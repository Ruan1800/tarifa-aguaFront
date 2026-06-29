# AquaTarifa — Frontend

Interface web para gerenciamento de tarifas de água. Permite criar tabelas tarifárias com categorias e faixas de consumo progressivo, além de calcular o valor a pagar com base no consumo informado.

**Backend (API):** https://tarifa-agua.onrender.com  
**Frontend (produção):** em breve no Vercel

---

## Funcionalidades

- Listar e excluir tabelas tarifárias cadastradas
- Criar tabelas com categorias (residencial, comercial, industrial etc.) e faixas de preço progressivo
- Calcular o valor da tarifa com base na categoria e consumo (m³)

## Tecnologias

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React (ícones)

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- npm

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd tarifa-agua-front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=https://tarifa-agua.onrender.com
```

> Se quiser apontar para um backend local, use `VITE_API_URL=http://localhost:8080`.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em: http://localhost:5173

---

## Build de produção

```bash
npm run build
```

Os arquivos ficam em `dist/`.

---

## Deploy no Vercel

### Via interface web (recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New → Project**
3. Importe este repositório do GitHub
4. Na tela de configuração, expanda **Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `VITE_API_URL` | `https://tarifa-agua.onrender.com` |

5. Clique em **Deploy**

O Vercel detecta automaticamente que é um projeto Vite. As configurações de build padrão já são corretas:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Via CLI do Vercel

```bash
npm i -g vercel
vercel
```

Quando solicitado, defina a variável de ambiente `VITE_API_URL=https://tarifa-agua.onrender.com`.

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Não | URL base da API. Padrão: `http://localhost:8080` |
