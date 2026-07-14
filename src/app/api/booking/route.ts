import { getAuthUser } from '@/lib/auth-compat';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─── Shared Nodemailer transporter ───────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

// ─── Send booking notification email to the admin ────────────────────────────
async function sendBookingNotificationEmail(params: {
  studentName: string;
  studentEmail: string;
  phoneNumber: string;
  university: string;
  studentIdNum: string;
  bookingId: string;
  roomId: string;
  academicYear: string;
  semester: string;
  price: number;
  emergencyContact: { name?: string; relationship?: string; phone?: string };
}) {
  const transporter = createTransporter();
  const appliedAt = new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' });

  await transporter.sendMail({
    from: `"Xtracity Booking System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER, // → xtracityhostels@gmail.com
    subject: `🏠 New Hostel Application – ${params.studentName} | Xtracity`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #E03B0D; padding: 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="32" valign="middle">
                <img src="https://unpkg.com/lucide-static@0.321.0/icons/home.svg" width="24" height="24" style="display: block; filter: invert(1) brightness(100);" alt="Home" />
              </td>
              <td valign="middle">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Hostel Application Received</h1>
              </td>
            </tr>
            <tr>
              <td width="32"></td>
              <td>
                <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 13px;">Applied at ${appliedAt} (Ghana Time)</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">

          <!-- Student Info -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Student Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Full Name</td>
              <td style="padding: 10px 0; color: #111827; font-weight: bold;">${params.studentName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Email Address</td>
              <td style="padding: 10px 0;"><a href="mailto:${params.studentEmail}" style="color: #E03B0D;">${params.studentEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Phone Number</td>
              <td style="padding: 10px 0; color: #111827;">${params.phoneNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">University</td>
              <td style="padding: 10px 0; color: #111827;">${params.university}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Student ID</td>
              <td style="padding: 10px 0; color: #111827;">${params.studentIdNum}</td>
            </tr>
          </table>

          <!-- Booking Info -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Booking Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Booking Ref</td>
              <td style="padding: 10px 0; color: #111827; font-family: monospace; font-weight: bold;">XTR-${params.bookingId.split('-')[0].toUpperCase()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Room</td>
              <td style="padding: 10px 0; color: #111827;">${params.roomId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Academic Year</td>
              <td style="padding: 10px 0; color: #111827;">${params.academicYear}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Semester</td>
              <td style="padding: 10px 0; color: #111827;">${params.semester}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Rent (per sem)</td>
              <td style="padding: 10px 0; color: #E03B0D; font-weight: bold; font-size: 15px;">${Number(params.price).toLocaleString()} GHS</td>
            </tr>
          </table>

          <!-- Emergency Contact -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Emergency Contact</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Name</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Relationship</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.relationship || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Phone</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.phone || 'N/A'}</td>
            </tr>
          </table>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; font-size: 12px; color: #166534;">
            ✅ <strong>Action Required:</strong> Please contact the student to coordinate room verification, ID check, and key handover.
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px 32px; font-size: 11px; color: #9ca3af; text-align: center;">
          Xtracity Hostels &amp; Apartments · Cosway St, Agbogba, Accra, Ghana · Automated booking notification
        </div>
      </div>
    `,
  });
}

