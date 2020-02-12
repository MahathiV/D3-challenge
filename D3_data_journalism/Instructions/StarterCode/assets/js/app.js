
// Making Window Responsive

function make_responsive()

{

// if the SVG area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart

 var svgarea = d3.select("body").select("svg");

 if (!svgarea.empty())
 {
     svgarea.remove();
 }

// svg area setting to windows height and windows width

 var svgHeight = window.innerHeight;
 var svgWidth = window.innerWidth;

  //var svgWidth = 750;
  //var svgHeight = 600;

  var svg = d3.select("#scatter")
  .append("svg")
  .attr("width",svgWidth)
  .attr("height",svgHeight)

  var margin = {
    top: 70,
    bottom: 150,
    right: 630,
    left: 160 
   }


 // Chart area height and width

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

 // shift the chart by left and top margins
  var chartGroup = svg.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`)


 // Import CSV data from "data.csv" file

 d3.csv("assets/data/data.csv").then(function(data)  // absolute path

 // d3.csv("./data.csv").then(function(data) // relative path
  {
    //console.log(data)

 // Parse data as numbers

  data.forEach(function(d)
  {
     d.poverty = +d.poverty
     d.healthcare = +d.healthcare
    
     d.smokes = +d.smokes
     d.age = +d.age
    })

// create scale functions

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty-1),d3.max(data, d => d.poverty+2)])
    .range([0,chartWidth]);

  var yLinearScale = d3.scaleLinear()
   .domain([d3.min(data, d => d.healthcare-0.5),d3.max(data, d => d.healthcare+2)])
   .range([chartHeight,0])

// Create axis values at bottom for x - axis , at left side for y axis

  var bottomAxis = d3.axisBottom(xLinearScale)
  var leftAxis = d3.axisLeft(yLinearScale)


// append axis to charts

 chartGroup.append("g")
    .attr("transform",`translate(0,${chartHeight})`)
    .call(bottomAxis) // x -axis values

  chartGroup.append("g")
    .call(leftAxis) // y-axis values

 // create circles for scatter plot

  var circles = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",d => xLinearScale(d.poverty))
    .attr("cy",d=>yLinearScale(d.healthcare))
    .attr("r",12.5)
    .attr("fill","lightblue")

//state abbrevations inside circles

   var circle_text_inside = chartGroup.selectAll(null)
   .data(data)
   .enter()
   .append("text")

   circle_text_inside
   .attr("dx",function(d) {return xLinearScale(d.poverty)})
   .attr("dy",function(d) {return yLinearScale(d.healthcare)})
   .text(function(d) {return d.abbr})
   .attr("fill","white")
   .attr("font-size","12px")
   .style("text-anchor","middle")
   .attr("font-family","sans-serif")
   .attr("class","circle_text")
   //.attr("dy","1em")
   //.attr("dx","1em")

// adding tooltips - information on mouseover

  var tooltip = d3.tip()
     .attr("class","tooltip")
     .offset([80,-60])
     .html(function(d){
       return (`${d.state}<br>
              Poverty: ${d.poverty}%<br>
              Healthcare: ${d.obesity}%`)
       })
 
    chartGroup.call(tooltip)

    circles
    .on("mouseover",function(d){
      tooltip.show(d,this)
    })

    .on("mouseout",function(d,i){
      tooltip.hide(d)
    })

 // x and y axis titles (text)

   chartGroup.append("text")
   .attr("transform","rotate(-90)")
   .attr("y",-60)
   .attr("x",0-(chartHeight/2))
   .attr("dy","1em")
   .attr("class","axisText")
   .text("Lacks Healthcare(%)")

   chartGroup.append("text")
   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 45})`)
   .attr("class", "axisText")
   .text("In Poverty(%)");

 })
}

make_responsive()


d3.select(window).on("resize",make_responsive)





