export const URL = "https://brutalassault.cz/en/xchange";

export const DELUTA_STELUTA = "40751105286@c.us";
export const BRUTALIST = "120363284241978249@g.us";

export const mokangeala = (lowestPrice: number) =>
  "HAI LA MOKANGEALA!" +
  "\n" +
  `bilet la brutal la ${lowestPrice} €` +
  "\n" +
  `ici -> ${URL}`;

export const ieftin = (lowestPrice: number) =>
  `baiatu' cel mai ieftin la brutal pe ${lowestPrice} €` +
  "\n" +
  `ici -> ${URL}`;
