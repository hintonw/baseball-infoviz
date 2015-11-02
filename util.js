// TODO this may need to be done for our data
function batterType(d) {
  return d;
}

function pitcherType(d) {
  return d;
}

function teamType(d) {
  return d;
}


var tooltip = d3.select("#first-base")
    .append("div")
    .attr("class", "tooltip")
    .text("a simple tooltip")
    .on("mouseover", function(){return tooltip.style("visibility", "hidden");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


function myFunction(){

	document.getElementById("first-base").innerHTML = "YOU CLICKED ME!";
}