# 🚀 Marketing Digital con Asistente de IA por Voz 🚀

¡Bienvenido al repositorio de Marketing Digital! Este proyecto es una plataforma web moderna y dinámica para una agencia de marketing digital, diseñada para mostrar servicios, proyectos y facilitar la interacción con los clientes a través de un innovador asistente de IA por voz.

## ✨ Características Principales

*   **Página de Inicio Dinámica:** Presentación atractiva de la agencia y servicios destacados.
*   **Sección de Servicios:** Listado completo de servicios de marketing digital con detalles individuales.
*   **Sección de Proyectos:** Galería de casos de éxito con descripciones detalladas de los desafíos y soluciones.
*   **Página de Contacto:** Información de contacto (dirección, teléfonos, email) obtenida de la base de datos y un formulario de contacto funcional.
*   **Asistente de IA por Voz:**
    *   Integrado directamente en la interfaz para una experiencia de usuario interactiva.
    *   Impulsado por **Groq** para el procesamiento del lenguaje natural (LLM).
    *   Utiliza la **Web Speech API** para reconocimiento de voz (Speech-to-Text) y síntesis de voz (Text-to-Speech) en español.
    *   Capaz de responder preguntas sobre **servicios, proyectos e información de contacto** directamente desde la base de datos.
    *   Manejo inteligente de precios (conversión de números a palabras) y sugerencia de uso del formulario de contacto.
*   **Base de Datos Dinámica:** Toda la información de servicios, proyectos y contacto se gestiona a través de **Supabase**.
*   **Diseño Responsivo:** Experiencia de usuario optimizada para dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
*   **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **ORM/Cliente DB:** `@supabase/supabase-js`
*   **Inteligencia Artificial (LLM):** [Groq](https://groq.com/) (`@ai-sdk/groq`)
*   **SDK de IA:** [Vercel AI SDK](https://sdk.vercel.ai/)
*   **Reconocimiento/Síntesis de Voz:** Web Speech API (integrada en el navegador)
*   **Iconos:** [Lucide React](https://lucide.dev/icons/)
*   **Fuentes:** [Geist Sans & Mono](https://vercel.com/font)

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 1. Clonar el Repositorio

```bash
git clone [URL_DE_TU_REPOSITORIO]
cd tu-proyecto-marketing-digital
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar Supabase

Este proyecto utiliza Supabase para la base de datos.

a.  **Crea un Proyecto en Supabase:**
    *   Ve a [Supabase](https://supabase.com/) y crea una nueva cuenta o inicia sesión.
    *   Crea un nuevo proyecto.

b.  **Obtén tus Credenciales de Supabase:**
    *   En tu proyecto de Supabase, ve a `Settings` > `API`.
    *   Necesitarás `Project URL` y `anon public` key.

c.  **Configura las Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz de tu proyecto y añade tus credenciales de Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL="[TU_SUPABASE_PROJECT_URL]"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[TU_SUPABASE_ANON_KEY]"
   ```

d.  **Ejecuta los Scripts SQL:**
    Los scripts para crear y poblar las tablas de `marketing_services`, `marketing_projects` y `contact_info` se encuentran en la carpeta `scripts/`.
    **Copia el contenido de cada uno de estos archivos (`create-marketing-services-table.sql`, `create-marketing-projects-table.sql`, `create-contact-info-table.sql`, `insert-new-marketing-services.sql`, `update-projects-with-company-names.sql`) y ejecútalos manualmente en el "SQL Editor" de tu panel de Supabase.**

   *   `scripts/create-marketing-services-table.sql`
   *   `scripts/create-marketing-projects-table.sql`
   *   `scripts/create-contact-info-table.sql`
   *   `scripts/insert-new-marketing-services.sql` (para añadir los dos servicios extra)
   *   `scripts/update-projects-with-company-names.sql` (para añadir los nombres de empresa a los proyectos existentes)

### 4. Configurar Groq (para la IA)

a.  **Obtén tu API Key de Groq:**
    *   Regístrate o inicia sesión en [Groq](https://groq.com/).
    *   Genera una nueva API Key.

b.  **Configura la Variable de Entorno:**
    Añade tu API Key de Groq a tu archivo `.env.local`:

   ```env
   GROQ_API_KEY="[TU_GROQ_API_KEY]"
   ```

### 5. Ejecutar el Proyecto

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

El proyecto se ejecutará en `http://localhost:3000`.

## 📂 Estructura del Proyecto

```
.
├── app/
│   ├── api/
│   │   ├── chat/             # API para el chat de texto (no usado por la IA de voz)
│   │   └── voice-chat/       # API principal para la IA de voz (Groq, Supabase)
│   ├── about/                # Página "Nosotros"
│   ├── contact/              # Página "Contactos" y Server Action del formulario
│   ├── projects/             # Página de listado de proyectos
│   │   └── [slug]/           # Página de detalle de proyecto
│   ├── services/             # Página de listado de servicios
│   │   └── [slug]/           # Página de detalle de servicio
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página de inicio
├── components/
│   ├── ui/                   # Componentes de Shadcn UI
│   ├── ai-chat-widget.tsx    # Widget de chat de texto (no usado por la IA de voz)
│   ├── ai-sphere-chat.tsx    # Componente de la esfera de IA (no usado por la IA de voz)
│   ├── contact-form.tsx      # Formulario de contacto
│   ├── footer.tsx            # Pie de página
│   ├── navbar.tsx            # Barra de navegación
│   ├── project-card.tsx      # Tarjeta de proyecto
│   ├── service-card.tsx      # Tarjeta de servicio
│   └── voice-ai-assistant.tsx # Componente principal del asistente de IA por voz
├── lib/
│   └── supabase.ts           # Configuración del cliente Supabase
├── public/                   # Archivos estáticos (imágenes, etc.)
├── scripts/                  # Scripts SQL para la base de datos
│   ├── create-contact-info-table.sql
│   ├── create-marketing-projects-table.sql
│   ├── create-marketing-services-table.sql
│   ├── insert-new-marketing-services.sql
│   └── update-projects-with-company-names.sql
├── utils/
│   └── number-to-words.ts    # Utilidad para convertir números a palabras en español
├── .env.local.example        # Ejemplo de archivo de variables de entorno
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🗣️ Uso del Asistente de IA por Voz

El asistente de IA por voz se activa a través de un botón flotante en la esquina inferior derecha de la pantalla. Al hacer clic, se abrirá una interfaz donde podrás interactuar con la IA usando tu voz.

**Ejemplos de preguntas que puedes hacer:**

*   "¿Qué servicios ofrecen?"
*   "Háblame sobre la optimización SEO avanzada."
*   "¿Qué proyectos han realizado?"
*   "Cuéntame sobre el proyecto de ModaExpress."
*   "¿Cuál es su dirección?"
*   "¿Cuál es su número de teléfono?"
*   "¿Cuál es su correo electrónico?"

La IA responderá utilizando la información de la base de datos y te guiará si necesita más detalles o si no encuentra la información.

---

## 🔣 Developer   

- 👨‍💻 **Ing. Edward Avalos** - *Full Stack Developer y Desarrollador Principal* - [GitHub](https://github.com/kirusiya/) | [LinkedIn](https://www.linkedin.com/in/edward-avalos-severiche/)
- 📧 **Email**: edward@ajamba.org
- 📱 **WhatsApp Business**: (+591) 61781119 | [Whatsapp](https://wa.me/59161781119)



*For technical support or questions about this implementation, please refer to the troubleshooting section or review the comprehensive code documentation within the project files.*
