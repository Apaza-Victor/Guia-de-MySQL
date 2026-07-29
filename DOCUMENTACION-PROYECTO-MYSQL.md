# 📘 Documentación de Proyecto: "Guía de MySQL" — Web Guía/Teoría de MySQL (De Cero a Experto)

> Documento de especificación técnica y de contenido para construir el proyecto con ayuda de IA (opencode). Incluye stack, arquitectura, estructura de archivos, plan paso a paso, temario completo y sección de recursos.

---

## 1. Resumen del proyecto

Sitio web guía/estático (multi-página) que enseña MySQL desde nivel cero hasta nivel experto con un enfoque práctico paso a paso, con:

- Teoría clara por secciones.
- Ejemplos de código SQL resaltados (syntax highlighting).
- Ejemplos visuales (diagramas de tablas, relaciones, resultados de consultas simuladas).
- Tablas comparativas y de referencia.
- Modo claro / oscuro persistente.
- Navegación por header con menús desplegables (dropdown) en escritorio y menú hamburguesa funcional en móvil.
- Diseño responsive desde **368px** en adelante (mobile-first).
- Cada sección/tema como **archivo `.html` independiente**, enlazado mediante rutas relativas, compartiendo header/footer/sidebar comunes.
- Sección de recursos externos gratuitos (documentación, cursos, práctica).

---

## 2. Stack tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| Estructura | HTML5 | Contenido semántico de cada página |
| Framework CSS | Bootstrap 5 (CDN) | Grid, componentes base, utilidades responsive |
| Estilos propios | CSS3 + Variables CSS (`:root`) | Theming (dark/light), ajustes finos, animaciones |
| Interactividad | JavaScript (Vanilla, ES6+) | Menú hamburguesa, dropdowns, dark mode, carga de componentes, buscador, tabs de código |
| Iconos | Bootstrap Icons **o** Boxicons (CDN) | Iconografía de menú, tarjetas, botones |
| Animaciones | AOS (Animate On Scroll) | Animaciones al hacer scroll |
| Resaltado de código | Prism.js o Highlight.js (CDN) | Syntax highlighting para bloques SQL |
| Tipografía | Google Fonts (ej. "Poppins" + "Fira Code" para código) | Legibilidad y estética moderna |
| Diagramas ER (opcional) | Mermaid.js (CDN) | Diagramas entidad-relación interactivos |
| Notificaciones/copiar código | Vanilla JS + Clipboard API | Botón "copiar código" en cada snippet |

> **Nota:** Todo vía CDN, sin necesidad de Node/build tools, para que opencode genere archivos estáticos listos para abrir o desplegar (GitHub Pages, Netlify, Vercel).

---

## 3. Arquitectura y estructura de carpetas

Cada sección del temario es un archivo `.html` independiente. El header, footer y sidebar se cargan mediante **JS (fetch + innerHTML)** o **includes manuales** para mantener consistencia sin duplicar código en cada archivo (evita "copiar y pegar" el header 40 veces).

