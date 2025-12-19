## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Auth0 (Authentication)

## Auth0 Setup

This project uses Auth0 for authentication. To set up Auth0:

1. **Create an Auth0 Account and Application**
   - Sign up at [auth0.com](https://auth0.com) (free tier available)
   - Go to the Auth0 Dashboard
   - Navigate to Applications → Applications
   - Click "Create Application"
   - Choose "Single Page Application" as the application type
   - Select React as the technology

2. **Configure Auth0 Application Settings**
   - In your Auth0 application settings, configure the following URLs:
     - **Allowed Callback URLs**: `http://localhost:8080`
     - **Allowed Logout URLs**: `http://localhost:8080`
     - **Allowed Web Origins**: `http://localhost:8080`
   - For production, add your production URLs to these fields as well

3. **Create Environment File**
   - Copy `.env.example` to `.env.local`:
     ```sh
     cp .env.example .env.local
     ```
   - Fill in your Auth0 credentials in `.env.local`:
     - `VITE_AUTH0_DOMAIN`: Your Auth0 domain (e.g., `your-tenant.auth0.com`)
     - `VITE_AUTH0_CLIENT_ID`: Your Auth0 Client ID (found in your application settings)
     - `VITE_AUTH0_AUDIENCE`: (Optional) Your API identifier if using Auth0 APIs
     - `VITE_AUTH0_REDIRECT_URI`: `http://localhost:8080` (port number for this project)

4. **Start the Development Server**
   ```sh
   npm run dev
   ```

**Note**: The `.env.local` file is git-ignored and will never be committed. Only `.env.example` is tracked in the repository.

