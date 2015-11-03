// TODO this may need to be done for our data
function batterType(d) {
  d.G = +d.G;
  d.AB = +d.AB;
  d.R = +d.R;
  d.H = +d.H;
  d['2B'] = +d['2B'];
  d['3B'] = +d['3B'];
  d.HR = +d.HR;
  d.RBI = +d.RBI;
  d.SB = +d.SB;
  d.SO = +d.SO;
  d.BB = +d.BB;
  return d;
}

function pitcherType(d) {
  d.W = +d.W;
  d.ERA = +d.ERA;
  d.BB = +d.BB;
  d.H = +d.H;
  d.SO = +d.SO;
  d.SV = +d.SV;
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