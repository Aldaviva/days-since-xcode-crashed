var API_ROOT = "/cgi-bin/";
var CRASH_NAME = "xcode";

var ACHIEVEMENTS = [
	 { name: "contra",                     hours:    0.168 },
	 { name: "transcontinental blackbird", hours:    1.132 },
	 { name: "energetic",                  hours:    5.000 },
	 { name: "business day",               hours:    8.000 },
	 { name: "NSRangeException",           hours:   10.000 },
	 { name: "daily restart",              hours:   24.000 },
	 { name: "cannonball run",             hours:   28.842 },
	 { name: "a full deck",                hours:   52.000 },
	 { name: "titanic voyage",             hours:   87.800 },
	 { name: "to the moon",                hours:  102.750 },
	 { name: "eww",                        hours:  144.000 },
	 { name: "24/7",                       hours:  168.000 },
	 { name: "headcount",                  hours:  195.000 },
	 { name: "megasecond",                 hours:  277.778 },
	 { name: "fortnight",                  hours:  336.000 },
	 { name: "Xcode not found",            hours:  404.000 },
	 { name: "lunar cycle",                hours:  708.734 },
	 { name: "odometer rollover",          hours: 1000.000 },
	 { name: "updates available",          hours: 2064.000 },
	 { name: "revolution of mercury",      hours: 2111.111 },
	 { name: "Napoleon's Hundred Days",    hours: 2280.000 }
];

var mostRecentCrashDate;

main();


function main(){
	setInterval(updateCrashes, 15*60*1000);
	updateCrashes()
		.done(function(){
			setInterval(render, 60*1000);
		});

	connectEvents();
}

function connectEvents(){
	window.addEventListener("message", function(event){
		var data = event.data;

		if(data.powermate && data.powermate.buttonPressed){
			mostRecentCrashDate = new Date();
			render();
			$.post(API_ROOT+'crashes/'+CRASH_NAME);
		}
	}, false);
}

function updateCrashes(){
	return $.getJSON(API_ROOT+'crashes/'+CRASH_NAME+'?limit=1')
		.done(function(crashes){
			if(crashes.length){
				mostRecentCrashDate = new Date(crashes[0].date);
			}
			render();
		});
}

function render(){
	var hoursSinceLastCrash;
	var counterEl = $('.counter');
	var unitsEl = $('.caption .units');

	if(mostRecentCrashDate){
		hoursSinceLastCrash = moment().startOf('hour').diff(moment(mostRecentCrashDate).startOf('hour'), 'hours');
	} else {
		hoursSinceLastCrash = '?';
	}

	counterEl.text(hoursSinceLastCrash);
	unitsEl.text((hoursSinceLastCrash === 1) ? "hour" : "hours");

	renderArchievement();
}

function renderArchievement(){
	var hoursSinceLastCrash = moment().diff(mostRecentCrashDate, 'seconds')/60/60;
	var achievementEl = $('.achievement');
	var achievement = _(ACHIEVEMENTS)
		.filter(function(ach){
			return ach.hours < hoursSinceLastCrash;
		})
		.max("hours")
		.value();

	achievementEl.toggle(!!achievement);
	if(achievement){
		$('.achievement').text("achievement unlocked: "+achievement.name+" ("+achievement.hours+" hours)");
	}
}