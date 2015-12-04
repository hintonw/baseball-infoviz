//playerPicker.js controls the List of players and how they are arranged and drawn.
// All of this code was written from scratch. The list was integrated with Bootstrap and is described below.

var pickerWidth = 280,
    pickerHeight = 280;

var allPlayers_Picker,
    allPlayersArray = [],
    currentPickerPlayers = [],
    currentPlayersPicked = [];

var teamsPicker,
    positionPicker;

var isFilteredByPosition = false,
    isFilteredByTeam = false;

var lastPositionPicked = "";

var pickerList;

//This function filters out players that have retired before they are drawn to the screen.
//This is necessary because our data contains player data starting in the early 1900's.
function filterOutRetiredPlayers() {
  var temp = [];
  for(var i = 0; i < allPlayersArray.length; i++) {
    if (allPlayers_Picker[allPlayersArray[i]].data["2014"] !== undefined) {
      temp.push(allPlayersArray[i]);
    }
  }
  currentPickerPlayers = temp;
}

//This creates an array of the playerID's from the data organized in allPlayers.js
function registerPickerPlayers(allPlayers) {
  allPlayers_Picker = allPlayers;
  allPlayersArray = Object.keys(allPlayers_Picker);
}

//This creates an array of the teamID's from the data organized in allTeams.js
function registerTeamsPicker(allTeams) {
  teamsPicker = allTeams;
}

//This creates an array of the positions from the data organized in allPlayers.js
function registerPositionsPicker(allPositions){
  positionPicker = allPositions;
}

//This function draws the initial list with all Active players in the draft.
function drawPlayerPicker() {
  filterOutRetiredPlayers();

  d3.select("#viewport").selectAll("ul").remove();

  //This appends a Bootstrap list-group ul to the viewport which allows scrolling in the viewport.
  //By adding the class list-group, Bootstrap is able to automatically style the list.
  pickerList = d3.select("#viewport")
      .append("ul")
      .attr("class", "list-group");
  
  //Our Awesome player ranking algorithm! TM 
  currentPickerPlayers = sortPlayers(currentPickerPlayers, allPlayers_Picker);

  //This is where each individial player is added to the list. 
  //It adds a checkmark for each player which allows the player to be selected.
  //It will add players to the different charts and change the color of the checkmark to indicate picked players.
  //Adding the list-group-item class to the li allows Bootstrap to automatically style the list items.
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

//This function redraws the player list once a filter has been applied to the data.
function drawPlayerList(playersToDraw) {

    //This sorts the players by our ranking algorithm.
	  playersToDraw = sortPlayers(playersToDraw, allPlayers_Picker);	
	
  //This appends a Bootstrap list-group ul to the viewport which allows scrolling in the viewport.
  //By adding the class list-group, Bootstrap is able to automatically style the list.
	  d3.select("#viewport").selectAll("ul").remove();
	  
	  pickerList = d3.select("#viewport")
	      .append("ul")
	      .attr("class", "list-group");
	  
    // This adds the Players to the list, it adds theie name, team abbreviation and the position they play.
    //It also checks to see if the player is already selected and then draws the Checkmark either grey or
    //green to indicated if it is not selected or selected, respectively.
    //Then it takes the selected players and passes them to the trend chart and barchart to be drawn.
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

//This checks to see if a player has already been selected by the user and returns the color to redraw on the checkmark.
//I know that it is not typical to check the color to see if a user is already selected but it worked very well in this situation.
function checkIfPicked(player) {
  if (currentPlayersPicked.indexOf(player) > -1) {
    return "green";
  } else {
    return "rgb(200, 200, 200)";
  }
}

//This removes players form the currently selected players drawn on the Trend chart.
function removeFromCurrent(playerToRemove) {
  currentPlayersPicked.splice(playerToRemove, 1);
}

//This adds players to the list that is drawn by the trend chart.
function addToCurrent(playerToAdd) {
  if (currentPlayersPicked.indexOf(playerToAdd) > -1) {
    removeFromCurrent(playerToAdd);
  } else {
    currentPlayersPicked.push(playerToAdd);
  }
}

//This first checks if the list is already filtered by position. Then it will filter the list down to the player on 
//the team indicated by the teamID in updatedPlayers.
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

//This checks to see if the players in the selected positions have relevant data then it updates the list to be drawn to only player
//who play the selected position in updatedPlayers.
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

//This is called when the "All Players" button is pressed. It clears the list of players and resets the list 
//to be the same as it was before any filters were applied.
function resetPickerList() {
  filterOutRetiredPlayers();
  lastPositionPicked = "";
  drawPlayerList(currentPickerPlayers);
  isFilteredByTeam = false;
  isFilteredByPosition = false;
}
