import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Botao from '../components/Botao';
import { CheckCircle2, Package, Truck, Home, ArrowRight, Check } from 'lucide-react';
import './StatusCompra.css';

const StatusCompra: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Rola para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Se a pessoa acessar a página diretamente pela URL sem ter feito uma compra, redireciona.
  if (!location.state) {
    return <Navigate to="/" />;
  }

  const dados = location.state;

  return (
    <div className="status-compra-container">
      
      {/* CABEÇALHO DE SUCESSO */}
      <div className="status-header">
        <div className="status-header-icone">
          <CheckCircle2 size={64} />
        </div>
        <h1>Pagamento Aprovado!</h1>
        <p>Seu pedido <strong>#MRTN-{(Math.random() * 1000000).toFixed(0)}</strong> foi confirmado com sucesso.</p>
      </div>

      <div className="status-layout">
        
        {/* COLUNA ESQUERDA: TRACKING E ENDEREÇO */}
        <div className="status-col-principal">
          
          <div className="status-card">
            <h2>Acompanhe seu pedido</h2>
            <div className="timeline-container">
              
              <div className="timeline-step concluido">
                <div className="timeline-icone"><Check size={24} /></div>
                <div className="timeline-texto">
                  <strong>Pagamento Aprovado</strong>
                  <span>Hoje</span>
                </div>
              </div>
              
              <div className="timeline-linha ativa"></div>
              
              <div className="timeline-step atual">
                <div className="timeline-icone"><Package size={24} /></div>
                <div className="timeline-texto">
                  <strong>Separando Estoque</strong>
                  <span>Em andamento</span>
                </div>
              </div>
              
              <div className="timeline-linha"></div>
              
              <div className="timeline-step pendente">
                <div className="timeline-icone"><Truck size={24} /></div>
                <div className="timeline-texto">
                  <strong>Em Transporte</strong>
                  <span>Pendente</span>
                </div>
              </div>
              
              <div className="timeline-linha"></div>

              <div className="timeline-step pendente">
                <div className="timeline-icone"><Home size={24} /></div>
                <div className="timeline-texto">
                  <strong>Entregue</strong>
                  <span>Previsão: {dados.freteInfo.dataFormatada}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="status-card">
            <h2>Detalhes da Entrega</h2>
            <div className="endereco-confirmado">
              <div className="endereco-dados">
                <strong>{dados.endereco.rua}</strong>
                <p>{dados.endereco.complemento}</p>
                <p>{dados.endereco.cidade}</p>
                <p>CEP: {dados.endereco.cep}</p>
              </div>
              <div className="frete-escolhido">
                <strong>Tipo de Frete:</strong>
                <p>{dados.tipoFrete === 'padrao' ? 'Entrega Padrão (Grátis)' : 'Entrega Expressa (R$ 14,99)'}</p>
              </div>
            </div>
            <div className="aviso-envio">
              <p>Enviaremos o código de rastreio para o seu e-mail assim que o pedido for despachado.</p>
            </div>
          </div>
          
        </div>

        {/* COLUNA DIREITA: RESUMO DO PEDIDO */}
        <div className="status-col-resumo">
          <div className="status-card resumo-final">
            <h2>Resumo do Pedido</h2>
            
            <div className="resumo-produtos-lista">
              {dados.itens.map((item: any) => (
                <div key={`${item.sku}-${item.tamanho}`} className="resumo-produto-item">
                  <img src={item.imagem} alt={item.nome} className="resumo-produto-img" />
                  <div className="resumo-produto-info">
                    <span className="resumo-produto-nome">{item.nome}</span>
                    <span className="resumo-produto-detalhes">Tam: {item.tamanho} | Qtd: {item.quantidade}</span>
                    <span className="resumo-produto-preco">{(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="resumo-valores-final">
              <div className="resumo-linha">
                <span>Subtotal ({dados.quantidadeItens} {dados.quantidadeItens === 1 ? 'item' : 'itens'})</span>
                <span>{dados.totalBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="resumo-linha">
                <span>Frete</span>
                <span className={dados.tipoFrete === 'padrao' ? "texto-verde" : ""}>
                  {dados.tipoFrete === 'padrao' ? 'Grátis' : (14.99).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              {dados.multiplicadorJuros > 1 && (
                <div className="resumo-linha">
                  <span>Juros ({dados.parcelas}x)</span>
                  <span style={{color: '#d32f2f'}}>
                    +{(dados.totalFinal - dados.totalBase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}
              
              <div className="resumo-linha total">
                <span>Total Pago</span>
                <span>{dados.totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              
              <div className="metodo-utilizado">
                Pagamento via <strong>{dados.metodoPagamento === 'pix' ? 'PIX' : `Cartão de Crédito (${dados.parcelas}x)`}</strong>
              </div>
            </div>
            
            <Botao onClick={() => navigate('/catalogo')} className="btn-voltar-compras" fullWidth>
              Continuar Comprando <ArrowRight size={20} />
            </Botao>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatusCompra;
