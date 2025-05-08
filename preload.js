const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("InvoiceGenerator", {
    generateInvoicePdf: (invoiceJson) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("generateInvoice", invoiceJson);

            ipcRenderer.on("onSuccess", (_event, data) => resolve(data));
            ipcRenderer.on("onError", (_event, data) => reject(data));
        });
    },

    generateReportPdf: (imagePath) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("generateReport", imagePath);

            ipcRenderer.on("onSuccess", (_event, data) => resolve(data));
            ipcRenderer.on("onError", (_event, data) => reject(data));
        });
    },

    generateAppointmentPdf: (appointmentJson) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("generateAppointment", appointmentJson);

            ipcRenderer.on("onSuccess", (_event, data) => resolve(data));
            ipcRenderer.on("onError", (_event, data) => reject(data));
        });
    },

    generatePrescriptionPdf: (prescriptionJson) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("generatePrescription", prescriptionJson);

            ipcRenderer.on("onSuccess", (_event, data) => resolve(data));
            ipcRenderer.on("onError", (_event, data) => reject(data));
        });
    },
});