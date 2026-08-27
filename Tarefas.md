# Plano de Desenvolvimento - Maratona

## Fase 1: Design e Planejamento Visual
- [X] Analisar 2 a 3 sites de marcas esportivas reais para tirar referências de design (espaçamento, disposição de fotos, fontes).
- [X] Definir o nome da loja.
- [X] Escolher a paleta de cores (ex: fundo escuro com detalhes em verde-néon ou laranja) e as fontes (Google Fonts).
- [ ] Desenhar o protótipo no Figma das 3 telas principais:
  - Home (Vitrine, barra de busca, filtros).
  - Tela de Produto (PDP - Fotos grandes, seleção de tamanho, botão de comprar).
  - Checkout Fictício (Resumo da compra, formulário visual simples).
- [ ] Mapear o layout responsivo: planejar o empilhamento dos elementos em colunas verticais no celular, garantindo que nenhum componente transborde e cause overflow nas bordas.
- [ ] Estabelecer o padrão CSS *mobile-first*, mantendo o cuidado rigoroso de não aplicar estilos exclusivos de desktop dentro da media query inicial.

---

## Fase 2: Curadoria de Dados e Diagramação
- [ ] Escolher os 15 tênis principais e 10 acessórios (meias, shorts, etc.).
- [ ] Levantar todos os dados manuais de cada item: Nome, Marca, Preço, Descrição curta e URLs de fotos de alta qualidade.
- [ ] Criar um arquivo `produtos_mock.json` com todos esses itens para validar a estrutura dos dados antes de criar as tabelas no banco.
- [ ] Desenhar o Diagrama do Banco de Dados Relacional (Tabelas de Produtos, Categorias, etc.).
- [ ] Desenhar o Diagrama de Fluxo do Usuário (passo a passo desde a entrada até o checkout).
- [ ] Construir o Diagrama de Arquitetura da Nuvem, incluindo o desenho explícito de onde entraria um BFF (Backend For Frontend) caso a loja ganhasse um app mobile futuramente[cite: 1].

---

## Fase 3: Desenvolvimento do Backend (API & DB)
- [ ] Criar o projeto no Neon e configurar as credenciais do PostgreSQL.
- [ ] Rodar os scripts SQL para criar as tabelas e inserir os 25 produtos.
- [ ] Inicializar o projeto Node.js com Express e TypeScript.
- [ ] Criar as rotas da API:
  - `GET /produtos`
  - `GET /produtos/:id`
  - `GET /produtos?busca=...` (ou categoria)
- [ ] Implementar a camada de cache com Redis nas rotas de listagem de produtos.
- [ ] Testar a API localmente com Postman ou Insomnia.

---

## Fase 4: Desenvolvimento do Frontend
- [ ] Inicializar o projeto React + Vite + TypeScript.
- [ ] Configurar roteamento (React Router) para as 3 páginas principais (Home, PDP, Checkout).
- [ ] Codificar o layout base (Header com Busca, Footer).
- [ ] Integrar a Home com a API via `fetch` para buscar e renderizar a vitrine[cite: 1].
- [ ] Implementar a lógica funcional da barra de busca e dos filtros por categoria[cite: 1].
- [ ] Codificar a Tela de Produto dinâmica (carregando os dados do item clicado).
- [ ] Montar a tela visual de Checkout Fictício.
- [ ] Validar todas as telas em formato mobile no DevTools.

---

## Fase 5: Deploy e Testes
- [ ] Subir o código do Backend para o Render e configurar variáveis de ambiente (Neon + Redis).
- [ ] Subir o código do Frontend para a Vercel, apontando para a URL da API em produção.
- [ ] Testar o fluxo completo na versão no ar (busca, filtros, clique no produto)[cite: 1].
- [ ] Rodar o Lighthouse (F12 > Lighthouse > Analyze) para mapear o tempo de carregamento e acessibilidade[cite: 1].
- [ ] Criar e publicar a rota `/como-fiz` no frontend[cite: 1].

---

## Fase 6: Reta Final e Bônus (Vídeo)
- [ ] Escrever o roteiro de 5 a 8 minutos respondendo às 5 perguntas obrigatórias do desafio[cite: 1].
- [ ] Treinar as justificativas para a call técnica ("por que fez assim", "o que acontece se mudar").
- [ ] Gravar a tela navegando no código e no site no ar (mostrando funcionamento do cache e headless)[cite: 1].
- [ ] Comprimir o arquivo de vídeo e colocá-lo dentro da pasta pública do projeto para auto-hospedar[cite: 1].
- [ ] Fazer o último deploy com o vídeo embutido na página `/como-fiz`[cite: 1].
- [ ] Testar a URL pública final em aba anônima e no celular[cite: 1].
- [ ] Enviar a URL no canal do Bootcamp antes de terça, 01/09, 17h59[cite: 1].