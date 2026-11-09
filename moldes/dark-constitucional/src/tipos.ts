export type Palavra = { w: string; ini: number; fim: number }; // quadros, relativos à cena

export type Cena = {
  tipo: "gancho" | "frase" | "placar" | "cedula" | "documentos" | "cartas" | "pausa" | "linha" | "pergunta";
  fala?: string;
  seg?: number;
  [k: string]: any;
};

export type CenaPronta = Cena & {
  inicio: number;
  dur: number;
  palavras: Palavra[];
  audio?: string;
};

export type Props = {
  id: string;
  pauta?: number;
  serie?: string;
  marca: string;
  cenas: CenaPronta[];
  total: number;
  comVoz: boolean;
};
