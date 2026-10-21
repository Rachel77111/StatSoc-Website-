# StatSoc Website

React, TypeScript, Tailwind CSS and Vite website for the University of Sydney Statistics Society.

## Local development

Install dependencies with `npm ci`, start the development server with `npm run dev`, and build production files with `npm run build`.

## Event content editor (Decap CMS)

The **Meet our team** page is available at `/team`. In the editor, open **Website pages → Meet our team** to add member names, photos, taglines and role descriptions. Names and photos are initially blank; the page displays role illustrations until photos are added. Roles are grouped into **The Big Four** and **Directors**.

The editor is served at `/admin/`. It manages `content/events.json`; event images and past-event gallery photos uploaded in the editor are committed under `public/uploads/events/`. The site reads the generated `/content/events.json` at runtime, so CMS edits become visible after the deployment finishes.

This project uses Decap CMS with GitHub login and Netlify's built-in OAuth service. It does not use Netlify Identity or the deprecated Git Gateway. To enable authentication and publishing:

1. Import `Rachel77111/StatSoc-Website-` into a Netlify site, using the `main` branch.
2. Use the repository root as the base directory, `npm run build` as the build command, and `dist` as the publish directory. The included `netlify.toml` configures these values and pins Node to the version required by the project.
3. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App** ([direct link](https://github.com/settings/applications/new)). Give it a name such as `StatSoc content editor`. Set **Homepage URL** to your deployed website URL and **Authorization callback URL** to exactly `https://api.netlify.com/auth/done`.
4. Register the app, copy its **Client ID**, and generate a **Client Secret**. In your Netlify project, open **Project configuration → Security → OAuth → Authentication Providers → Install Provider**. Choose **GitHub**, enter those credentials, and save. Keep the secret in Netlify only; do not put it in this repository, the CMS YAML, or frontend environment variables.
5. Give each trusted editor's GitHub account **write/push access** to `Rachel77111/StatSoc-Website-`. Editors use their own GitHub accounts. If the repository belongs to an organisation that restricts OAuth apps, an organisation owner may also need to approve the app. If the repository moves, update `backend.repo` in `public/admin/config.yml`.
6. Visit the deployed site's `/admin/`, select **Login with GitHub**, and authorise the OAuth app. Open **Events page → Events and galleries**, edit content or images, then save/publish. Wait for Netlify's production deployment to finish and refresh `/events`.

The CMS commits directly to `main`; Netlify then rebuilds and publishes the site. GitHub repository permissions control who can save changes. Write access also permits changes outside the CMS; grant it only to trusted editors. Branch protection that requires pull requests can prevent this direct-publish workflow.

For local CMS UI testing, run `npm run dev` and open `/admin/index.html`. Use the deployed site for GitHub login and publishing after configuring OAuth in Netlify. `local_backend` remains disabled, so local testing does not grant repository write access or save edits to local files.

If login fails, confirm the OAuth provider is installed on the correct Netlify project and the callback URL matches exactly. Open the editor using the deployed project's domain, allow the login popup, and verify the GitHub account has repository write access. The existing `site_url` and `display_url` point to `https://statsoc.sydney.edu.au`; update them if your final public domain differs.

Setup references: [Decap GitHub backend](https://decapcms.org/docs/github-backend/) and [Netlify OAuth provider setup](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/).
