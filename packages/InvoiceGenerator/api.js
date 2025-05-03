const { startJavaApp } = require("./run-java");

let javaProc = null;

function initInvoiceGenerator() {
    javaProc = startJavaApp((data) => {
        console.log("[Java Output]: ", data);
    }, (error) => {
        console.log("[Java Error]: ", error);
    });
}

async function sendToInvoiceGenerator(input) {
    return new Promise((resolve, reject) => {
        if(!javaProc)
            reject(new Error("invoice_manager.jar has not initialized"));

        javaProc.stdin.write(input + "\n");

        javaProc.stdout.on("data", (data) => {
            resolve(data.toString());
        });

        javaProc.stderr.on("data", (data) => {
            reject(data.toString());
        });
    });
}

async function generatePdf(invoiceJson) {
    return sendToInvoiceGenerator("generateInvoice:" + invoiceJson);
} 

function killInvoiceGeneratorProcess() {
    javaProc.kill();
}

module.exports = {
    initInvoiceGenerator,
    generatePdf,
    killInvoiceGeneratorProcess,
};