const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local to reset the database.');
  process.exit(1);
}

const isDummyConfig = 
  supabaseUrl.includes('your-project-id') ||
  supabaseUrl.includes('your-real-project-id') ||
  supabaseUrl.includes('your-') ||
  supabaseServiceKey.includes('your_') ||
  supabaseServiceKey.includes('dummy');

if (isDummyConfig) {
  console.error(
    '❌ Database reset aborted.\n' +
    'Reason: You are still using the placeholder/dummy values in your `.env.local` file.\n' +
    'Please replace the "your-real-project-id", "your_real_anon_key", and "your_real_service_role_key" strings in your `.env.local` file with your actual Supabase URL and Service Role Key.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function main() {
  console.log('🔄 Connecting to Supabase database...');
  console.log(`URL: ${supabaseUrl}`);

  // 1. Delete all payments
  console.log('🗑️ Deleting all records from "payments" table...');
  const { error: payErr } = await supabase
    .from('payments')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (payErr) {
    console.error('❌ Failed to delete payments:', payErr.message);
  } else {
    console.log('✅ Payments table cleared.');
  }

  // 2. Delete all bookings
  console.log('🗑️ Deleting all records from "bookings" table...');
  const { error: bookErr } = await supabase
    .from('bookings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (bookErr) {
    console.error('❌ Failed to delete bookings:', bookErr.message);
  } else {
    console.log('✅ Bookings table cleared.');
  }

  // 3. Delete all students
  console.log('🗑️ Deleting all records from "students" table...');
  const { error: stdErr } = await supabase
    .from('students')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (stdErr) {
    console.error('❌ Failed to delete students:', stdErr.message);
  } else {
    console.log('✅ Students table cleared.');
  }

  // 4. Reset rooms status to 'Available'
  console.log('🔄 Resetting physical rooms status to "Available"...');
  const { error: roomErr } = await supabase
    .from('rooms')
    .update({ status: 'Available' })
    .neq('id', 'dummy_id_to_match_all');

  if (roomErr) {
    console.error('❌ Failed to reset rooms status:', roomErr.message);
  } else {
    console.log('✅ Rooms status set to "Available".');
  }

  console.log('🎉 Database reset completed successfully! You are ready to receive real bookings.');
}

main();
