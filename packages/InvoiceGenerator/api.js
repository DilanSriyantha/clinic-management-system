const { startJavaApp } = require("./run-java");

let javaProc = null;

function initInvoiceGenerator(onDataCallback, onErrorCallback) {
    javaProc = startJavaApp(onDataCallback, onErrorCallback);
}

async function sendToInvoiceGenerator(input) {
    return new Promise((resolve, reject) => {
        initInvoiceGenerator((data) => {
            resolve(data);
            killInvoiceGeneratorProcess();
        }, (error) => {
            reject(error);
            killInvoiceGeneratorProcess();
        });
        
        if(!javaProc)
            reject(new Error("invoice_manager.jar has not initialized"));

        javaProc.stdin.write(input + "\n");
    });
}

async function generatePdf(invoiceJson) {
    return sendToInvoiceGenerator("generateInvoice:" + invoiceJson);
} 

function killInvoiceGeneratorProcess() {
    javaProc.kill();
}

module.exports = {
    generatePdf
};