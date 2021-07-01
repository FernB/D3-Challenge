// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  };

  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


  var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("./assets/data/data.csv").then(function(data) {

    console.log(data[0])

    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.age = +d.age;
        d.income = +d.income;
      });

      var xLables = [{label: "In Poverty (%)", value: "poverty"}, {label: "Age(Median)", value:"age"}, {label: "Household Income (Median)", value: "income"}];
      var yLables = [{label: "Obese (%)", value: "obesity"}, {label: "Smokes (%)", value:"smokes"}, {label: "Lacks Healthcare (%)", value: "healthcare"}];

      var valuex = "poverty";
      var valuey = "healthcare";



var xScale = d3.scaleLinear()
.domain([d3.min(data, d =>d.poverty)*0.9,d3.max(data, d =>d.poverty)*1.1])
.range([0,chartWidth]);


var yScale = d3.scaleLinear()
.domain([d3.min(data, d =>d.healthcare)*0.9,d3.max(data, d =>d.healthcare)*1.1])
.range([chartHeight,0]);


var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

console.log(data.map(d => xScale(d.poverty)))

chartGroup.append("g")
.attr("class", "yaxis")
.call(yAxis);

chartGroup.append("g")
.attr("class", "xaxis")
.attr("transform", `translate(0, ${chartHeight})`)
.call(xAxis);

var dataPlot = chartGroup.append("g")
.selectAll("dot")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xScale(d.poverty)  )
.attr("cy", d => yScale(d.healthcare) )
.attr("r", 10)
.style("fill", "#9ecae1")


var statetext = chartGroup.append("g")
.attr("class", "stateText")
.attr("font-size", 10)
.selectAll(".stateText")
.data(data)
.enter()
.append("text")
.attr("x", d => xScale(d.poverty))
.attr("y", d => yScale(d.healthcare))
.attr("dy",".35em")
.text(d => d.abbr);

chartGroup.append('g')
.attr("text-anchor", "middle")
.attr("font-size",14)
.attr("fill","black")
.selectAll("text")
.data(xLables)
.enter()
.append("text")
.attr("y",(d,i)=>chartHeight)
.attr("x",chartWidth/2)
.attr("dy",(d,i) => (2+i)+"em")
.attr("class","aText inactive")
.attr("id","xs")
.text(d => d.label)
.on("click", function(d) { d3.selectAll("#xs").attr("class","aText inactive"), d3.select(this).attr("class","aText active"), valuex = d.value, updateX(), updateTip()})


chartGroup.append('g')
.attr("text-anchor", "middle")
.attr("font-size",14)
.attr("fill","black")
.selectAll("text")
.data(yLables)
.enter()
.append('text')
.attr("x", -chartWidth/4)
.attr("y",(d,i) => -chartMargin.bottom/1.5)
.attr("dy",(d,i) => i+"em")
.attr("transform","rotate(-90)")
.attr("class","aText inactive")
.attr("id","ys")
.html(d => d.label)
.on("click", function(d) { d3.selectAll("#ys").attr("class","aText inactive"), d3.select(this).attr("class","aText active"), valuey = d.value, updateY(), updateTip()})



// Step 1: Initialize Tooltip
var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([-10, 0])
.html(function(d) {
    return (`${d.state}<br> ${valuex} : ${d[valuex]} ${valuex === "age"| valuex === "income" ? "" : "%"} <br> ${valuey} : ${d[valuey]}%`)});

// Step 2: Create the tooltip in chartGroup.
chartGroup.call(toolTip);

// Step 3: Create "mouseover" event listener to display tooltip
dataPlot.on("mouseover", function(d) {
toolTip.show(d, this)
d3.select(this).style("stroke","black")
})
// Step 4: Create "mouseout" event listener to hide tooltip
.on("mouseout", function(d) {
  toolTip.hide(d)
  d3.select(this).style("stroke",null)
});



function updateTip (){
    toolTip
    .html(function(d) {
        
        return (`${d.state}<br> ${valuex} : ${d[valuex]} ${valuex === "age"| valuex === "income" ? "" : "%"} <br> ${valuey} : ${d[valuey]}%`)


    });

}
















console.log(select)
function updateX() {
    xScale.domain([d3.min(data, d =>d[valuex])*0.9,d3.max(data, d =>d[valuex])*1.1])
    chartGroup.select(".xaxis")
    .transition()
    .duration(1000)
    .call(xAxis)

    dataPlot.data(data)
    .transition()
    .duration(1000)
    .attr("cx", d => xScale(d[valuex]))
    
    statetext.data(data)
    .transition()
    .duration(1000)
    .attr("x", d => xScale(d[valuex]))
};

function updateY() {
    
    yScale.domain([d3.min(data, d =>d[valuey])*0.9,d3.max(data, d =>d[valuey])*1.1])
    chartGroup.select(".yaxis")
    .transition()
    .duration(1000)
    .call(yAxis)

    dataPlot.data(data)
    .transition()
    .duration(1000)
    .attr("cy", d => yScale(d[valuey]))
    
    statetext.data(data)
    .transition()
    .duration(1000)
    .attr("y", d => yScale(d[valuey]))

    ;
}




// d3.select('#selectiony').on("change", d => 

// updateY(d3.select(this).property("value"))

// )




})