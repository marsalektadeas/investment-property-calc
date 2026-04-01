/**
 * Přepočet nominální hodnoty na reálnou (po inflaci)
 * @param nominalValue  nominální hodnota v roce `year`
 * @param inflationRate roční inflace v %
 * @param year          počet let od základního roku
 */
export function toReal(nominalValue: number, inflationRate: number, year: number): number {
  return nominalValue / Math.pow(1 + inflationRate / 100, year)
}

/**
 * Přepočet reálné hodnoty na nominální
 */
export function toNominal(realValue: number, inflationRate: number, year: number): number {
  return realValue * Math.pow(1 + inflationRate / 100, year)
}

/**
 * Reálná úroková sazba (Fisherova rovnice)
 */
export function realInterestRate(nominalRate: number, inflationRate: number): number {
  return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100
}
