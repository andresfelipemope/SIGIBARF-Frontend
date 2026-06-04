# SIGIBARF - Frontend

## Propósito del Proyecto

SIGIBARF (Sistema de Información y Gestión de Inventario para Alimentos BARF) es una plataforma web desarrollada para la administración integral de la producción de alimentos BARF (Biologically Appropriate Raw Food). Su objetivo principal es proporcionar herramientas avanzadas de gestión, balanceo de recetas y control de macronutrientes, monitoreo de inventario, registros de producción, alertas críticas y seguimiento de pedidos y créditos.

---

## Tecnologías Utilizadas

- Next.js 16 (Turbopack)
- React 19
- TailwindCSS 4
- PNPM (Gestor de Paquetes)
- Docker
- ESLint

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 22 o superior
- PNPM
- Docker (opcional)

---

## Instalación de PNPM

### Linux

#### Arch Linux / CachyOS / Manjaro

```bash
sudo pacman -S pnpm
```

#### Debian / Ubuntu

Primero instala Node.js y npm (si no los tienes):

```bash
sudo apt update
sudo apt install nodejs npm
```

Luego instala pnpm globalmente:

```bash
sudo npm install -g pnpm
```

#### Fedora

```bash
sudo dnf install pnpm
```

### Windows

**Opción recomendada (winget):**

```powershell
winget install pnpm.pnpm
```

**Alternativa usando npm:**

Primero instala Node.js desde https://nodejs.org/, luego ejecuta:

```powershell
npm install -g pnpm
```

**Alternativa usando PowerShell Script:**

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

### Verificar instalación

```bash
pnpm --version
```

---

## Migración desde NPM (IMPORTANTE)

Este proyecto fue migrado de `npm` a `pnpm`. Antes de instalar dependencias, todos los integrantes del equipo deben eliminar los archivos y carpetas generados por npm.

**Linux / macOS:**

```bash
rm -rf node_modules package-lock.json
```

**Windows (PowerShell):**

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

Si aparece un archivo `package-lock.json` en cualquier momento, debe eliminarse.

---

## Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd SIGIBARF-Frontend
```

### 2. Instalar dependencias

Este proyecto utiliza `pnpm` como gestor de paquetes. Para garantizar versiones exactas y evitar modificaciones accidentales del lockfile, utiliza:

```bash
pnpm install --frozen-lockfile
```

No utilices `npm install`.

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto y define la URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Ejecutar el entorno de desarrollo

```bash
pnpm dev
```

### 5. Acceder a la aplicación

```
http://localhost:3000
```

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Ejecutar en modo desarrollo |
| `pnpm build` | Generar build de producción |
| `pnpm start` | Ejecutar build de producción |
| `pnpm lint` | Ejecutar linter |

---

## Ejecución con Docker

**Construir la imagen:**

```bash
docker build -t sigibarf-frontend .
```

**Ejecutar el contenedor:**

```bash
docker run -p 3000:3000 sigibarf-frontend
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Reglas del Proyecto

**Comandos permitidos:**

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm start
pnpm lint
```

**Comandos NO permitidos:**

```bash
npm install
npm ci
npm run dev
```

Estos comandos pueden modificar dependencias y generar inconsistencias entre entornos de desarrollo.

---

## Instalación de nuevas dependencias

Para agregar dependencias al proyecto, usa siempre `pnpm`:

```bash
# Dependencia de producción
pnpm add <paquete>

# Dependencia de desarrollo
pnpm add -D <paquete>
```

---

## Estructura General del Proyecto

```
SIGIBARF-Frontend/
├── src/
│   ├── app/                # Páginas y rutas de la aplicación (App Router)
│   ├── components/         # Componentes UI reutilizables
│   ├── hooks/              # Hooks personalizados (useFormulaciones, etc.)
│   ├── lib/                # Utilidades y configuración de API (api.js)
│   └── services/           # Servicios de comunicación con backend
├── public/                 # Recursos estáticos
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── postcss.config.mjs
├── Dockerfile
└── README.md
```

El proyecto utiliza `pnpm-lock.yaml` para asegurar instalaciones consistentes entre todos los miembros del equipo. El directorio `node_modules/` no debe subirse al repositorio.

---

Proyecto desarrollado para el sistema académico y de gestión de inventario y producción de alimentos BARF, SIGIBARF.
