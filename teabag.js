/**
 * Created by ranveer on 05/04/16.
 */

var lipsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the\
industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and\
scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into\
electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release\
of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like\
Aldus PageMaker including versions of Lorem Ipsum."

var now = new Date();
var hour = now.getHours();

// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 16,
    center: new google.maps.LatLng(19.134249, 72.913608),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
        stylers: [{
            saturation: -60
        }]
    }]
});

function assign_dots() {
    $("#hour").text(hour);
    console.log(hour);
    // Load the station data. When the data comes back, create an overlay.
    d3.json("stations.json", function (error, data) {

        var overlay = new google.maps.OverlayView();

        if (error) throw error;


        // Add the container when the overlay is added to the map.
        overlay.onAdd = function () {
            var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                .attr("class", "stations");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            overlay.draw = function () {
                var projection = this.getProjection(),
                    padding = 10;

                layer.selectAll("svg").remove();

                var marker = layer.selectAll("svg")
                    .data(d3.entries(data))
                    .each(transform) // update existing markers
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

                // Add a circle.
                marker.append("circle")
                    .attr("r", function(d){
                        return d.value[3][hour]*6;
                    })
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .on("click",toggleExpand);

                // Add a label.
                marker.append("text")
                    .attr("x", padding + 10)
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .text(function (d) {
                        if (d.value[3][hour])
                            return d.key;
                    });

                function transform(d) {
                    d = new google.maps.LatLng(d.value[1], d.value[0]);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }

                function toggleExpand(d) {
                    $("#information-title").text(d.value[2]);
                    $("#information-para").text(lipsum);
                }

            };
        };

        overlay.onRemove = function() {};

        // Bind our overlay to the map
        overlay.setMap(map);
    });
}
window.onload = assign_dots();

function progress_time() {
    hour = hour + 1;
    if (hour == 24) hour = 0;
    d3.selectAll("svg").remove();
    assign_dots();
}

function regress_time() {
    hour = hour - 1;
    if (hour == -1) hour = 23;
    d3.selectAll("svg").remove();
    assign_dots();
}