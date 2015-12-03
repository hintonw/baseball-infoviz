// This displays the player-related infromation on the bar chart

//creating necessary variables 
var allPlayers_Bar; 
var currentPlayer;  
var currentStatBar = "AVG"; 
var width_Bar, height_Bar;  
var barData = [0, 0, 0, 0];  
var leagueAverages_Bar;   
var year_Bar = 2014;  
var labelsBar = ["League Average", "Team Average", "Position Average", "Player"]; 

// calculating the margin and the scales for the x and y axis
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width_Bar = 600 - margin.left - margin.right,
    height_Bar = 270 - margin.top - margin.bottom;
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

//creates the svg object that is used throughout
var svg_Bar = d3.select("#barChart").append("svg") 
    .attr("width", width_Bar + margin.left + margin.right)
    .attr("height", height_Bar + margin.top + margin.bottom)
  .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Used to originally draw an empty graph 
function drawBarChart() {
	
  // creates the y axis with its labels  
  // inspired by previous homeworks 
	svg_Bar.append("g")
      .attr("class", "y axis")
      .call(yAxis_Bar)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(currentStatBar);

  // creates the x axis with its labels  
  // inspired by previous homeworks 
	svg_Bar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_Bar + ")")
    .call(xAxis_Bar);

    // originally creates th bar objects with a [0,0,0,0] array as their values  
    svg_Bar.selectAll(".bar")
    	.data(barData)
  	.enter().append("rect")
  		.attr("class", "bar")
      	.attr("x", function(d,i) {return (width_Bar/4)*i; })
      	.attr("width", x_Bar.rangeBand())
      	.attr("y", function(d) { return y_Bar(d); })
      	.attr("height", function(d) { return height_Bar - y_Bar(d)});  

    // gives the bars their colors 
     svg_Bar.selectAll(".bar")
     	.attr("class","bar")
    	.style("fill", function(d, i) { return color_Bar(i); })   

      

	
}

// This updates the Bar chart with a new player for a new statistic 
 function updateBarChart(newPlayer, newStat) {

    currentPlayer = newPlayer; 
    currentStatBar = newStat; 
 		barData = getBarDataFor(currentPlayer, currentStatBar);   

    labelsBar = getLabels(currentPlayer); 
    
    // reseting the labels on the x-axis 
    x_Bar.domain(labelsBar);  
    xAxis_Bar.scale(x_Bar); 
 		
 
 		// reseting the scale of the y-axis and its values 
 		var maxBarStat = getMaxStatVal(barData); 
 		y_Bar.domain([0,1.75*maxBarStat]);  
 		yAxis_Bar.scale(y_Bar); 

    // remove all previous information before adding new ones
 		svg_Bar.select(".y.axis").remove();   
    svg_Bar.select(".x.axis").remove();  
    svg_Bar.selectAll("text.bar").remove();  

    // creating the new y axis and new scales for it 
    // inspired by previous homeworks 
 		svg_Bar.append("g")
      		.attr("class", "y axis")
      		.call(yAxis_Bar)
      		.append("text")
     	 	.attr("transform", "rotate(-90)")
      		.attr("y", 6)
      		.attr("dy", ".71em")
      		.style("text-anchor", "end")
      		.text(currentStatBar);

    // drawing the new x-axis with the new labels  
    // inspired by previous homeworks 
    svg_Bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_Bar + ")")
      .call(xAxis_Bar);

    // creates the new bars for the barChart  
		svg_Bar.selectAll(".bar")
    		.data(barData)
      		.transition()
      		.duration(function(d) { return 1000; } )
      		.attr("y", function(d) { return y_Bar(d); })
      		.attr("height", function(d) { return height_Bar - y_Bar(d)});

  	 //gives the new bars their colors 
    	 svg_Bar.selectAll(".bar")
    	 	.attr("class","bar")
    		.style("fill", function(d, i) { return color_Bar(i); }) 
		
    // writes the value of each bar starting at the middle of the bar  
    // inspired by an online tutorial
    svg_Bar.selectAll("text.bar")
      .data(barData)
    .enter().append("text")
      .attr("class", "bar")
      .attr("text-anchor", "left") 
      .attr("x", function(d,i) { return (width_Bar/4)*i + width_Bar/8 ;  })
      .attr("y", function(d) { return y_Bar(d); })
      .text(function(d) { return Math.round(d*100)/100; });
	

 }

