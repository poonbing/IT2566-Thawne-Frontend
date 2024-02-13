const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  showDialog: () => {
      ipcRenderer.send('show-dialog');
  },
   onUpdateCounter: (callback) => 
   ipcRenderer.on('set-safe-mode', (_event, value) => callback(value)),
});