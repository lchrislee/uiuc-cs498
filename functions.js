function processData(incoming, pageCount) {

    let maxDimension = 400;
    let minMargin = 50;

    var cityScale = d3.scaleLog([10, 150], [0, maxDimension]);
    var cityAxis = d3.axisBottom(cityScale).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"));
    var highwayScale = d3.scaleLog([10, 150], [maxDimension, 0]);
    var highwayAxis = d3.axisLeft(highwayScale).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"));

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + minMargin + ", " + minMargin + ")")
        .selectAll("circle")
        .data(incoming)
        .enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return cityScale(Number(d.AverageCityMPG));
            })
            .attr("cy", function(d, i) {
                return highwayScale(Number(d.AverageHighwayMPG));
            })
            .attr("r", function(d, i) {
                return 5;// + Number(d.EngineCylinders);
            })
            .attr("fill", function(d) {
                if (d.Fuel == "Electricity") {
                    return "green";
                } else if (d.Fuel == "Diesel") {
                    return "yellow";
                } else {
                    return "red";
                }
            })
            .on("mouseover", function(d, i) {
                getToolTipDiv()
                    .style("opacity", 1)
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY + 15) + "px")
                    .html(getToolTipText(d));
            })
            .on("mouseout", function() {
                getToolTipDiv()
                    .style("opacity", 0)
                    .html("");
            });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + minMargin + ", " + minMargin + ")")
        .call(highwayAxis);

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + minMargin + ", " + (maxDimension + minMargin) + ")")
        .call(cityAxis);

}

function getToolTipDiv() {
    return d3.selectAll("div").filter("#tooltip");
}

function getToolTipText(datum) {
    var cylinderText = datum.EngineCylinders == "0" ? "N/A" : datum.EngineCylinders;
    return "Maker: " + datum.Make + "<br/># Cylinders: " + cylinderText + "<br/>Highway Mileage: " + datum.AverageHighwayMPG + "<br/>City Mileage: " + datum.AverageCityMPG;
}

function getStyle(isEnabled) {
    if (isEnabled) {
        return "style='opacity=100";
    } else {
        return "style='opacity=0'";
    }
}