//Pass in a playerID 
//sets up easy data reading for other functions
function registerBarPlayers(allPlayers) {
	allPlayers_Bar = allPlayers;  
	leagueAverages_Bar = getAverageStatsForYear(year_Bar, allPlayers_Bar);  

}
//changes the current player being displayed on the bar chart 
function addPlayerBar(newPlayer){ 
  currentPlayer = newPlayer; 
  updateBarChart(currentPlayer, currentStatBar);
}

//Pass in a playerID 
//returns the data necessary for the bar chart 
function getBarDataFor(newPlayer,newStat) { 

  // getting the player object 
	currentStatBar = newStat; 
  var playerId = newPlayer;
	var player = allPlayers_Bar[playerId]; 
	

	var ret = [];
	var year = year_Bar; 
  //League Average
  var a = 0;
  //Team Average 
  var b = 0;
  //Position Average
  var c = 0; 
  //Player Average 
  var d = 0;  

  //actually solves for the values of the graph. 
  if (player != null && player != NaN && player != undefined) {
      b = averageTeam(playerId);  
      c = averagePosition(playerId);  
      //checking just in case the player doesn't have anything for a given stat 
      if (player.data[year_Bar][currentStatBar] != undefined && player.data[year_Bar][currentStatBar] != NaN && 
          player.data[year_Bar][currentStatBar] != null){
        d = player.data[year_Bar][currentStatBar];  
      }
  }
  // finds the league average for a given stat
	var i = getAllStatNames().indexOf(currentStatBar);   
	var a = leagueAverages_Bar[i];    

	ret = [a,b,c,d]; 
	return ret;
}

// finds the max value in a given array so that we know what scale to put the graph on
function getMaxStatVal(data){ 
	return d3.max(data); 
}  

//calculates the team average of a given stat 
function averageTeam(newPlayer) {
  var teamBarID = allPlayers_Bar[newPlayer].data[year_Bar].teamID;    

  var pIDs = Object.keys(allPlayers_Bar);
  var val = 0; 
  var count = 0;  
  for (var i = 0; i < pIDs.length; i++) {  
    var pop = pIDs[i];  
    var p = allPlayers_Bar[pop];    
    if ( p != undefined ){
      if (p.data != undefined){  
       if (year_Bar in p.data){ 
        if (p.data[year_Bar].teamID == teamBarID) {
          count++;   
          if (p.data[year_Bar][currentStatBar] !== undefined && !isNaN(p.data[year_Bar][currentStatBar])){
            val += p.data[year_Bar][currentStatBar]; 
          }  
        }
       }
      }
    } 
  }
  if (count != 0 && val !=0){
    return val /=count; 
  } 
  return 0; 

} 
//calculates the position average for a given stat 
function averagePosition(newPlayer){
  var posBar = allPlayers_Bar[newPlayer].data[year_Bar].positions[0];   

  var pIDs = Object.keys(allPlayers_Bar);
  var val = 0; 
  var count = 0;  
  for (var i = 0; i < pIDs.length; i++) {  
    var pop = pIDs[i];  
    var p = allPlayers_Bar[pop];    
    if ( p != undefined ){
      if (p.data != undefined){  
       if (year_Bar in p.data && p.data[year_Bar].positions != undefined && p.data[year_Bar].positions != null && p.data[year_Bar].positions != NaN){  
        if (p.data[year_Bar].positions[0] == posBar) {
          count++;   
          if (p.data[year_Bar][currentStatBar] !== undefined && !isNaN(p.data[year_Bar][currentStatBar])){
            val += p.data[year_Bar][currentStatBar]; 
          }  
        }
       }
      }
    }
  } 
  if (count != 0 && val !=0){
    return val /=count; 
  } 
  return 0; 
} 

//creates a new array of labels for the x-axis
function getLabels(newPlayer){
  return ["League Average" ,allPlayers_Bar[newPlayer].data[year_Bar].teamID + " Average",allPlayers_Bar[newPlayer].data[year_Bar].positions[0] +" Average",allPlayers_Bar[newPlayer].name];  

}




