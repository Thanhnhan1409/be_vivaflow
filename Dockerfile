###################
# BUILD FOR DEVELOPMENT
###################
FROM node:20 AS development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


###################
# BUILD FOR PRODUCTION
###################
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=development /usr/src/app/dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

ENV NODE_ENV=production


###################
# PRODUCTION
###################
FROM node:20.17-alpine AS production

# Install necessary dependencies for Prisma (like libc6-compat)
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
