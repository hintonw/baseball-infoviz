// This code is responsible for reading the raw data into data files.
// All of this was created entirely from scratch.

function loadTeams(players) {
	d3.csv("raw_data/2014/Teams.csv", function(error, teams) {
		
		var allTeams = {};
	
		for (var i = 0; i < teams.length; i++) {
		   if (teams[i].yearID == "2014") {
			  allTeams[teams[i].teamID] = {name : teams[i].name, players : {}};
		   }
		}
		
		var playerIds = Object.keys(players);
		for (var i = 0; i < playerIds.length; i++) {
			var playerId = playerIds[i];
			var player = players[playerId];
			var playerYears = Object.keys(player.data);
			for (var j = 0; j < playerYears.length; j++) {
				var year = playerYears[j];
				var playerTeamForYear = player.data[year].teamID;
				if (playerTeamForYear in allTeams) {
					if (year in allTeams[playerTeamForYear].players) {
						allTeams[playerTeamForYear].players[year].push(playerId);
					} else {
						allTeams[playerTeamForYear].players[year] = [playerId];
					}
				}
			}
		}
			
		console.log(allTeams);
		  
		registerTeamsPicker(allTeams);

	});
}