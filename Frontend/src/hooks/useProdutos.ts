import { useState, useEffect, useMemo } from 'react';
import type { Produto } from '../types';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch('/Produtos/products.json'),
          fetch('/Produtos/other_products.json').catch(() => null)
        ]);

        if (!res1.ok) {
          throw new Error('Falha ao carregar o catálogo de produtos');
        }
        
        const data1: Produto[] = await res1.json();
        const data2: Produto[] = res2 && res2.ok ? await res2.json() : [];
        
        setProdutos([...data1, ...data2]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const termo = busca.toLowerCase();
      return (
        produto.nome.toLowerCase().includes(termo) ||
        produto.marca.toLowerCase().includes(termo) ||
        produto.categoria_principal.toLowerCase().includes(termo)
      );
    });
  }, [produtos, busca]);

  return {
    produtos: produtosFiltrados,
    loading,
    error,
    busca,
    setBusca,
  };
};
