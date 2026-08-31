import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  marca: string;
  sku: string;
  corNome: string;
  imagem: string;
  tamanho: number;
  preco: number;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (item: ItemCarrinho) => void;
  removerItem: (sku: string, tamanho: number) => void;
  atualizarQuantidade: (sku: string, tamanho: number, novaQuantidade: number) => void;
  total: number;
  quantidadeItens: number;
  esvaziarCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarItem = (novoItem: ItemCarrinho) => {
    setItens(prev => {
      const indexExistente = prev.findIndex(
        item => item.sku === novoItem.sku && item.tamanho === novoItem.tamanho
      );

      if (indexExistente >= 0) {
        const novosItens = [...prev];
        novosItens[indexExistente].quantidade += novoItem.quantidade;
        return novosItens;
      }
      return [...prev, novoItem];
    });
  };

  const removerItem = (sku: string, tamanho: number) => {
    setItens(prev => prev.filter(item => !(item.sku === sku && item.tamanho === tamanho)));
  };

  const atualizarQuantidade = (sku: string, tamanho: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerItem(sku, tamanho);
      return;
    }
    setItens(prev => prev.map(item => 
      item.sku === sku && item.tamanho === tamanho 
        ? { ...item, quantidade: novaQuantidade } 
        : item
    ));
  };

  const esvaziarCarrinho = () => {
    setItens([]);
  };

  const total = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const quantidadeItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      total,
      quantidadeItens,
      esvaziarCarrinho
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};
