-- Fix the remaining function with search_path security issue
CREATE OR REPLACE FUNCTION public.generate_availability_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Clear existing data to ensure fresh insertion
    DELETE FROM public.availability;

    -- Insert availability data for next 365 days
    INSERT INTO public.availability (date, is_available, price_per_night)
    SELECT 
        date,
        CASE 
            -- Exclude specific holidays
            WHEN (EXTRACT(MONTH FROM date) = 12 AND EXTRACT(DAY FROM date) = 25) THEN FALSE  -- Christmas
            WHEN (EXTRACT(MONTH FROM date) = 1 AND EXTRACT(DAY FROM date) = 1) THEN FALSE   -- New Year's Day
            WHEN (EXTRACT(MONTH FROM date) = 7 AND EXTRACT(DAY FROM date) = 4) THEN FALSE   -- Independence Day
            ELSE TRUE
        END AS is_available,
        CASE 
            -- Dynamic pricing logic
            WHEN EXTRACT(MONTH FROM date) IN (6, 7, 8) THEN 250.00  -- Summer peak season
            WHEN EXTRACT(DOW FROM date) IN (5, 6) THEN 200.00       -- Weekend pricing
            ELSE 180.00                                             -- Standard pricing
        END AS price_per_night
    FROM generate_series(
        CURRENT_DATE, 
        CURRENT_DATE + INTERVAL '365 days', 
        INTERVAL '1 day'
    ) AS date;
END;
$function$;