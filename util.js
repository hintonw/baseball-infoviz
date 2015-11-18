// TODO this may need to be done for our data
function batterType(d) {
  d.G = +d.G;
  d.AB = +d.AB;
  d.AVG = +d.AVG;
  d.R = +d.R;
  d.hitterH = +d.H;
  d['2B'] = +d['2B'];
  d['3B'] = +d['3B'];
  d.HR = +d.HR;
  d.RBI = +d.RBI;
  d.SB = +d.SB;
  d.hitterSO = +d.SO;
  d.hitterBB = +d.BB;
  return d;
}

function pitcherType(d) {
  d.W = +d.W;
  d.ERA = +d.ERA;
  d.pitchBB = +d.BB;
  d.pitchH = +d.H;
  d.pitchSO = +d.SO;
  d.SV = +d.SV;
  return d;
}

function teamType(d) {
  return d;
}

function getPlayerDataForYear(year, allPlayers) {
	var result = [];
	var playerIds = Object.keys(allPlayers);
	for (var i = 0; i < playerIds.length; i++) {
		var playerId = playerIds[i];
		var player = allPlayers[playerId];
		var playerName = player.name;
		if (year in player.data) {
			var playerData = player.data[year];
			playerData.name = playerName;
			playerData.playerID = playerId;
			result.push(playerData);
		}
	}
	return result;
}

function getAllStatNames() {
	return ['AVG', 'G', 'AB', 'R', 'pitchH', 'hitterH', '2B', '3B', 'HR', 'RBI', 'SB', 'pitchSO', 'hitterSO', 'pitchBB', 'hitterBB', 'W', 'ERA', 'SV'];
}

function getAverageStatsForYear(year, allPlayers) {
	var result = [];
	var counts = Array.apply(null, Array(getAllStatNames().length)).map(function (_, i) {return 0;});
	var playerIds = Object.keys(allPlayers);
	for (var i = 0; i < playerIds.length; i++) {
		var playerId = playerIds[i];
		var player = allPlayers[playerId];
		var playerName = player.name;
		if (year in player.data) {
			var playerData = player.data[year];
			for (var j = 0; j < getAllStatNames().length; j++) {
				var stat = getAllStatNames()[j];
				if (playerData[stat] !== undefined && !isNaN(playerData[stat])) {
					if (result[j] === undefined) {
						result[j] = playerData[stat];
					} else {
						result[j] += playerData[stat];
					}
					counts[j] += 1;
				}
			}
		}
	}
	
	for (var i = 0; i < result.length; i++) {
		console.log(result[i]);
		console.log(counts[i]);
		result[i] /= counts[i];
	}
	return result;
}

function roundToThree(num) {
	return Math.round(num * 1000) / 1000;
}

function myFunction(){

	document.getElementById("first-base").innerHTML = "YOU CLICKED ME!";
}