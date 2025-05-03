export namespace CurrencyFormatter {
    export function format(amount: number) {
        return Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            currencyDisplay: "symbol"
        }).format(amount);
    }
}