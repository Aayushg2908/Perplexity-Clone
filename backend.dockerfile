FROM node:buster-slim

ARG SEARXNG_API_URL
ENV SEARXNG_API_URL=${SEARXNG_API_URL}

WORKDIR /home/perplexity

COPY src /home/perplexity/src

COPY tsconfig.json /home/perplexity/
COPY .env /home/perplexity/
COPY package.json /home/perplexity/
COPY package-lock.json /home/perplexity/

RUN npm install
RUN npm run build

CMD [ "npm","start" ]