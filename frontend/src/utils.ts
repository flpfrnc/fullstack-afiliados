/**
   *
   * @param values transaction value
   * @returns formatted value in BRL - `R$`
   */
export function formatTransactionValue(value: string | number | undefined) {
    if (!value) value = 0;

    if (typeof value === "string") value = Number(value);

    const reais = (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return reais;
  }