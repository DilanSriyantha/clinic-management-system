const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require("child_process");
const fs = require("fs");
const InvoiceGenerator = require("./packages/InvoiceGenerator/api");
const Printer = require("./packages/PrintJobHandler/api");

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

    javaProcess = spawn("java", ["-jar", jarPath, "--spring.profiles.active=prod"], {
        detached: false,
        stdio: "pipe",
        env: process.env
    });

    console.log(javaProcess.spawnargs);

    javaProcess.stdout.on("data", (data) => {
        console.log(`Java Backend PID:${javaProcess.pid} Out: ${data}`);
        handleExit(`${data}`);
        // handleServerStarted(`${data}`);
        handleServerStarted("Tomcat started");
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
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
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
    // startJavaProcess();
    loadFrontend();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            // startJavaProcess();
            loadFrontend();
        }
    });

    ipcMain.on("generateInvoice", async (event, invoiceJson) => {
        InvoiceGenerator.generatePdf(invoiceJson)
            .then((res) => {
                console.log(res);
                Printer.printPdf(res, Printer.USE_DEFAULT_PRINT_DIALOG)
                    .then((r) => {
                        console.log(r);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
                event.reply("onSuccess", res);
            })
            .catch((err) => {
                event.reply("onError", err);
            });
    });
});

app.on('window-all-closed', () => {
    app.quit();

    if(!javaProcess) return;
    javaProcess.stdin.write("exit");
    javaProcess.stdin.end();
});