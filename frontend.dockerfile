FROM node:buster-slim

WORKDIR /home/perplexity

COPY ui /home/perplexity

RUN apt-get update -y && apt-get install -y openssl

RUN npm install
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "dev"]