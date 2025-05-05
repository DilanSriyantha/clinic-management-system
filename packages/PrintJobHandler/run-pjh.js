const path = require("path");
const { spawn } = require("child_process");

const printJobHandlerPath = path.join(__dirname, "bin", "PrintJobHandler", "bin", "Release", "PrintJobHandler.exe");

function startPrintJobHandler(onDataCallback, onErrorCallback) {
    const printJobHandlerProcess = spawn(printJobHandlerPath, [], {
        stdio: 'pipe',
        shell: false
    });

    printJobHandlerProcess.stdout.on("data", (data) => {
        onDataCallback("[PrintJobHandler]: " + data.toString());
    });

    printJobHandlerProcess.stderr.on("data", (data) => {
        onErrorCallback("[PrintJobHandler]: " + data.toString());
    });

    printJobHandlerProcess.on("close", (code) => {
        console.log("[PrintJobHandler]: exited with code " + code);
    });

    return printJobHandlerProcess;
}

module.exports = { startPrintJobHandler };