```
Guia de MySQL/
│
├── index.html                     # Página de inicio (landing)
├── 404.html                       # Página 404 personalizada
│
├── /assets
│   ├── /css
│   │   ├── variables.css          # Variables de color (modo claro/oscuro)
│   │   ├── base.css               # Reset, tipografía, utilidades globales
│   │   ├── layout.css             # Header, footer, sidebar, grid general
│   │   ├── components.css         # Cards, botones, badges, tablas, code-blocks
│   │   └── responsive.css         # Media queries (368px, 480px, 768px, 992px, 1200px)
│   │
│   ├── /js
│   │   ├── main.js                # Inicialización general
│   │   ├── theme-switcher.js      # Lógica dark/light + localStorage
│   │   ├── navbar.js              # Dropdowns desktop + hamburguesa mobile
│   │   ├── include-partials.js    # Carga dinámica de header/footer/sidebar + fija rutas
│   │   ├── copy-code.js           # Botón copiar en bloques de código
│   │   └── search.js              # Buscador de temas (opcional)
│   │
│   ├── /img
│   │   ├── logo.svg
│   │   ├── og-image.png
│   │   └── /diagrams              # Imágenes de diagramas ER, capturas, etc.
│   │
│   └── /partials
│       ├── header.html            # Navbar con dropdowns (se inyecta en cada página)
│       ├── sidebar.html           # Índice lateral de subtemas (por módulo)
│       └── footer.html            # Footer con links y redes
│
└── /pages                          # Contenido de todos los módulos
    │
    ├── /fundamentos                # MÓDULO 1: Fundamentos
    │   ├── que-es-mysql.html
    │   ├── instalacion.html
    │   ├── clientes-mysql.html
    │   ├── tipos-de-datos.html
    │   └── bases-de-datos-y-tablas.html
    │
    ├── /consultas-basicas           # MÓDULO 2: SQL Básico
    │   ├── select.html
    │   ├── where.html
    │   ├── order-by-limit.html
    │   ├── insert-update-delete.html
    │   └── operadores.html
    │
    ├── /consultas-intermedias       # MÓDULO 3: SQL Intermedio
    │   ├── funciones-agregadas.html
    │   ├── group-by-having.html
    │   ├── joins.html
    │   ├── subconsultas.html
    │   └── vistas.html
    │
    ├── /diseno-bd                   # MÓDULO 4: Diseño de Bases de Datos
    │   ├── modelo-entidad-relacion.html
    │   ├── normalizacion.html
    │   ├── claves-primarias-foraneas.html
    │   ├── relaciones.html
    │   └── integridad-referencial.html
    │
    ├── /avanzado                    # MÓDULO 5: SQL Avanzado
    │   ├── indices.html
    │   ├── transacciones.html
    │   ├── procedimientos-almacenados.html
    │   ├── funciones-personalizadas.html
    │   ├── triggers.html
    │   ├── eventos.html
    │   └── vistas-avanzadas.html
    │
    ├── /optimizacion                # MÓDULO 6: Rendimiento y Optimización
    │   ├── explain.html
    │   ├── optimizacion-consultas.html
    │   ├── indices-avanzados.html
    │   └── particionamiento.html
    │
    ├── /administracion              # MÓDULO 7: Administración
    │   ├── usuarios-y-permisos.html
    │   ├── backup-restauracion.html
    │   ├── replicacion.html
    │   └── seguridad.html
    │
    ├── /experto                     # MÓDULO 8: Nivel Experto
    │   ├── json-en-mysql.html
    │   ├── full-text-search.html
    │   ├── motores-de-almacenamiento.html
    │   ├── mysql-y-orm.html
    │   ├── escalabilidad.html
    │   └── buenas-practicas.html
    │
    ├── /practica                    # MÓDULO 9: Ejercicios y Retos
    │   ├── ejercicios-basicos.html
    │   ├── ejercicios-intermedios.html
    │   ├── ejercicios-avanzados.html
    │   └── proyectos-practicos.html
    │
    ├── /recursos
    │   └── recursos.html            # Documentación, cursos gratis, práctica online
    │
    └── /glosario
        └── glosario.html            # Glosario de términos SQL/MySQL
```

**Regla de rutas:** todas las páginas de módulos están dentro de `/pages` y cargan los partials con rutas relativas (`../../assets/...`). Se usa el atributo `data-base` en el `<body>` (ej. `data-base="."` para raíz, `data-base="../.."` para páginas dentro de `/pages`). `include-partials.js` ajusta automáticamente las rutas de los links en los partials según `data-base`.

---

## 4. Sistema de diseño (Design System)

### 4.1 Modo claro/oscuro
- Variables CSS en `:root` (modo claro) y `[data-theme="dark"]` (modo oscuro).
- Botón toggle (icono sol/luna) en el navbar, visible en desktop y en el menú hamburguesa.
- Preferencia guardada en `localStorage` y aplicada antes del render (evitar "flash" de color) con un script inline pequeño en el `<head>`.
- Respetar `prefers-color-scheme` como valor por defecto si el usuario no eligió antes.

