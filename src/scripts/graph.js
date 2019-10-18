import Genres from "../../assets/data/genres";
//Testing logging data
// d3.json("../assets/data/genres.json").then((data) => {
//   console.log(data);
// });
document.addEventListener("DOMContentLoaded", () => {
  const margin = {top: 10, right: 20, bottom: 30, left: 50},
      width = 1500 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;
  
  //Create svg element
  const canvas = d3.select("body");
  const svg = canvas.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 900 + margin.top + margin.bottom)
    .attr("position", "absolute")
    .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  
  //Adding Title
  svg.append("text")
    .attr("x", (width / 2) + 50)
    .attr("y", 10 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("font-family", "Verdana")
    .style("font-weight", 600)
    .text("Music Genre Identifier: What makes a genre unique?")
  
  
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
      .style("font-size", "12px")
      .style("font-family", "Verdana")
      .text("Energy")
    
    //Add y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("class", "y-axis-label")
      .transition().duration(1000).attr("y", 50)
      .attr("x", 0 - (height / 2) - 15)
      .attr("text-anchor", "middle")
      .style("font-family", "Verdana")
      .style("font-size", "12px")
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
    //Button Tooltips
    // const buttonData = [{
    //   "danceability": "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable",
    //   "acousticness": "This value describes how acoustic a song is. A score of 1.0 means the song is most likely to be an acoustic one",
    //   "liveness": "This value describes the probability that the song was recorded with a live audience. According to the official documentation a value above 0.8 provides strong likelihood that the track is live",
    //   "valence": "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)",
    //   "instrumentalness": "This value represents the amount of vocals in the song. The closer it is to 1.0, the more instrumental the song is",
    //   "speechness": "Speechiness detects the presence of spoken words in a track. If the speechiness of a song is above 0.66, it is probably made of spoken words, a score between 0.33 and 0.66 is a song that may contain both music and words, and a score below 0.33 means the song does not have any speech."
    // }];

    const buttonTooltip = d3.select("body")
      .append("div")
        .style("opacity", 0)
        .attr("class", "buttonTooltip")
        .style("position", "absolute")
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .style("font-weight", "300")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

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
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .text("Danceability")
    });

    d3.select(".danceability").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".danceability").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })

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
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .text("Acousticness")
    });

    d3.select(".acousticness").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("This value describes how acoustic a song is. A score of 1.0 means the song is most likely to be an acoustic one.")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".acousticness").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })
  
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
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .text("Liveness")
    });


    d3.select(".liveness").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("This value describes the probability that the song was recorded with a live audience. According to the official documentation a value above 0.8 provides strong likelihood that the track is live.")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".liveness").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })
  
  
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
        .style("text-anchor", "middle")
        .style("font-family", "Verdana")
        .attr("font-size", "12px")
        .text("Instrumentalness")
    });

    d3.select(".instrumentalness").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("This value represents the amount of vocals in the song. The closer it is to 1.0, the more instrumental the song is.")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".instrumentalness").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })
  
    
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
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .text("Valence")
    });

    
    d3.select(".valence").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".valence").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })
  
  
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
        .style("font-family", "Verdana")
        .style("font-size", "12px")
        .text("Speechness")
    });

    d3.select(".speechness").on("mouseover", () => {
      buttonTooltip
        .style("z-index", 1)
        .html("Speechiness detects the presence of spoken words in a track. If the speechiness of a song is above 0.66, it is probably made of spoken words, a score between 0.33 and 0.66 is a song that may contain both music and words, and a score below 0.33 means the song does not have any speech.")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY-20) + "px")
    });

    d3.select(".speechness").on("mouseleave", () => {
      buttonTooltip
        .style("opacity", 0)
        .style("z-index", -1)
    })
  };
  buildGraph(Genres);
})
