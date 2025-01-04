FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install --omit=dev
RUN npm cache clean --force

FROM node:18.15.0-bullseye-slim
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node ./config ./config
CMD ["node", "./dist/app/app.js"]
