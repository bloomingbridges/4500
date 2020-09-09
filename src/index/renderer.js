// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const SRC_DB = connectToDB('source')
		, HON_DB = connectToDB('translations')
		, INPUT = document.getElementById('input');

var progress;

function determineProgress() {
	HON_DB.info().then(function( info ) {
		// console.dir(info);
	  progress = info.doc_count + 1;
	  if (progress <= 4500) {
			nextChallenge();
	  } else {
	  	congratulate();
	  }
	});
}

function publishTranslation( t ) {
	console.log("Publishing " + t);
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

function nextChallenge() {
	SRC_DB.get(`r${progress}`, ( error ) => {
		if (error) console.error(error.message);
	}).then(( doc ) => {
		document.getElementById('tango').innerText = doc.tango;
		document.getElementById('sentence').innerText = doc.sentence;
	});
}

function congratulate() {
	// alert("You've reached the end!");
	document.body.innerHTML = `<section id="congrats">
		<h1>完全出来たおめでとうございます！</h1>
	</section>`;
}

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