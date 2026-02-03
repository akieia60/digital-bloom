
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Check if SERVICE_ROLE is needed for uploads depending on policy

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadBestVideo() {
    const videosDir = path.join(process.cwd(), 'project_assets/videos')

    // Find the most recent video files
    const files = fs.readdirSync(videosDir)
        .filter(f => f.endsWith('.mp4'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(videosDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)

    if (files.length === 0) {
        console.log('❌ No videos found in project_assets/videos')
        return
    }

    console.log('🎬 Recent Videos Found:')
    files.slice(0, 5).forEach((f, i) => {
        console.log(`   ${i + 1}. ${f.name}`)
    })

    // In a real CLI interactions are hard, so we'll just pick the newest one by default
    // or take an argument.
    const targetFile = files[0].name
    const targetPath = path.join(videosDir, targetFile)

    console.log(`\n🚀 Uploading newest video: ${targetFile}`)

    // Create a clean "viral-name"
    const cleanName = `viral-${Date.now()}.mp4`

    const fileBuffer = fs.readFileSync(targetPath)

    const { data, error } = await supabase.storage
        .from('digital-products')
        .upload(`videos/viral/${cleanName}`, fileBuffer, {
            contentType: 'video/mp4',
            upsert: true
        })

    if (error) {
        console.error('❌ Upload Failed:', error.message)
        console.error('   Hint: Ensure "digital-products" bucket exists and policies allow uploads.')
    } else {
        // Get Public URL
        const { data: publicData } = supabase.storage
            .from('digital-products')
            .getPublicUrl(`videos/viral/${cleanName}`)

        console.log('✅ Upload Successful!')
        console.log(`🔗 Public URL: ${publicData.publicUrl}`)
        console.log('\n👉 NEXT STEP: Create a product with this URL!')
    }
}

uploadBestVideo()
