// This should use the allPlayers to draw the player chart and have a function to be called onFilter.

// NOTE: Do not use the same names for variables across files!!

var pickerWidth = 280,
    pickerHeight = 280;

var allPlayers_Picker;
var currentPickerPlayers = [];
var currentPlayersPicked = [];
var teamsPicker;

var pickerList;

function logPickerPlayers() {
  console.log(allPlayers_Picker);
  console.log(currentPickerPlayers);
}

function registerPickerPlayers(allPlayers) {
  allPlayers_Picker = allPlayers;
  currentPickerPlayers = Object.keys(allPlayers_Picker);
}

function drawPlayerPicker() {

  d3.select("#viewport").selectAll("ul").remove();

  pickerList = d3.select("#viewport")
      .append("ul")
      .attr("class", "list-group");

  pickerList.selectAll("li")
      .data(currentPickerPlayers)
      .enter()
      .append("li")
      .attr("class", "list-group-item")
      .text(function(d) { return allPlayers_Picker[d].name; })
      .append("span")
      .attr("class", "glyphicon glyphicon-ok")
      .style("float", "right")
      .style("color", "rgb(200, 200, 200)")
      .on("click", function(d) { 
        addToCurrent(d); 
        addPlayerTrend(d);
        d3.select(this).style("color", function(d) {
          if (d3.select(this).style("color") === "rgb(200, 200, 200)"){
            return "green";
          } else {
            return "rgb(200, 200, 200)";
          }
        });
      });
}

function drawPlayerList(playersToDraw) {

	  d3.select("#viewport").selectAll("ul").remove();
	  
	  pickerList = d3.select("#viewport")
	      .append("ul")
	      .attr("class", "list-group");
	  
	  pickerList.selectAll("li")
      .data(currentPickerPlayers)
      .enter()
      .append("li")
      .attr("class", "list-group-item")
      .text(function(d) { return allPlayers_Picker[d].name; })
      .append("span")
      .attr("class", "glyphicon glyphicon-ok")
      .style("float", "right")
      .style("color", "rgb(200, 200, 200)")
      .on("click", function(d) { 
        addToCurrent(d); 
        d3.select(this).style("color", function(d) {
          if (d3.select(this).style("color") === "rgb(200, 200, 200)"){
            addPlayerTrend(d);
            return "green";
          } else {
            removePlayerTrend(d);
            return "rgb(200, 200, 200)";
          }
        });
      });

}

function removeFromCurrent(playerToRemove) {
  currentPlayersPicked.splice(playerToRemove, 1);
}

function addToCurrent(playerToAdd) {
  if (currentPlayersPicked.indexOf(playerToAdd) > -1) {
    removeFromCurrent(playerToAdd);
  } else {
    currentPlayersPicked.push(playerToAdd);
  }
}

function registerTeamsPicker(allTeams) {
  teamsPicker = allTeams;
}

function updatePlayerList(updatedPlayers) {
  currentPickerPlayers = teamsPicker[updatedPlayers].players["2014"];
  drawPlayerList(currentPickerPlayers);
}