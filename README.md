# Styled By Wilma — Asesora de Imagen Personal con IA 👗✨

> **"No es una app que analiza cómo te ves. Es una app que aprende quién eres para ayudarte a vestirte."**

Styled By Wilma es una Web App Progresiva (PWA) móvil full-stack de asesoría de imagen y estilismo personal, desarrollada con **React, Vite, Tailwind CSS v4, Google Gemini API** y diseñada para desplegarse fácilmente en **Cloudflare Pages / Workers**.

---

## 🌟 Módulos Style DNA (Cerebro de Personalización)

- 🎨 **Color DNA**: Estación analítica (ej. Otoño Cálido, Invierno Brillante), temperatura, profundidad, intensidad, contraste, paleta recomendada, neutros base, metales y colores a evitar.
- 📐 **Body DNA**: Silueta ósea (Reloj de arena, Rectángulo, Triángulo, etc.), proporciones hombros/cintura/cadera, zonas a destacar y escotes/largos óptimos.
- 🎭 **Style DNA**: Porcentajes interactivos de los 4 pilares (*% Classic, % Natural, % Romantic, % Creative*) y arquetipo resultante.
- 💼 **Lifestyle DNA**: Edad, profesión, modalidad laboral (híbrido/remoto/presencial), rutina semanal y clima habitual.
- ☁️ **Comfort DNA**: Prioridad de confort (1 a 10), ajuste favorito, altura máxima de tacón y prendas vetadas.
- 🛍️ **Shopping DNA**: Nivel de presupuesto, frecuencia de compra, marcas de cabecera y análisis de coste por uso (*price per wear*).
- 👗 **Wardrobe DNA**: Armario digital progresivo que clasifica prendas y genera looks inteligentes con lo que ya posees.
- 📅 **Calendario de Outfits & Aprendizaje de Hábitos (AI Scheduler)**:
  - **Planificación a Futuro:** Agenda looks para los próximos días o semanas según ocasión (Trabajo, Casual, Cena/Noche, Eventos, Viaje, Deporte) y pronóstico del tiempo.
  - **Generación Asistida con Wilma:** Wilma combina automáticamente prendas existentes en tu armario que armonicen con tu Style DNA y la ocasión del día seleccionado.
  - **Registro de Uso y Aprendizaje IA:** Marca qué outfits usaste en días pasados; la IA aprende de tus frecuencias de uso, rotación de prendas olvidadas y preferencias horarias, evitando repeticiones indeseadas y optimizando sugerencias semanales.
  - **Visualización Dual:** Selector interactivo de vista mensual (rejilla de días) y vista semanal tipo timeline detallado.
  - **Wilma Habit Brain:** Panel analítico de rotación de armario (índice de variedad semanal, piezas con 5 estrellas y recomendaciones de equilibrio de vestuario).

---

## 🔐 Autenticación & Panel Superadmin MASTER

### Credenciales de Superadmin (Ocultas y Validadas en Backend)
- **Usuario:** `MASTER`
- **Contraseña:** `xyz19481940`
- **Panel de Control:** Acceso directo desde el icono de escudo en el Header o seleccionando la pestaña **Master** en el modal de inicio de sesión.

### Modalidades de Registro & Acceso
1. **Registro Tipo Facebook:** Formulario mobile-first que captura Nombre, Apellidos, Nombre de usuario (@usuario), Correo electrónico, Celular, Fecha de nacimiento (selectores Día, Mes, Año) y Género.
2. **3 Opciones de Inicio de Sesión:**
   - Opción 1: **Nombre de usuario** (ej. `@victoria`, `@carmen_style`, o `MASTER`)
   - Opción 2: **Correo electrónico** (ej. `victoria@example.com`)
   - Opción 3: **Teléfono móvil** (ej. `+34 612 345 678` o número registrado)
3. **Autenticación con Google:** Inicio de sesión instantáneo de 1 clic con cuenta de Google.
4. **Recuperación de Contraseña:** Flujo con código de verificación de 6 dígitos con expiración de 15 minutos para restablecer la contraseña de manera segura.
5. **Modo Full Pantalla Adaptable para PC (Windows, Mac, Linux):**
   - La aplicación es totalmente responsive y se adapta a pantallas grandes de escritorio de PCs Windows, Mac y Linux con barra de navegación superior, diseño en cuadrícula para outfits y armario, y paneles fluidos.
   - Cuenta con un botón de conmutación en la cabecera (icono de monitor/celular) para alternar entre **Modo Pantalla Completa PC** y **Simulador Móvil Frame**.
6. **Panel Superadmin Full Completo:**
   - Métricas en tiempo real: Total de usuarias, Usuarias Activas Hoy (DAU), MAU, tasa de finalización de Onboarding (94.2%).
   - Volumen de IA ejecutado: Style Checks, ¿Me lo compro?, Test de color y mensajes de Chat.
   - Distribución de Color DNA (% Otoño Cálido, Invierno Brillante, Primavera Clara, Verano Suave con códigos hex reales).
   - Tipologías de Silueta (% Reloj de arena, Rectángulo, Pera, etc.).
   - Ranking de Marcas más consultadas (Massimo Dutti, COS, Sézane, Zara, etc.).
   - Tabla de usuarias con búsqueda en vivo, filtros por estado, alternancia de suspensión/reactivación y visor de Style DNA.
   - Registro de auditoría cronológico en vivo y botón de exportación de métricas a JSON/CSV.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + PWA (Manifest + Service Worker `sw.js`).
