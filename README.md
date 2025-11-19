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

## 📋 Endpoints da API

### Health Check

#### `GET /health`
Verifica se a API está funcionando.

**Resposta (200):**
```json
{
  "status": "ok"
}
```

---

### 🏷️ Categorias

#### `GET /api/categories`
Lista todas as categorias (ordenadas por ID crescente).

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Bebidas"
  },
  {
    "id": 2,
    "nome": "Pratos Principais"
  }
]
```

---

#### `GET /api/categories/:id`
Busca uma categoria específica por ID.

**Parâmetros:**
- `id` (path) - ID da categoria

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Bebidas"
}
```

**Resposta (404):**
```json
{
  "error": "Categoria não encontrada"
}
```

---

#### `POST /api/categories`
Cria uma nova categoria.

**Body (JSON):**
```json
{
  "nome": "Sobremesas"
}
```

**Resposta (201):**
```json
{
  "id": 3,
  "nome": "Sobremesas"
}
```

**Resposta (400) - Validação:**
```json
{
  "error": {
    "formErrors": [],
    "fieldErrors": {
      "nome": ["String must contain at least 1 character(s)"]
    }
  }
}
```

---

#### `PUT /api/categories/:id`
Atualiza uma categoria existente.

**Parâmetros:**
- `id` (path) - ID da categoria

**Body (JSON):**
```json
{
  "nome": "Bebidas Geladas"
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Bebidas Geladas"
}
```

**Resposta (404):**
```json
{
  "error": "Categoria não encontrada"
}
```

---

#### `DELETE /api/categories/:id`
Deleta uma categoria (não pode ter pratos associados).

**Parâmetros:**
- `id` (path) - ID da categoria

**Resposta (204):** Sem conteúdo

**Resposta (404):**
```json
{
  "error": "Categoria não encontrada"
}
```

---

### 🍽️ Pratos

#### `GET /api/dishes`
Lista todos os pratos com suas categorias (ordenados por ID crescente).

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Hambúrguer Artesanal",
    "descricao": "Hambúrguer com pão artesanal, 180g de carne, queijo cheddar",
    "preco": "29.90",
    "categoriaId": 2,
    "categoria": {
      "id": 2,
      "nome": "Pratos Principais"
    }
  }
]
```

---

#### `GET /api/dishes/:id`
Busca um prato específico por ID com sua categoria.

**Parâmetros:**
- `id` (path) - ID do prato

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Hambúrguer Artesanal",
  "descricao": "Hambúrguer com pão artesanal, 180g de carne, queijo cheddar",
  "preco": "29.90",
  "categoriaId": 2,
  "categoria": {
    "id": 2,
    "nome": "Pratos Principais"
  }
}
```

**Resposta (404):**
```json
{
  "error": "Prato não encontrado"
}
```

---

#### `POST /api/dishes`
Cria um novo prato.

**Body (JSON):**
```json
{
  "nome": "Pizza Margherita",
  "descricao": "Pizza com molho de tomate, mussarela e manjericão",
  "preco": 35.00,
  "categoriaId": 2
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "nome": "Pizza Margherita",
  "descricao": "Pizza com molho de tomate, mussarela e manjericão",
  "preco": "35.00",
  "categoriaId": 2
}
```

**Resposta (400) - Validação:**
```json
{
  "error": {
    "formErrors": [],
    "fieldErrors": {
      "preco": ["Number must be greater than 0"],
      "categoriaId": ["Expected number, received string"]
    }
  }
}
```

---

#### `PUT /api/dishes/:id`
Atualiza um prato existente (todos os campos são opcionais).

**Parâmetros:**
- `id` (path) - ID do prato

**Body (JSON):**
```json
{
  "nome": "Pizza Margherita Premium",
  "preco": 42.00
}
```

**Resposta (200):**
```json
{
  "id": 2,
  "nome": "Pizza Margherita Premium",
  "descricao": "Pizza com molho de tomate, mussarela e manjericão",
  "preco": "42.00",
  "categoriaId": 2
}
```

**Resposta (404):**
```json
{
  "error": "Prato não encontrado"
}
```

---

#### `DELETE /api/dishes/:id`
Deleta um prato (não pode estar em pedidos ativos).

**Parâmetros:**
- `id` (path) - ID do prato

**Resposta (204):** Sem conteúdo

**Resposta (404):**
```json
{
  "error": "Prato não encontrado"
}
```

---

### 📦 Pedidos

#### `GET /api/orders`
Lista todos os pedidos com seus itens e pratos (ordenados do mais recente ao mais antigo).

**Resposta (200):**
```json
[
  {
    "id": 1,
    "criadoEm": "2025-11-19T10:30:00.000Z",
    "itens": [
      {
        "id": 1,
        "pedidoId": 1,
        "pratoId": 1,
        "quantidade": 2,
        "prato": {
          "id": 1,
          "nome": "Hambúrguer Artesanal",
          "descricao": "Hambúrguer com pão artesanal",
          "preco": "29.90",
          "categoriaId": 2
        }
      }
    ]
  }
]
```

---

#### `GET /api/orders/:id`
Busca um pedido específico por ID com todos os seus itens e pratos.

**Parâmetros:**
- `id` (path) - ID do pedido

