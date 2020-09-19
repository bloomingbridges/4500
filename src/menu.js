const { app } = require("electron");
const minimalTemplate = [
	{
		label: app.name,
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
        label: 'GitHubで見る',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/bloomingbridges/4500')
        }
      }
    ]
  }
];
exports.template = minimalTemplate;