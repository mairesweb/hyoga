export function formatPercentage(number: number) {
    return number.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

export function formatCurrency(number: number) {
    return number.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}
