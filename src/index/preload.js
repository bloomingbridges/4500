const POUCH = require('pouchdb-browser')

global.connectToDB = function( name ) {
	return new POUCH(name);
}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

})
