# Static site served by nginx inside the container; the host nginx proxies to it.
FROM nginx:1.27-alpine
COPY deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY index.html THREEUI-LICENSE.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
