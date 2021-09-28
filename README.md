# vite-ssr-web

Example of a completely framework-less approach to building a web app. It's all about the developer tooling and the build process!

Current minimal dependencies:
- `vite` for development
- `vite-plugin-ssr` for SSR and SSG
- `typescript` for maintainability
- `express` and `ts-node` for serving the app
- `lodash` for utility functions
- `storeon` for state management
- `tailwindcss` and `postcss` for styling
- `schema-dts` for type definitions for Schema.org vocabulary

## Development

```bash
npm install
npm run dev
```

Open the browser at http://localhost:3000/

For production:
```bash
npm run prod
```