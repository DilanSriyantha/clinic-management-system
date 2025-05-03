const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("InvoiceGenerator", {
    generateInvoicePdf: (invoiceJson) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send("generateInvoice", invoiceJson);

            ipcRenderer.on("onSuccess", (event, data) => resolve(data));
            ipcRenderer.on("onError", (event, data) => reject(data));
        });
    },
});