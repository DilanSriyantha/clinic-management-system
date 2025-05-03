const path = require("path");
const { spawn } = require("child_process");

const javaAppPath = path.join(__dirname, "bin", "invgen.jar");

function startJavaApp(onDataCallback, onErrorCallback) {
    const javaProcess = spawn("java", ["-jar", javaAppPath]);

    javaProcess.stdout.on("data", (data) => {
        onDataCallback(data.toString()); 
    });

    javaProcess.stderr.on("data", (data) => {
        onErrorCallback(data.toString());
    });

    javaProcess.on("close", (code) => {
        console.log("java process exited with code " + code);
    });

    return javaProcess;
}

module.exports = { startJavaApp };