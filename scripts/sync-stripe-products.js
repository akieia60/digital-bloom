
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Service role key preferred for updates if RLS is on
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!supabaseUrl || !supabaseKey || !stripeSecretKey) {
    console.error('Missing credentials in .env (Need SUPABASE_URL, SUPABASE_ANON_KEY, and STRIPE_SECRET_KEY)')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const stripe = new Stripe(stripeSecretKey)

async function syncToStripe() {
    console.log('🔄 Syncing products to Stripe...')

    // 1. Get products that need Stripe IDs
    // We look for digital products that match our criteria but are missing stripe_product_id
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'digital')
        .eq('is_active', true)

    if (error) {
        console.error('❌ Supabase Error:', error.message)
        return
    }

    const productsToSync = products.filter(p => !p.stripe_product_id || !p.stripe_price_id)

    if (productsToSync.length === 0) {
        console.log('✅ All active digital products already have Stripe IDs!')
        return
    }

    console.log(`📝 Found ${productsToSync.length} products to create in Stripe.`)

    for (const product of productsToSync) {
        try {
            console.log(`\nProcessing: ${product.name}...`)

            // Create Product in Stripe
            const stripeProduct = await stripe.products.create({
                name: product.name,
                description: product.description || `Digital Flower: ${product.name}`,
                images: product.image ? [product.image.startsWith('http') ? product.image : 'https://placehold.co/400'] : [],
                metadata: {
                    supabase_id: product.id,
                    product_type: 'digital'
                }
            })

            // Create Price in Stripe
            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: Math.round(product.price * 100), // Convert to cents
                currency: 'usd',
            })

            console.log(`   ✅ Created Stripe Product: ${stripeProduct.id}`)
            console.log(`   ✅ Created Stripe Price: ${stripePrice.id}`)

            // Update Supabase
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    stripe_product_id: stripeProduct.id,
                    stripe_price_id: stripePrice.id
                })
                .eq('id', product.id)

            if (updateError) {
                console.error(`   ❌ Failed to update Supabase: ${updateError.message}`)
            } else {
                console.log(`   ✨ Synced successfully!`)
            }

        } catch (err) {
            console.error(`   ❌ Stripe/Sync Error: ${err.message}`)
        }
    }
}

syncToStripe()
