// NOTE: Do not use the same names for variables across files!!

// This should display the player-related bar chart and have a funciton that listens for filters
// Ideally, one for playerSelected and one for teamSelected or something like that

var allPlayers_Bar; 
var currentPlayer;  
var currentStatBar = "AVG"; 
var width_Bar, height_Bar;  
var barData = [.25, .5, 1, .75];  
var leagueAverages_Bar;   
var year_Bar = 2014; 

var labelsBar = ["League Average", "Team Average", "Position Average", "Player Average"]; 

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width_Bar = 960 - margin.left - margin.right,
    height_Bar = 500 - margin.top - margin.bottom;

var y_Bar = d3.scale.linear()
    .domain([0, 1])
    .range([height_Bar, 0]);

var x_Bar = d3.scale.ordinal() 
	.domain(labelsBar)
    .rangeRoundBands([0, width_Bar]); 

var color_Bar = d3.scale.category10();

var xAxis_Bar = d3.svg.axis()
    .scale(x_Bar)
    .orient("bottom");

var yAxis_Bar = d3.svg.axis()
    .scale(y_Bar)
    .orient("left");

var svg_Bar = d3.select("#barChart").append("svg") 
    .attr("width", width_Bar + margin.left + margin.right)
    .attr("height", height_Bar + margin.top + margin.bottom)
  .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var barsG = svg_Bar.append("g")                            
				  .style("display", "none"); 


function drawBarChart() {
	

	svg_Bar.append("g")
      .attr("class", "y axis")
      .call(yAxis_Bar)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(currentStatBar);

	svg_Bar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_Bar + ")")
    .call(xAxis_Bar);

    svg_Bar.selectAll(".bar")
    	.data(barData)
  	.enter().append("rect")
  		.attr("class", "bar")
      	.attr("x", function(d,i) {return (width_Bar/4)*i; })
      	.attr("width", x_Bar.rangeBand())
      	.attr("y", function(d) { return y_Bar(d); })
      	.attr("height", function(d) { return height_Bar - y_Bar(d)});  

     svg_Bar.selectAll(".bar")
     	.attr("class","bar")
    	.style("fill", function(d, i) { return color_Bar(i); }) 
	
}

 function updateBarChart(newPlayer) {

 		barData = getBarDataFor();  

 		//var svg = d3.select("#barChart").transition();

 		var maxBarStat = getMaxStatVal(barData); 
 		y_Bar.domain([0,1.5*maxBarStat]);  
 		yAxis_Bar.scale(y_Bar); 

 		svg_Bar.select(".y.axis").remove();  
 		svg_Bar.append("g")
      		.attr("class", "y axis")
      		.call(yAxis_Bar)
      		.append("text")
     	 	.attr("transform", "rotate(-90)")
      		.attr("y", 6)
      		.attr("dy", ".71em")
      		.style("text-anchor", "end")
      		.text(currentStatBar);


		svg_Bar.selectAll(".bar")
    		.data(barData)
      		.transition()
      		.duration(function(d) { return 1000; } )
      		.attr("y", function(d) { return y_Bar(d); })
      		.attr("height", function(d) { return height_Bar - y_Bar(d)});
  	
    	 svg_Bar.selectAll(".bar")
    	 	.attr("class","bar")
    		.style("fill", function(d, i) { return color_Bar(i); }) 
		
    	
	

 }

//Pass in a playerID
function registerBarPlayers(allPlayers) {
	allPlayers_Bar = allPlayers;  
	leagueAverages_Bar = getAverageStatsForYear(year_Bar, allPlayers_Bar);  

}


// var playerIds = Object.keys(allPlayers_Bar);
// var playerId = playerIds[0];
// var player = allPlayers[playerId];

//Pass in a playerID 
function getBarDataFor(playerID) { 

	// var playerIds = Object.keys(allPlayers_Bar);
 //    var playerId = playerIds[15];
	var player = allPlayers_Bar[playerID]; 
	

	console.log(player); 

	var ret = [];
	var year = year_Bar; 
	var d = player.data[year_Bar][currentStatBar]; 

	var i = getAllStatNames().indexOf(currentStatBar);   
	var a = leagueAverages_Bar[i];  

	//TODO: Find Team average for stat 
	var b = 0; 

	//TODO: Find Position Average for Stat 
	var c = 0; 

	ret = [a,b,c,d]; 
	return ret;
}

function getMaxStatVal(data){
	return d3.max(data); 
}
function shallowBarCopyOf(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
        if(oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
}  




