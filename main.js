const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require("child_process");
let javaProcess = null;

const startJavaProcess = () => {
    const jarPath = app.isPackaged
        ? path.join(process.resourcesPath, "backend.jar")
        : path.join("backend", "out", "artifacts", "backend_jar", "backend.jar");

    javaProcess = spawn("java", ["-jar", jarPath], {
        detached: false,
        stdio: "pipe"
    });

    javaProcess.stdout.on("data", (data) => {
        console.log(`Java Backend PID:${javaProcess.pid} Out: ${data}`);
        handleExit(`${data}`);
    });

    javaProcess.stderr.on("data", (data) => {
        console.log(`Java Backend PID:${javaProcess.pid} Error: ${data}`);
    });

    javaProcess.on("exit", (data) => {
        console.log(`java process PID:${javaProcess.pid} exists: ${data}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL("http://localhost:5173/");
    // win.loadFile('index.html');
    // Uncomment to open DevTools automatically
    // win.webContents.openDevTools()
}

function handleExit(data) {
    if(data.trim() == "exit_code: 0")
        if(process.platform !== "darwin")
            app.quit();
}

app.whenReady().then(() => {
    startJavaProcess();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            startJavaProcess();
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    javaProcess.stdin.write("exit");
    javaProcess.stdin.end();
});