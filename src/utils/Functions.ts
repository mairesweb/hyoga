function convertTaxeToMonthly(taxe: number) {
  return Math.pow(1 + taxe / 100, 1 / 12) - 1;
}

function calculateAliquot(investimentType: string, time: number, resultSimulation: any) {
  if (investimentType === 'tributado') {
      if (time <= 6) {
          resultSimulation.taxesPercentage = '22,5%';
          return 0.225;
      } else if (time <= 12) {
          resultSimulation.taxesPercentage = '20%';
          return 0.2;
      } else if (time <= 24) {
          resultSimulation.taxesPercentage = '17,5%';
          return 0.175;
      } else {
          resultSimulation.taxesPercentage = '15%';
          return 0.15;
      }
  }

  return 0;
}

export { convertTaxeToMonthly, calculateAliquot };