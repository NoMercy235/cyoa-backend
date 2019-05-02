FROM node:carbon

# File Author / Maintainer
LABEL authors="Alexandru Florian Barascu <alex.florin235@yahoo.com>"
MAINTAINER alex.florin235@yahoo.com

ENV PORT=8080
ENV HTTPS_PORT=443

# Set work directory to /src
WORKDIR /src

# Copy app source
COPY . /src

# Install app dependencies
RUN rm package-lock.json && npm install

EXPOSE $PORT
EXPOSE $HTTP_PORT

# Start command as per package.json
ENTRYPOINT ["npm", "start"]
