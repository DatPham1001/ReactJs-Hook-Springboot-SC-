export function currencyFormat(number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(number);
}
export function formatDate(date) {
    return `${date.slice(-2)}/${date.slice(5,7)}/${date.slice(0,4)}`;
}