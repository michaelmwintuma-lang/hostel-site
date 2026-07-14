import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  // Retrieve the Clerk Webhook Secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Error: CLERK_WEBHOOK_SECRET is not configured.', {
      status: 500,
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook events
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, first_name, last_name, email_addresses, phone_numbers, unsafe_metadata } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address || '';
    const primaryPhone = phone_numbers?.[0]?.phone_number || '';
    const firstName = first_name || '';
    const lastName = last_name || '';

    // Extract metadata values if they were pre-filled or passed during signup
    const university = (unsafe_metadata?.university as string) || '';
    const studentIdNum = (unsafe_metadata?.student_id_num as string) || '';
    const emergencyContact = (unsafe_metadata?.emergency_contact as object) || { name: '', relationship: '', phone: '' };

    // Insert student record into Supabase using admin client (bypasses RLS)
    const { error } = await supabaseAdmin
      .from('students')
      .insert({
        clerk_id: id,
        first_name: firstName,
        last_name: lastName,
        email: primaryEmail,
        phone_number: primaryPhone,
        emergency_contact: emergencyContact,
        university: university,
        student_id_num: studentIdNum,
      });

    if (error) {
      console.error('Error creating student in Supabase:', error);
      return new Response('Database error', { status: 500 });
    }

    return new Response('Student synced successfully', { status: 201 });
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || '';
    const firstName = first_name || '';
    const lastName = last_name || '';

    const { error } = await supabaseAdmin
      .from('students')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: primaryEmail,
      })
      .eq('clerk_id', id);

    if (error) {
      console.error('Error updating student in Supabase:', error);
      return new Response('Database error', { status: 500 });
    }

    return new Response('Student updated successfully', { status: 200 });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const { error } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('clerk_id', id);

    if (error) {
      console.error('Error deleting student in Supabase:', error);
      return new Response('Database error', { status: 500 });
    }

    return new Response('Student deleted successfully', { status: 200 });
  }

  return new Response('Webhook received', { status: 200 });
}
