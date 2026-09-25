FROM node:24.21.0-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_PREP_DATA_PROVIDER=http
ARG VITE_PREP_API_BASE_URL=/api
ENV VITE_PREP_DATA_PROVIDER=${VITE_PREP_DATA_PROVIDER}
ENV VITE_PREP_API_BASE_URL=${VITE_PREP_API_BASE_URL}
RUN npm run build

FROM nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284 AS runtime
ARG PREP_FRONTEND_VERSION=dev
LABEL org.opencontainers.image.title="prep-web" \
      org.opencontainers.image.revision="${PREP_FRONTEND_VERSION}"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
