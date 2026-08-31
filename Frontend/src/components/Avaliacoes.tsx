import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import type { ResumoAvaliacoesGeral } from '../types';
import Botao from './Botao';
import './Avaliacoes.css';

interface Props {
  avaliacoes: ResumoAvaliacoesGeral;
}

const renderStars = (nota: number, max = 5) => {
  return (
    <div className="estrelas-container">
      {[...Array(max)].map((_, i) => {
        const preenchimento = Math.min(Math.max(nota - i, 0), 1);
        return (
          <div key={i} className="estrela-wrapper">
            <Star size={16} className="estrela-fundo" />
            <div className="estrela-preenchimento" style={{ width: `${preenchimento * 100}%` }}>
              <Star size={16} className="estrela-frente" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MetricBar = ({ label, value, leftLabel, rightLabel, centerLabel }: { label: string, value: number, leftLabel: string, rightLabel: string, centerLabel?: string }) => {
  return (
    <div className="metrica-item">
      <h4>{label}</h4>
      <div className="metrica-barra-container">
        <div className="metrica-linha-fundo">
          <div className="metrica-separador left"></div>
          <div className="metrica-separador right"></div>
        </div>
        <div className="metrica-marcador" style={{ left: `${value}%` }}></div>
      </div>
      <div className="metrica-labels">
        <span>{leftLabel}</span>
        {centerLabel && <span>{centerLabel}</span>}
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

const Avaliacoes: React.FC<Props> = ({ avaliacoes }) => {
  const [aberto, setAberto] = useState(false);
  const [filtroNota, setFiltroNota] = useState<number | null>(null);

  const { resumo, comentarios } = avaliacoes;

  const comentariosFiltrados = filtroNota 
    ? comentarios.filter(c => c.nota === filtroNota)
    : comentarios;

  return (
    <section className="avaliacoes-section" id="secao-avaliacoes">
      <div className="avaliacoes-header-toggle" onClick={() => setAberto(!aberto)}>
        <h3>Avaliações ({resumo.total_avaliacoes})</h3>
        <div className="avaliacoes-toggle-right">
          {renderStars(resumo.nota_geral)}
          {aberto ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {aberto && (
        <div className="avaliacoes-content">
          <div className="avaliacoes-resumo-topo">
            <div className="nota-destaque">
              <span className="nota-numero">{resumo.nota_geral.toFixed(1)}</span>
              {renderStars(resumo.nota_geral)}
            </div>
            <Botao variante="secundario" className="btn-escrever">
              Escrever um comentário →
            </Botao>
          </div>

          <div className="avaliacoes-metricas-grid">
            <MetricBar 
              label="Conforto" 
              value={resumo.metricas.conforto} 
              leftLabel="Muito ruim" 
              rightLabel="Excelente" 
            />
            <MetricBar 
              label="Qualidade" 
              value={resumo.metricas.qualidade} 
              leftLabel="Muito ruim" 
              rightLabel="Excelente" 
            />
            <MetricBar 
              label="Tamanho" 
              value={resumo.metricas.tamanho} 
              leftLabel="Muito pequeno" 
              centerLabel="Perfeito" 
              rightLabel="Muito grande" 
            />
            <MetricBar 
              label="Largura" 
              value={resumo.metricas.largura} 
              leftLabel="Muito pequeno" 
              centerLabel="Perfeito" 
              rightLabel="Muito largo" 
            />
          </div>

          <div className="avaliacoes-filtros">
            <div className="filtros-esquerda">
              <h4>Filtrar por avaliações</h4>
              <div className="botoes-filtro">
                {[5, 4, 3, 2, 1].map(nota => (
                  <button 
                    key={nota}
                    className={`btn-filtro-nota ${filtroNota === nota ? 'ativo' : ''}`}
                    onClick={() => setFiltroNota(filtroNota === nota ? null : nota)}
                  >
                    ★ {nota}
                  </button>
                ))}
              </div>
            </div>
            <div className="filtros-direita">
              <h4>Ordenar por</h4>
              <select className="select-ordenar">
                <option>Mais recente</option>
                <option>Mais úteis</option>
                <option>Maior nota</option>
                <option>Menor nota</option>
              </select>
            </div>
          </div>

          <div className="comentarios-lista">
            {comentariosFiltrados.length === 0 ? (
              <p className="sem-avaliacoes">Nenhuma avaliação encontrada para este filtro.</p>
            ) : (
              comentariosFiltrados.map(comentario => (
                <div key={comentario.id} className="comentario-item">
                  <div className="comentario-esquerda">
                    {renderStars(comentario.nota)}
                  </div>
                  <div className="comentario-direita">
                    <div className="comentario-cabecalho">
                      <h4>{comentario.titulo}</h4>
                      <span className="comentario-data">{comentario.data}</span>
                    </div>
                    <p className="comentario-texto">{comentario.texto}</p>
                    <div className="comentario-acoes">
                      <span className="util-texto">Isto foi útil?</span>
                      <button className="btn-util">
                        <ThumbsUp size={16} /> {comentario.util_sim}
                      </button>
                      <button className="btn-util">
                        <ThumbsDown size={16} /> {comentario.util_nao}
                      </button>
                      <button className="btn-denunciar">Denunciar comentário</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Avaliacoes;
