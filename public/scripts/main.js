var API_ROOT = "/cgi-bin/";

var mostRecentCrashDate;

main();


function main(){
	setInterval(updateCrashes, 15*60*1000);
	updateCrashes();

	connectEvents();
}

function connectEvents(){
	window.addEventListener("message", function(event){
		var data = event.data;

		if(data.powermate && data.powermate.buttonPressed){
			mostRecentCrashDate = new Date();
			render();
		}
	}, false);
}

function updateCrashes(){
	$.getJSON(API_ROOT+'crashes/xcode?limit=1')
		.done(function(crashes){
			if(crashes.length){
				mostRecentCrashDate = new Date(crashes[0].date);
			}
			render();
		});
}

function render(){
	var daysSinceLastCrash;
	var counterEl = $('.counter');
	var unitsEl = $('.caption .units.days');

	if(mostRecentCrashDate){
		daysSinceLastCrash = moment().startOf('day').diff(moment(mostRecentCrashDate).startOf('day'), 'days');
	} else {
		daysSinceLastCrash = '?';
	}

	counterEl.text(daysSinceLastCrash);
	unitsEl.text((daysSinceLastCrash === 1) ? "day" : "days");
}