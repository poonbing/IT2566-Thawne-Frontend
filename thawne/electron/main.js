const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
 
const isDev = process.env.IS_DEV == "true" ? true : false;
 
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    frame: true,
    icon: path.join(__dirname, '..', 'public', 'icons', 'icon.ico'),

    

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })


  mainWindow.setContentProtection(true);

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
 
  mainWindow.loadURL(
    isDev
      ? 'https://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

}
 

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

