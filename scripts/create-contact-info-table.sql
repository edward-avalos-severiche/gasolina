CREATE TABLE public.contact_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    address text NOT NULL,
    phone_fixed text NOT NULL,
    phone_whatsapp text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT contact_info_pkey PRIMARY KEY (id)
);

INSERT INTO public.contact_info (address, phone_fixed, phone_whatsapp, email) VALUES
('Carrer de la Marina 20, 08005 Barcelona, España', '+34 931 23 45 67', '+34 612 34 56 78', 'contacto@marketingdigital.es');
