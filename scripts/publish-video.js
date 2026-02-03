
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Service role preferred for inserts if RLS blocks

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function publishvideo() {
    const videosDir = path.join(process.cwd(), 'project_assets/videos')

    // Find newest video
    const files = fs.readdirSync(videosDir)
        .filter(f => f.endsWith('.mp4'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(videosDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)

    if (files.length === 0) {
        console.log('❌ No local videos found.')
        return
    }

    // Allow user to specify file via command line argument
    const specifiedFile = process.argv[2]
    const customName = process.argv[3]
    const customCategory = process.argv[4]

    let targetFile = files[0].name // Default to newest

    if (specifiedFile && !specifiedFile.startsWith('--')) {
        if (files.find(f => f.name === specifiedFile)) {
            targetFile = specifiedFile
        } else {
            console.log(`⚠️ Specified file "${specifiedFile}" not found. Using newest: ${targetFile}`)
        }
    }

    console.log(`🚀 Publishing video: ${targetFile}`)

    // 1. Upload
    const cleanName = `viral-${Date.now()}.mp4`
    const fileBuffer = fs.readFileSync(path.join(videosDir, targetFile))

    console.log('   📤 Uploading to Storage...')
    const { error: uploadError } = await supabase.storage
        .from('digital-products')
        .upload(`videos/viral/${cleanName}`, fileBuffer, {
            contentType: 'video/mp4',
            upsert: true
        })

    if (uploadError) {
        console.error('   ❌ Upload Failed:', uploadError.message)
        return
    }

    const { data: publicData } = supabase.storage
        .from('digital-products')
        .getPublicUrl(`videos/viral/${cleanName}`)

    const videoUrl = publicData.publicUrl
    console.log('   ✅ Uploaded!')

    // 2. Create Product
    console.log('   ✨ Creating Product in Database...')

    // Attempt to make a smarter name
    let baseName = "Viral Product"
    if (customName) baseName = customName
    else if (targetFile.includes("stilletto")) baseName = "Crystal Stiletto Reveal"
    else if (targetFile.includes("grok")) baseName = `Viral Reveal ${new Date().toLocaleTimeString()}`

    const productName = customName ? customName : `${baseName} ${new Date().toLocaleDateString()}`
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const category = customCategory || 'digital-art'

    const { data: product, error: dbError } = await supabase
        .from('products')
        .insert({
            name: productName,
            slug: slug,
            description: 'Exclusive AI-generated viral flower reveal. High contrast, 3D pop-out effect.',
            price: 7.99, // Lowered price for viral volume
            category: category,
            product_type: 'digital',
            video_file_url: videoUrl,
            video_url: videoUrl, // Populate legacy column as well
            image_url: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?q=80&w=2848&auto=format&fit=crop', // Placeholder thumb
            is_active: true,
            stock: 999
        })
        .select()
        .single()

    if (dbError) {
        console.error('   ❌ Database Insert Failed:', dbError.message)
        console.log(`   ⚠️ But video is uploaded: ${videoUrl}`)
    } else {
        console.log(`\n🎉 SUCCESS! Product Created:`)
        console.log(`   Name: ${product.name}`)
        console.log(`   Price: $${product.price}`)
        console.log(`   ID: ${product.id}`)
    }
}

publishvideo()
