import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, RefreshCw } from 'lucide-react';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoCard from '../components/ProdutoCard';
import './Home.css';

const slides = [
  {
    id: 1,
    title: 'NIKE ZOOM FLY 6',
    subtitle: 'clássico & estiloso',
    image: '/Imagens/nike_hero.jpg',
    btnText: 'clique aqui',
    bgColor: '#1a1a1a',
  },
  {
    id: 2,
    title: 'ADIDAS ADIZERO BOSTON',
    subtitle: 'inspirado em um design arquitetônico transformador',
    image: '/Imagens/adidas_hero.jpg',
    btnText: 'compre já',
    bgColor: '#161616',
  },
  {
    id: 3,
    title: 'NEW BALANCE ELLIPSE',
    subtitle: 'do outfit casual até uma produção mais alinhada',
    image: '/Imagens/newbalance_hero.jpg',
    btnText: 'ver todos',
    bgColor: '#1e1c1b',
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <Link to="/catalogo" className="hero-btn">
              {slide.btnText}
            </Link>
          </div>
          <div className="hero-slide-image">
            <img src={slide.image} alt={slide.title} />
          </div>
        </div>
      ))}
      
      <button className="slider-arrow prev" onClick={prevSlide}>&#10094;</button>
      <button className="slider-arrow next" onClick={nextSlide}>&#10095;</button>
      
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

const preloadLifestyleImages = [
  "/Imagens/pexels-basquetebol-br-934307817-20037838.avif",
  "/Imagens/pexels-cristian-camilo-estrada-2152272341-32566487.avif",
  "/Imagens/pexels-cristian-camilo-estrada-2152272341-35261936.avif",
  "/Imagens/pexels-federicoabisphotography-28907540.avif",
  "/Imagens/pexels-igor-pericles-517653171-37989859.avif",
  "/Imagens/pexels-runffwpu-2402777.avif",
  "/Imagens/pexels-runffwpu-10527114.avif",
  "/Imagens/pexels-willians-huerta-2157111846-34663460.avif"
];

const Home: React.FC = () => {
  const { produtos, loading, error } = useProdutos();

  // Força o navegador a baixar e fazer cache das fotos pesadas em background
  // assim que o usuário abre a página, antes mesmo de ele rolar a tela!
  useEffect(() => {
    preloadLifestyleImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
          <HeroSlider />

          <section className="benefits-bar">
            <div className="benefits-container">
              <div className="benefit-item">
                <Truck size={24} />
                <span>Frete Grátis acima de R$ 299</span>
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
              <h2>EQUIPAMENTO DE ELITE PARA O SEU CORRE</h2>
              <p>Explore o mundo com os melhores tênis do mercado.</p>
            </div>
            <div className="lifestyle-grid">
              <div className="grid-item item-large item-1">
                <img src="/Imagens/pexels-basquetebol-br-934307817-20037838.avif" alt="Lifestyle 1" decoding="async" />
              </div>
              <div className="grid-item item-2">
                <img src="/Imagens/pexels-cristian-camilo-estrada-2152272341-32566487.avif" alt="Lifestyle 2" decoding="async" />
              </div>
              <div className="grid-item item-tall item-3">
                <img src="/Imagens/pexels-cristian-camilo-estrada-2152272341-35261936.avif" alt="Lifestyle 3" decoding="async" />
              </div>
              <div className="grid-item item-4">
                <img src="/Imagens/pexels-federicoabisphotography-28907540.avif" alt="Lifestyle 4" decoding="async" />
              </div>
              <div className="grid-item item-5">
                <img src="/Imagens/pexels-igor-pericles-517653171-37989859.avif" alt="Lifestyle 5" decoding="async" />
              </div>
              <div className="grid-item item-6">
                <img src="/Imagens/pexels-runffwpu-2402777.avif" alt="Lifestyle 6" decoding="async" />
              </div>
              <div className="grid-item item-7">
                <img src="/Imagens/pexels-runffwpu-10527114.avif" alt="Lifestyle 7" decoding="async" />
              </div>
              <div className="grid-item item-8">
                <img src="/Imagens/pexels-willians-huerta-2157111846-34663460.avif" alt="Lifestyle 8" decoding="async" />
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
