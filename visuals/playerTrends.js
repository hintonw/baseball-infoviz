var currentTrendPlayers = [];
var currentStat = "AVG";

var margin_trend = {top: 30, right: 20, bottom: 30, left: 50},
	width_trend = 600 - margin_trend.left - margin_trend.right,
	height_trend = 270 - margin_trend.top - margin_trend.bottom;

var x_trend = d3.scale.ordinal().rangeRoundBands([0, width_trend]);
var y_trend = d3.scale.linear().range([height_trend, 0]);

var xAxis_trend = d3.svg.axis().scale(x_trend)
    .orient("bottom");


var yAxis_trend = d3.svg.axis().scale(y_trend)
    .orient("left").ticks(5);

var svg_trend = d3.select("#trendsChart")
	.append("svg")
	.attr("width", width_trend + margin_trend.left + margin_trend.right)
	.attr("height", height_trend + margin_trend.top + margin_trend.bottom)
	.append("g")
	.attr("transform", "translate(" + margin_trend.left + "," + margin_trend.top + ")");

var allPlayers_trend;
var years_trend = rangeOf(2000, 2014);
var colors_trend;
var circlesG = svg_trend.append("g")                            
				  .style("display", "none");


function drawTrendChart() {
	
	
    x_trend.domain(years_trend);
    y_trend.domain([0, .5]);

//    svg.append("path").attr("class", "line") 
//        .attr("d", valueline(data));

    svg_trend.append("g")                     // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_trend + ")")
        .call(xAxis_trend);

    svg_trend.append("g")                     // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis_trend)
        .append("text")
          .attr("class", "y label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("AVG");
    
    svg_trend.append("g")
	    .attr("class", "legendOrdinal")
	    .attr("transform", "translate(" + (width_trend - 200) + ",0)");
    
    d3.select('#trendsPicker')
	    .append('p')
	    .append('select')
	      .attr('class','trendSelect')
	      .on('change',function() {
	    	  currentStat = d3.select('.trendSelect').property('value');
        	  updateChart(currentStat);
          })
	    .selectAll('option')
	      .data(getAllStatNames()).enter()
	      .append('option')
	        .text(function(d) {return d;});
    
    svg_trend.append("rect")
        .attr("width", width_trend)  
        .attr("height", height_trend)
        .style("fill", "none")       
        .style("pointer-events", "all") 
        .on("mouseover", function() { circlesG.style("display", null); })
        .on("mouseout", function() { circlesG.style("display", "none"); })
        .on("mousemove", mousemove);    

    function mousemove() {
    	if (circlesG.selectAll("circle").size() != currentTrendPlayers.length) return;
    	
    	var xPos = d3.mouse(this)[0];
        var leftEdges = x_trend.range();
        var width = x_trend.rangeBand();
        var j;
        for(j=0; xPos > (leftEdges[j] + width); j++) {}
            //do nothing, just increment j until case fails
            

        for (var t = 0; t < currentTrendPlayers.length; t++) {
        	
        	var data = getDataFor(currentTrendPlayers[t]);
        	var curYear = years_trend[j];
        	var curStat = null;
        	for (var r = 0; r < data.length; r++) {
        		if (data[r].year == curYear) {
        			curStat = data[r][currentStat];
        		}
        	}
        	
        	if (curStat == null) return;
        	
        	circlesG.select("circle.y" + t)                         
            	.attr("transform",                           
                      "translate(" + (x_trend(curYear) + x_trend.rangeBand()/2) + "," +       
                                     y_trend(curStat) + ")");  
        	
        	circlesG.select("text.y1" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(curYear) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(roundToThree(curStat));
	
	        circlesG.select("text.y2" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(curYear) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(roundToThree(curStat));
	
	        circlesG.select("text.y3" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(curYear) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(years_trend[j]);
	
	        circlesG.select("text.y4" + t)
	            .attr("transform",
	            		"translate(" + (x_trend(curYear) + x_trend.rangeBand()/2) + "," +       
                        y_trend(curStat) + ")")
	            .text(years_trend[j]);
        }
    }
}

function registerTrendPlayers(allPlayers) {
	allPlayers_trend = allPlayers;
}

function updateChart(newStat) {
	
	var maxStat = 1;
	var range = rangeOf(2000, 2014);
	if (currentTrendPlayers.length != 0) {
		maxStat = maxStatValue(newStat);
		range = getMaxRange();
	}
	
	years_trend = range;
    // Scale the range of the data again
    x_trend.domain(range);
    y_trend.domain([0, maxStat * 1.5]);

    // Select the section we want to apply our changes to
    var svg = d3.select("#trendsChart").transition();
    
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis_trend);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis_trend);
    svg.select(".y.label")
    	.duration(750)
    	.text(newStat);
    
    colors_trend = colorArray(currentTrendPlayers.length);
    circlesG.selectAll("circle").remove();
    circlesG.selectAll("text").remove();
    
    for (var i = 0; i < currentTrendPlayers.length; i++) {
    	var player = currentTrendPlayers[i];
    	var playerData = getDataFor(player);
    	
        svg.select(".line" + player)
            .duration(750)
            .attr("d", makeLineWith(playerData))
            .style("stroke", colors_trend[i]);
        
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
	
        circlesG.append("text")
	        .attr("class", "y3" + i)
	        .style("stroke", "white")
	        .style("stroke-width", "3.5px")
	        .style("opacity", 0.8)
	        .attr("dx", 8)
	        .attr("dy", "1em");
        circlesG.append("text")
	        .attr("class", "y4" + i)
	        .attr("dx", 8)
	        .attr("dy", "1em");
    }
    
    var ordinal = d3.scale.ordinal()
    	.domain(currentTrendPlayers.map(function(d) {
    		return allPlayers_trend[d].name;
    	}))
    	.range(colors_trend);
	
	var legendOrdinal = d3.legend.color()
	    .shape("path", d3.svg.symbol().type("triangle-up").size(100)())
	    .shapePadding(10)
	    .scale(ordinal);
	
	svg_trend.select(".legendOrdinal")
	    .call(legendOrdinal);

}

function addPlayerTrend(player) {
	if (player in currentTrendPlayers) return;
	
	currentTrendPlayers.push(player);
	
	svg_trend.append("path").attr("class", "line" + player).attr("fill", "none");
	
	updateChart(currentStat);
}

function removePlayerTrend(player) {
	var index = currentTrendPlayers.indexOf(player);
	if (index > -1) {
	    currentTrendPlayers.splice(index, 1);
	    svg_trend.select(".line" + player).remove();
	    updateChart(currentStat);
	}
}

function makeLineFor(player) {
	var valueline = d3.svg.line()
	    .x(function(d) { return x_trend(d.year); })
	    .y(function(d) {
	    	if (d[currentStat] === undefined || d[currentStat] === NaN) {
	    		return y_trend(0.0);
	    	}
	    	return y_trend(d[currentStat]);
	       });
	
	return valueline(getDataFor(player));
}

function makeLineWith(data) {
	var valueline = d3.svg.line()
	    .x(function(d) { return x_trend(d.year) + + x_trend.rangeBand()/2; })
	    .y(function(d) {
	    	if (d[currentStat] === undefined || d[currentStat] === NaN) {
	    		console.log("here");
	    		return y_trend(0.0);
	    	}
	    	return y_trend(d[currentStat]);
	       });
	
	return valueline(data);
}

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

function rangeOf(from, to) {
	var res = [];
	for (var i = from; i <= to; i++) {
		res.push(i);
	}
	return res;
}

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
	return rangeOf(min, max);
}

function shallowCopy(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
        if(oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
}

function colorArray(n) {
	var res = [];
	var color = d3.scale.category10();
	for (var i = 0; i < n; i++) {
		res.push(color(i));
	}
	return res;
}