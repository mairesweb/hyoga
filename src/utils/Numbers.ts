export function formatPercentage(number: number) {
    return number.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

export function formatCurrency(number: number) {
    return number.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function formatNumber(number: number) {
    return number.toLocaleString('pt-br');
}

export function convertCurrencyToNumber(currency: string) {
    const regex = new RegExp(/[^0-9,-]/g);
    return Number(currency.replace(regex, '').replace(',', '.'));
}
