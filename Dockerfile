FROM node:16.19.0 as base

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

FROM base as build

WORKDIR /usr/src/app
COPY . ./
# RUN pnpm install --frozen-lockfile --prod
RUN pnpm install
RUN pnpm run build:docker

FROM base as deploy

WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./
# COPY --from=build /usr/src/app/dist ./dist/
# COPY --from=build /usr/src/app/node_modules ./node_modules/
# COPY .npmrc package.json pnpm-lock.yaml ./
EXPOSE 3100
EXPOSE 3200
CMD ["node", "--experimental-specifier-resolution=node", "-r", "dotenv/config", "/usr/src/app/dist/index.js"]

# FROM node:16.19.0 as base

# RUN npm install -g pnpm

# FROM base as dependencies

# WORKDIR /usr/src/app
# COPY .npmrc package.json pnpm-lock.yaml ./
# ENV GENERATE_SOURCEMAP=false
# RUN pnpm install --frozen-lockfile --prod

# FROM base as build

# WORKDIR /usr/src/app
# COPY . ./
# COPY --from=dependencies /usr/src/app/node_modules ./node_modules/
# RUN pnpm run build
# # RUN pnpm prune --prod

# FROM base as deploy

# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist/
# COPY --from=build /usr/src/app/node_modules ./node_modules/
# COPY .npmrc package.json pnpm-lock.yaml ./
# EXPOSE 3100
# EXPOSE 3200
# CMD ["node", "--experimental-specifier-resolution=node", "-r", "dotenv/config", "/usr/src/app/dist/index.js"]



# node --experimental-specifier-resolution=node -r dotenv/config dist/index.js
# FROM node:16
# RUN npm install -g pnpm
# WORKDIR /usr/src/app
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --only=production
# COPY --from=0 /usr/src/app/dist .
# COPY .env.prod ./.env
# EXPOSE 3100
# EXPOSE 3200
# CMD pnpm run production
