FROM node:16.14.2-bullseye
WORKDIR /app
COPY . .
#
ARG prv_key
ARG pub_key
RUN apt-get update && apt-get install -y git openssh-server
RUN mkdir -p ~/.ssh && chmod 0700 ~/.ssh
RUN ssh-keyscan git.knovator.in > ~/.ssh/known_hosts
RUN echo "$prv_key" | base64 -d > ~/.ssh/id_ed25519 && echo "$pub_key" | base64 -d > ~/.ssh/id_ed25519.pub && chmod 600 ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519.pub
#
RUN yarn install --network-concurrency 1
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start-docker"]