**Resposta (200):**
```json
{
  "id": 1,
  "criadoEm": "2025-11-19T10:30:00.000Z",
  "itens": [
    {
      "id": 1,
      "pedidoId": 1,
      "pratoId": 1,
      "quantidade": 2,
      "prato": {
        "id": 1,
        "nome": "Hambúrguer Artesanal",
        "descricao": "Hambúrguer com pão artesanal",
        "preco": "29.90",
        "categoriaId": 2
      }
    }
  ]
}
```

**Resposta (404):**
```json
{
  "error": "Pedido não encontrado"
}
```

---

#### `POST /api/orders`
Cria um novo pedido com itens.

**Body (JSON):**
```json
{
  "items": [
    {
      "pratoId": 1,
      "quantidade": 2
    },
    {
      "pratoId": 2,
      "quantidade": 1
    }
  ]
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "criadoEm": "2025-11-19T10:30:00.000Z",
  "itens": [
    {
      "id": 1,
      "pedidoId": 1,
      "pratoId": 1,
      "quantidade": 2,
      "prato": {
        "id": 1,
        "nome": "Hambúrguer Artesanal",
        "preco": "29.90",
        "categoriaId": 2,
        "categoria": {
          "id": 2,
          "nome": "Pratos Principais"
        }
      }
    }
  ],
  "total": 59.80
}
```

**Nota:** O endpoint também emite um evento SSE `new-order` para todos os clientes conectados.

**Resposta (400) - Validação:**
```json
{
  "error": {
    "formErrors": [],
    "fieldErrors": {
      "items": ["Array must contain at least 1 element(s)"]
    }
  }
}
```

---

#### `PUT /api/orders/:id`
Atualiza um pedido existente (substitui todos os itens).

**Parâmetros:**
- `id` (path) - ID do pedido

**Body (JSON):**
```json
{
  "items": [
    {
      "pratoId": 1,
      "quantidade": 3
    }
  ]
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "criadoEm": "2025-11-19T10:30:00.000Z",
  "itens": [
    {
      "id": 2,
      "pedidoId": 1,
      "pratoId": 1,
      "quantidade": 3,
      "prato": {
        "id": 1,
        "nome": "Hambúrguer Artesanal",
        "preco": "29.90",
        "categoriaId": 2,
        "categoria": {
          "id": 2,
          "nome": "Pratos Principais"
        }
      }
    }
  ],
  "total": 89.70
}
```

**Nota:** O endpoint também emite um evento SSE `order-update` para todos os clientes conectados.

**Resposta (404):**
```json
{
  "error": "Pedido não encontrado"
}
```

---

#### `DELETE /api/orders/:id`
Deleta um pedido e todos os seus itens.

**Parâmetros:**
- `id` (path) - ID do pedido

**Resposta (204):** Sem conteúdo

**Nota:** O endpoint também emite um evento SSE `order-delete` com `{ id }` para todos os clientes conectados.

**Resposta (404):**
```json
{
  "error": "Pedido não encontrado"
}
```

---

### 📡 Server-Sent Events (SSE)

#### `GET /api/orders/stream`
Estabelece uma conexão SSE para receber atualizações em tempo real sobre pedidos.

**Headers necessários:**
```
Accept: text/event-stream
```

**Eventos emitidos:**

##### Conexão estabelecida:
```
data: {"type":"connected","message":"SSE connected"}
```

##### Heartbeat (a cada 30s):
```
:heartbeat
```

##### Novo pedido criado:
```
event: new-order
data: {"id":1,"criadoEm":"2025-11-19T10:30:00.000Z","itens":[...],"total":59.80}
```

##### Pedido atualizado:
```
event: order-update
data: {"id":1,"criadoEm":"2025-11-19T10:30:00.000Z","itens":[...],"total":89.70}
```

##### Pedido deletado:
```
event: order-delete
data: {"id":1}
```

**Exemplo de uso (JavaScript):**
```javascript
const eventSource = new EventSource('https://cardapio-digital-backend.vercel.app/api/orders/stream');

eventSource.addEventListener('new-order', (event) => {
  const order = JSON.parse(event.data);
  console.log('Novo pedido:', order);
});

eventSource.addEventListener('order-update', (event) => {
  const order = JSON.parse(event.data);
  console.log('Pedido atualizado:', order);
});

eventSource.addEventListener('order-delete', (event) => {
  const { id } = JSON.parse(event.data);
  console.log('Pedido deletado:', id);
});
```

**Exemplo de teste (curl):**
```bash
curl -N -H "Accept: text/event-stream" https://cardapio-digital-backend.vercel.app/api/orders/stream
```

**⚠️ Nota para produção (Vercel):**
- Em ambientes serverless, use Redis (Upstash) para pub/sub entre instâncias
- Configure `REDIS_URL` nas variáveis de ambiente
- Conexões SSE têm timeout de 60s no plano Hobby (900s no Pro)

---

#### `GET /api/sse/status`
Retorna informações sobre o status do SSE (útil para debugging).

**Resposta (200):**
```json
{
  "clients": 2,
  "heartbeatMs": 30000,
  "redis": true,
  "channel": "orders"
}
```

**Campos:**
- `clients` - Número de clientes conectados nesta instância
- `heartbeatMs` - Intervalo do heartbeat em milissegundos
- `redis` - Se Redis pub/sub está ativo
- `channel` - Canal Redis sendo usado

---

## 📮 Postman
Importe `postman/Cardapio Digital - Production.postman_collection.json`. Há variáveis de ambiente e exemplos prontos para todos os endpoints.