- **IA**: Google Gemini API (`gemini-3.8-flash` en AI Studio / `gemini-2.5-flash` en Cloudflare Functions).
- **Backend Serverless**:
  - Entorno local / AI Studio: `server.ts` con Express y `@google/genai` como proxy seguro.
  - Entorno Cloudflare: `functions/api/gemini.js` como Cloudflare Pages Function.
- **Persistencia**: LocalStorage con perfil inicial precargado (Victoria — Classic Chic) para pruebas inmediatas.

---

## 🚀 Guía de Despliegue Paso a Paso

### 1. Ejecutar en Google AI Studio (Desarrollo Local)

El entorno de desarrollo ya cuenta con todas las dependencias instaladas:

```bash
# Iniciar el servidor de desarrollo (puerto 3000)
npm run dev
```

En AI Studio, la variable de entorno `GEMINI_API_KEY` se inyecta automáticamente desde el panel **Secrets**.

---

### 2. Subir a un Repositorio de GitHub

Ejecuta estos comandos en tu terminal para publicar el proyecto en tu cuenta de GitHub:

```bash
# 1. Inicializar git si no está inicializado
git init

# 2. Agregar todos los archivos al seguimiento
git add .

# 3. Crear el primer commit
git commit -m "feat: Styled By Wilma PWA con Gemini y Cloudflare Functions"

# 4. Vincular tu repositorio remoto de GitHub (reemplaza TU_USUARIO y TU_REPO)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/styled-by-wilma.git

# 5. Subir a GitHub
git push -u origin main
```

---

### 3. Desplegar en Cloudflare Pages

Tienes dos opciones muy sencillas:

#### Opción A: Conexión Automática desde GitHub (Recomendada)

1. Ve al panel de [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**.
2. Haz clic en **Create Application** → pestaña **Pages** → **Connect to Git**.
3. Selecciona tu repositorio de GitHub `styled-by-wilma`.
4. En los ajustes de compilación (*Build Settings*):
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. En **Environment Variables** (Variables de Entorno):
   - Añade `GEMINI_API_KEY` con tu clave de [Google AI Studio](https://aistudio.google.com/).
6. Haz clic en **Save and Deploy**. ¡Tu app estará viva en `https://styled-by-wilma.pages.dev`!

#### Opción B: Despliegue directo con Wrangler CLI

```bash
# 1. Instalar Wrangler (si no lo tienes)
npm install -g wrangler

# 2. Compilar el frontend
npm run build

# 3. Iniciar sesión en Cloudflare
wrangler login

# 4. Desplegar a Cloudflare Pages
wrangler pages deploy dist --project-name=styled-by-wilma

# 5. Configurar el secreto GEMINI_API_KEY en Cloudflare Pages
wrangler pages secret put GEMINI_API_KEY --project-name=styled-by-wilma
```

---

## 📁 Estructura del Proyecto

```
styled-by-wilma/
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker para offline y cache
│   └── icon.svg                 # Icono monograma de lujo
├── functions/
│   └── api/
│       └── gemini.js            # Cloudflare Pages Function (Proxy seguro de Gemini)
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Cabecera editorial y accesos rápidos
│   │   ├── BottomNav.tsx        # Navegación móvil de 5 pestañas
│   │   ├── HomeView.tsx         # Pantalla principal "¿Qué necesitas hoy?"
│   │   ├── ChatView.tsx         # Chat contextual con Wilma
│   │   ├── StyleCheckView.tsx   # "Analiza mi look" (Style Check)
│   │   ├── BuyCheckView.tsx     # "¿Me lo compro?" (Evaluador de compras)
│   │   ├── ColorCheckView.tsx   # "¿Este color es para mí?"
│   │   ├── WardrobeView.tsx     # Armario digital y generador de outfits
│   │   ├── OnboardingModal.tsx  # Diagnóstico guiado de 5 etapas
│   │   └── StyleDnaModal.tsx    # Pasaporte Style DNA desglosado
│   ├── data/
│   │   └── defaultStyleDna.ts   # Paletas, consejos y datos iniciales de Victoria
│   ├── services/
│   │   ├── storage.ts           # Persistencia en LocalStorage
│   │   └── geminiService.ts     # Integración Gemini con inyección de Style DNA
│   ├── types.ts                 # Definiciones completas de TypeScript
│   ├── App.tsx                  # Componente raíz
│   ├── index.css                # Estilos base y tokens de color
│   └── main.tsx                 # Entrada React
├── .env.example                 # Plantilla de variables de entorno
├── metadata.json                # Metadatos para AI Studio
├── wrangler.toml                # Configuración de Cloudflare Pages
└── README.md                    # Esta guía
```

---

## 🔒 Seguridad de la API Key

La `GEMINI_API_KEY` **nunca se expone al navegador**:
- En Cloudflare Pages, la petición viaja a `/api/gemini`, que es ejecutada del lado servidor por `functions/api/gemini.js` usando `env.GEMINI_API_KEY`.
- En AI Studio / Express, `server.ts` utiliza `@google/genai` del lado servidor con `process.env.GEMINI_API_KEY`.
- Si la app se prueba sin conexión o sin clave configurada, incluye un **motor de estilismo simulado** que analiza los datos con reglas de imagen profesionales para garantizar que todas las pantallas funcionen siempre.
