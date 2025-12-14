# TMDB Explorer - Explorador de Filmes e Séries

Uma aplicação web moderna e responsiva que permite pesquisar, filtrar e explorar filmes e séries através da **API The Movie Database (TMDB)**.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [API Utilizada](#api-utilizada)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Correr em Dev](#como-correr-em-dev)
- [Persistência de Dados](#persistência-de-dados)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Tratamento de Erros](#tratamento-de-erros)
- [Testes](#testes)

## 🎯 Visão Geral

A **TMDB Explorer** é uma aplicação SPA (Single Page Application) desenvolvida em React que consome a API pública The Movie Database. A aplicação oferece uma experiência de utilizador intuitiva com pesquisa em tempo real, filtros avançados, paginação e persistência de favoritos.

### Design

O projeto segue uma filosofia de **Cinema Moderno Minimalista** com:
- Paleta de cores: Preto profundo (`#0a0a0a`), branco puro e laranja vibrante (`#ff6b35`)
- Tipografia elegante com hierarquia clara
- Espaço negativo generoso
- Animações subtis e transições suaves

## ✨ Funcionalidades

### Requisitos Implementados

1. **Pesquisa com Debounce** (~400 ms)
   - Pesquisa automática conforme o utilizador digita
   - Pressionar Enter para pesquisa imediata
   - Limpeza rápida com botão X

2. **Filtros e Ordenação**
   - Alternância entre Filmes e Séries
   - Ordenação por: Popularidade, Classificação, Data de Lançamento
   - Filtros por Género (múltiplos géneros selecionáveis)

3. **Paginação no Cliente**
   - Seleção de tamanho de página: 6, 12, 24, 48 itens
   - Navegação entre páginas com botões Anterior/Próxima
   - Indicador de página atual

4. **Estados UI**
   - **Loading**: Skeleton cards animados
   - **Empty**: Mensagem amigável quando não há resultados
   - **Error**: Mensagem de erro com botão "Tentar Novamente"
   - **Success**: Grid de resultados com cards interativos

5. **Fetch Robusto**
   - **AbortController**: Cancela pedidos anteriores ao fazer nova pesquisa
   - **Timeout**: 8 segundos (configurável)
   - **Verificação de resposta**: Valida `response.ok` antes de parsear JSON
   - **Tratamento de 404**: Apresenta estado vazio quando aplicável
   - **Normalização**: Lida com payloads em formato `[]` e `{data:[]}`
   - **Retry automático**: Tenta novamente em caso de timeout

6. **Persistência em localStorage**
   - Favoritos: Guarda IDs de filmes/séries marcados como favoritos
   - Restauração automática ao carregar a página
   - Sincronização em tempo real

7. **Acessibilidade**
   - `aria-live` em mensagens de estado
   - Labels associados a inputs
   - Navegação por teclado (Tab, Enter)
   - Descrições de imagens com `alt` descritivo

8. **Responsividade**
   - Design mobile-first
   - Grid responsivo: 1 coluna (mobile), 2 (tablet), 3-4 (desktop)
   - Barra de pesquisa e filtros adaptáveis

9. **Tratamento de Dados**
   - **Strings**: Título, nome com fallback "—"
   - **Números**: Popularidade com `toLocaleString('pt-PT')`
   - **Datas**: Formatadas com `Intl.DateTimeFormat` em português
   - **Booleanos**: Badge "+18" para filmes adultos
   - **Imagens**: URLs de posters com fallback SVG

## 🛠 Stack Tecnológico

| Categoria | Tecnologia |
|-----------|-----------|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Linguagem** | TypeScript 5.6 |
| **Styling** | TailwindCSS 4 |
| **UI Components** | shadcn/ui |
| **Routing** | Wouter 3 |
| **Icons** | Lucide React |
| **Notificações** | Sonner |
| **HTTP Client** | Fetch API nativa |
| **Persistência** | localStorage |

## 📡 API Utilizada

### The Movie Database (TMDB)

**Documentação**: [https://developer.themoviedb.org/docs](https://developer.themoviedb.org/docs)

**Endpoints Utilizados**:

| Endpoint | Descrição | Parâmetros |
|----------|-----------|-----------|
| `/search/movie` | Pesquisa de filmes | `query`, `page`, `language` |
| `/search/tv` | Pesquisa de séries | `query`, `page`, `language` |
| `/discover/movie` | Descobrir filmes | `sort_by`, `with_genres`, `primary_release_date.gte/lte`, `page` |
| `/discover/tv` | Descobrir séries | `sort_by`, `with_genres`, `first_air_date.gte/lte`, `page` |
| `/movie/popular` | Filmes populares | `page`, `language` |
| `/tv/popular` | Séries populares | `page`, `language` |
| `/movie/now_playing` | Filmes em cartaz | `page`, `language` |
| `/movie/upcoming` | Filmes em breve | `page`, `language` |

**Campos Extraídos do JSON**:

```typescript
// Filme/Série
- id: number (identificador único)
- title/name: string (título)
- overview: string (sinopse)
- poster_path: string | null (caminho do poster)
- backdrop_path: string | null (caminho do backdrop)
- release_date/first_air_date: string (data em YYYY-MM-DD)
- vote_average: number (classificação 0-10)
- vote_count: number (número de votos)
- popularity: number (índice de popularidade)
- genre_ids: number[] (IDs dos géneros)
- adult: boolean (conteúdo para adultos)
- original_language: string (idioma original)
```

**Autenticação**: API Key incluída na query string (`api_key` parameter)

## 📁 Estrutura do Projeto

```
tmdb-explorer/
├── client/
│   ├── public/
│   │   └── images/          # Imagens estáticas
│   ├── src/
│   │   ├── components/      # Componentes React reutilizáveis
│   │   │   ├── MediaCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/           # Hooks customizados
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── usePagination.ts
│   │   ├── lib/             # Utilitários e serviços
│   │   │   ├── tmdb-config.ts
│   │   │   ├── tmdb-service.ts
│   │   │   ├── fetch-api.ts
│   │   │   └── format-utils.ts
│   │   ├── contexts/        # React Contexts
│   │   ├── App.tsx          # Componente raiz
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Estilos globais
│   └── index.html
├── server/                  # Placeholder (não utilizado)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou superior
- npm ou pnpm

### Passos de Instalação

1. **Clonar o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd tmdb-explorer
   ```

2. **Instalar dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configurar variáveis de ambiente** (opcional)
   - A API Key está configurada em `client/src/lib/tmdb-config.ts`
   - Para alterar, editar `TMDB_API_KEY` no ficheiro

4. **Construir o projeto**
   ```bash
   pnpm build
   # ou
   npm run build
   ```

## 🔧 Como Correr em Dev

### Servidor de Desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou a porta indicada no terminal).

### Proxy Vite (se necessário)

Se a API TMDB apresentar problemas de CORS, o Vite pode ser configurado com um proxy em `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api/tmdb': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tmdb/, '')
      }
    }
  }
})
```

**Nota**: A API TMDB não expõe CORS por padrão, mas funciona com requests diretos do navegador quando a API Key é fornecida como parâmetro.

### Verificação de Tipos

```bash
pnpm check
# ou
npm run check
```

## 💾 Persistência de Dados

### localStorage

A aplicação utiliza `localStorage` para persistir dados do utilizador:

**Chave**: `tmdb-favorites`
**Tipo**: `number[]` (array de IDs de filmes/séries)
**Exemplo**:
```json
[550, 278, 238, 240]
```

### Como Testar a Persistência

1. Abrir a aplicação no navegador
2. Pesquisar um filme (ex: "Matrix")
3. Clicar no ícone de coração para adicionar a favoritos
4. Recarregar a página (F5 ou Ctrl+R)
5. O filme deve permanecer marcado como favorito

### Limpar Dados

Para limpar os favoritos, executar no console do navegador:
```javascript
localStorage.removeItem('tmdb-favorites');
```

## 🏗 Arquitetura e Decisões Técnicas

### Módulo de Fetch Robusto

**Ficheiro**: `client/src/lib/fetch-api.ts`

O módulo `fetchWithTimeout` implementa:

1. **AbortController**: Cancela pedidos anteriores
   ```typescript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), timeout);
   ```

2. **Timeout**: Configurável, padrão 8 segundos
   - Previne pedidos presos indefinidamente
   - Retry automático se falhar

3. **Verificação de Resposta**
   ```typescript
   if (!response.ok) {
     throw new FetchError(errorMessage, response.status);
   }
   ```

4. **Normalização de Payload**
   - Lida com `[]` ou `{data: []}`
   - Extrai dados de forma consistente

### Hooks Customizados

| Hook | Propósito | Uso |
|------|-----------|-----|
| `useDebounce` | Atrasa execução de valores | Pesquisa com debounce |
| `useLocalStorage` | Sincroniza com localStorage | Favoritos persistentes |
| `usePagination` | Gerencia paginação no cliente | Navegação entre páginas |

### Componentes Reutilizáveis

- **MediaCard**: Exibe filme/série com informações formatadas
- **SearchBar**: Pesquisa com debounce e limpeza
- **FilterBar**: Filtros por tipo, ordenação e género
- **Pagination**: Controles de paginação
- **LoadingState**: Skeleton cards animados
- **ErrorState**: Mensagem de erro com retry
- **EmptyState**: Mensagem quando não há resultados

### Formatação de Dados

**Ficheiro**: `client/src/lib/format-utils.ts`

Funções para formatar diferentes tipos de dados:

```typescript
formatString(value)           // String com fallback "—"
formatNumber(value)           // Número com separador pt-PT
formatDate(dateString)        // Data em formato pt-PT
formatRating(rating)          // Classificação 0-10
formatDuration(minutes)       // Duração em h:mm
getTMDBImageUrl(path, size)   // URL de imagem TMDB
formatCurrency(value)         // Moeda em EUR
```

## ⚠️ Tratamento de Erros

### Estratégia de Tratamento

1. **Timeout (8s)**
   - Mensagem: "Pedido expirou. Por favor, tente novamente."
   - Ação: Botão "Tentar Novamente"

2. **Erro de Rede**
   - Mensagem: "Erro de conexão. Verifique a sua ligação à internet."
   - Ação: Retry manual

3. **Erro de API (4xx, 5xx)**
   - Mensagem: Extraída da resposta da API
   - Ação: Retry manual

4. **404 (Não Encontrado)**
   - Apresenta estado vazio
   - Sugestão: "Tente ajustar os seus filtros"

### Exemplo de Uso

```typescript
try {
  const data = await searchMovies(query);
} catch (err) {
  if (err instanceof FetchError) {
    console.error(err.message); // Mensagem amigável
    console.error(err.statusCode); // Código HTTP
  }
}
```

## 🧪 Testes

### Executar Testes

```bash
pnpm test
# ou
npm run test
```

### Cenários de Teste Recomendados

1. **Pesquisa**
   - [ ] Pesquisa com debounce funciona
   - [ ] Enter executa pesquisa imediata
   - [ ] Limpeza com X funciona

2. **Filtros**
   - [ ] Alternância Filmes/Séries funciona
   - [ ] Ordenação altera ordem dos resultados
   - [ ] Filtros por género funcionam
   - [ ] Múltiplos géneros selecionáveis

3. **Paginação**
   - [ ] Navegação entre páginas funciona
   - [ ] Seleção de tamanho de página funciona
   - [ ] Indicador de página está correto

4. **Estados**
   - [ ] Loading mostra skeleton cards
   - [ ] Error mostra mensagem com retry
   - [ ] Empty mostra mensagem apropriada
   - [ ] Success mostra grid de resultados

5. **Persistência**
   - [ ] Favoritos são guardados em localStorage
   - [ ] Favoritos persistem após recarregar
   - [ ] Remover favorito funciona

6. **Acessibilidade**
   - [ ] Navegação por teclado funciona
   - [ ] Mensagens de estado têm `aria-live`
   - [ ] Imagens têm `alt` descritivo

## 📱 Responsividade

A aplicação é responsiva em todos os dispositivos:

- **Mobile** (< 640px): 1 coluna
- **Tablet** (640px - 1024px): 2 colunas
- **Desktop** (> 1024px): 3-4 colunas

## 📄 Licença

Este projeto foi desenvolvido como trabalho académico e está disponível sob a licença MIT.

## 🙏 Créditos

- **API**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

---

**Desenvolvido com ❤️ por Guilherme Silva, Tomás Gomes e Gustavo Marques**
