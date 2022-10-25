FROM node:lts
WORKDIR /usr/src/app
COPY . ./
ENV GENERATE_SOURCEMAP=false
RUN npm install --only=production
RUN npm run build



FROM node:lts
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist .
COPY .env.prod ./.env
EXPOSE 3100 9090
CMD npm run production
#CMD ["node", "--experimental-specifier-resolution=node", "bin/www.js"]
