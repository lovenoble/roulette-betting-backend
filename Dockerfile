FROM node:16.19.0 as base

RUN npm install -g pnpm
# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

FROM base as dependencies

WORKDIR /usr/src/app
COPY .npmrc package.json pnpm-lock.yaml ./
ENV GENERATE_SOURCEMAP=false
RUN pnpm install --frozen-lockfile --prod
# RUN pnpm install

FROM base as build

WORKDIR /usr/src/app
COPY . ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm run build

FROM base as deploy

WORKDIR /usr/src/app
COPY .env.prod ./.env
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/keys ./keys
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY .npmrc package.json pnpm-lock.yaml ./
EXPOSE 3100
EXPOSE 3200
EXPOSE 4200
CMD ["node", "--experimental-specifier-resolution=node", "-r", "dotenv/config", "/usr/src/app/dist/index.js"]

