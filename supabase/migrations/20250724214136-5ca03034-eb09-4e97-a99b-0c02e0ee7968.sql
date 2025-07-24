-- Enable RLS on availability table to fix critical security issue
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Fix function search_path security for existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;