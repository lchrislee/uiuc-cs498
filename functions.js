function getGraphDimensions(pageEntry) {
    var tickValues = [];
    if (pageEntry == 0) {
        tickValues = [10, 15, 20, 30, 45];
    } else if (pageEntry == 1) {
        tickValues = [80, 95, 125, 150];
    } else {
        tickValues = [10, 20, 50, 100];
    }

    return {
        "minCity": pageEntry == 1 ? 80 : 10,
        "maxCity": pageEntry == 0 ? 45 : 150,
        "minHighway": pageEntry == 1 ? 70 : 10,
        "maxHighway": pageEntry == 0 ? 50 : 150,
        "tickValues": tickValues
    };
}

function processData(incoming, pageEntry) {

    let maxDimension = 400;
    let minMargin = 60;
    let dims = getGraphDimensions(pageEntry);

    var cityScale = d3.scaleLog([dims.minCity, dims.maxCity], [0, maxDimension]);
    var cityAxis = d3.axisBottom(cityScale).tickValues(dims.tickValues).tickFormat(d3.format("~s"));
    var highwayScale = d3.scaleLog([dims.minHighway, dims.maxHighway], [maxDimension, 0]);
    var highwayAxis = d3.axisLeft(highwayScale).tickValues(dims.tickValues).tickFormat(d3.format("~s"));

    var svg = d3.select("svg");

    // Chart
    svg.append("g")
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
                return 5;
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
            // Tooltip
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

    // Title
    svg.append("text")
        .attr("transform", "translate(" + (maxDimension - minMargin) / 2 + ", " + minMargin + ")")
        .text("2017 Model - Average MPG");

    // Y Axis
    svg.append("g")
        .attr("id", "highwayAxis")
        .attr("transform", "translate(" + minMargin + ", " + minMargin + ")")
        .call(highwayAxis);

    svg.append("text")
        .attr("transform", "translate(" + (minMargin / 2) + ", " + (maxDimension / 2 + minMargin) + ") rotate(-90)")
        .text("Highway");

    // X Axis
    svg.append("g")
        .attr("id", "cityAxis")
        .attr("transform", "translate(" + minMargin + ", " + (maxDimension + minMargin) + ")")
        .call(cityAxis);

    svg.append("text")
        .attr("transform", "translate(" + (maxDimension + minMargin) / 2 + ", " + (maxDimension + 1.6 * minMargin) + ")")
        .text("City");
}

function getToolTipDiv() {
    return d3.selectAll("div").filter("#tooltip");
}

function getToolTipText(datum, shouldshowCylinders) {
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