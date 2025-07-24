-- Create bookings table for villa reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 2,
  total_price DECIMAL(10,2) NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create availability calendar table
CREATE TABLE public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  is_available BOOLEAN NOT NULL DEFAULT true,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 180.00,
  min_stay INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for real guest reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  guest_name TEXT NOT NULL,
  guest_location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create WhatsApp messages table for support chat
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_phone TEXT NOT NULL,
  guest_name TEXT,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'incoming' CHECK (message_type IN ('incoming', 'outgoing')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
FOR SELECT USING (auth.uid() = user_id OR guest_email = auth.email());

CREATE POLICY "Anyone can create bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own bookings" ON public.bookings
FOR UPDATE USING (auth.uid() = user_id OR guest_email = auth.email());

-- Create policies for availability (public read access)
CREATE POLICY "Anyone can view availability" ON public.availability
FOR SELECT USING (true);

-- Create policies for reviews (public read for published)
CREATE POLICY "Anyone can view published reviews" ON public.reviews
FOR SELECT USING (is_published = true);

CREATE POLICY "Verified guests can create reviews" ON public.reviews
FOR INSERT WITH CHECK (true);

-- Create policies for WhatsApp messages (admin only)
CREATE POLICY "Admin can manage WhatsApp messages" ON public.whatsapp_messages
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial availability data (next 365 days)
INSERT INTO public.availability (date, is_available, price_per_night)
SELECT 
  (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 364))::DATE as date,
  CASE 
    -- Mark some holidays as unavailable
    WHEN EXTRACT(month FROM (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 364))) = 12 
         AND EXTRACT(day FROM (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 364))) = 25 THEN false
    WHEN EXTRACT(month FROM (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 364))) = 1 
         AND EXTRACT(day FROM (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 364))) = 1 THEN false
    ELSE true
  END as is_available,
  180.00 as price_per_night
ON CONFLICT (date) DO NOTHING;