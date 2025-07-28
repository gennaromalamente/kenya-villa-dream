-- Fix search_path security issues for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_availability_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;