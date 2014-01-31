var API_ROOT = "/cgi-bin/";
var CRASH_NAME = "xcode";

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
		hoursSinceLastCrash = Math.floor(getHoursSinceLastCrash());
	} else {
		hoursSinceLastCrash = '?';
	}

	counterEl.text(hoursSinceLastCrash);
	unitsEl.text((hoursSinceLastCrash === 1) ? "hour" : "hours");

	renderArchievement();
}

function renderArchievement(){
	var hoursSinceLastCrash = getHoursSinceLastCrash();
	var achievementEl = $('.achievement');
	var achievement = _(ACHIEVEMENTS)
		.filter(function(ach){
			return ach.hours <= hoursSinceLastCrash;
		})
		.max("hours")
		.value();

	var isAchievement = _.isObject(achievement);
	achievementEl.toggle(isAchievement);
	if(isAchievement){
		$('.achievement').text("achievement unlocked: "+achievement.name+" ("+achievement.hours+" hours)");
	}
}

function getHoursSinceLastCrash(){
	return moment().diff(mostRecentCrashDate, 'seconds')/60/60;
}