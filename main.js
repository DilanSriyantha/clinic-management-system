const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require("child_process");
const fs = require("fs");

var win = null;

const logFilePath = path.join(process.cwd(), "app.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

console.log = function(...args) {
    const message = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ");
    logStream.write(`${new Date().toISOString()} - ${message}\n`);

    process.stdout.write(message + "\n");
}

let javaProcess = null;

const startJavaProcess = () => {
    const jarPath = app.isPackaged
        ? path.join(process.resourcesPath, "be/backend.jar")
        : path.join("backend", "out", "artifacts", "backend_jar", "backend.jar");

    javaProcess = spawn("java", ["-jar", jarPath], {
        detached: false,
        stdio: "pipe"
    });

    javaProcess.stdout.on("data", (data) => {
        console.log(`Java Backend PID:${javaProcess.pid} Out: ${data}`);
        handleExit(`${data}`);
        handleServerStarted(`${data}`);
    });

    javaProcess.stderr.on("data", (data) => {
        console.log(`Java Backend PID:${javaProcess.pid} Error: ${data}`);
    });

    javaProcess.on("exit", (data) => {
        console.log(`java process PID:${javaProcess.pid} exists: ${data}`);
    });
}

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile("index.html");
    // win.loadFile('index.html');
    // Uncomment to open DevTools automatically
    // win.webContents.openDevTools()
}

function handleExit(data) {
    if(data.trim() == "exit_code: 0")
        if(process.platform !== "darwin")
            app.quit();
}

function handleServerStarted(data) {
    if(data.trim().includes("Tomcat started")){
        loadFrontend();
    }
}

function loadFrontend() {
    if(app.isPackaged)
        win.loadFile(path.join(__dirname, "renderer/index.html"));
    else
        win.loadURL("http://localhost:5173/");
}

app.whenReady().then(() => {
    createWindow();
    startJavaProcess();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            startJavaProcess();
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
    javaProcess.stdin.write("exit");
    javaProcess.stdin.end();
});