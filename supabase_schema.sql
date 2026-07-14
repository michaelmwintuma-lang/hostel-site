-- 1. Create Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_sem NUMERIC NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] NOT NULL,
  popular BOOLEAN DEFAULT FALSE,
  tagline TEXT
);

-- 2. Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  room_number TEXT NOT NULL,
  room_type_id TEXT REFERENCES room_types(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Available'
);

-- 3. Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  emergency_contact JSONB,
  university TEXT NOT NULL,
  student_id_num TEXT NOT NULL,
  disciplinary_notes TEXT DEFAULT 'None',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  academic_year TEXT NOT NULL,
  semester INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  balance_due NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount_paid NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  gateway_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Successful',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Insert Seed Data for Room Types
INSERT INTO room_types (id, name, price_per_sem, capacity, amenities, popular, tagline)
VALUES 
  (
    'single-room', 
    'Single Room', 
    125000, 
    1, 
    ARRAY['Private Study Desk', 'Air Conditioning', 'En-suite Bathroom', 'High-speed Internet', 'Personal Wardrobe', '24/7 Security Access'], 
    TRUE, 
    'Private, quiet space for students who value independence and comfort.'
  ),
  (
    'two-in-a-room', 
    '2-in-a-room', 
    80000, 
    2, 
    ARRAY['Study Desks', 'Air Conditioning', 'Shared Bathroom', 'High-speed Internet', 'Spacious Wardrobe', 'Common Lounge Access'], 
    FALSE, 
    'A balanced shared option with personal comfort and community feel.'
  ),
  (
    'three-in-a-room', 
    '3-in-a-room', 
    4800, 
    3, 
    ARRAY['Wardrobes', 'Air Conditioning', 'Shared Bathroom', 'Power Outlets', 'Study Area Access', 'Secure Building Entry'], 
    FALSE, 
    'A practical shared arrangement for students seeking value and convenience.'
  )
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  price_per_sem = EXCLUDED.price_per_sem,
  capacity = EXCLUDED.capacity,
  amenities = EXCLUDED.amenities,
  popular = EXCLUDED.popular,
  tagline = EXCLUDED.tagline;

-- 7. Insert Seed Data for Physical Rooms
INSERT INTO rooms (id, room_number, room_type_id, status)
VALUES 
  ('R101', 'Room 101-A', 'single-room', 'Available'),
  ('R102', 'Room 102-A', 'single-room', 'Available'),
  ('R201', 'Room 201-B', 'two-in-a-room', 'Available'),
  ('R202', 'Room 202-B', 'two-in-a-room', 'Available'),
  ('R301', 'Room 301-C', 'three-in-a-room', 'Available')
ON CONFLICT (id) DO UPDATE 
SET 
  room_number = EXCLUDED.room_number,
  room_type_id = EXCLUDED.room_type_id,
  status = EXCLUDED.status;

-- 8. Create Double-Booking Safe RPC Function
CREATE OR REPLACE FUNCTION create_booking_safe(
  p_student_id UUID,
  p_room_id TEXT,
  p_academic_year TEXT,
  p_semester INTEGER,
  p_price NUMERIC
)
RETURNS UUID AS $$
DECLARE
  v_booking_id UUID;
  v_capacity INTEGER;
  v_current_occupancy INTEGER;
  v_room_type_id TEXT;
BEGIN
  -- Get room details and capacity (with row-level lock)
  SELECT r.room_type_id, rt.capacity INTO v_room_type_id, v_capacity
  FROM rooms r
  JOIN room_types rt ON r.room_type_id = rt.id
  WHERE r.id = p_room_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room % not found', p_room_id;
  END IF;

  -- Count current confirmed/pending bookings for this room
  SELECT count(*) INTO v_current_occupancy
  FROM bookings
  WHERE room_id = p_room_id AND status IN ('Confirmed', 'Pending');

  -- Verify room capacity
  IF v_current_occupancy >= v_capacity THEN
    RAISE EXCEPTION 'Room % is already fully booked', p_room_id;
  END IF;

  -- Insert booking record
  INSERT INTO bookings (
    student_id,
    room_id,
    academic_year,
    semester,
    price,
    status,
    balance_due
  ) VALUES (
    p_student_id,
    p_room_id,
    p_academic_year,
    p_semester,
    p_price,
    'Pending',
    p_price
  ) RETURNING id INTO v_booking_id;

  -- Update room occupancy status
  IF (v_current_occupancy + 1) >= v_capacity THEN
    UPDATE rooms SET status = 'Fully_Occupied' WHERE id = p_room_id;
  ELSE
    UPDATE rooms SET status = 'Occupied' WHERE id = p_room_id;
  END IF;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;

-- 9. Disable Row Level Security (RLS) on all tables so client-side public client can query them directly
ALTER TABLE room_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