Ejemplo de variables sugeridas:
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f4f6fa;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a68;
  --accent: #4f7cff;
  --accent-hover: #3a63e0;
  --code-bg: #1e1e2e;
  --border-color: #e2e5ec;
}

[data-theme="dark"] {
  --bg-primary: #0f0f1a;
  --bg-secondary: #16161f;
  --text-primary: #eaeaf5;
  --text-secondary: #b0b0c8;
  --accent: #6f9bff;
  --accent-hover: #8faeff;
  --code-bg: #0a0a12;
  --border-color: #2a2a3a;
}
```

### 4.2 Breakpoints responsive (mobile-first, desde 368px)
```css
/* Base: 368px en adelante (mínimo soportado) */
/* xs  >= 368px  → base sin media query */
/* sm  >= 480px */
/* md  >= 768px  → aparece navbar completo, desaparece hamburguesa */
/* lg  >= 992px  → sidebar visible fijo en páginas de contenido */
/* xl  >= 1200px */
/* xxl >= 1400px */
```
- Menú hamburguesa activo por defecto hasta `md` (768px).
- Dropdowns del header solo con hover/click en `md` en adelante; en mobile se convierten en acordeones dentro del menú lateral deslizante (offcanvas).
- Tipografía fluida con `clamp()` para títulos.
- Tablas con `overflow-x: auto` en pantallas pequeñas (wrapper `.table-responsive`).
- Bloques de código con scroll horizontal en mobile, nunca "rompen" el layout.

### 4.3 Componentes reutilizables
- **Navbar** con logo, links principales y dropdowns de subsecciones por módulo.
- **Sidebar** de navegación dentro de cada módulo (índice de subtemas, resalta el activo).
- **Breadcrumbs** (Inicio > Módulo > Subtema).
- **Code block** con: etiqueta de lenguaje, botón copiar, numeración de línea opcional.
- **Callouts / Alerts**: Nota, Tip, Advertencia, Importante (con íconos y colores distintos).
- **Cards** para tarjetas de módulos en la home.
- **Tablas** de referencia (tipos de datos, funciones, comparativas).
- **Tabs** para mostrar ejemplo de código vs resultado de consulta (tabla simulada).
- **Botón "Anterior / Siguiente tema"** al final de cada página para navegación secuencial.
- **Barra de progreso** de lectura (scroll progress bar) — opcional, mejora UX.
- **Botón "volver arriba"**.
- **Buscador** simple de temas por palabra clave (filtra links del sidebar/menú).

---

## 5. Estructura estándar de cada página de contenido

Cada archivo `.html` de tema debe seguir esta plantilla:

1. `<head>`: meta tags, título único, favicon, CDN's, CSS propios, script inline anti-flash de tema.
2. Header (inyectado).
3. Breadcrumb.
4. Layout de 2 columnas en `lg+`: Sidebar del módulo (izquierda) + Contenido (derecha).
5. Contenido:
   - Título del tema + breve introducción.
   - Explicación teórica (texto claro, en español, ejemplos cotidianos).
   - Ejemplo(s) de código SQL con syntax highlighting.
   - Ejemplo visual: tabla de datos de muestra y/o resultado simulado de la consulta.
   - Tabla de referencia si aplica (ej. lista de operadores, funciones).
   - Callout de "Buenas prácticas" o "Errores comunes".
   - Mini reto/ejercicio relacionado (opcional, con link a la sección de práctica).
6. Navegación anterior/siguiente.
7. Footer (inyectado).

---

## 6. Plan paso a paso para construir la web

### Fase 0 — Preparación
1. Crear la estructura de carpetas descrita en la sección 3.
2. Definir la paleta de colores y tipografías (Google Fonts).
3. Añadir en `index.html` los CDNs: Bootstrap 5, Bootstrap Icons (o Boxicons), AOS, Prism.js/Highlight.js, Google Fonts.

### Fase 1 — Base y theming
4. Crear `variables.css` con modo claro/oscuro.
5. Crear `base.css` (reset, tipografía, utilidades).
6. Implementar `theme-switcher.js` (toggle + localStorage + `prefers-color-scheme`).

### Fase 2 — Layout global
7. Construir `header.html` (partial) con: logo, links principales y dropdowns de subsecciones por módulo, botón de tema, botón hamburguesa.
8. Construir `footer.html` (partial) con links rápidos, redes, créditos.
9. Construir `sidebar.html` (partial reutilizado dentro de cada módulo, cambia el contenido activo vía JS o data-atributos).
10. Crear `include-partials.js` para inyectar header/sidebar/footer en todas las páginas mediante `fetch()`.
11. Implementar `navbar.js`: dropdowns en desktop (click/hover) y comportamiento offcanvas/acordeón en mobile (hamburguesa funcional con apertura/cierre, overlay y cierre con `Esc` o click fuera).

### Fase 3 — Componentes de contenido
12. Crear estilos de `components.css`: code-block, callouts, cards, tabs, tablas responsive, badges.
13. Implementar `copy-code.js` (botón copiar por bloque).
14. Configurar Prism.js/Highlight.js para el lenguaje SQL.
15. Integrar AOS para animaciones de entrada (cards, secciones) con `data-aos`.

### Fase 4 — Responsive
16. Crear `responsive.css` con los breakpoints (368px en adelante) y probar en anchos: 368px, 480px, 768px, 992px, 1200px, 1440px.
17. Verificar tablas, code-blocks y navbar en cada breakpoint.

### Fase 5 — Contenido (el más extenso)
18. Crear la landing (`index.html`): hero, presentación de la guía, tarjetas de los 9 módulos, sección "por qué aprender MySQL", CTA al primer tema.
19. Generar cada archivo `.html` de cada módulo siguiendo la plantilla de la sección 5, usando el temario completo (sección 7).
20. Completar la página de **Recursos** (sección 8).
21. Completar el **Glosario**.

### Fase 6 — Funcionalidades extra
22. Implementar buscador simple (`search.js`) que filtre temas del sidebar/menú por texto.
23. Implementar navegación "Anterior / Siguiente" automática entre temas.
24. Implementar barra de progreso de scroll y botón "volver arriba".
25. Añadir página 404 personalizada (`404.html`).

### Fase 7 — Pulido y QA
26. Revisar accesibilidad: contraste de colores en ambos modos, `alt` en imágenes, roles ARIA en el menú (`aria-expanded`, `aria-controls`), navegación por teclado en dropdowns y hamburguesa.
27. Optimizar imágenes y verificar tiempos de carga.
28. Validar HTML/CSS y revisar consistencia de rutas relativas entre todos los módulos.
29. Probar en navegadores principales y en real device / DevTools desde 368px.
30. Deploy (GitHub Pages / Netlify / Vercel).

---

## 7. Temario completo — Guía MySQL de Cero a Experto

### Módulo 1 — Fundamentos
1. ¿Qué es MySQL? Historia, para qué sirve, MySQL vs otros motores (PostgreSQL, SQLite, SQL Server)
2. Instalación y configuración (Windows, Linux, macOS) + XAMPP/WAMP
3. Clientes para MySQL: MySQL Workbench, phpMyAdmin, línea de comandos, DBeaver
4. Tipos de datos en MySQL (numéricos, texto, fecha/hora, booleanos, ENUM, JSON)
5. Bases de datos y tablas: crear, eliminar, modificar (`CREATE DATABASE`, `CREATE TABLE`, `ALTER TABLE`, `DROP`)

### Módulo 2 — Consultas básicas (SQL Básico)
6. `SELECT` y proyección de columnas
7. `WHERE` y operadores de comparación
8. Operadores lógicos (`AND`, `OR`, `NOT`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`)
9. `ORDER BY` y `LIMIT` / `OFFSET`
10. `INSERT INTO`, `UPDATE`, `DELETE`
11. Alias (`AS`) y comentarios en SQL

