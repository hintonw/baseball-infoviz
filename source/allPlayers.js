d3.csv("raw_data/2014/Master.csv", batterType, function(error1, master) {
	
	d3.csv("raw_data/2014/Batting.csv", batterType, function(error1, batters) {
	
		d3.csv("raw_data/2014/Pitching.csv", pictherType, function(error2, pitchers) {
			
			  
			  // TODO: get cumulative stats for players over all years in table
			  // TODO: filter out non-major teams and players who aren't around anymore
	
			  var allPlayers = [];
			  
			  // 
			  for (var i = 0; i < master.length; i++) {
				  
			  }
			  
			  // drawPlayerPicker(allPlayers);
			  
			  // drawPlayerBarChart(allPlayers);
			  
			  // NOTE: batter and pitcher objects have different attributes
			  
		});
	  
	});
});