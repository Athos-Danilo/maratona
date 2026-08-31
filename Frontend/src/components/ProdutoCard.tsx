import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Heart, Star, Ruler, Info } from 'lucide-react';
import type { Produto, Variacao } from '../types';
import './ProdutoCard.css';

interface ProdutoCardProps {
  produto: Produto;
  variacaoEspecifica?: Variacao;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, variacaoEspecifica }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pegamos a variação específica ou a primeira para exibir na vitrine
  const variacaoVitrine = variacaoEspecifica || produto.variacoes[0];
  const preco = variacaoVitrine.preco;
  const temDesconto = preco.promocional < preco.original;

  // Lógica de escassez/urgência
  const tamanhosDisponiveis = variacaoVitrine.grade_tamanhos.filter(t => t.estoque > 0);
  const totalEstoque = tamanhosDisponiveis.reduce((acc, t) => acc + t.estoque, 0);
  const isPoucasUnidades = tamanhosDisponiveis.length < 5 || totalEstoque < 10;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="produto-card">
      <Link to={`/produto/${produto.id}?cor=${encodeURIComponent(variacaoVitrine.cor_nome)}`} className="produto-card-link">
        <div className="imagem-container">
          <img 
            src={variacaoVitrine.imagens.principal_vitrine} 
            alt={produto.nome} 
            className="produto-imagem" 
            loading="lazy"
          />
          <div className="card-badges-left">
            {temDesconto && (
              <span className="badge-desconto">Oferta</span>
            )}
            {produto.tipo_corrida && (
              <span className="badge-categoria">{produto.tipo_corrida}</span>
            )}
            {isPoucasUnidades && (
              <span className="badge-urgencia">Últimas unidades</span>
            )}
          </div>
          
          <button 
            className={`wishlist-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label="Adicionar aos favoritos"
          >
            <Heart size={20} fill={isFavorited ? "#e32636" : "none"} color={isFavorited ? "#e32636" : "#666"} />
          </button>
        </div>
        <div className="produto-info">
          <div className="marca-avaliacao-container">
            <span className="produto-marca">{produto.marca}</span>
            {produto.avaliacoes && (
              <div className="produto-avaliacao">
                <Star size={12} fill="#f5c518" color="#f5c518" />
                <span className="nota">{produto.avaliacoes.resumo.nota_geral.toFixed(1)}</span>
                <span className="total-avaliacoes">({produto.avaliacoes.resumo.total_avaliacoes})</span>
              </div>
            )}
          </div>
          <h3 className="produto-nome">{produto.nome}</h3>
          <p className="produto-desc-curta">{produto.descricoes.vitrine} - {variacaoVitrine.cor_nome}</p>
          <div className="produto-preco-container">
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
          <div className="guia-tamanhos-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeGuideOpen(true); }}>
            Guia de Tamanhos
          </div>
        </div>
      </Link>
      
      {mounted && isSizeGuideOpen && createPortal(
        <div className="size-guide-modal-overlay" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeGuideOpen(false); }}>
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProdutoCard;
