import React from 'react';
import './ComoFiz.css';

const ComoFiz: React.FC = () => {
  return (
    <div className="como-fiz-container">
      <div className="como-fiz-header">
        <h1>Desafio Bootcamp: Minha Loja no Ar</h1>
        <p>Apresentação do projeto Maratona - Alta Performance</p>
      </div>

      <div className="video-section">
        <div className="video-wrapper">
          <video
            width="100%"
            height="100%"
            controls
            preload="metadata"
            title="Apresentação do Projeto"
          >
            <source src="/Video/video.mp4" type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      </div>

      <div className="perguntas-section">
        <h2>Perguntas e Respostas da Defesa Técnica</h2>

        <div className="pergunta-item">
          <h3>1. O que você construiu e como o código está organizado?</h3>
          <p>
            Construí a "Maratona", um e-commerce focado em tênis de alta performance. O código foi organizado utilizando a arquitetura Layer-Based com React e Vite. A lógica de negócios, como o carrinho e as chamadas ao catálogo, foi extraída para <code>hooks/</code> e <code>contexts/</code>. Os componentes visuais ficam em <code>components/</code> e as telas completas em <code>pages/</code>. Toda a estilização foi feita com Vanilla CSS puro para máximo controle de performance.
          </p>
        </div>

        <div className="pergunta-item">
          <h3>2. Por que o catálogo é separado do front?</h3>
          <p>
            O catálogo vive de forma estática em <code>/Produtos/products.json</code> e é consumido nativamente via <code>fetch()</code> no <code>useProdutos.ts</code>. Isso demonstra o conceito base do <strong>Headless Commerce</strong>, onde o Frontend (a vitrine) é completamente desvinculado do Backend (neste caso simulado pelo arquivo estático). Isso permite que a interface seja atualizada independentemente dos dados, ganhando velocidade e escalabilidade.
          </p>
        </div>

        <div className="pergunta-item">
          <h3>3. Se essa loja fosse para a AWS, onde entraria cada peça?</h3>
          <p>
            Para 10 mil acessos simultâneos, a estratégia cloud seria: Os arquivos estáticos do React (HTML, CSS, JS) e imagens seriam armazenados em um <strong>S3 Bucket</strong>. Na frente dele, teríamos o <strong>CloudFront (CDN)</strong>, que faz o cache global nas bordas. Quando o usuário acessa, o navegador bate no CloudFront. Se o arquivo estiver lá (Cache Hit), ele retorna instantaneamente sem onerar o servidor de origem, absorvendo o pico de acessos perfeitamente.
          </p>
        </div>

        <div className="pergunta-item">
          <h3>4. Resultados do Lighthouse</h3>
          <p>
            O foco em Vanilla CSS e o uso do formato moderno de imagens <code>.avif</code> garantem altas pontuações (acima de 90) em Performance, Acessibilidade e Boas Práticas. O que pode ser melhorado como próximo passo é implementar <em>lazy-loading</em> avançado nas imagens fora da viewport inicial e pré-carregar as fontes críticas.
          </p>
        </div>

        <div className="pergunta-item">
          <h3>5. Onde plugaria IA e o que foi mais difícil?</h3>
          <p>
            A Inteligência Artificial se encaixaria perfeitamente como um "Assistente de Corrida" (um chatbot treinado) recomendando o tênis ideal com base na pisada, peso e objetivo de pace do corredor. A parte mais difícil técnica foi modelar o schema JSON "Padrão Ouro", garantindo o mapeamento exato do controle de estoque granular de cada variação de cor e número.
          </p>
        </div>

        <div className="pergunta-item bff-section">
          <h3>6. Bônus — Arquitetura com BFF (Backend For Frontend)</h3>
          <p>
            <strong>O que é o padrão BFF?</strong> BFF significa <em>Backend For Frontend</em>. Quando uma empresa tem várias plataformas (um site Web e um App de celular, por exemplo), as necessidades de dados dessas duas plataformas são muito diferentes. O celular tem tela menor e internet 4G (precisa de dados compactos), enquanto a Web tem tela grande e internet rápida (pode carregar imagens enormes e muitos dados de uma vez).
          </p>
          <p>
            Em vez de fazer o App e o Site consumirem a mesma "API Gorda" (o que deixaria o App lento), o padrão BFF cria um <strong>Backend intermediário exclusivo para cada frontend</strong>.
          </p>
          <p>
            O BFF do Mobile vai buscar os dados no banco, filtrar apenas o essencial, diminuir o tamanho da resposta e entregar "mastigado" para o aplicativo de celular.
          </p>

          <h4 className="diagram-title">Diagrama da Arquitetura</h4>
          
          <div className="diagrama-container">
            <img 
              src="/Imagens/Captura%20de%20tela%202026-09-01%20163043.png" 
              alt="Diagrama da Arquitetura com BFF" 
              className="diagrama-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComoFiz;
