// MODULES ///////////////////////////////////////////////////////////
const DIALOG = require('electron').remote.dialog
		, SHELL  = require('electron').shell
		, STORE  = require('electron-store')
		, POUCH  = require('pouchdb-browser')
		, XLSX   = require('xlsx')
		, IPC    = require('electron').ipcRenderer
		, FS     = require('fs');
//////////////////////////////////////////////////////////////////////

// UI ////////////////////////////////////////////////////////////////
// UI - (() => {})(); ////////////////////////////////////////////////
(() => {
	let openBTN = document.getElementById('open')
		, link = document.getElementById('store-link');
	openBTN.addEventListener('click', selectSpreadsheet);
	link.addEventListener('click', function( event ) {
		event.preventDefault();
		SHELL.openExternal(event.target.href);
	});
})();
// UI - SELECT_SPREADSHEET ///////////////////////////////////////////
function selectSpreadsheet( event ) {
	event.target.disabled = true;
	let files = DIALOG.showOpenDialogSync({
		filters: [{ name: "Spreadsheet", extensions: ['xlsx'] }], 
		properties: ['openFile'],
		buttonLabel: 'Import'
	});
	if (files) {
		parseSpreadsheet(files[0]);
	} else {
		event.target.disabled = null; return;
	}
}
//////////////////////////////////////////////////////////////////////

// SETUP /////////////////////////////////////////////////////////////
// SETUP - PARSE_SPREADSHEET /////////////////////////////////////////
function parseSpreadsheet( path ) {
	let workbook = XLSX.readFile(path);
	let worksheet = workbook.Sheets[workbook.SheetNames[0]];
	if (worksheet['A1'].v !== '単語' || 
			worksheet['B1'].v !== 'Sentence') {
		alert("This file does not resemble the required document.");
		return;
	}
	fillSourceDatabase(worksheet);
}
// SETUP - FILL_SOURCE_DATABASE //////////////////////////////////////
function fillSourceDatabase( src ) {
	let max = 4500
		, db = new POUCH('source')
		, status = document.getElementById('status');
	var docs = [], doc = {}, r = 2, a, b;
	status.classList.add('loading');
	for ( r; r < max + 2; r++ ) {
		// console.log(src[`A${r}`], src[`B${r}`]); //////////////////////
		a = src[`A${r}`];
		b = src[`B${r}`];
		doc = {
			"_id": `r${r-1}`,
			"tango": a.v,
			"sentence": (b) ? b.v : ""
		};
		docs.push(doc);
	}
	db.bulkDocs(docs).then(() => {
		new POUCH('translations');
		IPC.invoke('performAdditionalSetupTasks');
		window.close();
	}).catch(( error ) => {
		console.log(error.message);
	});
}
//////////////////////////////////////////////////////////////////////