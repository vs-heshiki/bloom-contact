# Bloom Contact API

API REST em **Express + TypeScript + Sequelize (MySQL)**, validações com **Joi**, testes com **Jest**, arquitetura com **controllers / usecases / services**, documentação **Swagger**, execução com **Docker Compose**.

> **Desafio**: CRUD de contatos (nome, endereço, telefones, email) + integração com clima (HgBrasil) ao exibir contato, incluindo mensagem de sugestão conforme regras de temperatura/condição. Soft delete, filtros, tratamento de erros e documentação.

## Como rodar (Docker)

1. Copie `.env.example` para `.env` e ajuste se necessário.
2. Execute:

```bash
docker compose up --build
```

- API: http://localhost:7545
- Swagger: http://localhost:7545/docs

## Scripts (sem Docker)

```bash
npm install
cp .env.example .env
npm run dev
```

Para build/start:

```bash
npm run build
npm start
```

## Variáveis de ambiente

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_DIALECT=mysql`
- `HGBRASIL_KEY`
- `PORT` (default 7545)

## Endpoints principais

- `POST /contacts` – cria contato (validação Joi, impede telefones duplicados)
- `GET /contacts` – lista com filtros por `name`, `address`, `email`, `phone`
- `GET /contacts/:id` – exibe contato + clima (cidade = `address`)
- `PUT /contacts/:id` – atualiza contato
- `DELETE /contacts/:id` – soft delete (paranoid)

## Arquitetura

- **controllers** – HTTP/adaptação (validações Joi)
- **usecases** – orquestram regras de negócio
- **services** – integrações (HgBrasil)
- **repository** - acesso a dados (Sequelize)
- **structs** – Sequelize (Contact, Phone). Soft delete via `paranoid: true` e índice único (contactId, number).
- **middlewares** – tratamento de erros centralizado
- **validations** – esquemas Joi

## Testes

- **Unit**: HgBrasil
- **Integração**: endpoints (usa `sqlite` em memória quando `NODE_ENV=test`)

```bash
npm test
npm run test:unit
npm run test:integration
```

## Notas

- A integração com HgBrasil tolera falhas: se a API cair, a resposta do `GET /contacts/:id` virá com `weather.error`.