// ─── Send confirmation email to the student ──────────────────────────────────
async function sendStudentConfirmationEmail(params: {
  studentName: string;
  studentEmail: string;
  phoneNumber: string;
  university: string;
  studentIdNum: string;
  bookingId: string;
  roomId: string;
  academicYear: string;
  semester: string;
  price: number;
  emergencyContact: { name?: string; relationship?: string; phone?: string };
}) {
  const transporter = createTransporter();
  const appliedAt = new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' });

  await transporter.sendMail({
    from: `"Xtracity Hostels" <${process.env.EMAIL_USER}>`,
    to: params.studentEmail,
    subject: `🎉 Application Received – Xtracity Hostels & Apartments`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #E03B0D; padding: 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="32" valign="middle">
                <img src="https://unpkg.com/lucide-static@0.321.0/icons/home.svg" width="24" height="24" style="display: block; filter: invert(1) brightness(100);" alt="Home" />
              </td>
              <td valign="middle">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Hostel Application Received</h1>
              </td>
            </tr>
            <tr>
              <td width="32"></td>
              <td>
                <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 13px;">Applied at ${appliedAt} (Ghana Time)</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 14px; color: #374151; margin-top: 0; margin-bottom: 20px; line-height: 1.6;">
            Hi <strong>${params.studentName}</strong>,<br/><br/>
            Thank you for applying to <strong>Xtracity Hostels &amp; Apartments</strong>. Below is a copy of the registration details we received. We will contact you shortly to coordinate room verification, ID check, and key handover.
          </p>

          <!-- Student Info -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Student Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Full Name</td>
              <td style="padding: 10px 0; color: #111827; font-weight: bold;">${params.studentName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Email Address</td>
              <td style="padding: 10px 0;"><a href="mailto:${params.studentEmail}" style="color: #E03B0D;">${params.studentEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Phone Number</td>
              <td style="padding: 10px 0; color: #111827;">${params.phoneNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">University</td>
              <td style="padding: 10px 0; color: #111827;">${params.university}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Student ID</td>
              <td style="padding: 10px 0; color: #111827;">${params.studentIdNum}</td>
            </tr>
          </table>

          <!-- Booking Info -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Booking Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Booking Ref</td>
              <td style="padding: 10px 0; color: #111827; font-family: monospace; font-weight: bold;">XTR-${params.bookingId.split('-')[0].toUpperCase()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Room</td>
              <td style="padding: 10px 0; color: #111827;">${params.roomId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Academic Year</td>
              <td style="padding: 10px 0; color: #111827;">${params.academicYear}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Semester</td>
              <td style="padding: 10px 0; color: #111827;">${params.semester}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Rent (per sem)</td>
              <td style="padding: 10px 0; color: #E03B0D; font-weight: bold; font-size: 15px;">${Number(params.price).toLocaleString()} GHS</td>
            </tr>
          </table>

          <!-- Emergency Contact -->
          <h2 style="color: #E03B0D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Emergency Contact</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; width: 160px;">Name</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">Relationship</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.relationship || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Phone</td>
              <td style="padding: 10px 0; color: #111827;">${params.emergencyContact?.phone || 'N/A'}</td>
            </tr>
          </table>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; font-size: 12px; color: #166534; line-height: 1.5;">
            🎉 <strong>Application Received:</strong> We have successfully received your application! The management team will contact you shortly to coordinate room verification, ID check, and key handover.
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px 32px; font-size: 11px; color: #9ca3af; text-align: center;">
          Xtracity Hostels &amp; Apartments · Cosway St, Agbogba, Accra, Ghana · This is an automated receipt
        </div>
      </div>
    `,
  });
}


// ─── POST /api/booking ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const {
      roomId,
      academicYear,
      semester,
      price,
      firstName,
      lastName,
      email,
      phoneNumber,
      emergencyContact,
      university,
      studentIdNum,
      callbackUrl
    } = await req.json();

    if (!roomId || !academicYear || !semester || !price || !phoneNumber || !emergencyContact || !university || !studentIdNum || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    const primaryEmail = email;
    const studentName = `${firstName} ${lastName}`;

    // 1. Get or update the student profile in Supabase by email
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('email', primaryEmail)
      .single();

    let studentId = student?.id;

    if (studentError || !studentId) {
      const guestClerkId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const { data: newStudent, error: createError } = await supabaseAdmin
        .from('students')
        .insert({
          clerk_id: guestClerkId,
          first_name: firstName,
          last_name: lastName,
          email: primaryEmail,
          phone_number: phoneNumber,
          emergency_contact: emergencyContact,
          university,
          student_id_num: studentIdNum
        })
        .select('id')
        .single();

      if (createError || !newStudent) {
        console.error('Error creating student fallback:', createError);
        return NextResponse.json({ error: 'Failed to create student profile.' }, { status: 500 });
      }
      studentId = newStudent.id;
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('students')
        .update({ phone_number: phoneNumber, emergency_contact: emergencyContact, university, student_id_num: studentIdNum })
        .eq('id', studentId);

      if (updateError) {
        console.error('Error updating student profile:', updateError);
        return NextResponse.json({ error: 'Failed to update student profile.' }, { status: 500 });
      }
    }

    // 2. Create the booking via safe RPC (prevents double-booking race conditions)
    const { data: bookingId, error: bookingError } = await supabaseAdmin.rpc(
      'create_booking_safe',
      {
        p_student_id: studentId,
        p_room_id: roomId,
        p_academic_year: academicYear,
        p_semester: semester,
        p_price: price
      }
    );

    if (bookingError) {
      console.error('Booking RPC Error:', bookingError);
      return NextResponse.json({ error: bookingError.message }, { status: 409 });
    }

    // 3. Send real emails to admin and student
    try {
      await sendBookingNotificationEmail({
        studentName,
        studentEmail: primaryEmail,
        phoneNumber,
        university,
        studentIdNum,
        bookingId,
        roomId,
        academicYear,
        semester,
        price,
        emergencyContact,
      });
      await sendStudentConfirmationEmail({
        studentName,
        studentEmail: primaryEmail,
        phoneNumber,
        university,
        studentIdNum,
        bookingId,
        roomId,
        academicYear,
        semester,
        price,
        emergencyContact,
      });
      console.log(`✅ Booking emails sent to admin and ${primaryEmail}`);
    } catch (emailErr) {
      // Non-fatal — booking is already saved, just log the error
      console.error('Email dispatch error (non-fatal):', emailErr);
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking registered and admin notified via email.',
    });

  } catch (err: any) {
    console.error('Booking API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ─── GET /api/booking ─────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch student profile by Clerk ID
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, phone_number, university, student_id_num, emergency_contact')
      .eq('clerk_id', user.id)
      .maybeSingle();

    if (!student) {
      return NextResponse.json({ registered: false });
    }

    // 2. Fetch active booking
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        status,
        price,
        rooms (
          room_number,
          room_types (
            name
          )
        )
      `)
      .eq('student_id', student.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const activeBooking = bookingData && bookingData.length > 0 ? bookingData[0] : null;

    return NextResponse.json({
      registered: true,
      student,
      booking: activeBooking ? {
        id: activeBooking.id,
        status: activeBooking.status,
        price: Number(activeBooking.price),
        roomNumber: (activeBooking.rooms as any)?.room_number || 'TBD',
        roomCategory: (activeBooking.rooms as any)?.room_types?.name || 'TBD'
      } : null
    });

  } catch (err: any) {
    console.error('GET Booking API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
