// TODO this may need to be done for our data
function batterType(d) {
  d.G = +d.G;
  d.AB = +d.AB;
  d.R = +d.R;
  d.H = +d.H;
  d['2B'] = +d['2B'];
  d['3B'] = +d['3B'];
  d.HR = +d.HR;
  d.RBI = +d.RBI;
  d.SB = +d.SB;
  d.SO = +d.SO;
  d.BB = +d.BB;
  return d;
}

function pitcherType(d) {
  d.W = +d.W;
  d.ERA = +d.ERA;
  d.BB = +d.BB;
  d.H = +d.H;
  d.SO = +d.SO;
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

function myFunction(){

	document.getElementById("first-base").innerHTML = "YOU CLICKED ME!";
}