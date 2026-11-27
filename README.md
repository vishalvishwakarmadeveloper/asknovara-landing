# Ask Novara - Landing page

Static landing page for [asknovara.tech](https://asknovara.tech), plus Privacy, Terms and Cookie pages.

**Stack:** HTML, CSS, JavaScript, Bootstrap 5, Tailwind (CDN, `tw-` prefix), GSAP + ScrollTrigger, Lenis, globe.gl.
**Fonts:** Clash Display, Work Sans, JetBrains Mono.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (Dokploy or any Docker host)

The repo has a `Dockerfile` that serves the site with nginx on port 80. No environment variables are needed.

In Dokploy: Build Type **Dockerfile**, Dockerfile path `Dockerfile`, and in Domains set the container port to **80**.

## Before going live

- Replace every `***********` in `privacy.html` and `terms.html` with the real company details: legal name, company number, registered office, ICO number and contact email. `cookies.html` also has one, for the contact email.
- Connect the contact form (`#leadForm` in `assets/js/main.js`) to an email or CRM endpoint.
- Add the real LinkedIn, X and Instagram URLs in the footer.
