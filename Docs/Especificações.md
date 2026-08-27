# Especificações Técnicas e Diário de Bordo - Projeto **Maratona**

Este documento tem como objetivo registrar e justificar todas as decisões técnicas tomadas durante o desenvolvimento do projeto **Maratona**, além de servir como um diário de progresso das tarefas executadas.

> [!NOTE]
> **Aviso de Co-autoria:** Parte da estruturação visual, formatação em Markdown e a redação final das justificativas técnicas deste documento foram feitas com o **Gemini** (Inteligência Artificial).

---

## Sumário
- [1. Diário de Desenvolvimento](#1-diário-de-desenvolvimento)
- [2. Identidade Visual e UI/UX](#2-identidade-visual-e-uiux)
  - [2.1. Benchmarking: Padrão da Indústria](#21-benchmarking-padrão-da-indústria)
  - [2.2. Justificativa da Paleta de Cores (White Theme)](#22-justificativa-da-paleta-de-cores-white-theme)
  - [2.3. Definição da Paleta de Cores](#23-definição-da-paleta-de-cores)
  - [2.4. Tipografia](#24-tipografia)
- [3. Engenharia de Dados e Estruturação do Catálogo](#3-engenharia-de-dados-e-estruturação-do-catálogo)
  - [3.1. Processo de Curadoria e Extração Manual](#31-processo-de-curadoria-e-extração-manual)
  - [3.2. Modelagem do Schema JSON (SKUs e Variações)](#32-modelagem-do-schema-json-skus-e-variações)
  - [3.3. Modelagem Relacional e Diagrama de Entidade-Relacionamento (MER/DER)](#33-modelagem-relacional-e-diagrama-de-entidade-relacionamento-merder)
  - [3.4. Perspectiva de Migração para Produção (PostgreSQL + Neon)](#34-perspectiva-de-migração-para-produção-postgresql--neon)
- [4. Arquitetura e Padrões de Projeto (Backend)](#4-arquitetura-e-padrões-de-projeto-backend)
- [5. Arquitetura e Padrões de Projeto (Frontend)](#5-arquitetura-e-padrões-de-projeto-frontend)

---

## 1. Diário de Desenvolvimento

Aqui serão registradas as tarefas executadas ao longo do projeto.

### [26/08/2026] - Planejamento de UI/UX + Catálogo 
- [x] Criação do arquivo de Especificações e Diário de Bordo.
- [x] Realização de análise de mercado e Benchmarking com grandes players.
- [x] Definição da paleta de cores.
- [x] Definição da tipografia.
- [x] Início da construção do catálogo de produtos em JSON.

### [27/08/2026] - Engenharia de Dados e Refinamento do Schema
- [x] Evolução do Schema JSON para suportar gestão de SKUs, múltiplas variações de cores e controle de estoque individual por tamanho.
- [x] Extração e curadoria manual de dados reais de tênis de alta performance.
- [x] Organização da arquitetura de pastas de imagens (adotando `.avif`).
- [x] Finalização do cadastro dos primeiros 8 produtos (totalizando quase 20 SKUs completos).
- [x] Documentação da estratégia de migração de dados para o PostgreSQL (Neon).
- [x] Inclusão das colunas de auditoria (created_at, updated_at) e soft delete (ativo) no Schema JSON.
- [x] Criação e documentação do Modelo Entidade-Relacionamento (MER/DER).
- [x] Conclusão do processo de cadastro dos 15 produtos planejados.
- [x] Setup inicial e estruturação da arquitetura base do Backend (Node.js + TypeScript).
- [x] Definição e documentação da arquitetura (Layered) e dos padrões de projeto do backend.
- [x] Execução de pivot estratégico: consolidação dos 15 catálogos em products.json e foco no escopo Headless.
- [x] Definição e documentação da arquitetura (Layer-Based) e dos padrões de projeto do frontend (React).

---

## 2. Identidade Visual e UI/UX

### 2.1. Benchmarking: Padrão da Indústria

Para definir a identidade visual e a paleta de cores do e-commerce, foi realizada uma análise detalhada da Interface de Usuário (UI)  de algumas das principais marcas de artigos esportivos do mercado: **Nike, Adidas, Reebok, Fila, Puma e Mizuno**. 

O padrão da indústria que se destacou de forma claríssima foi a utilização unânime de **fundos 100% brancos** na área de vitrine, combinados com textos e ícones em **preto absoluto**, garantindo alto contraste e amplas áreas de respiro (*whitespace*). Nessas interfaces, as cores de identidade da marca (como o vermelho da Reebok ou o azul da Mizuno) são restritas a pequenos pontos de destaque, como logotipos ou botões. A intenção é que a fotografia do produto (seja em fundo infinito ou cenas de *lifestyle*, como faz a Nike) domine completamente o campo visual.

Para ilustrar essa análise, abaixo estão algumas referências dos sites analisados: 

<p align="center">
  <img src="./Imagens/Exemplos.jpg" width="100%" alt="Varios exemplos de desing de sites de e-commerce de artigos esportivos" />
</p>

### 2.2. Justificativa da Paleta de Cores (White Theme)

> *"Por que todas as gigantes do mercado esportivo adotam esse padrão minimalista?"*

No e-commerce de artigos esportivos, **o produto é a única estrela**. Vestuário de corrida e tênis de alta performance já costumam ter cores extremamente agressivas e vibrantes (verde neon, laranja choque, solados coloridos, detalhes reflexivos). 

Se aplicarmos um fundo escuro (Dark Mode) ou muito chamativo no site, o visual geral ficará poluído. O fundo acabaria "brigando" com a fotografia do produto pela atenção do usuário. O fundo branco puro (ou *off-white*) resolve essa questão pois:

1.  Faz com que as cores do tênis saltem e ganhem destaque imediato na tela.
2.  Passa uma sensação de ambiente limpo, organizado e seguro (fatores essenciais para transmitir confiança na hora de passar o cartão de crédito).
3.  Melhora absurdamente a legibilidade dos textos descritivos e dos preços.

### 2.3. Definição da Paleta de Cores

Para a loja **Maratona**, a paleta com destaque em **laranja** se encaixa perfeitamente na proposta de "Alta Performance". Ela cria o contraste agressivo desejado, mas mantendo a viabilidade comercial que deixará a loja com o aspecto visual de uma gigante do varejo esportivo.

Abaixo, a estruturação base do projeto:

*   **Fundo (Background):** `#FFFFFF`
*   **Texto Principal/Títulos:** `#000000`
*   **Textos Secundários/Rodapé:** `#1A1A1A`
*   **Destaque Primário (Botões de Compra):** `#FF7C00`
*   **Destaque Secundário (Tags/Hover):** `#FE9A28`

<p align="center">
  <img src="./Imagens/Paleta_De_Cores.png" width="100%" alt="Paleta de Cores Maratona" />
</p>

### 2.4. Tipografia

As fontes escolhidas (via Google Fonts) focam em transmitir movimento e garantir legibilidade:

*   **Títulos (Headers/Banners):** `Barlow Condensed`
    *   *Uso:* Peso **800 (ExtraBold) em Itálico**.
    *   *Justificativa:* A inclinação do itálico aliada à espessura da fonte transmite a sensação de velocidade e avanço, alinhando-se à estética de alta performance.
*   **Corpo de Texto (Preços, descrições, botões):** `Inter`
    *   *Uso:* Pesos **300 (Light) ou 400 (Regular)**.
    *   *Justificativa:* Fonte altamente legível e limpa. Seu design neutro equilibra a agressividade visual da Barlow, garantindo conforto na leitura técnica.

---

## 3. Engenharia de Dados e Estruturação do Catálogo

### 3.1. Processo de Curadoria e Extração Manual

Para garantir um nível de excelência e realismo no e-commerce, optou-se por não utilizar geradores automáticos de dados genéricos. O catálogo da **Maratona** foi construído através de um meticuloso trabalho manual de engenharia de dados.

O processo consistiu em mapear produtos reais em grandes e-commerces do segmento esportivo (como a loja oficial da Adidas) e realizar a extração minuciosa de:
*   Descrições otimizadas para vendas (textos de vitrine) e especificações técnicas reais (drop, peso, materiais da entressola).
*   Catálogo de imagens em alta definição, realizando o download e a conversão/manutenção para o formato web moderno `.avif`, que oferece performance superior de carregamento.
*   Organização hierárquica severa das pastas no projeto (ex: `/Produtos/04/Cinza/...`), separando os assets por ID e por cor.

### 3.2. Modelagem do Schema JSON (SKUs e Variações)

A estrutura do `produtos_mock.json` foi desenhada para emular a arquitetura complexa de sistemas corporativos de varejo. O schema abandonou a ideia de tratar um calçado como um item global, adotando o conceito de **SKU (Stock Keeping Unit)**.

Essa modelagem de dados "Padrão Ouro" suporta características avançadas de negócio:
*   **Variações Independentes:** Um mesmo modelo de tênis engloba múltiplos objetos para cada cor disponível.
*   **Precificação Dinâmica:** O sistema permite que cada variação de cor tenha seu próprio preço (refletindo a realidade do mercado onde cores diferentes do mesmo produto podem entrar em promoções de queima de estoque individualmente).
*   **Estoque por Grade Rigorosa:** O controle de disponibilidade não é geral, mas atrelado especificamente a cada número do pé. Isso possibilita o desenvolvimento de regras de negócio precisas no Frontend (React), como a desabilitação automática do botão de compra quando o estoque de um tamanho específico chega a zero.

### 3.3. Modelagem Relacional e Diagrama de Entidade-Relacionamento (MER/DER)

Para garantir uma transição segura entre a estruturação estática (JSON) e o banco de dados em produção (PostgreSQL via Neon), o Modelo Entidade-Relacionamento físico foi documentado antes da implementação do Backend.

*   **Origem da Modelagem:** O esquema foi gerado traduzindo diretamente a estrutura "Padrão Ouro" do nosso arquivo JSON para DBML. Os arrays de dados aninhados foram estritamente normalizados em tabelas relacionais independentes com cardinalidade 1:N.
*   **Propósito Técnico:** Desenhar as entidades visualmente previne falhas de arquitetura antes da codificação e documenta as restrições físicas do PostgreSQL, assegurando a correta tipagem para dados financeiros (`decimal(10,2)`), injeção de timestamps de auditoria e a implementação de *soft delete*.

<p align="center">
  <img src="./Imagens/Diagrama_de_Entidade-Relacionamento.png" width="100%" alt="Diagrama de Entidade-Relacionamento do Banco de Dados Maratona" />
</p>

### 3.4. Perspectiva de Migração para Produção (PostgreSQL + Neon)

Embora a aplicação inicie seu desenvolvimento consumindo o arquivo JSON, essa arquitetura de dados não é definitiva. O JSON atua apenas como um provedor de dados confiável (seeder) para acelerar o desenvolvimento e os testes de interface.

Toda a modelagem hierárquica foi construída visando uma **transição direta e normalizada para um banco de dados relacional**. Em fases posteriores do projeto, todos esses dados serão migrados para um banco **PostgreSQL**, que será hospedado em nuvem utilizando a plataforma **Neon**. 

A estrutura em JSON mapeia perfeitamente para as futuras tabelas do banco de dados (ex: `Produtos`, `SKUs_Variacoes`, `Grades_Tamanhos` e `Galeria_Imagens`), garantindo que o Backend possa ser integrado sem a necessidade de refatorar a lógica de dados construída nesta etapa.

---

## 4. Arquitetura e Padrões de Projeto (Backend)

Para garantir escalabilidade, organização e uma base sólida de engenharia de software, o backend em Node.js com TypeScript foi estruturado com base nos seguintes conceitos:

### 4.1. Layered Architecture (Arquitetura em Camadas)
A aplicação adota a divisão estrita em camadas (Controller-Service-Repository), alinhando-se perfeitamente à escolha "Layer-Based" do frontend:
*   **Route:** Recebe a requisição (ex: `GET /produtos`).
*   **Controller:** Valida se os dados da requisição estão corretos e repassa para o Service.
*   **Service:** O "cérebro" da aplicação. Aplica as regras de negócio e aciona o cache do Redis.
*   **Repository:** A única camada que sabe se comunicar com o PostgreSQL. Executa o SQL e devolve os dados para cima.

**Por que usar?** Demonstra maturidade em engenharia de software. Essa estrutura permite, por exemplo, a substituição do banco de dados alterando apenas a camada Repository, sem que o resto do sistema seja afetado.

### 4.2. Padrões de Projeto Essenciais
Para organizar o fluxo de forma profissional e otimizar os recursos do sistema, adotamos três padrões principais:

*   **Dependency Injection (Injeção de Dependência):** As classes recebem suas dependências de fora (ex: o Controller recebe o Service; o Service recebe o Repository) em vez de criarem suas próprias conexões. Isso desacopla as camadas e permite injetar diferentes repositórios sem alterar as regras de negócio.
*   **Singleton Pattern:** Utilizado nas conexões externas (banco PostgreSQL e cache Redis). Garante a criação de uma única instância de conexão que é reutilizada em todas as consultas. Isso é vital para garantir performance e suportar altos volumes de acessos simultâneos sem derrubar o servidor por excesso de conexões.
*   **DTO (Data Transfer Object):** Aproveitando a tipagem estática do TypeScript, os DTOs garantem que os dados trafeguem no formato correto e que o Controller envie ao frontend estritamente as informações necessárias, ocultando dados sensíveis de forma segura.

### 4.3. Pivot Estratégico: Foco no Escopo Headless (Desafio Bootcamp)

> [!IMPORTANT]
> **Atualização de Escopo (27/08/2026):** Para garantir a entrega impecável do desafio 'Minha Loja no Ar' até o prazo estrito de 01/09, a implementação prática do servidor Node.js e a conexão física com o PostgreSQL foram temporariamente congeladas. Toda a arquitetura (Layered) e o Modelo Entidade-Relacionamento detalhados acima permanecem validados e figuram como o roadmap oficial de escalabilidade do e-commerce. Contudo, a prioridade técnica atual é cumprir o requisito primário da avaliação: a demonstração prática do conceito de headless commerce através de um consumo estático.

**Ações do Pivot:**
*   **Consolidação do Banco em Texto:** Os 15 catálogos granulares (`Dados.json`) mapeados ao longo do processo de curadoria foram unificados em um único e robusto arquivo `products.json`.
*   **Orquestração pelo Frontend:** A aplicação React assumirá o papel de consumir esse catálogo nativamente via `fetch`, gerenciando o estado global, a vitrine e o motor de busca sem a dependência de uma API intermediária.

Esta manobra isola o risco estrutural, garante a estabilidade do layout e libera carga horária para o foco no maior peso avaliativo: a gravação do vídeo técnico com a defesa do Lighthouse e do mapeamento em nuvem (AWS).

---

## 5. Arquitetura e Padrões de Projeto (Frontend)

Para o desenvolvimento da interface, focando na orquestração pelo frontend (Headless Commerce), adotamos os seguintes padrões arquiteturais no React para demonstrar domínio técnico, garantir escalabilidade e manter a separação estrita de responsabilidades:

### 5.1. Layer-Based Architecture (Arquitetura por Camadas)
O projeto foi organizado com base no tipo técnico de cada arquivo. Essa abordagem tradicional é extremamente intuitiva, tem curva de aprendizado nula e é perfeita para navegação ágil no código durante defesas técnicas:
*   `components/`: Componentes visuais compartilhados (Header, Card, Button).
*   `pages/`: Telas completas da aplicação (Home, ProductDetail, Checkout).
*   `services/`: Centralização das chamadas à API e requisições externas.
*   `hooks/`: Lógica de negócios isolada via Custom Hooks.
*   `types/`: Tipagens globais e interfaces TypeScript.
*   `styles/`: CSS global e variáveis de design.

### 5.2. Padrões de Componentes e Estado
No ecossistema moderno do React, abandonamos os padrões clássicos orientados a objetos em favor de padrões funcionais que comprovam, na prática, o conceito de Headless:

*   **Custom Hooks Pattern:** O padrão de ouro do projeto. A lógica pesada (chamadas de API, filtros, estados complexos) é extraída dos componentes visuais para arquivos isolados (ex: `useProducts`). **Por que usar?** Os componentes visuais ficam "burros" (focados apenas em renderizar UI). Se a fonte de dados for alterada (do JSON para a API), altera-se apenas o Hook, sem a necessidade de reescrever as telas.
*   **Provider Pattern (Context API):** Utilizado para gerenciar estados globais, como o Carrinho de Compras, sem instalar bibliotecas pesadas (como Redux). **Por que usar?** Resolve o problema de *Prop Drilling* (passar propriedades de pai para filho infinitamente), permitindo que qualquer tela acesse ou modifique o carrinho globalmente de forma eficiente.
*   **Container / Presenter Pattern (Bônus Visual):** Integrado perfeitamente à arquitetura Layer-Based. As `pages` atuam como *Containers* (lidam com os dados chamando os Custom Hooks), enquanto os `components` atuam como *Presenters* (recebem os dados via *props* e os exibem visualmente).

**Veredito:** O "cérebro" da aplicação está centralizado na pasta `hooks/`, enquanto a "beleza e a interface" reinam soberanas na pasta `components/`.
