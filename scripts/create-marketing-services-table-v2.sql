-- Eliminar la tabla si ya existe para asegurar una creación limpia (opcional, descomentar si es necesario)
-- DROP TABLE IF EXISTS public.marketing_services;

CREATE TABLE public.marketing_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    short_description text NOT NULL,
    price numeric(10,2) NOT NULL,
    image_url text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT marketing_services_pkey PRIMARY KEY (id),
    CONSTRAINT marketing_services_slug_key UNIQUE (slug)
);

INSERT INTO public.marketing_services (name, slug, description, short_description, price, image_url, is_featured) VALUES
('Optimización SEO Avanzada', 'seo-avanzada', 'Nuestro servicio de optimización SEO avanzada está diseñado para llevar tu sitio web a la cima de los resultados de búsqueda. Incluye análisis de palabras clave, optimización on-page y off-page, construcción de enlaces de alta calidad y reportes mensuales detallados para asegurar un crecimiento sostenido y orgánico.', 'Impulsa tu visibilidad online con estrategias SEO de vanguardia.', 1200.00, '/placeholder.svg?height=400&width=600', true),
('Gestión de Redes Sociales', 'gestion-redes-sociales', 'Creamos y ejecutamos estrategias de contenido para tus redes sociales (Facebook, Instagram, LinkedIn, Twitter, TikTok). Incluye creación de posts, gestión de comunidades, campañas de anuncios pagados y análisis de rendimiento para aumentar el engagement y la conversión.', 'Construye una comunidad fuerte y activa en tus redes sociales.', 850.00, '/placeholder.svg?height=400&width=600', true),
('Diseño Web Profesional', 'diseno-web-profesional', 'Desarrollamos sitios web modernos, responsivos y optimizados para la conversión. Desde landing pages hasta e-commerce complejos, nos aseguramos de que tu presencia online sea impactante y funcional, reflejando la identidad de tu marca.', 'Tu presencia digital, diseñada para impactar y convertir.', 1800.00, '/placeholder.svg?height=400&width=600', false),
('Campañas de Email Marketing', 'email-marketing', 'Diseñamos y gestionamos campañas de email marketing efectivas para nutrir a tus leads y fidelizar a tus clientes. Incluye segmentación de audiencias, creación de contenido persuasivo, automatización de flujos y análisis de métricas.', 'Conecta con tus clientes a través de campañas de email personalizadas.', 600.00, '/placeholder.svg?height=400&width=600', false),
('Publicidad en Google Ads', 'google-ads', 'Creamos y optimizamos campañas de publicidad en Google Search y Display Network. Maximizamos tu ROI con una gestión experta de pujas, palabras clave y audiencias, asegurando que tu inversión genere los mejores resultados.', 'Alcanza a tus clientes ideales con anuncios efectivos en Google.', 950.00, '/placeholder.svg?height=400&width=600', true),
('Creación de Contenido para Blogs', 'contenido-blogs', 'Desarrollamos artículos de blog de alta calidad, optimizados para SEO y diseñados para atraer y educar a tu audiencia. Desde la investigación de temas hasta la redacción y edición, te ayudamos a establecer tu autoridad en la industria.', 'Contenido fresco y relevante para tu blog, optimizado para SEO.', 700.00, '/placeholder.svg?height=400&width=600', false);
