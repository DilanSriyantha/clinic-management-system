import { Invoice } from "./types";

export {};

declare global {
    interface Window {
        InvoiceGenerator: {
            generateInvoicePdf: (invoiceJson: string) => Promise<any>;
            generateReportPdf: (imagePath: string) => Promise<any>;
            generatePrescriptionPdf: (prescriptionJson: string) => Promise<any>;
            generateAppointmentPdf: (appointmentJson: string) => Promise<any>;
        };
    }
}