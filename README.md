# IA Gasolina

Aplicación de prueba con una página inicial estática y una esfera animada que sirve como interfaz visual para un asistente de IA.

## Estado actual

- La ruta `/` es estática y no depende de una base de datos.
- Se eliminaron Supabase, las rutas de contenido dinámico y los scripts SQL.
- La esfera de IA se mantiene en `components/ai-sphere-chat.tsx`.
- El asistente de voz usa `components/voice-ai-assistant.tsx`.
- Las rutas `/api/chat` y `/api/voice-chat` son opcionales y funcionan como backend para Groq; no son necesarias para renderizar el index.

## Conectar Groq

1. Crea una API key en [Groq Console](https://console.groq.com/keys).
2. Añade la variable en las variables del proyecto de Vercel o en `.env.local` durante desarrollo:

```env
GROQ_API_KEY=tu_api_key
```

3. Reinicia el servidor de desarrollo. La clave solo debe usarse en el servidor; nunca la expongas como `NEXT_PUBLIC_GROQ_API_KEY` ni la pongas en componentes cliente.

El endpoint `app/api/voice-chat/route.ts` usa `@ai-sdk/groq` y recibe las solicitudes del asistente. Para una aplicación 100% exportada como HTML estático, no se puede ejecutar Groq desde el navegador de forma segura: debes mantener este endpoint en un despliegue con funciones serverless o conectar un backend externo.

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación se abre en `http://localhost:3000`.

## Producción

```bash
pnpm build
pnpm start
```

## Stack

- Next.js App Router
- React y TypeScript
- Tailwind CSS
- Vercel AI SDK + Groq
- Web Speech API para voz
- React Three Fiber para la esfera animada

## Estructura relevante

```text
app/page.tsx                  # Index estático de prueba
app/api/voice-chat/route.ts   # Endpoint server-side para Groq
components/ai-sphere-chat.tsx # Esfera visual e interacción
components/voice-ai-assistant.tsx
```

## Seguridad

No subas `.env.local` al repositorio. La API key de Groq debe permanecer en variables de entorno server-side.
