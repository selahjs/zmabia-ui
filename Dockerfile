FROM nginx:1.24.0

# Add nginx configuration
ADD nginx.conf /etc/nginx/conf.d/default.conf

# Copy web app files
COPY /build/webapp /usr/share/nginx/html

# Copy consul files and run script
COPY /consul /consul
COPY run.sh /run.sh

# Ensure the script is executable
RUN chmod +x /run.sh

# Update package lists and install dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg gettext build-essential

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

# Move package.json and install npm dependencies
RUN mv /consul/package.json /package.json && \
    npm install

# Specify the default command
CMD ["/run.sh"]
