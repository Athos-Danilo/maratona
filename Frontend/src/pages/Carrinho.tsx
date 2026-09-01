import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import Botao from '../components/Botao';
import { Trash2, Plus, Minus } from 'lucide-react';
import './Carrinho.css';

const Carrinho: React.FC = () => {
  const { itens, atualizarQuantidade, removerItem, total, quantidadeItens } = useCarrinho();
  const navigate = useNavigate();

  if (itens.length === 0) {
    return (
      <div className="carrinho-vazio">
        <h2>Seu carrinho está vazio</h2>
        <p>Parece que você ainda não escolheu seu equipamento de alta performance.</p>
        <Link to="/">
          <Botao>Voltar para a Vitrine</Botao>
        </Link>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <h1>Seu Carrinho ({quantidadeItens} {quantidadeItens === 1 ? 'item' : 'itens'})</h1>
      
      <div className="carrinho-layout">
        <div className="carrinho-lista">
          {itens.map((item) => (
            <div key={`${item.sku}-${item.tamanho}`} className="carrinho-item">
              <div className="item-imagem">
                <img src={item.imagem} alt={item.nome} width="100" height="100" />
              </div>
              <div className="item-detalhes">
                <span className="item-marca">{item.marca}</span>
                <Link to={`/produto/${item.produtoId}`} className="item-nome-link">
                  <h3>{item.nome}</h3>
                </Link>
                <p className="item-variacao">Cor: {item.corNome} | Tamanho: {item.tamanho}</p>
                
                <div className="item-controles">
                  <div className="quantidade-controle">
                    <button 
                      className="qtd-btn" 
                      onClick={() => atualizarQuantidade(item.sku, item.tamanho, item.quantidade - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantidade}</span>
                    <button 
                      className="qtd-btn" 
                      onClick={() => atualizarQuantidade(item.sku, item.tamanho, item.quantidade + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    className="remover-btn" 
                    onClick={() => removerItem(item.sku, item.tamanho)}
                    aria-label="Remover item do carrinho"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="item-preco">
                {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="carrinho-resumo">
          <h2>Resumo do Pedido</h2>
          
          <div className="resumo-linha">
            <span>Subtotal</span>
            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          
          <div className="resumo-linha total">
            <span>Total</span>
            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          
          <Botao 
            fullWidth 
            onClick={() => navigate('/checkout')}
            className="checkout-btn"
          >
            Ir para o pagamento
          </Botao>
          
          <p className="seguranca-aviso">
            Ambiente 100% seguro. Suas informações estão protegidas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
