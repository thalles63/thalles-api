FROM oven/bun:1

WORKDIR /app

# Copia os manifests primeiro (para cache de dependências)
COPY package.json bun.lockb* ./

RUN bun install

# Copia o restante do código
COPY . .

EXPOSE 3000

CMD ["bun", "run", "production"]