### Módulo 3 — Consultas intermedias
12. Funciones agregadas (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`)
13. `GROUP BY` y `HAVING`
14. `JOIN`: `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN` (simulado), `CROSS JOIN`, self join
15. Subconsultas (subqueries) — en `WHERE`, `FROM`, `SELECT`
16. Vistas (`VIEW`): creación y uso
17. Operadores de conjuntos (`UNION`, `UNION ALL`)

### Módulo 4 — Diseño de bases de datos
18. Modelo entidad-relación (diagramas ER)
19. Normalización (1FN, 2FN, 3FN, BCNF) con ejemplos prácticos
20. Claves primarias, foráneas, únicas, `AUTO_INCREMENT`
21. Tipos de relaciones: 1:1, 1:N, N:M (tablas intermedias)
22. Integridad referencial y restricciones (`CONSTRAINT`, `CHECK`, `DEFAULT`)

### Módulo 5 — SQL avanzado
23. Índices: qué son, tipos (simple, único, compuesto, full-text)
24. Transacciones: `START TRANSACTION`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, propiedades ACID
25. Procedimientos almacenados (`CREATE PROCEDURE`)
26. Funciones personalizadas (`CREATE FUNCTION`)
27. Triggers (`BEFORE/AFTER INSERT/UPDATE/DELETE`)
28. Eventos programados (`EVENT SCHEDULER`)
29. Vistas avanzadas y vistas actualizables

### Módulo 6 — Rendimiento y optimización
30. `EXPLAIN` y análisis de planes de ejecución
31. Optimización de consultas (evitar `SELECT *`, uso correcto de índices)
32. Índices avanzados y cobertura de índices (covering index)
33. Particionamiento de tablas
34. Caché de consultas y buenas prácticas de rendimiento

### Módulo 7 — Administración
35. Gestión de usuarios y permisos (`CREATE USER`, `GRANT`, `REVOKE`)
36. Copias de seguridad y restauración (`mysqldump`, restauración)
37. Replicación (maestro-esclavo, conceptos básicos)
38. Seguridad: inyección SQL, buenas prácticas, cifrado, roles

### Módulo 8 — Nivel experto
39. JSON en MySQL (columnas JSON, funciones `JSON_EXTRACT`, etc.)
40. Búsqueda de texto completo (`FULLTEXT`, `MATCH...AGAINST`)
41. Motores de almacenamiento: InnoDB vs MyISAM vs Memory
42. MySQL con ORMs (Sequelize, Eloquent, TypeORM) — conceptos generales
43. Escalabilidad: sharding, balanceo de carga, alta disponibilidad
44. Buenas prácticas profesionales y checklist de un DBA

### Módulo 9 — Práctica
45. Ejercicios básicos (SELECT, WHERE, INSERT/UPDATE/DELETE)
46. Ejercicios intermedios (JOIN, GROUP BY, subconsultas)
47. Ejercicios avanzados (procedimientos, triggers, optimización)
48. Proyectos prácticos guiados (ej. sistema de tienda, blog, gestión escolar) con esquema de BD incluido

### Extra
49. Glosario de términos (con buscador alfabético)
50. Hoja de referencia rápida (cheat sheet) descargable/imprimible

---

## 8. Sección de recursos (contenido sugerido para `recursos.html`)

Organizar en tarjetas por categoría, cada una con: nombre, breve descripción, idioma, y enlace.

### 8.1 Documentación oficial
- **MySQL Reference Manual** (documentación oficial completa) — dev.mysql.com/doc
- **W3Schools SQL/MySQL** — w3schools.com/mysql
- **MDN — Introducción a bases de datos** — developer.mozilla.org

### 8.2 Cursos gratuitos
- **freeCodeCamp** — cursos completos de SQL/MySQL en YouTube y su plataforma
- **Codecademy (curso gratuito "Learn SQL")** — codecademy.com
- **Khan Academy — Intro to SQL** — khanacademy.org
- **SoloLearn — SQL** — sololearn.com
- **YouTube: canales en español** (ej. HolaMundo, Fazt, Bootcamp de programación) — buscar "curso MySQL gratis español"
- **Coursera / edX** (cursos auditables gratis de universidades, ej. Stanford, Duke) — coursera.org / edx.org

### 8.3 Plataformas de práctica online
- **SQLZoo** — sqlzoo.net (ejercicios interactivos)
- **HackerRank — SQL Track** — hackerrank.com
- **LeetCode — Database Problems** — leetcode.com
- **Mode SQL Tutorial** — mode.com/sql-tutorial
- **DB Fiddle** — db-fiddle.com (probar consultas SQL online sin instalar nada)
- **SQL Practice (SQLBolt)** — sqlbolt.com
- **Programiz SQL Online Compiler** — programiz.com

### 8.4 Herramientas gratuitas
- **MySQL Workbench** — herramienta oficial gratuita
- **phpMyAdmin** — administración web
- **DBeaver Community** — cliente universal de BD gratuito
- **XAMPP / WAMP / MAMP** — entornos locales con MySQL incluido
- **draw.io / dbdiagram.io** — para crear diagramas ER gratis

### 8.5 Comunidades y foros
- **Stack Overflow (etiqueta mysql)**
- **Reddit r/SQL y r/Database**
- **Foros en español: forosdelweb, StackOverflow en español**

> Nota: Verificar periódicamente que los enlaces sigan activos y sean gratuitos, ya que el contenido y disponibilidad de sitios externos puede cambiar.

---

## 9. Buenas prácticas de accesibilidad y SEO

- Usar etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<article>`.
- Atributos `aria-expanded`, `aria-hidden`, `aria-label` en el menú hamburguesa y dropdowns.
- Contraste adecuado (mínimo AA) en ambos temas.
- `alt` descriptivo en todas las imágenes/diagramas.
- Meta `description` y `title` únicos por página.
- Datos estructurados básicos (Open Graph) para compartir en redes.
- Foco visible (`:focus-visible`) para navegación por teclado.
- Uso de `<button>` para elementos interactivos (no `<div onclick>`).

---

## 10. Checklist final antes de dar por terminado el proyecto

- [ ] Todos los módulos y temas tienen su archivo `.html` propio y funcional.
- [ ] Header con dropdowns funciona en desktop (click/hover) y hamburguesa funciona en mobile (abre, cierra, overlay, Esc).
- [ ] Dark/Light mode persiste al recargar y no parpadea al cargar.
- [ ] Sitio usable y legible desde 368px de ancho sin scroll horizontal no deseado (excepto tablas/código).
- [ ] Todos los bloques de código tienen resaltado de sintaxis y botón copiar.
- [ ] Sidebar de cada módulo resalta el tema activo.
- [ ] Navegación anterior/siguiente funciona en todos los temas.
- [ ] Página de recursos con enlaces verificados.
- [ ] Glosario completo y ordenado alfabéticamente.
- [ ] Página 404 personalizada.
- [ ] Rutas relativas correctas entre todos los niveles de carpetas.
- [ ] Validación de accesibilidad básica realizada.

---

## 11. Prompt sugerido para dar a opencode (resumen ejecutable)

> "Usando esta documentación completa como especificación, construye el proyecto `Guia de MySQL` con la estructura de carpetas de la sección 3 (los módulos dentro de `/pages`), el sistema de diseño de la sección 4, siguiendo el plan paso a paso de la sección 6, generando TODOS los archivos `.html` del temario de la sección 7 con contenido teórico real, ejemplos de código SQL, tablas y ejemplos visuales, además de la página de recursos con los enlaces de la sección 8. El sitio debe ser una guía paso a paso responsive desde 368px, con dark/light mode persistente, header con dropdowns en desktop y menú hamburguesa funcional en mobile, usando Bootstrap 5, un set de iconos (Bootstrap Icons o Boxicons), AOS para animaciones y Prism.js o Highlight.js para el resaltado de código, todo vía CDN sin necesidad de build tools."

---

*Fin de la documentación.*
