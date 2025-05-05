const { startPrintJobHandler } = require("./run-pjh");

let printJobHandler = null;

const USE_DEFAULT_PRINTER = "use_default_printer";
const USE_DEFAULT_PRINT_DIALOG = "use_default_print_dialog";
const USE_DEFAULT_LOCAL_PDF_VIEWER = "use_default_local_pdf_viewer";

function initPrintJobHandler(onDataCallback, onErrorCallback) {
    printJobHandler = startPrintJobHandler(onDataCallback, onErrorCallback);
}

async function sendToPrintJobHandler(input) {  
    return new Promise((resolve, reject) => {
        initPrintJobHandler((data) => {
            resolve(data);
            killPrintJobHandler();
        }, (err) => {
            reject(err);
            killPrintJobHandler();
        });

        if(!printJobHandler)
            reject(new Error("PrintJobHandler.exe has not initialized."));

        printJobHandler.stdin.write(input + "\n");
    });
}

async function printPdf(pdfPath, printMode) {
    return sendToPrintJobHandler(`${pdfPath.trim()},${printMode.trim()}`);
}

function killPrintJobHandler() {
    printJobHandler.kill();
}

module.exports = {
    USE_DEFAULT_PRINTER,
    USE_DEFAULT_PRINT_DIALOG,
    USE_DEFAULT_LOCAL_PDF_VIEWER,
    printPdf
};