const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  showDialog: () => {
      ipcRenderer.send('show-dialog');
  }
});