# StatSoc Website

React, TypeScript, Tailwind CSS and Vite website for the University of Sydney Statistics Society.

## Local development

Install dependencies with `npm ci`, start the development server with `npm run dev`, and build production files with `npm run build`.

## Event content editor (Decap CMS)

The editor is served at `/admin/`. It manages `content/events.json`; event images and past-event gallery photos uploaded in the editor are committed under `public/uploads/events/`. The site reads the generated `/content/events.json` at runtime, so CMS edits become visible after the deployment finishes.

This project uses Decap CMS with Netlify Identity and Git Gateway. To enable authentication and publishing:

1. Import `Rachel77111/StatSoc-Website-` into a Netlify site, using the `main` branch.
2. Use the repository root as the base directory, `npm run build` as the build command, and `dist` as the publish directory. The included `netlify.toml` configures these values and pins Node to the version required by the project.
3. In the Netlify site dashboard, enable **Identity**.
4. Under Identity registration settings, choose **Invite only**. Invite only the StatSoc editors who should be allowed to publish. Do not enable open registration.
5. Under Identity services, enable **Git Gateway** and select the site's connected GitHub repository.
6. Visit the deployed site's `/admin/`, sign in with the invited account, and manage upcoming events, image uploads, past-event summaries and galleries.

The CMS commits directly to `main`; Netlify then rebuilds and publishes the site. Git Gateway authorizes editor writes through Netlify Identity. Hiding an admin navigation link is not access control, so keep Identity invite-only and only invite trusted editors.

For local CMS UI testing, run `npm run dev` and open `/admin/`. Git Gateway login and repository writes require the deployed Netlify Identity/Git Gateway configuration; local mode does not grant write access by itself.
