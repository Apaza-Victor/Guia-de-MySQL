# Guía de MySQL

Sitio web estático y responsive para aprender MySQL desde cero a nivel experto. Incluye 9 módulos con teoría, ejemplos de código SQL, ejercicios prácticos, glosario y recursos externos.

**🌐 Sitio en vivo:** [apaza-victor.github.io/Guia-de-MySQL](https://apaza-victor.github.io/Guia-de-MySQL/)

## Stack

- HTML5 + CSS3 (Variables CSS, diseño mobile-first)
- JavaScript vanilla (ES6+)
- Bootstrap Icons, Google Fonts (Poppins + Fira Code)
- AOS (animaciones al scroll)
- Prism.js (resaltado de código SQL)

## Estructura

```
index.html                  → Página de inicio
404.html                    → Página 404 personalizada
assets/
  css/                      → variables, base, layout, components, responsive
  js/                       → navbar, theme-switcher, search, copy-code, include-partials, main
  partials/                 → header, footer, sidebar
pages/
  fundamentos/              → Módulo 1
  consultas-basicas/        → Módulo 2
  consultas-intermedias/    → Módulo 3
  diseno-bd/                → Módulo 4
  avanzado/                 → Módulo 5
  optimizacion/             → Módulo 6
  administracion/           → Módulo 7
  experto/                  → Módulo 8
  practica/                 → Módulo 9
  recursos/                 → Recursos externos
  glosario/                 → Glosario de términos
```

## Características

- Modo claro / oscuro persistente (localStorage)
- Navegación con dropdowns en desktop y menú hamburguesa en móvil
- Diseño responsive mobile-first (desde 368px)
- Sidebar por módulo con resaltado del tema activo
- Bloque de código con botón copiar
- Callouts (tip, warning, important)
- Buscador de temas
- Navegación anterior/siguiente entre temas

## Despliegue

El sitio está desplegado en GitHub Pages. Para desplegar tu propia copia:

1. Haz fork del repositorio
2. Ve a Settings > Pages > Source > Deploy from branch
3. Selecciona `main` y carpeta `/ (root)`
4. Guarda y espera unos minutos

```
https://tu-usuario.github.io/Guia-de-MySQL/
```

## Licencia

Todos los derechos reservados. Este código está publicado únicamente con fines educativos y de visualización. No se permite la copia, modificación o distribución de este proyecto sin autorización previa.
