export interface Produto {
  id: string;
  ativo: boolean;
  nome: string;
  marca: string;
  categoria_principal: string;
  genero: string;
  tipo_corrida: string;
  descricoes: {
    vitrine: string;
    detalhada: string;
    especificacoes_tecnicas: string[];
  };
  variacoes: Variacao[];
  destaque_home: boolean;
  avaliacoes?: ResumoAvaliacoesGeral;
}

export interface ResumoAvaliacoesGeral {
  resumo: {
    nota_geral: number;
    total_avaliacoes: number;
    metricas: {
      conforto: number;
      qualidade: number;
      tamanho: number;
      largura: number;
    }
  };
  comentarios: ComentarioAvaliacao[];
}

export interface ComentarioAvaliacao {
  id: string;
  nota: number;
  titulo: string;
  texto: string;
  data: string;
  util_sim: number;
  util_nao: number;
}

export interface Variacao {
  sku_base: string;
  cor_nome: string;
  cores: { nome: string; hex: string }[];
  preco: {
    original: number;
    promocional: number;
  };
  thumbnail_cor: string;
  imagens: {
    principal_vitrine: string;
    galeria: string[];
  };
  grade_tamanhos: TamanhoEstoque[];
}

export interface TamanhoEstoque {
  tamanho: number;
  estoque: number;
}
