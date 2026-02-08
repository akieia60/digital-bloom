const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// The Authorized Top 10
const AUTHORIZED_IDS = [
    '9b991ce1-fcc8-4ae9-837a-d49d65c27da8', // Crystal Rose
    '19fbbeed-c6e6-4774-9f6f-f01f40ce6d8b', // His Love Gift
    '38932a37-5074-4a11-8943-a43eab7705a4', // Velvet Rose
    'b2869f9d-6089-486d-b7fa-e17dc343527d', // Blooming Hands
    'fadd7495-fd53-44a8-bfa2-2ff4a1e7f40a', // White Elegance
    '58700802-43f9-4400-80ba-d1cd3838bd60', // OpenArt Bloom 1
    '88eb09b8-f52a-491f-9513-7483184e3149', // OpenArt Extended
    '3a18f3db-8b8f-4b23-873e-5a5ef684b975', // Single Rose Bloom
    '8152b347-b57e-455b-a2f1-0ff7d8006cc7', // Soft Petals
    '1f96af91-eef8-4aa8-868c-81dbf3ccce4f'  // Red Balloon Magic
];

async function curateTop10() {
    console.log('--- CRITICAL CURATION: PRUNING TO TOP 10 ---');
    
    // First, let's see what we're deleting
    const { data: allProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name');

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        process.exit(1);
    }

    const toDelete = allProducts.filter(p => !AUTHORIZED_IDS.includes(p.id));
    console.log(`Found ${toDelete.length} items to remove (Rejecting Lux Latitude and Duplicates)...`);

    // Perform Deletion
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .not('id', 'in', `(${AUTHORIZED_IDS.join(',')})`);

    if (deleteError) {
        console.error('Deletion error:', deleteError);
        process.exit(1);
    }

    console.log('SUCCESS: Database pruned to the Masterpiece Top 10.');
    process.exit(0);
}

curateTop10();
