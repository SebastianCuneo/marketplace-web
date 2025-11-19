# 🌐 Marketplace Web - Aplicación Web Independiente

**Proyecto:** Marketplace de Servicios con Insumos  
**Plataforma:** React.js  
**Estado:** ✅ Proyecto Independiente (separado del monorepo)

---

## 📋 Descripción

Aplicación web donde:
- **Solicitantes** publican servicios que necesitan
- **Proveedores de Servicio** envían cotizaciones
- **Proveedores de Insumos** ofrecen materiales necesarios

---

## 🏗️ Arquitectura

Este proyecto fue extraído del monorepo original. La lógica de negocio que antes estaba en `@marketplace/shared` ahora está embebida en `src/core/`.

```
marketplace-web/
├── src/
│   ├── core/                 # Lógica de negocio (antes @marketplace/shared)
│   │   ├── contexts/         # AuthContext, ServicesContext, InsumosContext
│   │   ├── types/            # Interfaces TypeScript
│   │   ├── constants/        # Roles, Estados, Categorías
│   │   └── data/             # Usuarios hardcodeados, Mock data
│   │
│   ├── Components/           # Componentes UI
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── Login.tsx
│   │   ├── SolicitanteDashboard.tsx
│   │   ├── PublicarServicio.tsx
│   │   └── ...
│   │
│   ├── App.jsx              # Router principal
│   ├── index.js             # Entry point
│   └── index.css            # Tailwind CSS
│
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 💻 Tecnologías

- **Framework:** React 18.2.0
- **UI Library:** Shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 3.4.4
- **State Management:** Context API + useReducer
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Build Tool:** Craco (Create React App)
- **TypeScript:** 5.4.5

---

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar en Desarrollo

```bash
npm start
```

Abre `http://localhost:3000` en tu navegador.

### 3. Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `build/`.

---

## 🔑 Credenciales de Prueba

### Solicitante
```
Email: solicitante@marketplace.com
Password: solicitante123
```

### Proveedor de Servicio
```
Email: proveedor@marketplace.com
Password: proveedor123
```

### Proveedor de Insumos
```
Email: insumos@marketplace.com
Password: insumos123
```

---

## 📁 Estructura de `src/core/`

La carpeta `src/core/` contiene toda la lógica de negocio:

```
src/core/
├── contexts/
│   ├── AuthContext.tsx       # Autenticación
│   ├── ServicesContext.tsx   # Gestión de servicios
│   ├── InsumosContext.tsx    # Gestión de insumos
│   ├── AppProvider.tsx       # Wrapper de contexts
│   └── index.ts              # Exports
├── types/
│   ├── index.ts              # Tipos legacy
│   └── models.ts             # Modelos del TP
├── constants/
│   ├── roles.ts              # ROLES
│   ├── serviceStates.ts      # Estados del servicio
│   └── categories.ts         # Categorías y unidades
└── data/
    ├── hardcodedUsers.ts     # 6 usuarios de prueba
    ├── mockData.ts           # Datos legacy
    └── mockServices.ts       # Servicios de ejemplo
```

---

## 🎯 Funcionalidades

### ✅ Solicitante
- Publicar servicios
- Ver mis servicios
- Recibir cotizaciones
- Comparar cotizaciones
- Seleccionar cotización
- Ver ofertas de insumos

### ✅ Proveedor de Servicio
- Ver servicios disponibles
- Enviar cotizaciones
- Ver mis cotizaciones

### ✅ Proveedor de Insumos
- Gestionar catálogo de insumos
- Ofrecer packs de insumos

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm start

# Build producción
npm run build

# Tests
npm test

# Eject (no recomendado)
npm run eject
```

---

## 🔄 Importaciones

Todos los imports que antes eran:
```typescript
import { useAuth } from '@marketplace/shared';
```

Ahora son:
```typescript
import { useAuth } from '../core';  // Desde src/
import { useAuth } from '../../core';  // Desde src/Components/
```

---

## ⚠️ Importante

Este es un proyecto **independiente**. Si hay un proyecto mobile separado, los cambios en `src/core/` **NO se sincronizarán automáticamente**. Cualquier cambio debe replicarse manualmente en ambos proyectos.

---

## 🐛 Troubleshooting

### Error: Cannot find module './core'
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
```

### Error de TypeScript
```bash
# Verificar que tsconfig.json no tenga referencias a @marketplace/shared
```

### Estilos no se aplican
```bash
# Regenerar Tailwind
npm start
```

---

## 📚 Documentación Original

Para ver la documentación completa del monorepo original:
- Ver `CONTEXTO_COMPLETO_GEMINI.md` en el monorepo original
- Ver `README.md` en el monorepo original

---

## ✅ Checklist de Migración Completada

- ✅ Código de `packages/web/` copiado
- ✅ Lógica de `packages/shared/` movida a `src/core/`
- ✅ Imports refactorizados de `@marketplace/shared` a rutas relativas
- ✅ `package.json` actualizado (sin dependencia de shared)
- ✅ `tsconfig.json` actualizado (sin path alias)
- ✅ Archivos de monorepo eliminados

---

## 🎓 Autores

Trabajo Práctico 2025 - Marketplace de Servicios con Insumos

---

## 📄 Licencia

MIT

