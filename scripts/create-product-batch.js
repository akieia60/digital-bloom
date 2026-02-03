
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Note: For admin tasks, you might need SERVICE_ROLE key if RLS blocks inserts

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function batchCreate() {
    const filePath = process.argv[2]

    if (!filePath) {
        console.error('Usage: node scripts/create-product-batch.js <path-to-json-file>')
        process.exit(1)
    }

    const absolutePath = path.resolve(filePath)
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`)
        process.exit(1)
    }

    console.log(`📖 Reading products from ${path.basename(filePath)}...`)
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    let products = []

    try {
        products = JSON.parse(fileContent)
    } catch (e) {
        console.error('❌ Error parsing JSON:', e.message)
        process.exit(1)
    }

    if (!Array.isArray(products)) {
        console.error('❌ JSON must be an array of product objects')
        process.exit(1)
    }

    console.log(`🚀 Found ${products.length} products. Inserting...`)

    // Chunking inserts if there are many? Supabase can handle a fair amount.
    // But let's insert one by one to give better feedback, or in small batches.
    // The guide suggests a single INSERT statement, so supabase-js insert([array]) is fine.

    const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select()

    if (error) {
        console.error('❌ Insert Error:', error.message)
        console.error('   Hint: Check if your table has Row Level Security (RLS) policies allowing inserts.')
        console.error('         If RLS is on, you might need to disable it or add a policy for Anon inserts (not recommended for production).')
    } else {
        console.log(`✅ Successfully inserted ${data.length} products!`)
    }
}

batchCreate()
