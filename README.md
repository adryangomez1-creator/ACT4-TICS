# Catálogo de productos

Aplicación sencilla que obtiene productos de [Fake Store API](https://fakestoreapi.com/products), muestra sus nombres y categorías en español, convierte los precios de USD a quetzales con la tasa de [ExchangeRate-API](https://open.er-api.com/v6/latest/USD) y permite buscarlos por nombre o categoría.

## Requisitos

- Node.js y npm
- Git

## Instalación y uso

1. Instala las dependencias con `npm install`.
2. Abre `index.html` en el navegador. También puedes usar la extensión Live Server de VS Code.
3. Usa el campo de búsqueda para filtrar y el botón **Actualizar** para volver a consultar la API.

## ESLint y Husky

- `npm run lint` revisa el código JavaScript con ESLint.
- Husky ejecuta esa revisión automáticamente antes de cada commit. Si ESLint encuentra errores, el commit se bloquea.

Para preparar Git y el hook desde cero:

```bash
git init
npm install
npx husky init
```

El hook de pre-commit queda configurado para ejecutar `npm run lint`.