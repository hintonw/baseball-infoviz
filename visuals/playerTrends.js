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

function drawTrendChart() {
	
	
    x_trend.domain(rangeOf(2000, 2014));
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
    
    svg.append("rect")
        .attr("width", width_trend)  
        .attr("height", height_trend)
        .style("fill", "none")       
        .style("pointer-events", "all") 
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);    

    function mousemove() {
    	var bisectYear = d3.bisector(function(d) { return d.year; }).left;
    	
        var x0 = x.invert(d3.mouse(this)[0]),              
            i = bisectYear(data, x0, 1),                 
            d0 = data[i - 1],                            
            d1 = data[i],                                
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;   

        focus.select("circle.y")                         
            .attr("transform",                           
                  "translate(" + x(d.date) + "," +       
                                 y(d.close) + ")");   
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
    
    var colors = colorArray(currentTrendPlayers.length);
    
    for (var i = 0; i < currentTrendPlayers.length; i++) {
    	var player = currentTrendPlayers[i];
    	var playerData = getDataFor(player);
        svg.select(".line" + player)
            .duration(750)
            .attr("d", makeLineWith(playerData))
            .style("stroke", colors[i]);
    }
    
    var ordinal = d3.scale.ordinal()
    	.domain(currentTrendPlayers.map(function(d) {
    		return allPlayers_trend[d].name;
    	}))
    	.range(colors);
	
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
	    .x(function(d) { return x_trend(d.year); })
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