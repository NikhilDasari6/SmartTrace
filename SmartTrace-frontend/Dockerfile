FROM nginx:alpine

# Standard Nginx way to use environment variables in config
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html

ENV BACKEND_URL=http://smarttrace-backend:3000

EXPOSE 80


