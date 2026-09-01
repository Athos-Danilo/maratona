import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoCard from '../components/ProdutoCard';
import { ChevronDown, Filter } from 'lucide-react';
import type { Produto, Variacao } from '../types';
import './Catalogo.css';

// Tipo que junta o produto com uma variação específica para o flatMap
type FlatProduto = Produto & { variacaoAtual: Variacao };

const Catalogo: React.FC = () => {
  const { produtos, loading, error } = useProdutos();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  // Filtros obtidos da URL (Source of Truth)
  const generoSelecionado = searchParams.get('genero') || 'Todos';
  const marcaSelecionada = searchParams.get('marca') || 'Todas';
  const categoriaSelecionada = searchParams.get('categoria') || 'Todas';
  const tamanhoSelecionado = searchParams.get('tamanho') || 'Todos';
  const tipoCorridaSelecionado = searchParams.get('tipo_corrida') || 'Todos';
  const ordenacao = searchParams.get('ordenacao') || 'relevancia';
  const apenasOfertas = searchParams.get('ofertas') === 'true';

  const updateFiltro = (chave: string, valor: string) => {
    setSearchParams(prev => {
      // Se for o valor padrão, removemos da URL para manter limpa
      if (valor === 'Todos' || valor === 'Todas' || valor === 'relevancia') {
        prev.delete(chave);
      } else {
        prev.set(chave, valor);
      }
      return prev;
    });
  };

  // Estado de dropdowns (Custom Selects)
  const [aberto, setAberto] = useState<'genero' | 'marca' | 'ordem' | 'categoria' | 'tamanho' | 'ofertas' | 'tipo_corrida' | null>(null);

  // Paginação
  const [limite, setLimite] = useState(20);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setItemsPerPage(isMobile ? 10 : 20);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extrair opções únicas para os filtros
  const marcasDisponiveis = useMemo(() => {
    return ['Todas', ...Array.from(new Set(produtos.map(p => p.marca)))];
  }, [produtos]);
  
  const categoriasDisponiveis = useMemo(() => {
    return ['Todas', ...Array.from(new Set(produtos.map(p => p.categoria_principal)))];
  }, [produtos]);

  const generosDisponiveis = useMemo(() => {
    return ['Todos', ...Array.from(new Set(produtos.map(p => p.genero)))];
  }, [produtos]);

  const tiposCorridaDisponiveis = useMemo(() => {
    const tipos = new Set(produtos.map(p => p.tipo_corrida).filter(Boolean));
    return ['Todos', ...Array.from(tipos)];
  }, [produtos]);

  // Expandir os produtos pelas variações de cor (1 produto com 3 cores = 3 cards)
  const flatProdutos = useMemo(() => {
    let result: FlatProduto[] = [];
    produtos.forEach(p => {
      p.variacoes.forEach(v => {
        result.push({ ...p, variacaoAtual: v });
      });
    });
    return result;
  }, [produtos]);

  const tamanhosDisponiveis = useMemo(() => {
    if (categoriaSelecionada === 'Todas') return [];
    const all = new Set<string>();
    flatProdutos.forEach(p => {
       if (p.categoria_principal === categoriaSelecionada) {
         p.variacaoAtual.grade_tamanhos.forEach(t => all.add(t.tamanho.toString()));
       }
    });
    return Array.from(all).sort((a, b) => {
      const isNumA = !isNaN(Number(a));
      const isNumB = !isNaN(Number(b));
      if (isNumA && isNumB) return Number(a) - Number(b);
      const letterOrder = ['PP', 'P', 'M', 'G', 'GG', '2GG'];
      return letterOrder.indexOf(a) - letterOrder.indexOf(b);
    });
  }, [flatProdutos, categoriaSelecionada]);

  // Faceted Search: Calcular quais opções são válidas com base nos OUTROS filtros ativos
  const getProdutosParaFiltro = (filtroIgnorado: 'categoria' | 'genero' | 'marca' | 'tamanho' | 'tipo_corrida') => {
    let filtrados = flatProdutos;
    const removeAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (q) {
      const termo = removeAcentos(q.toLowerCase());
      filtrados = filtrados.filter(
        p => removeAcentos(p.nome.toLowerCase()).includes(termo) || 
             removeAcentos(p.marca.toLowerCase()).includes(termo) ||
             removeAcentos(p.categoria_principal.toLowerCase()).includes(termo) ||
             removeAcentos(p.variacaoAtual.cor_nome.toLowerCase()).includes(termo)
      );
    }
    
    if (filtroIgnorado !== 'categoria' && categoriaSelecionada !== 'Todas') {
      filtrados = filtrados.filter(p => p.categoria_principal === categoriaSelecionada);
    }
    if (filtroIgnorado !== 'genero' && generoSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.genero === generoSelecionado);
    }
    if (filtroIgnorado !== 'marca' && marcaSelecionada !== 'Todas') {
      filtrados = filtrados.filter(p => p.marca === marcaSelecionada);
    }
    if (filtroIgnorado !== 'tamanho' && tamanhoSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.variacaoAtual.grade_tamanhos.some(t => t.tamanho.toString() === tamanhoSelecionado && t.estoque > 0));
    }
    if (filtroIgnorado !== 'tipo_corrida' && tipoCorridaSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.tipo_corrida === tipoCorridaSelecionado);
    }
    if (apenasOfertas) {
      filtrados = filtrados.filter(p => p.variacaoAtual.preco.promocional < p.variacaoAtual.preco.original);
    }
    return filtrados;
  };

  const marcasValidas = useMemo(() => new Set(getProdutosParaFiltro('marca').map(p => p.marca)), [flatProdutos, q, categoriaSelecionada, generoSelecionado, tamanhoSelecionado, tipoCorridaSelecionado, apenasOfertas]);
  const categoriasValidas = useMemo(() => new Set(getProdutosParaFiltro('categoria').map(p => p.categoria_principal)), [flatProdutos, q, marcaSelecionada, generoSelecionado, tamanhoSelecionado, tipoCorridaSelecionado, apenasOfertas]);
  const generosValidos = useMemo(() => new Set(getProdutosParaFiltro('genero').map(p => p.genero)), [flatProdutos, q, marcaSelecionada, categoriaSelecionada, tamanhoSelecionado, tipoCorridaSelecionado, apenasOfertas]);
  const tiposCorridaValidos = useMemo(() => new Set(getProdutosParaFiltro('tipo_corrida').map(p => p.tipo_corrida).filter(Boolean)), [flatProdutos, q, marcaSelecionada, categoriaSelecionada, generoSelecionado, tamanhoSelecionado, apenasOfertas]);
  const tamanhosValidos = useMemo(() => {
    const prods = getProdutosParaFiltro('tamanho');
    const t = new Set<string>();
    prods.forEach(p => p.variacaoAtual.grade_tamanhos.forEach(grade => { if (grade.estoque > 0) t.add(grade.tamanho.toString()); }));
    return t;
  }, [flatProdutos, q, marcaSelecionada, categoriaSelecionada, generoSelecionado, tipoCorridaSelecionado, apenasOfertas]);

  // Aplicar Filtros, Busca e Ordenação
  const produtosFiltrados = useMemo(() => {
    let filtrados = flatProdutos;
    
    const removeAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (q) {
      const termo = removeAcentos(q.toLowerCase());
      filtrados = filtrados.filter(
        p => removeAcentos(p.nome.toLowerCase()).includes(termo) || 
             removeAcentos(p.marca.toLowerCase()).includes(termo) ||
             removeAcentos(p.categoria_principal.toLowerCase()).includes(termo) ||
             removeAcentos(p.variacaoAtual.cor_nome.toLowerCase()).includes(termo)
      );
    }

    if (categoriaSelecionada !== 'Todas') {
      filtrados = filtrados.filter(p => p.categoria_principal === categoriaSelecionada);
    }

    if (generoSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.genero === generoSelecionado);
    }

    if (marcaSelecionada !== 'Todas') {
      filtrados = filtrados.filter(p => p.marca === marcaSelecionada);
    }

    if (tamanhoSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.variacaoAtual.grade_tamanhos.some(t => t.tamanho.toString() === tamanhoSelecionado && t.estoque > 0));
    }

    if (tipoCorridaSelecionado !== 'Todos') {
      filtrados = filtrados.filter(p => p.tipo_corrida === tipoCorridaSelecionado);
    }

    if (apenasOfertas) {
      filtrados = filtrados.filter(p => p.variacaoAtual.preco.promocional < p.variacaoAtual.preco.original);
    }

    // Ordenação
    filtrados.sort((a, b) => {
      if (ordenacao === 'menor_preco') {
        return a.variacaoAtual.preco.promocional - b.variacaoAtual.preco.promocional;
      }
      if (ordenacao === 'maior_preco') {
        return b.variacaoAtual.preco.promocional - a.variacaoAtual.preco.promocional;
      }
      return 0; // relevancia / padrao do JSON
    });

    return filtrados;
  }, [flatProdutos, q, generoSelecionado, marcaSelecionada, categoriaSelecionada, tamanhoSelecionado, tipoCorridaSelecionado, apenasOfertas, ordenacao]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-select')) {
        setAberto(null);
      }
    };
    document.addEventListener('click', handleClickFora);
    return () => document.removeEventListener('click', handleClickFora);
  }, []);

  const carregarMais = () => {
    setLimite(prev => prev + itemsPerPage);
  };

  const limparFiltros = () => {
    setSearchParams(prev => {
      prev.delete('genero');
      prev.delete('marca');
      prev.delete('categoria');
      prev.delete('tamanho');
      prev.delete('tipo_corrida');
      prev.delete('ofertas');
      // Não apagamos o 'q' para permitir que o usuário limpe apenas os filtros da busca
      return prev;
    });
  };

  const temFiltroAtivo = categoriaSelecionada !== 'Todas' || generoSelecionado !== 'Todos' || marcaSelecionada !== 'Todas' || tamanhoSelecionado !== 'Todos' || tipoCorridaSelecionado !== 'Todos' || apenasOfertas || q !== '';

  if (loading) return <div className="loading">Carregando catálogo de alta performance...</div>;
  if (error) return <div className="error">Erro ao carregar produtos: {error}</div>;

  const produtosPaginados = produtosFiltrados.slice(0, limite);
  const temMais = limite < produtosFiltrados.length;

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <div className="breadcrumb">
          Início / {apenasOfertas ? 'Outlet / ' : ''} {categoriaSelecionada !== 'Todas' ? categoriaSelecionada : 'Todos os Produtos'} {q && `/ Busca: "${q}"`}
        </div>
        <div className="catalogo-title-row">
          <h1>
            {apenasOfertas && <span style={{ color: '#ff4d4d', marginRight: 12 }}>OUTLET</span>}
            {categoriaSelecionada !== 'Todas' ? categoriaSelecionada : 'Todos os Produtos'}
          </h1>
          <span className="resultados-count">{produtosFiltrados.length} resultados</span>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-grupo">
          <div className="filtro-icon">
            <Filter size={20} />
          </div>
          
          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'categoria' ? null : 'categoria')}}>
            <div className="select-trigger">
              Categoria: <strong>{categoriaSelecionada}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'categoria' && (
              <ul className="select-options">
                {categoriasDisponiveis.map(c => {
                  const isAvailable = c === 'Todas' || categoriasValidas.has(c);
                  return (
                    <li key={c} onClick={() => { if (isAvailable) updateFiltro('categoria', c) }} className={`${categoriaSelecionada === c ? 'active' : ''} ${!isAvailable ? 'disabled-option' : ''}`}>{c}</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'genero' ? null : 'genero')}}>
            <div className="select-trigger">
              Gênero: <strong>{generoSelecionado}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'genero' && (
              <ul className="select-options">
                {generosDisponiveis.map(g => {
                  const isAvailable = g === 'Todos' || generosValidos.has(g);
                  return (
                    <li key={g} onClick={() => { if (isAvailable) updateFiltro('genero', g) }} className={`${generoSelecionado === g ? 'active' : ''} ${!isAvailable ? 'disabled-option' : ''}`}>{g}</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'marca' ? null : 'marca')}}>
            <div className="select-trigger">
              Marca: <strong>{marcaSelecionada}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'marca' && (
              <ul className="select-options">
                {marcasDisponiveis.map(m => {
                  const isAvailable = m === 'Todas' || marcasValidas.has(m);
                  return (
                    <li key={m} onClick={() => { if (isAvailable) updateFiltro('marca', m) }} className={`${marcaSelecionada === m ? 'active' : ''} ${!isAvailable ? 'disabled-option' : ''}`}>{m}</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className={`custom-select ${categoriaSelecionada === 'Todas' ? 'disabled-select' : ''}`} onClick={(e) => { e.stopPropagation(); if (categoriaSelecionada !== 'Todas') setAberto(aberto === 'tamanho' ? null : 'tamanho')}}>
            <div className="select-trigger">
              Tamanho: <strong>{tamanhoSelecionado}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'tamanho' && categoriaSelecionada !== 'Todas' && (
              <ul className="select-options">
                <li onClick={() => updateFiltro('tamanho', 'Todos')} className={tamanhoSelecionado === 'Todos' ? 'active' : ''}>Todos</li>
                {tamanhosDisponiveis.map(t => {
                  const isAvailable = tamanhosValidos.has(t);
                  return (
                    <li key={t} onClick={() => { if (isAvailable) updateFiltro('tamanho', t) }} className={`${tamanhoSelecionado === t ? 'active' : ''} ${!isAvailable ? 'disabled-option' : ''}`}>{t}</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'tipo_corrida' ? null : 'tipo_corrida')}}>
            <div className="select-trigger">
              Corrida: <strong>{tipoCorridaSelecionado}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'tipo_corrida' && (
              <ul className="select-options">
                {tiposCorridaDisponiveis.map(tc => {
                  const isAvailable = tc === 'Todos' || tiposCorridaValidos.has(tc);
                  return (
                    <li key={tc} onClick={() => { if (isAvailable) updateFiltro('tipo_corrida', tc) }} className={`${tipoCorridaSelecionado === tc ? 'active' : ''} ${!isAvailable ? 'disabled-option' : ''}`}>{tc}</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'ofertas' ? null : 'ofertas')}}>
            <div className="select-trigger">
              Ofertas: <strong>{apenasOfertas ? 'Sim' : 'Todas'}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'ofertas' && (
              <ul className="select-options">
                <li onClick={() => updateFiltro('ofertas', 'Todos')} className={!apenasOfertas ? 'active' : ''}>Todas</li>
                <li onClick={() => updateFiltro('ofertas', 'true')} className={apenasOfertas ? 'active' : ''}>Apenas Ofertas</li>
              </ul>
            )}
          </div>
        </div>

        <div className="ordenacao-grupo">
          {temFiltroAtivo && (
            <button className="btn-limpar-filtros" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          )}
          <div className="custom-select" onClick={(e) => { e.stopPropagation(); setAberto(aberto === 'ordem' ? null : 'ordem')}}>
            <div className="select-trigger">
              Ordenar por: <strong>{ordenacao === 'relevancia' ? 'Relevância' : ordenacao === 'menor_preco' ? 'Menor Preço' : 'Maior Preço'}</strong>
              <ChevronDown size={16} />
            </div>
            {aberto === 'ordem' && (
              <ul className="select-options">
                <li onClick={() => updateFiltro('ordenacao', 'relevancia')} className={ordenacao === 'relevancia' ? 'active' : ''}>Relevância</li>
                <li onClick={() => updateFiltro('ordenacao', 'menor_preco')} className={ordenacao === 'menor_preco' ? 'active' : ''}>Menor Preço</li>
                <li onClick={() => updateFiltro('ordenacao', 'maior_preco')} className={ordenacao === 'maior_preco' ? 'active' : ''}>Maior Preço</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="no-results">
          <h3>Nenhum produto encontrado.</h3>
          <p>Tente ajustar os filtros ou o termo de busca.</p>
        </div>
      ) : (
        <>
          <div className="grid-produtos catalogo-grid">
            {produtosPaginados.map(p => (
              <ProdutoCard 
                key={`${p.id}-${p.variacaoAtual.cor_nome}`} 
                produto={p} 
                variacaoEspecifica={p.variacaoAtual} 
              />
            ))}
          </div>

          {temMais && (
            <div className="carregar-mais-container">
              <button className="carregar-mais-btn" onClick={carregarMais}>
                Carregar mais produtos
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Catalogo;
