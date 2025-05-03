import { Invoice } from "./types";

export {};

declare global {
    interface Window {
        InvoiceGenerator: {
            generateInvoicePdf: (invoiceJson: string) => Promise<any>;
        };
    }
}