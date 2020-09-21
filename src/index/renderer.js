// CONST /////////////////////////////////////////////////////////////
const SRC_DB = connectToDB('source')
		, HON_DB = connectToDB('translations')
		, INPUT = document.getElementById('input');
//////////////////////////////////////////////////////////////////////

// STATE /////////////////////////////////////////////////////////////
var progress;
//////////////////////////////////////////////////////////////////////

// UI ////////////////////////////////////////////////////////////////
// UI - (() => {})(); ////////////////////////////////////////////////
(function() {
	determineProgress();
	INPUT.addEventListener('blur', function( event ) {
		if (event.target.value === "") return;
		publishTranslation(event.target.v);
	});
	INPUT.addEventListener('keydown', function( event ) {
		if (event.target.value === "") return;
		if (event.keyCode === 13) {
			publishTranslation(event.target.v);
		}
	});
})();
// UI - PUBLISH_TRANSLATION //////////////////////////////////////////
function publishTranslation( t ) {
	// console.log("Publishing " + t); /////////////////////////////////
	let doc = {
		"_id": `t${progress}`,
		"text": INPUT.value
	};
	HON_DB.post(doc, ( error ) => {
		if (error) return;
		INPUT.value = "";
		progress += 1;
		determineProgress();
	});
}
//////////////////////////////////////////////////////////////////////

// PROGRESS //////////////////////////////////////////////////////////
// PROGRESS - DETERMINE_PROGRESS /////////////////////////////////////
function determineProgress() {
	HON_DB.info().then(function( info ) {
		// console.dir(info); ////////////////////////////////////////////
	  progress = info.doc_count + 1;
	  if (progress <= 4500) {
			nextChallenge();
	  } else {
	  	congratulate();
	  }
	});
}
// PROGRESS - NEXT_CHALLENGE /////////////////////////////////////////
function nextChallenge() {
	SRC_DB.get(`r${progress}`, ( error ) => {
		if (error) console.error(error.message);
	}).then(( doc ) => {
		document.getElementById('tango').innerText = doc.tango;
		document.getElementById('sentence').innerText = doc.sentence;
	});
}
// PROGRESS - CONGRATULATE ///////////////////////////////////////////
function congratulate() {
	// alert("You've reached the end!"); ///////////////////////////////
	document.body.innerHTML = `<section id="congrats">
		<h1>完全出来たおめでとうございます！</h1>
	</section>`;
}
//////////////////////////////////////////////////////////////////////