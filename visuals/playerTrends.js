// This file is responsible for drawing the trend lines.
// I looked at many different resources throughout the web
// for inspiration and took bits of pieces of code and
// adapted them for my own needs. I will label the websites
// where applicable

// Stores the players that are currently being displayed
var currentTrendPlayers = [];
// Current stat being displayed
var currentStat = "AVG";

// Set up the margins for this viz
var margin_trend = {top: 30, right: 20, bottom: 30, left: 50},
	width_trend = 800 - margin_trend.left - margin_trend.right,
	height_trend = 270 - margin_trend.top - margin_trend.bottom;

// The x axis plots the year of the players
var x_trend = d3.scale.ordinal().rangeRoundBands([0, width_trend - 200]);
// The y axis is the stat value
var y_trend = d3.scale.linear().range([height_trend, 0]);

var xAxis_trend = d3.svg.axis().scale(x_trend)
    .orient("bottom");
var yAxis_trend = d3.svg.axis().scale(y_trend)
    .orient("left").ticks(5);

// Create the trend chart
var svg_trend = d3.select("#trendsChart")
	.append("svg")
	.attr("width", width_trend + margin_trend.left + margin_trend.right)
	.attr("height", height_trend + margin_trend.top + margin_trend.bottom)
	.append("g")
	.attr("transform", "translate(" + margin_trend.left + "," + margin_trend.top + ")");

// Stores the player data
var allPlayers_trend;
// Stores the current x axis values
var years_trend = abbreviate(rangeOf(2000, 2014));
// Stores the current colors used
var colors_trend;
// Create and append an element for adding the DoD circles to
var circlesG = svg_trend.append("g")                            
				  .style("display", "none");


