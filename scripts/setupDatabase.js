#!/usr/bin/env node

// ============================================
// AUTOMATIC DATABASE SETUP
// ============================================
// This script will automatically set up your Supabase database

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🌸 Digital Bloom - Database Setup\n');
console.log('This will set up your Supabase database automatically.\n');

async function setupDatabase() {
  try {
    // Read the SQL schema file
    const schemaPath = join(__dirname, '../supabase/schemas/01_initial_schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading database schema...');
    console.log('✓ Schema loaded\n');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`🔨 Executing ${statements.length} SQL statements...\n`);

    // Execute each statement using the REST API
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comment-only statements
      if (statement.trim().startsWith('--')) continue;

      try {
        // Use the Supabase RPC to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          // Check if it's a "already exists" error (which is okay)
          if (error.message.includes('already exists') ||
              error.message.includes('duplicate')) {
            console.log(`⊘ Skipping (already exists): Statement ${i + 1}`);
            skipCount++;
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
          }
        } else {
          console.log(`✓ Executed statement ${i + 1} of ${statements.length}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Setup Summary:');
    console.log(`   ✓ Successful: ${successCount}`);
    console.log(`   ⊘ Skipped: ${skipCount}`);
    console.log(`   Total: ${statements.length}`);
    console.log('='.repeat(50));

    // Verify tables were created
    console.log('\n🔍 Verifying database setup...');

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (!productsError) {
      console.log('✓ Products table verified');
    } else {
      console.log('⚠️  Products table verification failed:', productsError.message);
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run upload-products');
    console.log('2. Visit: http://localhost:5173/admin');
    console.log('3. Start adding your flower arrangements!\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n💡 Alternative method:');
    console.log('1. Go to https://app.supabase.com/project/_/sql');
    console.log('2. Copy contents of supabase/schemas/01_initial_schema.sql');
    console.log('3. Paste and click RUN\n');
    process.exit(1);
  }
}

setupDatabase();
