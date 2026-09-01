import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Produto, Variacao } from '../types';
import './ProdutoCard.css';

interface ProdutoCardProps {
  produto: Produto;
  variacaoEspecifica?: Variacao;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, variacaoEspecifica }) => {
  const [isFavorited, setIsFavorited] = useState(false);

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
            width="400" 
            height="400" 
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
            aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
          <p className="produto-genero">{produto.genero}</p>
          <p className="produto-desc-curta">{produto.descricoes.vitrine}</p>
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
        </div>
      </Link>
      
    </div>
  );
};

export default ProdutoCard;
