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

/*var tooltip = d3.select("#third-base")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip")
    .on("mouseover", function(){return tooltip.style("visibility", "visible");})
	.on("mousemove", function(){return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
*/

function myFunction(){

	document.getElementById("first-base").innerHTML = "YOU CLICKED ME!";
}