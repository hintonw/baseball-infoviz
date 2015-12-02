// This should use the allPlayers to draw the player chart and have a function to be called onFilter.

// NOTE: Do not use the same names for variables across files!!

var pickerWidth = 280,
    pickerHeight = 280;

var allPlayers_Picker,
    allPlayersArray = [];
var currentPickerPlayers = [];
var currentPlayersPicked = [];
var teamsPicker;
var positionPicker;
var isFilteredByPosition = false,
    isFilteredByTeam = false;
var lastPositionPicked = "";


var pickerList;

function filterOutRetiredPlayers() {
  var temp = [];
  for(var i = 0; i < allPlayersArray.length; i++) {
    if (allPlayers_Picker[allPlayersArray[i]].data["2014"] !== undefined) {
      temp.push(allPlayersArray[i]);
    }
  }
  currentPickerPlayers = temp;
}

function logPickerPlayers() {
  console.log(allPlayers_Picker);
  console.log(currentPickerPlayers);
}

function registerPickerPlayers(allPlayers) {
  allPlayers_Picker = allPlayers;
  allPlayersArray = Object.keys(allPlayers_Picker);
}

function registerTeamsPicker(allTeams) {
  teamsPicker = allTeams;
}

function registerPositionsPicker(allPositions){
  positionPicker = allPositions;
}

function drawPlayerPicker() {
  filterOutRetiredPlayers();

  d3.select("#viewport").selectAll("ul").remove();

  pickerList = d3.select("#viewport")
      .append("ul")
      .attr("class", "list-group");
  
  currentPickerPlayers = sortPlayers(currentPickerPlayers, allPlayers_Picker);

  pickerList.selectAll("li")
      .data(currentPickerPlayers)
      .enter()
      .append("li")
      .attr("class", "list-group-item")
      .text(function(d) { return allPlayers_Picker[d].name + " | " + allPlayers_Picker[d].data["2014"].teamID; })
      .append("span")
      .attr("class", "glyphicon glyphicon-ok")
      .style("float", "right")
      .style("color", "rgb(200, 200, 200)")
      .on("click", function(d) { 
        addToCurrent(d); 
        d3.select(this).style("color", function(d) {
          if (d3.select(this).style("color") === "rgb(200, 200, 200)"){
            addPlayerBar(d); 
            addPlayerTrend(d);
            return "green";
          } else {
            removePlayerTrend(d);
            return "rgb(200, 200, 200)";
          }
        });
      });
}

function drawPlayerList(playersToDraw) {

	  playersToDraw = sortPlayers(playersToDraw, allPlayers_Picker);	
	
	  d3.select("#viewport").selectAll("ul").remove();
	  
	  pickerList = d3.select("#viewport")
	      .append("ul")
	      .attr("class", "list-group");
	  
	  pickerList.selectAll("li")
      .data(playersToDraw)
      .enter()
      .append("li")
      .attr("class", "list-group-item")
      .text(function(d) { return allPlayers_Picker[d].name + " | " + allPlayers_Picker[d].data["2014"].teamID + lastPositionPicked; })
      .append("span")
      .attr("class", "glyphicon glyphicon-ok")
      .style("float", "right")
      .style("color", function(d) { return checkIfPicked(d); })
      .on("click", function(d) { 
        addToCurrent(d); 
        d3.select(this).style("color", function(d) {
          if (d3.select(this).style("color") === "rgb(200, 200, 200)"){
            addPlayerBar(d); 
            addPlayerTrend(d);
            return "green";
          } else {
            removePlayerTrend(d);
            return "rgb(200, 200, 200)";
          }
        });
      });

}

function checkIfPicked(player) {
  if (currentPlayersPicked.indexOf(player) > -1) {
    return "green";
  } else {
    return "rgb(200, 200, 200)";
  }
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

function updateListByTeam(updatedPlayers) {
  if(isFilteredByPosition) {
    var array = [];
    for (var i = 0; i < currentPickerPlayers.length; i++) {
      if (allPlayers_Picker[currentPickerPlayers[i]].data["2014"] !== undefined && 
        allPlayers_Picker[currentPickerPlayers[i]].data["2014"].teamID === updatedPlayers) {
        array.push(currentPickerPlayers[i]);
      }
    }
    currentPickerPlayers = array;
    isFilteredByTeam = true;
    drawPlayerList(currentPickerPlayers);
  } else {
    isFilteredByTeam = true;
    currentPickerPlayers = teamsPicker[updatedPlayers].players["2014"];
    drawPlayerList(currentPickerPlayers);
  }
}

function updateListByPosition(updatedPlayers) {
  isFilteredByPosition = true;
  var array = Array.from(positionPicker[updatedPlayers]);
  var temp = [];
  for (var i = 0; i < array.length; i++) {
    if (allPlayers_Picker[array[i]].data["2014"] !== undefined) {
      temp.push(array[i]);
    }
  }
  currentPickerPlayers = temp;
  lastPositionPicked = " | " + updatedPlayers;
  drawPlayerList(currentPickerPlayers);
}

function resetPickerList() {
  filterOutRetiredPlayers();
  lastPositionPicked = "";
  drawPlayerList(currentPickerPlayers);
  isFilteredByTeam = false;
  isFilteredByPosition = false;
}
