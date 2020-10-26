// MODULES ///////////////////////////////////////////////////////////
const POUCH = require('pouchdb-browser');
//////////////////////////////////////////////////////////////////////

// DB ////////////////////////////////////////////////////////////////
	const SRC_DB = new POUCH('source')
			, HON_DB = new POUCH('translations');
//////////////////////////////////////////////////////////////////////

// HISTORY ///////////////////////////////////////////////////////////
// HISTORY - WRITE_HISTORY ///////////////////////////////////////////
async function writeHistory() {
	let translations = await HON_DB.allDocs({ include_docs: true} );
	let entries = translations.rows.length - 1
		, i = 0, o, t;
	let sources = await SRC_DB.allDocs({ 
		include_docs: true,
		limit: entries + 1
	} );
	// console.log(sources);
	for ( i; i <= entries; i++ ) {
		o = sources.rows[i];
		t = translations.rows[i];
		let section = document.createElement('SECTION')
			, h2 = document.createElement('H2')
			, h3 = document.createElement('H3');
		h2.innerText = o.doc.sentence;
		h3.innerText = t.doc.text;
		section.appendChild(h2);
		section.appendChild(h3);
		if (document.body.children.length > 0)
			document.body.insertBefore(section, document.body.firstChild);
		else 
			document.body.appendChild(section);
	}
}
//////////////////////////////////////////////////////////////////////

// DOM_CONTENT_LOADED ////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', () => {
	writeHistory();
});
//////////////////////////////////////////////////////////////////////