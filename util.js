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


var tooltip = d3.select("#first-base")
    .append("div")
    .attr("class", "tooltip")
    .text("a simple tooltip")
    .on("mouseover", function(){return tooltip.style("visibility", "hidden");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


function myFunction(){

	document.getElementById("first-base").innerHTML = "YOU CLICKED ME!";
}