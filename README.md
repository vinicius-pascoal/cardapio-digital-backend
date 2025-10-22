# Cum Cardápio Digital (Node + TypeScript + Prisma + MySQL)

API simples para categorias, pratos e pedidos (com itens de pedido).

## Rodar com Docker (recomendado)

```bash
cp .env.example .env
docker compose up -d --build
# (primeira vez) aplicar migrations dentro do container:
docker compose exec api npx prisma migrate deploy
# (opcional) popular dados:
docker compose exec api npm run prisma:seed
```

A API estará em `http://localhost:3000`. O banco MySQL estará em `localhost:3306` (user: root / pass: root).

## Rodar localmente (sem Docker)

- Instale MySQL 8 e crie o DB `cum_cardapio`.
- Copie `.env.example` para `.env` e ajuste `DATABASE_URL`.
- Depois:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Endpoints

- `GET /health`

### Categorias
- `POST /api/categories` `{ nome }`
- `GET /api/categories`
- `GET /api/categories/:id`
- `PUT /api/categories/:id` `{ nome }`
- `DELETE /api/categories/:id`

### Pratos
- `POST /api/dishes` `{ nome, descricao?, preco, categoriaId }`
- `GET /api/dishes`
- `GET /api/dishes/:id`
- `PUT /api/dishes/:id` (campos acima)
- `DELETE /api/dishes/:id`

### Pedidos
- `POST /api/orders` `{ items: [{ pratoId, quantidade? }] }`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id` `{ items: [...] }` (substitui os itens)
- `DELETE /api/orders/:id`

## Postman
Importe `postman/Cum Cardapio.postman_collection.json`. Há variáveis e exemplos prontos.
