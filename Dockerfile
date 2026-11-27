# Static site served by nginx. No build step and no environment variables needed.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html privacy.html terms.html cookies.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
