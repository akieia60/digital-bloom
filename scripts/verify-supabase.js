
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    console.log('🔍 Verifying Supabase Configuration...')

    // 1. Verify Storage
    console.log('\n--- Checking Storage ---')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError.message)
    } else {
        const digitalProductsBucket = buckets.find(b => b.name === 'digital-products')
        if (digitalProductsBucket) {
            console.log('✅ Bucket "digital-products" exists')
            console.log(`   Public: ${digitalProductsBucket.public}`)
        } else {
            console.log('❌ Bucket "digital-products" NOT FOUND')
            console.log('   Action needed: Create public bucket named "digital-products"')
        }
    }

    // 2. Verify Table Schema
    console.log('\n--- Checking Products Table Schema ---')
    // We can't easily inspect schema with supabase-js directly without admin API usually,
    // but we can try to select one item and see if it errors on specific columns,
    // or just check if we can select them.
    // Actually, selecting non-existent columns usually doesn't error in Supabase JS client, it just ignores them or returns null?
    // Let's try to insert a dummy row and then delete it? No that's risky.
    // Let's try to select specific columns from the first product.

    const columnsToCheck = [
        'video_file_url',
        'prompt_used',
        'animation_style', // This might be camelCase or snake_case? Guide says "animation_style"
        'luxury_features',
        'stripe_product_id',
        'stripe_price_id'
    ]

    const { data: products, error: schemaError } = await supabase
        .from('products')
        .select(columnsToCheck.join(','))
        .limit(1)

    if (schemaError) {
        console.error('❌ Schema Verification Failed:', schemaError.message)
        console.error('   Likely missing columns based on error message.')
    } else {
        console.log('✅ Schema Check Passed (Columns exist)')
    }
}

verify()
