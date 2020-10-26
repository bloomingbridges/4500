// CONST /////////////////////////////////////////////////////////////
const APP = require("electron").app;
//////////////////////////////////////////////////////////////////////

// TEMPLATES /////////////////////////////////////////////////////////
const firstItemTemplateMac =  {
  label: APP.name,
  submenu: [
    { role: "about" },
    { type: "separator" },
    { role: "services" },
    { type: "separator" },
    { role: "hide" },
    { role: "hideothers" },
    { role: "unhide" },
    { type: "separator" },
    { role: "quit" }
  ]
};
const windowTemplateMac =  {
  role: "window",
  submenu: [
    { role: "minimize" },
    { role: "close" },
    { role: "zoom" },
    { type: "separator" },
    { role: "front" }
  ]
};
const windowTemplateWin =  {
  role: "window",
  submenu: [
    { role: "minimize" },
    { role: "close" }
  ]
};
const helpTemplate = {
  role: "help",
  submenu: [
    {
      label: "GitHubで見る",
      click: async () => {
        const { shell } = require('electron')
            , url = 'https://github.com/bloomingbridges/4500';
        await shell.openExternal(url);
      }
    },
    {
      label: "履歴を表示",
      accelerator: "Command+/",
      click: ( menuItem, browserWindow, event ) => { 
        if (browserWindow && browserWindow.title === '4500文')
          browserWindow.webContents.send('command', 'history');
      }
    }
  ]
}
//////////////////////////////////////////////////////////////////////

// FACTORIES /////////////////////////////////////////////////////////
function generateDefaultTemplate() {
  const isDarwin = process.platform === 'darwin';
  let t = [];
  if (isDarwin) t.push(firstItemTemplateMac);
  t.push( (isDarwin) ? windowTemplateMac : windowTemplateWin );
  t.push(helpTemplate);
  return t;
}
//////////////////////////////////////////////////////////////////////

// EXPORTS ///////////////////////////////////////////////////////////
exports.template = generateDefaultTemplate();
//////////////////////////////////////////////////////////////////////
