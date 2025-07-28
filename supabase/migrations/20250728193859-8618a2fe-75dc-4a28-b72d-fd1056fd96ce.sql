-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users table (restrictive)
CREATE POLICY "Only service role can access admin users" 
ON public.admin_users 
FOR ALL 
USING (false);

-- Insert default admin user with bcrypt hash for "admin123"
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$K8BdJ4oD8qM2uG1P3vF7VuqGx8w9N5XsY2kL3mR4jT6hC7aZ1bP0e');

-- Update the bookings table to track date availability when booked
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(20);

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update availability when booking is confirmed
CREATE OR REPLACE FUNCTION public.update_availability_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  booking_date DATE;
BEGIN
  -- If booking status is changing to confirmed, mark dates as unavailable
  IF NEW.booking_status = 'confirmed' AND (OLD.booking_status IS NULL OR OLD.booking_status != 'confirmed') THEN
    booking_date := NEW.check_in_date;
    WHILE booking_date < NEW.check_out_date LOOP
      UPDATE public.availability 
      SET is_available = false 
      WHERE date = booking_date;
      booking_date := booking_date + INTERVAL '1 day';
    END LOOP;
  END IF;
  
  -- If booking is cancelled or deleted, mark dates as available again
  IF NEW.booking_status = 'cancelled' AND OLD.booking_status = 'confirmed' THEN
    booking_date := NEW.check_in_date;
    WHILE booking_date < NEW.check_out_date LOOP
      UPDATE public.availability 
      SET is_available = true 
      WHERE date = booking_date;
      booking_date := booking_date + INTERVAL '1 day';
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for availability updates
CREATE TRIGGER booking_availability_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_availability_on_booking();