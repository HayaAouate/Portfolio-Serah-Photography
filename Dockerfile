# syntax=docker/dockerfile:1

# ---------- 1. Build : compilation Vite ----------
FROM node:22-alpine AS build

WORKDIR /app

# Couche de dépendances séparée : elle n'est reconstruite que si le lock change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL du service de formulaire (Formspree, Web3Forms…), injectée à la compilation.
# Laissée vide, le formulaire bascule sur le logiciel de messagerie du visiteur.
#   docker build --build-arg VITE_FORM_ENDPOINT=https://… .
ARG VITE_FORM_ENDPOINT=""
ENV VITE_FORM_ENDPOINT=$VITE_FORM_ENDPOINT

RUN npm run build


# ---------- 2. Runtime : nginx statique ----------
FROM nginx:1.27-alpine

# 3004 : 3001/3002/3003 sont déjà pris par les autres services du serveur
EXPOSE 3004

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3004/ >/dev/null || exit 1