// Initializes the trend chart
function drawTrendChart() {
	
	// Set x and y axis domains
    x_trend.domain(years_trend);
    y_trend.domain([0, .5]);

    // Add the x axis
    svg_trend.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_trend + ")")
        .call(xAxis_trend);

    // Add the y axis
    svg_trend.append("g")
        .attr("class", "y axis")
        .call(yAxis_trend)
        .append("text")
          .attr("class", "y label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("AVG");

    // Adding the legend holder
    svg_trend.append("g")
	    .attr("class", "legendOrdinal")
	    .attr("transform", "translate(" + (width_trend - 150) + ",50)");

    // Add the stat selection drop down box
    d3.select('#trendsPicker')
	    .append('p')
	    .append('select')
	      .attr('class','trendSelect')
	      .on('change',function() {
	    	  // Whenever a new on eis selected, update the trend and bar chart.
	    	  currentStat = d3.select('.trendSelect').property('value');
        	  updateChart(currentStat);
        	  updateBarChart(currentTrendPlayers[0], currentStat); 
          })
	    .selectAll('option')
	      .data(getAllStatNames()).enter()
	      .append('option')
	        .text(function(d) {return d;});

    // Canvas for the trend chart
    svg_trend.append("rect")
        .attr("width", width_trend)  
        .attr("height", height_trend)
        .style("fill", "none")       
        .style("pointer-events", "all") 
        .on("mouseover", function() { circlesG.style("display", null); })
        .on("mouseout", function() { circlesG.style("display", "none"); })
        .on("mousemove", mousemove);    

    
    
    // This resources was helpful for the DoD:http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
    // Some of it is directly imported, but the function to figure out which tick it
    // was over needed to be changed a lot
    function mousemove() {
    	if (circlesG.selectAll("circle").size() != currentTrendPlayers.length) return;
    	
    	var xPos = d3.mouse(this)[0];
        var leftEdges = x_trend.range();
        var width = x_trend.rangeBand();
        var j;
        for(j=0; xPos > (leftEdges[j] + width); j++) {}
        // do nothing, just increment j until case fails
        // at the end, we will get the j of the x tick that the mouse is over
            

        // Go through each of the currently displayed players
        // and update the DoD
        for (var t = 0; t < currentTrendPlayers.length; t++) {
        	
        	// Find the current players current stat for the year that were over
        	var data = getDataFor(currentTrendPlayers[t]);
        	var curYear = abbrvToYear(years_trend[j]);
        	var curStat = null;
        	for (var r = 0; r < data.length; r++) {
        		if (data[r].year == curYear) {
        			curStat = data[r][currentStat];
        		}
        	}
        	
        	if (curStat == null) continue;
        	
        	// Update the circle for the player
        	circlesG.select("circle.y" + t)                         
            	.attr("transform",                           
                      "translate(" + (x_trend(abbreviate([curYear])) + x_trend.rangeBand()/2) + "," +       
                                     y_trend(curStat) + ")");  
        	
        	// Update the text for the player
        	circlesG.select("text.y1" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(abbreviate([curYear])) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(roundToThree(curStat));
        	
	        circlesG.select("text.y2" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(abbreviate([curYear])) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(roundToThree(curStat));
        }
    }
}

// Registers the data with the chart when its finished
function registerTrendPlayers(allPlayers) {
	allPlayers_trend = allPlayers;
}

// Called to update the chart whenever modifications happen
// Essentially just redraws everything that way
// we can just call it whenever we make changes
function updateChart(newStat) {
	
	var maxStat = 1;
	var range = abbreviate(rangeOf(2000, 2014));
	if (currentTrendPlayers.length != 0) {
		// Get the max stat and range of the axises
		// so that we know what the knew axis should
		// be moved to
		maxStat = maxStatValue(newStat);
		range = getMaxRange();
	}
	
	years_trend = range;
    // Scale the range of the data again
    x_trend.domain(range);
    // leave a little extra space at the top to reduce clutter
    y_trend.domain([0, maxStat * 1.5]);

    // Select the section we want to apply our changes to
    var svg = d3.select("#trendsChart").transition();
 
    // change the x axis
    svg.select(".x.axis")
        .duration(750)
        .call(xAxis_trend);
 
    // change the y axis
    svg.select(".y.axis")
        .duration(750)
        .call(yAxis_trend);
    svg.select(".y.label")
    	.duration(750)
    	.text(newStat);
    
    // Get the new colors
    colors_trend = colorArray(currentTrendPlayers.length);
    // Remove everything and redraw it
    circlesG.selectAll("circle").remove();
    circlesG.selectAll("text").remove();
    
    // Redraw everything
    for (var i = 0; i < currentTrendPlayers.length; i++) {
    	var player = currentTrendPlayers[i];
    	var playerData = getDataFor(player);
    	
        svg.select(".line" + player)
            .duration(750)
            .attr("d", makeLineWith(playerData))
            .style("stroke", colors_trend[i])
            .style("stroke-width", 3);
        
        circlesG.append("circle")                                
	        .attr("class", "y" + i)                              
	        .style("fill", "none")                           
	        .style("stroke", "blue")                         
	        .attr("r", 4);
        
        circlesG.append("text")
	        .attr("class", "y1" + i)
	        .style("stroke", "white")
	        .style("stroke-width", "3.5px")
	        .style("opacity", 0.8)
	        .attr("dx", 8)
	        .attr("dy", "-.3em");
        circlesG.append("text")
	        .attr("class", "y2" + i)
	        .attr("dx", 8)
	        .attr("dy", "-.3em");
    }
    
    // 
    var ordinal = d3.scale.ordinal()
    	.domain(currentTrendPlayers.map(function(d) {
    		return allPlayers_trend[d].name;
    	}))
    	.range(colors_trend);
	
    // Update the legend using http://bl.ocks.org/ZJONSSON/3918369
	var legendOrdinal = d3.legend.color()
	    .shape("path", d3.svg.symbol().type("triangle-up").size(100)())
	    .shapePadding(10)
	    .scale(ordinal);
	
	svg_trend.select(".legendOrdinal")
	    .call(legendOrdinal);

}

// Function to add a player to the trend chart
function addPlayerTrend(player) {
	if (player in currentTrendPlayers) return;
	
	currentTrendPlayers.push(player);
	
	// This resource was useful when working with lines: http://bl.ocks.org/mbostock/3883245
	// We append the path when a player is added, then modify
	// everything in updateChart called below
	svg_trend.append("path").attr("class", "line" + player).attr("fill", "none");
	
	updateChart(currentStat);
}

// Function to remove a player from the trend chart
function removePlayerTrend(player) {
	var index = currentTrendPlayers.indexOf(player);
	if (index > -1) {
	    currentTrendPlayers.splice(index, 1);
	    svg_trend.select(".line" + player).remove();
	    updateChart(currentStat);
	}
}

// Makes the line for the given player
function makeLineFor(player) {
	var valueline = d3.svg.line()
	    .x(function(d) { return x_trend(abbreviate([d.year])); })
	    .y(function(d) {
	    	// If we dont have the stat, set it to 0
	    	if (d[currentStat] === undefined || d[currentStat] === NaN) {
	    		return y_trend(0.0);
	    	}
	    	return y_trend(d[currentStat]);
	       });
	
	return valueline(getDataFor(player));
}

// Make line given a specific data set
function makeLineWith(data) {
	var valueline = d3.svg.line()
	    .x(function(d) { return x_trend(abbreviate([d.year])) + + x_trend.rangeBand()/2; })
	    .y(function(d) {
	    	if (d[currentStat] === undefined || d[currentStat] === NaN) {
	    		console.log("here");
	    		return y_trend(0.0);
	    	}
	    	return y_trend(d[currentStat]);
	       });
	
	return valueline(data);
}

// Gets data for a given player for a certain year
function getDataFor(player) {
	var res = [];
	var years = Object.keys(allPlayers_trend[player].data);
	for (var i = 0; i < years.length; i++) {
		var year = years[i];
		var d = shallowCopy(allPlayers_trend[player].data[year]);
		d.year = parseInt(year);
		d.name = allPlayers_trend[player].name;
		res.push(d);
	}
	return res;
}

// Get the appreviated year (07, 94) and turn it
// into a number for the axises to take
function abbrvToYear(abbrvYearStr) {
	var abbrvYear = parseInt(abbrvYearStr.slice(1));
	if (abbrvYear < 50) {
		return 2000 + abbrvYear;
	} else {
		return 1900 + abbrvYear;
	}
}

// Just generates a range of numbers
function rangeOf(from, to) {
	var res = [];
	for (var i = from; i <= to; i++) {
		res.push(i);
	}
	return res;
}

// Gets the max value over all players for a given stat
function maxStatValue(stat) {
	var max = 0;
	for (var i = 0; i < currentTrendPlayers.length; i++) {
		var player = currentTrendPlayers[i];
		var years = Object.keys(allPlayers_trend[player].data);
		for (var j = 0; j < years.length; j++) {
			var year = years[j];
			if (!isNaN(allPlayers_trend[player].data[year][stat])) {
				max = Math.max(max, allPlayers_trend[player].data[year][stat]);
			}
		}
	}
	if (isNaN(max) || max == 0) return 1;
	return max;
}

// Gets the max years displayed, which is to say
// the earliest and latest year to capture all of the 
// current players' careers
function getMaxRange() {
	var max = 0;
	var min = 2016;
	for (var i = 0; i < currentTrendPlayers.length; i++) {
		var player = currentTrendPlayers[i];
		var years = Object.keys(allPlayers_trend[player].data);
		for (var j = 0; j < years.length; j++) {
			var year = years[j];
			max = Math.max(max, year);
			min = Math.min(min, year);
		}
	}
	return abbreviate(rangeOf(min, max));
}

// Abbreviate a year range to be shorted to things like '07 and '94
function abbreviate(yearRange) {
	var result = [];
	for (var i = 0; i < yearRange.length; i++) {
		var curYear = yearRange[i];
		result.push("'" + curYear.toString().slice(2));
	}
	return result;
}

// Shallow copy an object
function shallowCopy(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
        if(oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
}

// generate colors
function colorArray(n) {
	var res = [];
	var color = d3.scale.category10();
	for (var i = 0; i < n; i++) {
		res.push(color(i));
	}
	return res;
}