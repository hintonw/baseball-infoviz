d3.csv("raw_data/2014/Master.csv", function(error1, master) {
	
	d3.csv("raw_data/2014/Batting.csv", batterType, function(error1, batters) {
	
		d3.csv("raw_data/2014/Pitching.csv", pitcherType, function(error2, pitchers) {
			
			  
			  // TODO: get cumulative stats for players over all years in table
			  // TODO: filter out non-major teams and players who aren't around anymore
	
			  var allPlayers = {};
			  
			  // 
			  for (var i = 0; i < master.length; i++) {
				  if (currentlyPlays(master[i].finalGame)) {
					  allPlayers[master[i].playerID] = {name : master[i].nameGiven, data : {}};
				  }
			  }
			  
			  for (var i = 0; i < pitchers.length; i++) {
				  if (pitchers[i].playerID in allPlayers) {
					  var year = pitchers[i].yearID;
					  var player = pitchers[i];
					  if (year in allPlayers[pitchers[i].playerID].data) {
						  var curERA = allPlayers[pitchers[i].playerID].data[year].ERA;
						  allPlayers[pitchers[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[pitchers[i].playerID].data[year].W += player.W;
						  allPlayers[pitchers[i].playerID].data[year].ERA = (player.ERA + (curERA * (player.stint - 1))) / player.stint;
						  allPlayers[pitchers[i].playerID].data[year].BB += player.BB;
						  allPlayers[pitchers[i].playerID].data[year].H += player.H;
						  allPlayers[pitchers[i].playerID].data[year].SO += player.SO;
						  allPlayers[pitchers[i].playerID].data[year].SV += player.SV;
					  } else {
						  allPlayers[pitchers[i].playerID].data[year] = {};
						  allPlayers[pitchers[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[pitchers[i].playerID].data[year].W = player.W;
						  allPlayers[pitchers[i].playerID].data[year].ERA = player.ERA;
						  allPlayers[pitchers[i].playerID].data[year].BB = player.BB;
						  allPlayers[pitchers[i].playerID].data[year].H = player.H;
						  allPlayers[pitchers[i].playerID].data[year].SO = player.SO;
						  allPlayers[pitchers[i].playerID].data[year].SV = player.SV;
					  }
				  }
			  }
			  
			  for (var i = 0; i < batters.length; i++) {
				  if (batters[i].playerID in allPlayers) {
					  var year = batters[i].yearID;
					  var player = batters[i];
					  if (year in allPlayers[batters[i].playerID].data) {
						  allPlayers[batters[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[batters[i].playerID].data[year].G += player.G;
						  allPlayers[batters[i].playerID].data[year].AB += player.AB;
						  allPlayers[batters[i].playerID].data[year].R += player.R;
						  allPlayers[batters[i].playerID].data[year].H += player.H;
						  allPlayers[batters[i].playerID].data[year]['2B'] += player['2B'];
						  allPlayers[batters[i].playerID].data[year]['3B'] += player['3B'];
						  allPlayers[batters[i].playerID].data[year].HR += player.HR;
						  allPlayers[batters[i].playerID].data[year].RBI += player.RBI;
						  allPlayers[batters[i].playerID].data[year].SB += player.SB;
						  allPlayers[batters[i].playerID].data[year].SO += player.SO;
						  allPlayers[batters[i].playerID].data[year].BB += player.BB;
					  } else {
						  allPlayers[batters[i].playerID].data[year] = {};
						  allPlayers[batters[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[batters[i].playerID].data[year].G = player.G;
						  allPlayers[batters[i].playerID].data[year].AB = player.AB;
						  allPlayers[batters[i].playerID].data[year].R = player.R;
						  allPlayers[batters[i].playerID].data[year].H = player.H;
						  allPlayers[batters[i].playerID].data[year]['2B'] = player['2B'];
						  allPlayers[batters[i].playerID].data[year]['3B'] = player['3B'];
						  allPlayers[batters[i].playerID].data[year].HR = player.HR;
						  allPlayers[batters[i].playerID].data[year].RBI = player.RBI;
						  allPlayers[batters[i].playerID].data[year].SB = player.SB;
						  allPlayers[batters[i].playerID].data[year].SO = player.SO;
						  allPlayers[batters[i].playerID].data[year].BB = player.BB;
					  }
				  }
			  }
			  
			  console.log(allPlayers);
			  
			  loadTeams(allPlayers);
			  // drawPlayerPicker(allPlayers);
			  
			  // drawPlayerBarChart(allPlayers);
			  
			  // NOTE: batter and pitcher objects have different attributes
			  
		});
	  
	});
});

var currentlyPlays = function(lastGame) {
	return lastGame.indexOf("2014") != -1 || lastGame.indexOf("2013") != -1;
}