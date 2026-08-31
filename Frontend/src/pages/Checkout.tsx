import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import Botao from '../components/Botao';
import { MapPin, CreditCard, QrCode, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import './Checkout.css';

type MetodoPagamento = 'cartao' | 'pix' | null;
type TipoFrete = 'padrao' | 'expresso';

const Checkout: React.FC = () => {
  const { itens, total, quantidadeItens, esvaziarCarrinho } = useCarrinho();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [frete, setFrete] = useState<TipoFrete>('padrao');
  const [metodo, setMetodo] = useState<MetodoPagamento>('pix');
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState(1);
  const [loading, setLoading] = useState(false);

  const valorFrete = frete === 'expresso' ? 14.99 : 0;
  const totalBase = total + valorFrete;

  // Lógica de juros
  const getJuros = (parcelas: number) => {
    if (parcelas === 11) return 1.015; // 1.5%
    if (parcelas === 12) return 1.02; // 2%
    return 1;
  };

  const multiplicadorJuros = metodo === 'cartao' ? getJuros(parcelasSelecionadas) : 1;
  const totalFinal = totalBase * multiplicadorJuros;

  // Função para calcular data de entrega
  const calcularData = (dias: number) => {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    let diaAdicionado = false;
    
    // Se for domingo (0), pula pra segunda (1)
    if (data.getDay() === 0) {
      data.setDate(data.getDate() + 1);
      diaAdicionado = true;
    }
    
    return {
      dataFormatada: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(data),
      diaSemana: new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(data),
      adiado: diaAdicionado
    };
  };

  const infoPadrao = calcularData(15);
  const infoExpresso = calcularData(3);

  const handleFinalizarCompra = () => {
    setLoading(true);

    const dadosDoPedido = {
      itens,
      freteInfo: frete === 'padrao' ? infoPadrao : infoExpresso,
      tipoFrete: frete,
      valorFrete,
      totalBase,
      totalFinal,
      quantidadeItens,
      metodoPagamento: metodo,
      parcelas: parcelasSelecionadas,
      multiplicadorJuros,
      endereco: {
        rua: "Praça Joaquim Nabuco, 124",
        complemento: "Atrás da prefeitura",
        cidade: "Lajedo - PE",
        cep: "55385-000"
      }
    };

    // Simula processamento de 3 segundos
    setTimeout(() => {
      setLoading(false);
      navigate('/status-compra', { state: dadosDoPedido });
      esvaziarCarrinho();
    }, 3000);
  };

  if (quantidadeItens === 0 && !loading) {
    return (
      <div className="checkout-vazio">
        <h2>Seu carrinho está vazio</h2>
        <Botao onClick={() => navigate('/catalogo')}>Voltar às Compras</Botao>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        {etapa === 1 ? (
          <button className="voltar-btn" onClick={() => navigate('/carrinho')}>
            <ArrowLeft size={20} /> Voltar para o carrinho
          </button>
        ) : (
          <button className="voltar-btn" onClick={() => setEtapa(1)}>
            <ArrowLeft size={20} /> Voltar para Endereço e Frete
          </button>
        )}
        <h1>Finalizar Compra</h1>
      </div>

      <div className="checkout-layout">
        <div className="checkout-conteudo">
          
          {/* SEÇÃO DE ENDEREÇO */}
          {etapa === 1 && (
            <section className="checkout-secao">
            <div className="secao-header">
              <MapPin size={24} className="icone-secao" />
              <h2>Endereço e Entrega</h2>
            </div>
            
            <div className="endereco-card">
              <div className="endereco-dados">
                <strong>Praça Joaquim Nabuco, 124</strong>
                <p>Atrás da prefeitura</p>
                <p>Lajedo - PE</p>
                <p>CEP: 55385-000</p>
              </div>
              <button className="btn-alterar-endereco" disabled>Alterar</button>
            </div>

            <div className="fretes-disponiveis">
              <label className={`frete-card ${frete === 'padrao' ? 'selecionado' : ''}`}>
                <input 
                  type="radio" 
                  name="frete" 
                  checked={frete === 'padrao'} 
                  onChange={() => setFrete('padrao')} 
                />
                <div className="frete-info">
                  <span className="frete-tipo">Entrega Padrão (Grátis)</span>
                  <span className="frete-previsao">
                    Chegará dia <strong>{infoPadrao.dataFormatada}</strong> ({infoPadrao.diaSemana})
                  </span>
                  {infoPadrao.adiado && (
                    <span className="frete-aviso">* A data original caía num domingo. Reprogramado para a próxima segunda-feira útil.</span>
                  )}
                </div>
              </label>

              <label className={`frete-card ${frete === 'expresso' ? 'selecionado' : ''}`}>
                <input 
                  type="radio" 
                  name="frete" 
                  checked={frete === 'expresso'} 
                  onChange={() => setFrete('expresso')} 
                />
                <div className="frete-info">
                  <span className="frete-tipo">Entrega Expressa (R$ 14,99)</span>
                  <span className="frete-previsao">
                    Chegará dia <strong>{infoExpresso.dataFormatada}</strong> ({infoExpresso.diaSemana})
                  </span>
                  {infoExpresso.adiado && (
                    <span className="frete-aviso">* A data original caía num domingo. Reprogramado para a próxima segunda-feira útil.</span>
                  )}
                </div>
              </label>
            </div>
            
            {etapa === 1 && (
              <Botao className="btn-avancar" onClick={() => setEtapa(2)}>
                Continuar para o Pagamento
              </Botao>
            )}
          </section>
          )}

          {/* SEÇÃO DE PAGAMENTO */}
          {etapa === 2 && (
            <section className="checkout-secao">
              <div className="secao-header">
                <CreditCard size={24} className="icone-secao" />
                <h2>Pagamento</h2>
              </div>
              
              <div className="metodos-pagamento">
                  <button 
                    className={`metodo-btn ${metodo === 'pix' ? 'ativo' : ''}`}
                    onClick={() => setMetodo('pix')}
                  >
                    <QrCode size={20} /> PIX
                  </button>
                  <button 
                    className={`metodo-btn ${metodo === 'cartao' ? 'ativo' : ''}`}
                    onClick={() => setMetodo('cartao')}
                  >
                    <CreditCard size={20} /> Cartão de Crédito
                  </button>
                </div>

                {metodo === 'pix' && (
                  <div className="pagamento-box pix-box">
                    <p>Escaneie o QR Code ou copie o código para pagar.</p>
                    <div className="qr-code-falso">
                      <img src="/Imagens/pix.jpg" alt="QR Code Pix" className="qr-img" />
                    </div>
                    <div className="codigo-copia">
                      <input type="text" readOnly value="00020126580014br.gov.bcb.pix0136fake-code-maratona-123456789" />
                      <button>Copiar</button>
                    </div>
                    <p className="pix-aviso">O pagamento será aprovado instantaneamente logo após a conclusão.</p>
                  </div>
                )}

                {metodo === 'cartao' && (
                  <div className="pagamento-box cartao-box">
                    <div className="cartao-falso">
                      <div className="cartao-falso-logo">MARATONA</div>
                      <div className="cartao-falso-chip"></div>
                      <div className="cartao-falso-numero">•••• •••• •••• 4092</div>
                      <div className="cartao-falso-nome">ATHOS D M INACIO</div>
                      <div className="cartao-falso-validade">12/29</div>
                    </div>

                    <div className="form-falso">
                      <div className="input-group">
                        <label>Titular do Cartão</label>
                        <input type="text" readOnly value="ATHOS D M INACIO" />
                      </div>
                      <div className="input-group">
                        <label>CPF</label>
                        <input type="text" readOnly value="***.456.789-**" />
                      </div>
                      <div className="input-group">
                        <label>Parcelamento</label>
                        <select 
                          value={parcelasSelecionadas} 
                          onChange={(e) => setParcelasSelecionadas(Number(e.target.value))}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(p => {
                            let valorDaCompra = totalBase;
                            let textoJuros = 'sem juros';
                            if (p === 11) {
                              valorDaCompra = totalBase * 1.015; // 1.5% de juros
                              textoJuros = 'com juros (1.5%)';
                            } else if (p === 12) {
                              valorDaCompra = totalBase * 1.02; // 2% de juros
                              textoJuros = 'com juros (2%)';
                            }
                            const valorParcela = valorDaCompra / p;
                            return (
                              <option key={p} value={p}>
                                {p}x de {valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} {textoJuros}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
            </section>
          )}

        </div>

        {/* RESUMO FIXO */}
        <div className="checkout-resumo">
          <div className="resumo-box">
            <h2>Resumo da Compra</h2>

            <div className="resumo-produtos">
              <div className="resumo-produtos-lista">
                {itens.map(item => (
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
            </div>

            <div className="resumo-endereco">
              <span className="resumo-endereco-titulo">Entregar em:</span>
              <p>Praça Joaquim Nabuco, 124 - Atrás da prefeitura</p>
              <p>Lajedo - PE, 55385-000</p>
            </div>

            <div className="resumo-valores">
              <div className="resumo-linha">
                <span>Subtotal ({quantidadeItens} {quantidadeItens === 1 ? 'item' : 'itens'})</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="resumo-linha">
                <span>Frete</span>
                <span className={frete === 'padrao' ? "texto-verde" : ""}>
                  {frete === 'padrao' ? 'Grátis' : valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              {multiplicadorJuros > 1 && (
                <div className="resumo-linha">
                  <span>Juros de Parcelamento</span>
                  <span style={{color: '#d32f2f'}}>
                    +{(totalFinal - totalBase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}
              <div className="resumo-linha total">
                <span>Total</span>
                <span>{totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>

            <Botao 
              fullWidth 
              className={`btn-finalizar ${loading ? 'loading' : ''}`}
              onClick={handleFinalizarCompra}
              disabled={loading || etapa === 1}
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="spin-icon" /> Processando Pagamento...
                </>
              ) : (
                'Finalizar Compra'
              )}
            </Botao>
            <p className="seguranca-texto">Ambiente criptografado. Compra 100% segura.</p>
          </div>
        </div>

      </div>

      {/* OVERLAY DE LOADING TELA CHEIA (OPCIONAL MAS LEGAL) */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <Loader2 size={48} className="spin-icon text-primaria" />
            <h3>Aprovando seu pagamento...</h3>
            <p>Por favor, não feche esta janela.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
