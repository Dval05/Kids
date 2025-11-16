FROM php:8.2-apache

# Enable useful Apache modules
RUN a2enmod rewrite headers expires

# Configure Apache: disable directory listing and enable compression/cache headers (basic)
RUN printf '%s\n' \
    '<Directory /var/www/html>' \
    '  Options -Indexes +FollowSymLinks' \
    '  AllowOverride All' \
    '  Require all granted' \
    '</Directory>' \
    '<IfModule mod_deflate.c>' \
    '  AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json' \
    '</IfModule>' \
    '<IfModule mod_expires.c>' \
    '  ExpiresActive On' \
    '  ExpiresByType text/css "access plus 7 days"' \
    '  ExpiresByType application/javascript "access plus 7 days"' \
    '  ExpiresByType image/* "access plus 30 days"' \
    '</IfModule>' \
    > /etc/apache2/conf-available/kids.conf \
 && a2enconf kids

# Copy app
WORKDIR /var/www/html
COPY . /var/www/html/

# Configure Apache to listen on $PORT (Render sets it automatically)
RUN sed -ri 's/^Listen 80$/Listen ${PORT:-80}/' /etc/apache2/ports.conf \
 && sed -ri 's#<VirtualHost \*:80>#<VirtualHost *:${PORT:-80}>#' /etc/apache2/sites-available/000-default.conf

# Health endpoint (serves index.html by default)
EXPOSE 80

# Render uses PORT env var when present; map Apache to it
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

CMD ["bash", "-lc", "export PORT=${PORT:-80}; apache2-foreground"]
