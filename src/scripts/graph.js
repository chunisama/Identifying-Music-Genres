import Genres from "../../assets/data/genres";

//Testing logging data
// d3.json("../assets/data/genres.json").then((data) => {
//   console.log(data);
// });

const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

//Create svg element
const canvas = d3.select("body");
const svg = canvas.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 900 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Adding Title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 25 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "15px")
  .attr("font-family", "Verdana")
  .style("font-weight", 700)
  .text("Identifying a Music Genre: What makes a genre unique?")

//Reading data
function buildGraph(data){

  //Add x axis
  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([100, width]);
  svg.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .transition().duration(1500).call(d3.axisBottom(x));

  //Add y axis
  const y = d3.scaleLinear()
    .domain([0,1])
    .range([height, 25]);
  svg.append("g")
    .attr("transform", "translate(" + 100 + ")")
    .transition().duration(1500).call(d3.axisLeft(y));

  //Add x axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .transition().duration(1000).attr("transform", "translate(" + ((width / 2) + 50) + " ," + (height + 50) + ")")
    .attr("font-size", "12px")
    .attr("font-family", "Verdana")
    .text("Energy")
  
  //Add y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "y-axis-label")
    .transition().duration(1000).attr("y", 50)
    .attr("x", 0 - (height / 2) - 15)
    .attr("text-anchor", "middle")
    .attr("font-family", "Verdana")
    .attr("font-size", "12px")
    .text("Valence")

  //Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([0,3,4,5])
    .range([5, 9, 13, 20]);

  //Add a scale for bubble color
  const myColor = d3.scaleOrdinal()
    .domain([0,1,2,3,4,5,6,7,8,9,10,11])
    .range(d3.schemeSet3);
  
  //A tooltip div that is hidden by default
  const tooltip = d3.select("body")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  //3 functions that show/update tooltip based off user mouse movement
  const showTooltip = (d) => {
    tooltip
      .transition()
      .duration(200);
    tooltip
      .style("opacity", 1)
      .html("Genre: " + d.Genre)
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", (d3.event.pageY-10) + "px")
      .style("z-index", 1);
  }
  
  const moveTooltip = (d) => {
    tooltip
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", (d3.event.pageY-10) + "px");
  }

  const hideTooltip = (d) => {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
      .style("z-index", -1);
  }

  //Add bubbles
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", x(0))
      .attr("cy", y(0))
      .attr("r", z(0))
      //Tooltip triggers
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

  //Loading transition
  svg.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", (d) => {return x(d.Energy);})
    .attr("cy", (d) => {return y(d.Valence);})
    .attr("r", (d) => {return z(d.time_signature);})
    .style("fill", (d) => {return myColor(d.Key);})
  
  //Buttons
  //Danceability button
  d3.select(".danceability").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Danceability);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Danceability")
  });
  //Acousticness
  d3.select(".acousticness").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Acousticness);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Acousticness")
  });

  //Liveness
  d3.select(".liveness").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Liveness);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Liveness")
  });

  //Instrumentalness
  d3.select(".instrumentalness").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Instrumentalness);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Instrumentalness")
  });
  
  //Valence
  d3.select(".valence").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Valence);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Valence")
  });

  //Speechness
  d3.select(".speechness").on("click",() => {
    svg.selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cy", (d) => {return y(d.Speechness);})
    svg.selectAll(".y-axis-label").remove()
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("font-family", "Verdana")
      .attr("font-size", "12px")
      .text("Speechness")
  });
};



buildGraph(Genres);