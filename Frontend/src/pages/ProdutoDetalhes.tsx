import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import { useCarrinho } from '../contexts/CarrinhoContext';
import Botao from '../components/Botao';
import ProdutoCard from '../components/ProdutoCard';
import Avaliacoes from '../components/Avaliacoes';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, CheckCircle2, Info, AlertTriangle, Heart, Star, Ruler } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Variacao, Produto } from '../types';
import './ProdutoDetalhes.css';

const ProdutoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { produtos, loading, error } = useProdutos();
  const { adicionarItem } = useCarrinho();

  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState<string>('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<number | null>(null);
  const [recomendados, setRecomendados] = useState<Produto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showInstrucao, setShowInstrucao] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  // Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const produto = produtos.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsFavorito(false);
  }, [id]);

  useEffect(() => {
    if (produto) {
      const isVariacaoDoProdutoAtual = variacaoSelecionada && produto.variacoes.some(v => v.sku_base === variacaoSelecionada.sku_base);
      
      if (!variacaoSelecionada || !isVariacaoDoProdutoAtual) {
        const corUrl = searchParams.get('cor');
        let variacaoInicial = produto.variacoes[0];
        if (corUrl) {
          const encontrada = produto.variacoes.find(v => v.cor_nome === corUrl);
          if (encontrada) variacaoInicial = encontrada;
        }
        setVariacaoSelecionada(variacaoInicial);
        setImagemAtiva(variacaoInicial.imagens.principal_vitrine);
        setTamanhoSelecionado(null);
      }
    }
  }, [produto, variacaoSelecionada, searchParams]);

  useEffect(() => {
    if (produto && produtos.length > 0) {
      const generoAlvo = produto.genero.toLowerCase();
      const filtroGenero = (p: Produto) => {
        const g = p.genero.toLowerCase();
        if (generoAlvo === 'unissex') return true;
        return g === generoAlvo || g === 'unissex';
      };

      const tenisAleatorios = produtos.filter(p => p.categoria_principal !== 'Meias').sort(() => 0.5 - Math.random());
      const tenisRecomendados = tenisAleatorios
        .filter(p => p.id !== produto.id && filtroGenero(p))
        .slice(0, 2);
      
      const meiasAleatorias = produtos.filter(p => p.categoria_principal === 'Meias').sort(() => 0.5 - Math.random());
      const meiasRecomendadas = meiasAleatorias
        .filter(p => p.id !== produto.id && filtroGenero(p))
        .slice(0, 2);

      setRecomendados([...tenisRecomendados, ...meiasRecomendadas]);
    }
  }, [produto, produtos]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLightboxOpen]);

  if (loading) return <div className="loading">Carregando detalhes...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!produto) return <div className="error">Produto não encontrado.</div>;
  if (!variacaoSelecionada) return null;

  const preco = variacaoSelecionada.preco;
  const temDesconto = preco.promocional < preco.original;

  const tamanhoObj = variacaoSelecionada.grade_tamanhos.find(t => t.tamanho === tamanhoSelecionado);
  const isEsgotado = tamanhoObj ? tamanhoObj.estoque === 0 : false;
  const temTamanhoEsgotado = variacaoSelecionada.grade_tamanhos.some(t => t.estoque === 0);
  const isTotalmenteEsgotada = variacaoSelecionada.grade_tamanhos.every(t => t.estoque === 0);

  const handleComprar = () => {
    if (!tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    adicionarItem({
      produtoId: produto.id,
      nome: produto.nome,
      marca: produto.marca,
      sku: variacaoSelecionada.sku_base,
      corNome: variacaoSelecionada.cor_nome,
      imagem: variacaoSelecionada.imagens.principal_vitrine,
      tamanho: tamanhoSelecionado,
      preco: preco.promocional,
      quantidade: 1
    });
    navigate('/carrinho');
  };

  const handleAviseMe = () => {
    setShowModal(true);
  };

  const scrollToAvaliacoes = () => {
    const el = document.getElementById('secao-avaliacoes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLightbox = () => {
    const idx = variacaoSelecionada.imagens.galeria.indexOf(imagemAtiva);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const proximaImagem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % variacaoSelecionada.imagens.galeria.length);
  };

  const imagemAnterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + variacaoSelecionada.imagens.galeria.length) % variacaoSelecionada.imagens.galeria.length);
  };

  const proximaImagemInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = variacaoSelecionada.imagens.galeria.indexOf(imagemAtiva);
    const nextIdx = (idx + 1) % variacaoSelecionada.imagens.galeria.length;
    setImagemAtiva(variacaoSelecionada.imagens.galeria[nextIdx]);
  };

  const imagemAnteriorInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = variacaoSelecionada.imagens.galeria.indexOf(imagemAtiva);
    const prevIdx = (idx - 1 + variacaoSelecionada.imagens.galeria.length) % variacaoSelecionada.imagens.galeria.length;
    setImagemAtiva(variacaoSelecionada.imagens.galeria[prevIdx]);
  };

  return (
    <div className="detalhes-container">
      <div className="produto-grid">
        <div className="galeria-secao">
          <div className="imagem-principal" onClick={openLightbox} style={{ cursor: 'zoom-in', position: 'relative' }}>
            <button className="inline-nav prev-inline" onClick={imagemAnteriorInline} title="Imagem anterior">
              <ChevronLeft size={40} />
            </button>
            <img src={imagemAtiva} alt={produto.nome} />
            <button className="inline-nav next-inline" onClick={proximaImagemInline} title="Próxima imagem">
              <ChevronRight size={40} />
            </button>
          </div>
          <div className="miniaturas">
            {variacaoSelecionada.imagens.galeria.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${produto.nome} vista ${index + 1}`} 
                className={imagemAtiva === img ? 'ativa' : ''}
                onClick={() => setImagemAtiva(img)}
              />
            ))}
          </div>
        </div>

        <div className="info-secao">
          <span className="marca">{produto.marca}</span>

          {produto.avaliacoes && (
            <div className="produto-topo-avaliacoes" onClick={scrollToAvaliacoes}>
              <span className="nota-texto">{produto.avaliacoes.resumo.nota_geral.toFixed(1)}</span>
              <div className="estrelas-mini-container">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(produto.avaliacoes!.resumo.nota_geral) ? "currentColor" : "none"} className={i < Math.round(produto.avaliacoes!.resumo.nota_geral) ? "estrela-preenchida" : "estrela-vazia"} />
                ))}
              </div>
              <span className="total-avaliacoes">[{produto.avaliacoes.resumo.total_avaliacoes}]</span>
            </div>
          )}

          <h1>{produto.nome}</h1>
          <p className="genero-tipo">{produto.genero} • {produto.tipo_corrida}</p>

          <div className="preco-secao">
            {temDesconto ? (
              <>
                <span className="preco-riscado">
                  {preco.original.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="preco-atual destaque">
                  {preco.promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </>
            ) : (
              <span className="preco-atual">
                {preco.original.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            )}
          </div>

          {produto.variacoes.length > 1 && (
            <div className="seletor-cores">
              <h3>Cores Disponíveis</h3>
              <div className="cores-lista">
                {produto.variacoes.map((v) => {
                  const totalmenteEsgotada = v.grade_tamanhos.every(t => t.estoque === 0);
                  return (
                    <button 
                      key={v.sku_base} 
                      className={`cor-botao ${variacaoSelecionada.sku_base === v.sku_base ? 'selecionado' : ''} ${totalmenteEsgotada ? 'esgotada' : ''}`}
                      onClick={() => {
                        setVariacaoSelecionada(v);
                        setImagemAtiva(v.imagens.principal_vitrine);
                        setTamanhoSelecionado(null);
                      }}
                      title={`${v.cor_nome}${totalmenteEsgotada ? ' (Esgotado)' : ''}`}
                    >
                      <img src={v.thumbnail_cor} alt={v.cor_nome} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isTotalmenteEsgotada && (
            <div className="aviso-esgotado" style={{ margin: '0 0 24px 0' }}>
              <p className="msg-esgotado" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <AlertTriangle size={22} />
                Produto Indisponível no momento.
              </p>
              <p style={{ color: '#555', fontSize: '0.95rem' }}>Mas não se preocupe! Selecione seu tamanho na grade abaixo para ser avisado quando chegar.</p>
            </div>
          )}

          <div className="seletor-tamanhos">
            <div className="tamanhos-header">
              <h3>Selecione o Tamanho</h3>
              {temTamanhoEsgotado && !isTotalmenteEsgotada && (
                <button className="link-instrucao" onClick={() => setShowInstrucao(true)}>
                  Não encontrou seu tamanho?
                </button>
              )}
            </div>
            <div className="tamanhos-grid">
              {variacaoSelecionada.grade_tamanhos.map((t) => (
                <button
                  key={t.tamanho}
                  className={`tamanho-botao ${tamanhoSelecionado === t.tamanho ? 'selecionado' : ''} ${t.estoque === 0 ? 'esgotado' : ''}`}
                  onClick={() => setTamanhoSelecionado(t.tamanho)}
                >
                  {t.tamanho}
                </button>
              ))}
            </div>
          </div>

          <div className="guia-tamanhos-container" style={{ margin: '8px 0 4px 0' }}>
            <button className="guia-tamanhos-link-detalhes" onClick={() => setIsSizeGuideOpen(true)}>
              <Ruler size={18} />
              Guia de Tamanhos
            </button>
          </div>

          {tamanhoSelecionado && isEsgotado ? (
            <div className="aviso-esgotado-tamanho">
              <Botao 
                fullWidth 
                onClick={handleAviseMe}
                className="avise-me-btn"
              >
                Avise-me quando chegar (Tam: {tamanhoSelecionado})
              </Botao>
            </div>
          ) : (
            <Botao 
              variante="primario" 
              fullWidth 
              onClick={handleComprar}
              disabled={!tamanhoSelecionado}
              className="comprar-btn"
            >
              Adicionar ao Carrinho
            </Botao>
          )}

          <Botao 
            variante="secundario" 
            fullWidth 
            onClick={() => setIsFavorito(!isFavorito)}
            className={`desejos-btn ${isFavorito ? 'favoritado' : ''}`}
          >
            <Heart size={20} className="icone-coracao" />
            {isFavorito ? 'SALVO NA LISTA DE DESEJOS' : 'ADICIONAR À LISTA DE DESEJOS'}
          </Botao>

          <div className="descricao-secao">
            <h3>Descrição</h3>
            <p>{produto.descricoes.detalhada}</p>
            
            <h3>Especificações Técnicas</h3>
            <ul>
              {produto.descricoes.especificacoes_tecnicas.map((esp, i) => (
                <li key={i}>{esp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {produto.avaliacoes && (
        <Avaliacoes avaliacoes={produto.avaliacoes} />
      )}

      {recomendados.length > 0 && (
        <section className="recomendados-secao" style={{ marginTop: '80px', borderTop: '1px solid var(--cor-borda)', paddingTop: '48px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>VOCÊ TAMBÉM PODE GOSTAR</h2>
          <div className="grid-produtos">
            {recomendados.map(rec => (
              <ProdutoCard key={rec.id} produto={rec} />
            ))}
          </div>
        </section>
      )}

      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <X size={32} />
          </button>
          
          <button className="lightbox-nav prev" onClick={imagemAnterior}>
            <ChevronLeft size={48} />
          </button>
          
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              wheel={{ disabled: true }}
              pinch={{ disabled: false }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="zoom-controls">
                    <button onClick={() => zoomIn()} title="Aumentar Zoom"><ZoomIn size={20} /></button>
                    <button onClick={() => zoomOut()} title="Diminuir Zoom"><ZoomOut size={20} /></button>
                    <button onClick={() => resetTransform()} title="Redefinir"><Maximize size={20} /></button>
                  </div>
                  <TransformComponent wrapperStyle={{ width: '100vw', height: '100vh' }}>
                    <img 
                      src={variacaoSelecionada.imagens.galeria[lightboxIndex]} 
                      alt={`${produto.nome} ampliada`} 
                      style={{ cursor: 'grab', maxWidth: '100vw', maxHeight: '100vh', objectFit: 'contain' }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
          
          <button className="lightbox-nav next" onClick={proximaImagem}>
            <ChevronRight size={48} />
          </button>
        </div>
      )}

      {/* MODAL DE INSTRUÇÃO */}
      {showInstrucao && (
        <div className="modal-overlay" onClick={() => setShowInstrucao(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrapper info">
              <Info size={48} className="modal-lucide-icon-info" />
            </div>
            <h2>Como ser avisado</h2>
            <p>
              Para receber um alerta de reposição, basta clicar no <strong>tamanho desejado</strong> na grade (mesmo que ele esteja apagadinho/esgotado).
            </p>
            <p>
              Depois, é só clicar no botão escuro <strong>"Avise-me quando chegar"</strong> que vai aparecer logo abaixo!
            </p>
            <Botao onClick={() => setShowInstrucao(false)} fullWidth variante="secundario">Entendi</Botao>
          </div>
        </div>
      )}

      {/* MODAL DE AVISO CONFIGURADO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrapper success">
              <CheckCircle2 size={48} className="modal-lucide-icon" />
            </div>
            <h2>Aviso Configurado</h2>
            <p>
              Pronto! Você será notificado por e-mail assim que o tamanho <strong>{tamanhoSelecionado}</strong> deste modelo voltar ao estoque.
            </p>
            <Botao onClick={() => setShowModal(false)} fullWidth>Concluir</Botao>
          </div>
        </div>
      )}

      {/* MODAL DE GUIA DE TAMANHOS */}
      {isSizeGuideOpen && (
        <div className="size-guide-modal-overlay" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="size-guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="size-guide-header">
              <h4><Ruler size={20} style={{ marginRight: '8px' }}/> Guia de Tamanhos</h4>
              <button className="close-modal-btn" onClick={() => setIsSizeGuideOpen(false)}>✕</button>
            </div>
            
            <div className="size-guide-content">
              <div className="size-guide-instructions">
                <h5>Como medir o seu pé:</h5>
                <ol>
                  <li>Pise descalço sobre uma folha de papel.</li>
                  <li>Marque a ponta do dedão e o final do calcanhar.</li>
                  <li>Meça a distância entre os dois pontos.</li>
                </ol>
              </div>

              <div className="size-guide-grid-container">
                <div className="size-guide-grid">
                  <div className="size-item"><span>33</span><span>22,0 cm</span></div>
                  <div className="size-item"><span>40</span><span>26,5 cm</span></div>
                  <div className="size-item"><span>34</span><span>22,5 cm</span></div>
                  <div className="size-item"><span>41</span><span>27,5 cm</span></div>
                  <div className="size-item"><span>35</span><span>23,5 cm</span></div>
                  <div className="size-item"><span>42</span><span>28,0 cm</span></div>
                  <div className="size-item"><span>36</span><span>24,0 cm</span></div>
                  <div className="size-item"><span>43</span><span>29,0 cm</span></div>
                  <div className="size-item"><span>37</span><span>25,0 cm</span></div>
                  <div className="size-item"><span>44</span><span>29,5 cm</span></div>
                  <div className="size-item"><span>38</span><span>25,5 cm</span></div>
                  <div className="size-item"><span>45</span><span>30,0 cm</span></div>
                  <div className="size-item"><span>39</span><span>26,0 cm</span></div>
                  <div className="size-item"><span>46</span><span>31,0 cm</span></div>
                </div>
              </div>
              
              <div className="size-guide-tip">
                <Info size={18} />
                <p><strong>Dica de ouro:</strong> Para corrida, escolha um número <strong>maior</strong> do que o casual.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutoDetalhes;
