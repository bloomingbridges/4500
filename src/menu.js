// CONST /////////////////////////////////////////////////////////////
const APP = require("electron").app;
//////////////////////////////////////////////////////////////////////

// TEMPLATES /////////////////////////////////////////////////////////
const minimalTemplate = [
	{
		label: APP.name,
		showOn: ["darwin"],
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
	},
	{
    role: "window",
    submenu: [
      { role: "minimize" },
      { role: "close" },
      { role: "zoom", showOn: ["darwin"] },
      { type: "separator" },
      { role: "front", showOn: ["darwin"] }
    ]
  },
	{
    role: "help",
    showOn: ["darwin"],
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
];
//////////////////////////////////////////////////////////////////////

// EXPORTS ///////////////////////////////////////////////////////////
exports.template = minimalTemplate;
//////////////////////////////////////////////////////////////////////