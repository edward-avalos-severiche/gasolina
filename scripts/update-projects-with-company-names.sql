-- Paso 1: Añadir la columna 'company_name' si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketing_projects' AND column_name='company_name') THEN
        ALTER TABLE public.marketing_projects ADD COLUMN company_name text;
    END IF;
END
$$;

-- Paso 2: Actualizar los proyectos existentes con los nombres de las empresas
UPDATE public.marketing_projects SET company_name = 'ModaExpress' WHERE slug = 'seo-e-commerce';
UPDATE public.marketing_projects SET company_name = 'TechSolutions Pro' WHERE slug = 'contenido-saas-b2b';
UPDATE public.marketing_projects SET company_name = 'SaborAuténtico' WHERE slug = 'relanzamiento-redes';
UPDATE public.marketing_projects SET company_name = 'FitnessTotal Gym' WHERE slug = 'google-ads-local';
UPDATE public.marketing_projects SET company_name = 'StreamFlow Plataforma' WHERE slug = 'email-automation';
UPDATE public.marketing_projects SET company_name = 'Finanzas Inteligentes' WHERE slug = 'landing-page-conversion';

-- Opcional: Si quieres que la columna sea NOT NULL después de poblarla
-- ALTER TABLE public.marketing_projects ALTER COLUMN company_name SET NOT NULL;
