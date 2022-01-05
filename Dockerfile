# Use latest version of node
FROM node:16.4

# Create app directory
WORKDIR /treez-take-home

# Bundle app source
COPY . .

RUN npm install && npm install typescript -g

# Expose port
EXPOSE $SERVER_PORT

# Run App
CMD [ "node", "./build/app.js" ]