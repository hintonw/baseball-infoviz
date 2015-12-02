// This should use the allPlayers to draw the player chart and have a function to be called onFilter.

// NOTE: Do not use the same names for variables across files!!

var pickerWidth = 280,
    pickerHeight = 280;

var allPlayers_Picker;
var currentPickerPlayers = [];
var currentPlayersPicked = [];

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
      .style("color", "gray")
      .on("click", function(d) { addToCurrent(d); });
}

function drawPlayerList(playersToDraw) {

	  d3.select("#viewport").selectAll("ul").remove();
	  
	  pickerList = d3.select("#viewport")
	      .append("ul")
	      .attr("class", "list-group");
	  
	  pickerList.selectAll("li")
	      .data(playersToDraw)
	      .enter()
	      .append("li")
	      .attr("class", "list-group-item")
	      .text(function(d) { return allPlayers_Picker[d].name; });

    d3.select("#viewport").selectAll("ul").selectAll("li")
        .append("span")
        .attr("class", "glyphicon glyphicon-remove")
        .style("float", "right")
        .style("color", "gray");

    d3.select("#viewport").selectAll("ul").selectAll("li")
        .append("span")
        .attr("class", "glyphicon glyphicon-ok")
        .style("float", "right")
        .style("padding-right", "5px")
        .style("color", "gray")
        .on("click", addToCurrent);

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