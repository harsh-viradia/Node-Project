FROM node:16.14.2-bullseye
#
ARG prv_key
ARG pub_key
RUN apt-get update && apt-get install -y git openssh-server
RUN mkdir -p ~/.ssh && chmod 0700 ~/.ssh
RUN ssh-keyscan git.knovator.in > ~/.ssh/known_hosts
RUN echo "$prv_key" | base64 -d > ~/.ssh/id_ed25519 && echo "$pub_key" | base64 -d > ~/.ssh/id_ed25519.pub && chmod 600 ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519.pub
#
RUN apt update && apt install -y ffmpeg s3cmd chromium
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /var/www/orbit-skills-node/src/scripts/
RUN mv /usr/src/app/src/scripts/packager /var/www/orbit-skills-node/src/scripts/packager
RUN npm install -g nodemon
RUN chmod +x ./startup.sh
EXPOSE 3000
#CMD [ "node", "./src/bin/www" ]
CMD [ "sh", "./startup.sh" ]
