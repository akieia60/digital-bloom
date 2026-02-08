const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyCuration() {
    const results = {
        timestamp: new Date().toISOString(),
        products: [],
        count: 0,
        error: null
    };

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            results.error = error.message;
        } else {
            results.products = data.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price
            }));
            results.count = data.length;
        }
    } catch (err) {
        results.error = err.message;
    }

    fs.writeFileSync('verification_results.json', JSON.stringify(results, null, 2));
    process.exit(0);
}

verifyCuration();
