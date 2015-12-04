// This code is responsible for reading the raw data into data files.
// All of this was created entirely from scratch.

drawTrendChart();
drawBarChart(); 
drawPlayerPicker();

d3.csv("raw_data/2014/Master.csv", function(error1, master) {
	
	d3.csv("raw_data/2014/Batting.csv", batterType, function(error1, batters) {
	
		d3.csv("raw_data/2014/Pitching.csv", pitcherType, function(error2, pitchers) {
			
			d3.csv("raw_data/2014/Fielding.csv", function(error2, positions) {
	
	
			  var allPlayers = {};
			  
			  // Initialize the map of all players with their name
			  for (var i = 0; i < master.length; i++) {
				  // Quick check to see if they are retired
				  if (currentlyPlays(master[i].finalGame)) {
					  allPlayers[master[i].playerID] = {name : master[i].nameFirst + " " + master[i].nameLast, data : {}};
				  }
			  }
			  
			  // Add all pitcher data
			  for (var i = 0; i < pitchers.length; i++) {
				  // Check if player is in our data or not (not retired).
				  if (pitchers[i].playerID in allPlayers) {
					  var year = pitchers[i].yearID;
					  var player = pitchers[i];
					  // Weve already seen this player. This is a new team in the same year
					  if (year in allPlayers[pitchers[i].playerID].data) {
						  var curERA = allPlayers[pitchers[i].playerID].data[year].ERA;
						  allPlayers[pitchers[i].playerID].data[year].isPitcher = true;
						  allPlayers[pitchers[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[pitchers[i].playerID].data[year].W += player.W;
						  allPlayers[pitchers[i].playerID].data[year].ERA = (player.ERA + (curERA * (player.stint - 1))) / player.stint;
						  allPlayers[pitchers[i].playerID].data[year].pitchBB += player.pitchBB;
						  allPlayers[pitchers[i].playerID].data[year].pitchH += player.pitchH;
						  allPlayers[pitchers[i].playerID].data[year].pitchSO += player.pitchSO;
						  allPlayers[pitchers[i].playerID].data[year].SV += player.SV;
					  // First time seeing this year
					  } else {
						  allPlayers[pitchers[i].playerID].data[year] = {};
						  allPlayers[pitchers[i].playerID].data[year].isPitcher = true;
						  allPlayers[pitchers[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[pitchers[i].playerID].data[year].W = player.W;
						  allPlayers[pitchers[i].playerID].data[year].ERA = player.ERA;
						  allPlayers[pitchers[i].playerID].data[year].pitchBB = player.pitchBB;
						  allPlayers[pitchers[i].playerID].data[year].pitchH = player.pitchH;
						  allPlayers[pitchers[i].playerID].data[year].pitchSO = player.pitchSO;
						  allPlayers[pitchers[i].playerID].data[year].SV = player.SV;
					  }
				  }
			  }
			  
			  // Add all batter data
			  for (var i = 0; i < batters.length; i++) {
				// Check if player is in our data or not (not retired)
				  if (batters[i].playerID in allPlayers) {
					  var year = batters[i].yearID;
					  var player = batters[i];
					  if (allPlayers[batters[i].playerID].data[year] !== undefined && allPlayers[batters[i].playerID].data[year].isPitcher) {
						  // Dont want pitcher hit stats
						  continue;
					  }
					  // Weve already seen this player. This is a new team in the same year
					  if (year in allPlayers[batters[i].playerID].data) {
						  allPlayers[batters[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[batters[i].playerID].data[year].G += player.G;
						  allPlayers[batters[i].playerID].data[year].AB += player.AB;
						  allPlayers[batters[i].playerID].data[year].R += player.R;
						  allPlayers[batters[i].playerID].data[year].hitterH += player.hitterH;
						  allPlayers[batters[i].playerID].data[year].AVG = allPlayers[batters[i].playerID].data[year].hitterH / allPlayers[batters[i].playerID].data[year].AB;
						  allPlayers[batters[i].playerID].data[year]['2B'] += player['2B'];
						  allPlayers[batters[i].playerID].data[year]['3B'] += player['3B'];
						  allPlayers[batters[i].playerID].data[year].HR += player.HR;
						  allPlayers[batters[i].playerID].data[year].RBI += player.RBI;
						  allPlayers[batters[i].playerID].data[year].SB += player.SB;
						  allPlayers[batters[i].playerID].data[year].hitterSO += player.hitterSO;
						  allPlayers[batters[i].playerID].data[year].hitterBB += player.hitterBB;
					  } else { // First time seeing this year
						  allPlayers[batters[i].playerID].data[year] = {};
						  allPlayers[batters[i].playerID].data[year].teamID = player.teamID;
						  allPlayers[batters[i].playerID].data[year].G = player.G;
						  allPlayers[batters[i].playerID].data[year].AB = player.AB;
						  allPlayers[batters[i].playerID].data[year].R = player.R;
						  allPlayers[batters[i].playerID].data[year].hitterH = player.hitterH;
						  allPlayers[batters[i].playerID].data[year].AVG = allPlayers[batters[i].playerID].data[year].hitterH / allPlayers[batters[i].playerID].data[year].AB;
						  allPlayers[batters[i].playerID].data[year]['2B'] = player['2B'];
						  allPlayers[batters[i].playerID].data[year]['3B'] = player['3B'];
						  allPlayers[batters[i].playerID].data[year].HR = player.HR;
						  allPlayers[batters[i].playerID].data[year].RBI = player.RBI;
						  allPlayers[batters[i].playerID].data[year].SB = player.SB;
						  allPlayers[batters[i].playerID].data[year].hitterSO = player.hitterSO;
						  allPlayers[batters[i].playerID].data[year].hitterBB = player.hitterBB;
					  }
				  }
			  }
			  
			  var allPositions = {};
			  
			  // Add position information to the player map
			  for (var i = 0; i < positions.length; i++) {
				  // check if player in our data
				  if (positions[i].playerID in allPlayers) {
					  var year = positions[i].yearID;
					  // check if the year is in our data
					  if (year in allPlayers[positions[i].playerID].data) {
						  // check if positions is initialized.
						  if ("positions" in allPlayers[positions[i].playerID].data[year]) {
							  allPlayers[positions[i].playerID].data[year].positions.push(positions[i].POS);
						  } else {
							  allPlayers[positions[i].playerID].data[year].positions = [positions[i].POS];
						  }
						  // add to map from position -> list of players
						  if (positions[i].POS in allPositions) {
							  allPositions[positions[i].POS].add(positions[i].playerID);
						  } else {
							  allPositions[positions[i].POS] = new Set();
							  allPositions[positions[i].POS].add(positions[i].playerID);
						  }
					  }
				  }
			  }
			  
			  loadTeams(allPlayers);
			  
			  // console.log(getPlayerDataForYear("2014", allPlayers));
			  
			  // Call all callbacks to draw the visualization
			  registerTrendPlayers(allPlayers);
			  registerBarPlayers(allPlayers);
			  registerPickerPlayers(allPlayers);
			  registerPositionsPicker(allPositions); 
			  drawPlayerPicker();
			});
		});
	  
	});
});

// Way to check if the player currently plays by checking the date of their last game
var currentlyPlays = function(lastGame) {
	return lastGame.indexOf("2014") != -1 || lastGame.indexOf("2013") != -1;
}