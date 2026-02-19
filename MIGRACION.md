# Guía de Migración: De JavaScript Vanilla a Preact

Esta guía documenta el proceso de migración del sitio "Nuestro Amor" desde JavaScript Vanilla a Preact, un framework ligero y eficiente compatible con React.

## Índice

1. [Análisis del proyecto original](#1-análisis-del-proyecto-original)
2. [Selección del framework](#2-selección-del-framework)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Migración de componentes](#4-migración-de-componentes)
5. [Implementación del routing](#5-implementación-del-routing)
6. [Carga dinámica de recursos](#6-carga-dinámica-de-recursos)
7. [Pasos para ejecutar el proyecto](#7-pasos-para-ejecutar-el-proyecto)
8. [Añadir nuevas páginas](#8-añadir-nuevas-páginas)

## 1. Análisis del proyecto original

El proyecto original tenía estas características:

- **JavaScript Vanilla** sin frameworks
- **Componentes** implementados como funciones y objetos JS
- **Archivos separados** para diferentes funcionalidades:
  - `script.js` - Lógica principal
  - `proposal.js` - Funcionalidad de propuesta
  - `special-events.js` - Temas para días especiales
  - `gsap-animations.js` - Animaciones GSAP
  - `daily-color-palette.js` - Sistema de paleta de colores dinámica
- **Dependencias externas**: GSAP para animaciones y FontAwesome para iconos

## 2. Selección del framework

Se eligió **Preact** por estas razones:

- **Tamaño mínimo** (3KB gzipped vs React 40KB)
- **API compatible con React** (fácil aprendizaje y migración)
- **Excelente rendimiento** para animaciones
- **Soporte para Hooks** (useState, useEffect, etc.)
- **Enrutamiento simple** con preact-router
- **Mínimo impacto** en tiempo de carga

Otras alternativas consideradas:
- Alpine.js (más enfocado en pequeñas interacciones)
- Svelte (excelente, pero menos maduro para migración gradual)

## 3. Estructura del proyecto

La nueva estructura organiza el código de manera más mantenible:

```
src/
  ├── components/          # Componentes reutilizables
  │    ├── time-counter.jsx
  │    ├── photo-carousel.jsx
  │    ├── heart-button.jsx
  │    ├── proposal.jsx
  │    ├── header.jsx
  │    └── footer.jsx
  │
  ├── routes/              # Páginas de la aplicación
  │    ├── home.jsx
  │    ├── memories.jsx
  │    └── not-found.jsx
  │
  ├── hooks/               # Lógica reutilizable
  │    ├── use-gsap-animations.js
  │    ├── use-special-events.js
  │    └── use-color-palette.js
  │
  ├── styles/              # Estilos CSS modularizados
  │    ├── main.css
  │    ├── home.css
  │    └── ...
  │
  ├── utils/               # Utilidades y helpers
  │
  ├── index.jsx            # Punto de entrada
  └── app.jsx              # Componente principal con Router
```

## 4. Migración de componentes

Cada elemento funcional del sitio original se transformó en un componente Preact:

1. **Conversión de manipulación DOM a React/Preact**:
   ```javascript
   // Antes (JavaScript vanilla)
   document.getElementById('element').innerHTML = 'Contenido';

   // Después (Preact)
   const [content, setContent] = useState('Contenido');
   return <div>{content}</div>;
   ```

2. **Conversión de event listeners**:
   ```javascript
   // Antes
   element.addEventListener('click', handleClick);

   // Después
   <button onClick={handleClick}>Botón</button>
   ```

3. **Estado local con hooks**:
   ```javascript
   // Antes
   let currentSlide = 0;

   // Después
   const [currentSlide, setCurrentSlide] = useState(0);
   ```

4. **Efectos secundarios**:
   ```javascript
   // Antes
   window.addEventListener('resize', checkIsMobile);
   // Y en algún otro lugar:
   window.removeEventListener('resize', checkIsMobile);

   // Después
   useEffect(() => {
     window.addEventListener('resize', checkIsMobile);
     return () => window.removeEventListener('resize', checkIsMobile);
   }, []);
   ```

## 5. Implementación del routing

Implementamos un sistema de routing con `preact-router`:

```javascript
// En app.jsx
import { Router } from 'preact-router';
import { Home } from './routes/home';
import { Memories } from './routes/memories';

export function App() {
  return (
    <div id="app-container">
      <Header />
      <main>
        <Router>
          <Home path="/" />
          <Memories path="/recuerdos" />
          <NotFound default />
        </Router>
      </main>
      <Footer />
    </div>
  );
}
```

Para los enlaces entre páginas:

```javascript
import { Link } from 'preact-router/match';

<Link activeClassName="active" href="/recuerdos">Recuerdos</Link>
```

## 6. Carga dinámica de recursos

Las bibliotecas externas como GSAP se cargan dinámicamente:

```javascript
// En use-gsap-animations.js
const loadGsap = async () => {
  if (typeof gsap !== 'undefined') return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
  script.async = true;
  document.body.appendChild(script);

  return new Promise(resolve => {
    script.onload = resolve;
  });
};
```

## 7. Pasos para ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build
```

## 8. Añadir nuevas páginas

Para crear nuevas páginas:

1. **Crear un componente de ruta**:
   ```javascript
   // En src/routes/nueva-pagina.jsx
   import { h } from 'preact';

   export function NuevaPagina() {
     return (
       <div className="nueva-pagina">
         <h1>Título de la nueva página</h1>
         <p>Contenido...</p>
       </div>
     );
   }
   ```

2. **Añadir al router**:
   ```javascript
   // En app.jsx
   import { NuevaPagina } from './routes/nueva-pagina';

   // Dentro del componente Router:
   <Router>
     <Home path="/" />
     <NuevaPagina path="/nueva-pagina" />
     <NotFound default />
   </Router>
   ```

3. **Añadir enlace en la navegación**:
   ```javascript
   // En components/header.jsx
   <Link activeClassName="active" href="/nueva-pagina">Nueva Página</Link>
   ```

## Beneficios de la migración

1. **Mejor organización** con componentes y hooks
2. **Más fácil mantenimiento** con código modularizado
3. **Mejor rendimiento** con renderizado optimizado
4. **Escalabilidad** para añadir nuevas páginas y características
5. **Menor acoplamiento** entre componentes
6. **Reutilización de código** más sencilla