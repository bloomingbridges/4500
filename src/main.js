const {app, BrowserWindow, ipcMain} = require('electron')
const STORE = require('electron-store')
const PATH = require('path')

let mainWindow;

function createWindow () {
  let store = new STORE()
    , source = store.get('source');
  mainWindow = (source) ? createMainWindow() 
                        : createSetupWindow();
}

function createSetupWindow () {
  let win =  new BrowserWindow({
    width: 320,
    height: 300,
    resizable: false,
    frame: false,
    backgroundColor: "#268bd2",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  win.loadFile(PATH.join(__dirname, 'setup', 'setup.html'));
  return win;
}

function createMainWindow () {
  let win = new BrowserWindow({
    width: 960,
    height: 360,
    backgroundColor: "#eee",
    webPreferences: {
      preload: PATH.join(__dirname, 'index', 'preload.js')
    }
  });
  win.loadFile(PATH.join(__dirname, 'index', 'index.html'));
  return win;
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.handle('performAdditionalSetupTasks', ( event, args ) => {
  console.log("Finishing setup..");
  let store = new STORE();
  store.set('source', '有');
  createWindow();
});
