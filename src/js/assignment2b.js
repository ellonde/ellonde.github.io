/**
 * Created by Mathias on 30-03-2016.
 */
var w = 1400;
var h = 700;
var padding = 60;

var dataset;
var currentSet;
var data03;
var data15;
var currentIs2003 = true;

loadData();

function loadData(){
    //Load data from csv
    d3.csv("../../data/assignment2b_data.csv", function(error, data) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {      //If no error, the file loaded correctly. Yay!
            dataset = data;
            cleanData(); //Filter for wanted years
            data03 = dataset.filter(function(d) { return d.Year === 2003; });
            data15 = dataset.filter(function(d) { return d.Year === 2015; });
            makePlot();
        }
    });
}
//Change to numbers from strings
function cleanData(){
    dataset.forEach(function(d) {
        d.Prostitution = +d.Prostitution;
        d.Total = +d.Total;
        d.VehicleTheft = +d.VehicleTheft;
        d.Year = +d.Year;
    });
}

function makePlot(){

    //Add svg to body
    var svg = d3.select("body")
        .append("svg")
        .attr({
            height: h,
            width: w
        });

    //Set 2003 as current data
    currentSet = data03;
    //Setup various scales
    var scaleX = d3.scale.linear()
        .domain([0, d3.max(currentSet, function(d){
            return d.Prostitution;
        })])
        .range([padding,w - 2 * padding]);

    var colorRange = d3.scale.linear()
        .domain([d3.min(currentSet, function(d) {
            return d.Total;
        }),d3.max(currentSet, function (d) {
            return d.Total;
        })])
        .range([128,0]);

    var scaleY = d3.scale.linear()
        .domain([0, d3.max(currentSet, function(d){
            return d.VehicleTheft;
        })])
        .range([h - padding, padding])

    var scaleR = d3.scale.linear()
        .domain([0, d3.max(currentSet, function(d) {
            return d.Total;
        })])
        .range([2, 30]);

    //Add cicles to plot
    svg.selectAll("circle")
        .data(currentSet)
        .enter()
        .append("circle")
        .attr({ //Prostitution on x-axis
            cx: function (d) {
                return scaleX(d.Prostitution);
            },
            cy: function (d) { //VehicleTheft on y-axis
                return scaleY(d.VehicleTheft);
            },
            r: function (d) { //Radius scale to total number of crimes in district
                return scaleR(d.Total);
            },
            fill: function (d) { //Set colors of circles according to size of total number of crimes
                return "rgb(0, 0, " + Math.round(colorRange(d.Total)) + ")";
            },
            stroke: function(d) { //Add white border to circle
                return "white";
            }
        });

    //Add text to each circle
    svg.selectAll("text")
        .data(currentSet)
        .enter()
        .append("text")
        .text(function(d) {
            return d.District; //Add district name
        })//Set position
        .attr("x", function(d){
            return scaleX(d.Prostitution);
        })
        .attr("y", function(d) {
            return scaleY(d.VehicleTheft);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "red")

    //Add axis
    var xAxis = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom")
        .ticks(10);

    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(scaleY)
        .orient("left")
        .ticks(10);

    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    //Add axis labels
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", w)
        .attr("y",  h - 6)
        .text("Total number of prostitution incidents");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Total number of vehicle theft incidents");
    //On click handle transition
    d3.select("p")
        .on("click", function() {
            if(!currentIs2003){//Toggle dataset
                currentSet = data03;
                d3.select("p").text("Click here to toggle, 2003 is selected")
                currentIs2003 = true;
            }else{
                currentSet = data15;
                d3.select("p").text("Click here to toggle, 2015 is selected")
                currentIs2003 = false;
            }
            //Update cicles
            svg.selectAll("circle")
                .data(currentSet)
                .transition()
                .duration(2000)
                .ease("linear")
                .delay(function (d, i) {
                    return i * 1000 / currentSet.length
                })
                .attr("cx", function (d) {
                    return scaleX(d.Prostitution);
                })
                .attr("cy", function (d) {
                    return scaleY(d.VehicleTheft);
                })
                .attr("r", function (d) {
                    return scaleR(d.Total);
                })
            //Update text for circles
            svg.selectAll("text")
                .data(currentSet)
                .transition()
                .duration(2000)
                .ease("linear")
                .delay(function (d,i) {
                    return i * 1000 / currentSet.length
                })
                .attr("x", function(d) {
                    return scaleX(d.Prostitution);
                })
                .attr("y", function(d) {
                    return scaleY(d.VehicleTheft);
                })
        });


};


