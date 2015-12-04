// This file contains utility functions throughout the rest of the viz
// All of this was written from scratch.

// This is used in the ranking algorithm as the value of each stat
var statWeight = {
		"G": .05,
		"AB": .05,
		"AVG": 50,
		"R": .5,
		"hitterH": .5,
		'2B': .2,
		'3B': .2,
		"HR": .3,
		"RBI": .5,
		"SB": .4,
		"hitterSO": -.2,
		"hitterBB": .2,
		"W": .4,
		"ERA": -.2,
		"pitchBB": .4,
		"pitchH": .4,
		"pitchSO": .4,
		"SV": 3,
};

// Data types for the batter CSV
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

// Data types for pitcher CSV
function pitcherType(d) {
  d.W = +d.W;
  d.ERA = +d.ERA;
  d.pitchBB = +d.BB;
  d.pitchH = +d.H;
  d.pitchSO = +d.SO;
  d.SV = +d.SV;
  return d;
}

// Data types for team CSV
function teamType(d) {
  return d;
}


// Gets all the player data for a given year
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

// Gets all the available stats. Names taken directly from the database.
function getAllStatNames() {
	return ['AVG', 'G', 'AB', 'R', 'pitchH', 'hitterH', '2B', '3B', 'HR', 'RBI', 'SB', 'pitchSO', 'hitterSO', 'pitchBB', 'hitterBB', 'W', 'ERA', 'SV'];
}


// Gets the average stats for every player for a given year. This is because
// for each player, there are multiple data sets for a give year
// if they were on multliple teams.
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
		result[i] /= counts[i];
	}
	return result;
}

// Rounds to three (for displaying stats).
function roundToThree(num) {
	return Math.round(num * 1000) / 1000;
}

// Update displayed position to user
function updatePosition(position){

	document.getElementById("first-base").innerHTML = position;
}

// Update displayed team to user
function updateTeam(team){

	document.getElementById("third-base").innerHTML = team;
}

// Ranks the players by a weigthed sum of their stats and the weights assigned above
function sortPlayers(players, allPlayers) {
	players.sort(function(player1, player2) {
		var score1 = 0;
		var score2 = 0;
		var player1Data = allPlayers[player1].data[2014];
		var player2Data = allPlayers[player2].data[2014];
		for (var curStat in player1Data) {
			if(player1Data.hasOwnProperty(curStat) && typeof player1Data[curStat] === 'number') {
				score1 += statWeight[curStat] * player1Data[curStat];
			}
		}
		for (var curStat in player2Data) {
			if(player2Data.hasOwnProperty(curStat) && typeof player2Data[curStat] === 'number') {
				score2 += statWeight[curStat] * player2Data[curStat];
			}
		}
		return -(score1 - score2);
	});
	return players;
}