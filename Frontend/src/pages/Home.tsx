import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoCard from '../components/ProdutoCard';
import './Home.css';
import type { Produto } from '../types';

const HeroSlider: React.FC<{ produtos: Produto[] }> = ({ produtos }) => {
  const getSlideData = (id: string, skuBase: string, mensagem: string, bgColor: string, defaultTitle: string, defaultImage: string) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return { id, title: defaultTitle, subtitle: mensagem, image: defaultImage, btnText: 'VER PRODUTO', bgColor, link: '/catalogo', preco: 0, marca: '', descVitrine: '' };
    
    const variacao = produto.variacoes.find(v => v.sku_base === skuBase) || produto.variacoes[0];
    const imagens = variacao.imagens as any;
    const imgUrl = Array.isArray(imagens) ? imagens[0] : (imagens?.principal_vitrine || '');
    const preco = variacao.preco.promocional || variacao.preco.original;
    
    return {
      id,
      title: produto.nome,
      marca: produto.marca,
      subtitle: mensagem,
      descVitrine: produto.descricoes.vitrine,
      image: imgUrl,
      btnText: 'COMPRAR AGORA',
      bgColor,
      link: `/produto/${produto.id}`,
      preco
    };
  };

  const slides = [
    getSlideData('6', 'AAPE1-BRANCO', 'Sinta a velocidade absoluta. O tênis mais leve e rápido já criado para você quebrar todos os seus recordes nas maratonas.', '#ebedf0', 'ADIZERO ADIOS PRO EVO 1', '/Imagens/nike_hero.jpg'),
    getSlideData('10', 'PP-ROSA', 'Leve o amortecimento ágil para o próximo nível. A tecnologia ZoomX superleve energiza seus passos, garantindo uma corrida diária incrivelmente responsiva e confortável.', '#f5f5f6', 'NIKE PEGASUS PLUS', '/Imagens/nike_hero.jpg'),
    getSlideData('15', 'FFG2-VERDE', 'Conforto incomparável para o dia a dia. A tecnologia Fresh Foam que seus pés merecem, pronto para qualquer desafio.', '#e2e2e3', 'FRESH FOAM GAROÉV2', '/Imagens/newbalance_hero.jpg')
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundColor: slide.bgColor }}
        >
          <div className="hero-slide-content">
            <span className="hero-brand">{slide.marca}</span>
            <h2>{slide.title}</h2>
            <p className="hero-vitrine">{slide.descVitrine}</p>
            <p className="hero-subtitle">{slide.subtitle}</p>
            {slide.preco > 0 && (
              <div className="hero-price">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(slide.preco)}
              </div>
            )}
            <Link to={slide.link} className="hero-btn">
              {slide.btnText}
            </Link>
          </div>
          <div className="hero-slide-image">
            <img 
              src={slide.image} 
              alt={slide.title} 
              width="600" 
              height="600" 
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        </div>
      ))}
      
      <button className="slider-arrow prev" onClick={prevSlide} aria-label="Slide anterior"><ChevronLeft size={48} strokeWidth={1.5} /></button>
      <button className="slider-arrow next" onClick={nextSlide} aria-label="Próximo slide"><ChevronRight size={48} strokeWidth={1.5} /></button>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};



const Home: React.FC = () => {
  const { produtos, loading, error } = useProdutos();



  if (loading) {
    return <div className="loading">Carregando catálogo de alta performance...</div>;
  }

  if (error) {
    return <div className="error">Erro ao carregar produtos: {error}</div>;
  }

  // Filtra APENAS os destaques
  const destaques = produtos.filter(p => p.destaque_home);
  // Se por acaso nenhum produto for destaque, usamos os primeiros 8 para não quebrar a vitrine
  const produtosDestaque = destaques.length > 0 ? destaques : produtos.slice(0, 8);
  
  // Dividindo os destaques em duas listas para intercalar
  const destaquesLinha1 = produtosDestaque.slice(0, 4);
  const destaquesLinha2 = produtosDestaque.slice(4, 8);
  
  return (
    <div className="home-container">
        <>
          <HeroSlider produtos={produtos} />

          <section className="benefits-bar">
            <div className="benefits-container">
              <div className="benefit-item">
                <Truck size={24} />
                <span>Frete Grátis</span>
              </div>
              <div className="benefit-item">
                <CreditCard size={24} />
                <span>Até 10x sem juros no cartão</span>
              </div>
              <div className="benefit-item">
                <RefreshCw size={24} />
                <span>Troca Grátis em até 30 dias</span>
              </div>
            </div>
          </section>

          <main id="vitrine" className="vitrine-container">
            <div className="vitrine-header">
              <h2>Lançamentos e Destaques</h2>
            </div>
            <div className="grid-produtos">
              {destaquesLinha1.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          </main>

          <section className="lifestyle-collage-section">
            <div className="lifestyle-title-container">
              <h2>EQUIPAMENTO DE ELITE <br className="mobile-break" /> PARA O SEU CORRE</h2>
              <p>Explore o mundo com os melhores tênis do mercado.</p>
            </div>
            <div className="lifestyle-grid">
              <div className="grid-item item-large item-1">
                <img src="/Imagens/pexels-basquetebol-br-934307817-20037838-copiar.avif" alt="Lifestyle 1" decoding="async" />
              </div>
              <div className="grid-item item-2">
                <img src="/Imagens/pexels-cristian-camilo-estrada-2152272341-32566487-copiar.avif" alt="Lifestyle 2" decoding="async" />
              </div>
              <div className="grid-item item-tall item-3">
                <img src="/Imagens/pexels-cristian-camilo-estrada-2152272341-35261936-copiar.avif" alt="Lifestyle 3" decoding="async" />
              </div>
              <div className="grid-item item-4">
                <img src="/Imagens/pexels-federicoabisphotography-28907540-copiar.avif" alt="Lifestyle 4" decoding="async" />
              </div>
              <div className="grid-item item-5">
                <img src="/Imagens/pexels-igor-pericles-517653171-37989859-copiar.avif" alt="Lifestyle 5" decoding="async" />
              </div>
              <div className="grid-item item-6">
                <img src="/Imagens/pexels-runffwpu-2402777-copiar.avif" alt="Lifestyle 6" decoding="async" />
              </div>
              <div className="grid-item item-7">
                <img src="/Imagens/pexels-runffwpu-10527114-copiar.avif" alt="Lifestyle 7" decoding="async" />
              </div>
              <div className="grid-item item-8">
                <img src="/Imagens/pexels-willians-huerta-2157111846-34663460-copiar.avif" alt="Lifestyle 8" decoding="async" />
              </div>
            </div>
            <div className="lifestyle-message">
              <h2>NÃO DEIXE PARA AMANHÃ O QUE VOCÊ PODE CORRER HOJE</h2>
              <p>Seja você um amador dando as primeiras passadas ou um veterano buscando quebrar seu recorde pessoal. Nós temos o equipamento certo para impulsionar cada quilômetro da sua jornada.</p>
              <Link to="/catalogo?ofertas=true" className="lifestyle-cta-btn">Explorar Ofertas Imperdíveis</Link>
            </div>
          </section>

          {destaquesLinha2.length > 0 && (
            <main className="vitrine-container">
              <div className="vitrine-header">
                <h2>Equipamento Essencial</h2>
              </div>
              <div className="grid-produtos">
                {destaquesLinha2.map(produto => (
                  <ProdutoCard key={produto.id} produto={produto} />
                ))}
              </div>
            </main>
          )}
        </>
    </div>
  );
};

export default Home;
