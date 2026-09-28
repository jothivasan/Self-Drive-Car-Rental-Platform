# Self-Drive Car Rental Platform

A responsive React application that demonstrates a self-drive vehicle rental experience. Users can browse vehicles, filter and sort listings, view vehicle details, authenticate, and manage a rental-oriented profile.

## Features

- Vehicle catalog with filtering and sorting
- Vehicle detail modal and rental flow UI
- Registration, login, and profile screens
- Dashboard for account and booking-oriented views
- Responsive components built for a modern web experience

## Built with

React 19, TypeScript, Vite, and Supabase client libraries.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure the Supabase URL and anonymous key expected by `services/supabaseClient.ts`. Use environment variables for credentials and do not commit local environment files.

For a production build, run `npm run build`; use `npm run preview` to inspect the generated build.

## Project structure

- `components/` – reusable rental, navigation, authentication, and profile UI
- `context/` and `hooks/` – authentication state and helpers
- `services/` – Supabase integration
- `Documentation/` – project documentation

## License

Released under the MIT License. See [LICENSE](LICENSE).
