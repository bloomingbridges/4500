// MODULES ///////////////////////////////////////////////////////////
const APP = require('electron').app
    , IPC = require('electron').ipcMain
    , WIN = require('electron').BrowserWindow
    , MENU = require('electron').Menu
    , PATH = require('path')
    , STORE = require('electron-store')
    , MENU_TEMPLATE = require('./menu').template;
//////////////////////////////////////////////////////////////////////

// APP LIFECYCLE /////////////////////////////////////////////////////
// APP LIFECYCLE - WHEN_READY ////////////////////////////////////////
APP.whenReady().then(() => {
  createWindow()
  APP.on('activate', function () {
    if (WIN.getAllWindows().length === 0) createWindow()
  })
})
// APP LIFECYCLE - ON_WINDOW-ALL-CLOSED //////////////////////////////
APP.on('window-all-closed', function () {
  if (process.platform !== 'darwin') APP.quit()
})
//////////////////////////////////////////////////////////////////////

// WINDOWS ///////////////////////////////////////////////////////////
// WINDOWS - CREATE_WINDOW ///////////////////////////////////////////
function createWindow() {
  let 有 = new STORE().get('source');
  global.mainWindow = 有 ? createMainWindow() : createSetupWindow();
  let m = MENU.buildFromTemplate(MENU_TEMPLATE);
  MENU.setApplicationMenu(m);
}
// WINDOWS - CREATE_SETUP_WINDOW /////////////////////////////////////
function createSetupWindow() {
  let win =  new WIN({
    width: 320,
    height: 300,
    resizable: false,
    frame: false,
    show: false,
    backgroundColor: "#268bd2",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  win.once('ready-to-show', () => { win.show(); });
  win.loadFile(PATH.join(__dirname, 'setup', 'setup.html'));
  return win;
}
// WINDOWS - CREATE_MAIN_WINDOW //////////////////////////////////////
function createMainWindow() {
  let win = new WIN({
    width: 960,
    height: 360,
    show: false,
    backgroundColor: "#eee",
    autoHideMenuBar: true,
    webPreferences: {
      preload: PATH.join(__dirname, 'index', 'preload.js')
    }
  });
  win.once('ready-to-show', () => { win.show(); });
  // win.setMenuBarVisibility(false);
  win.loadFile(PATH.join(__dirname, 'index', 'index.html'));
  return win;
}
// WINDOWS - CREATE_HISTORY_WINDOW ///////////////////////////////////
function createHistoryWindow() {
  let win = new WIN({
    width: 640,
    height: 450,
    resizable: true,
    backgroundColor: "#a0f",
    webPreferences: {
      preload: PATH.join(__dirname, 'history', 'preload.js')
    }
  });
  win.loadFile(PATH.join(__dirname, 'history', 'history.html'));
  win.setMenuBarVisibility(false);
  return win;
}
//////////////////////////////////////////////////////////////////////

// IPC EVENTS ////////////////////////////////////////////////////////
// Used to communicate with renderer process /////////////////////////
// IPC EVENTS - PERFORM_ADDITIONAL_SETUP_TASKS ///////////////////////
IPC.handle('performAdditionalSetupTasks', ( event, args ) => {
  // console.log("Finishing setup.."); ///////////////////////////////
  let store = new STORE();
  store.set('source', '有');
  createWindow();
});
// IPC EVENTS - SHOW_HISTORY_WINDOW //////////////////////////////////
IPC.handle('showHistoryWindow', ( event, args ) => {
  global.historyWindow = createHistoryWindow();
  global.historyWindow.on('closed', ( event ) => {
    global.historyWindow = null;
  });
});
IPC.handle('updateHistoryWindow', ( event, args ) => {
  if (global.historyWindow && process.platform === 'darwin') 
    global.historyWindow.reload();
})
//////////////////////////////////////////////////////////////////////