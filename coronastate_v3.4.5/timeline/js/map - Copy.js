/////////////////////////////
//ACCESS TOKEN
/////////////////////////////
mapboxgl.accessToken =
    "pk.eyJ1Ijoibml0dHlqZWUiLCJhIjoid1RmLXpycyJ9.NFk875-Fe6hoRCkGciG8yQ";




/////////////////////////////
//ADD MAP CONTAINER
/////////////////////////////

var map = new mapboxgl.Map({
    container: "map",
    //Old, working, but no basemaps have labels
    //style: "mapbox://styles/nittyjee/ck2f3s0ks0u8o1cpfruf0qne6",
    //New, Not working
    style: "mapbox://styles/nittyjee/ck8j1l0e01adj1irx4mw3ywmz",
    hash: true,
    center: [20, 12],
    zoom: 1.5,
    pitchWithRotate: false
});

var hoveredStateId = null;

/////////////////////////////
//ADD NAVIGATION CONTROL (ZOOM IN AND OUT)
/////////////////////////////

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-left");




/////////////////////////////
//NOT SURE WHAT THIS IS
/////////////////////////////

urlHash = window.location.hash;

map.on("load", function() {
    console.log("load");
    var sliderVal = $("#date").val();
    var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
    var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));

    $("#linkButton").on("click", function() {
        document.location.href = "raster-version.html" + urlHash;
    });
});


map.on("error", function(e) {
    // Hide those annoying non-error errors
    if (e && e.error !== "Error") console.log(e);
});




//////////////////////////////////////////////
//TIME LAYER FILTERING. NOT SURE HOW WORKS.
//////////////////////////////////////////////


function changeDate(unixDate) {
    var year = parseInt(moment.unix(unixDate).format("YYYY"));
    var date = parseInt(moment.unix(unixDate).format("YYYYMMDD"));




    var yrFilter = ["all", ["<=", "YearStart", year],
        [">=", "YearEnd", year]
    ];

    var dateFilter = ["all", ["<=", "DayStart", date],
        [">=", "DayEnd", date]
    ];


    ///////////////////////////////
    //LAYERS FOR FILTERING
    ///////////////////////////////


    //NAHC
    map.setFilter("c7_dates-ajsksu", dateFilter);

    map.setFilter("time_test-2men60", dateFilter);

    map.setFilter("jhu_all3-db6ri5", dateFilter);

    map.setFilter("boundaries-0m2upp", dateFilter);

    map.setFilter("agg1-18x3fi", dateFilter);

    map.setFilter("agg1-5p32uh", dateFilter);

    map.setFilter("agg1-13tqas", dateFilter);

    map.setFilter("agg1-13tqas2", dateFilter);

    map.setFilter("all_locations-2wntvx", dateFilter);

} //end function changeDate




/////////////////////////////
//LAYERS AND LEGEND
/////////////////////////////


function setLayers() {

    //TOGGLE LAYERS
    var toggleableLayerIds = [

    ];

    //LEGEND?
    var legend = document.getElementById("legend");
    while (legend.hasChildNodes()) {
        legend.removeChild(legend.lastChild);
    }

    //TOGGLING
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        //use closure to deal with scoping
        (function() {
            var id = toggleableLayerIds[i];

            //ADD CHECKBOX
            var input = document.createElement("input");
            input.type = "checkbox";
            input.id = id;
            input.checked = true;

            //ADD LABEL
            var label = document.createElement("label");
            label.setAttribute("for", id);
            label.textContent = id;

            //CHECKBOX CHANGING (CHECKED VS. UNCHECKED)
            input.addEventListener("change", function(e) {
                map.setLayoutProperty(
                    id,
                    "visibility",
                    e.target.checked ? "visible" : "none"
                );
            });

            //NOTE?
            var layers = document.getElementById("legend");
            layers.appendChild(input);
            layers.appendChild(label);
            layers.appendChild(document.createElement("br"));
        })();
    }

}




/////////////////////////////
//LAYER CHANGING
/////////////////////////////


//BASEMAP SWITCHING
map.on('style.load', function() {
    //on the 'style.load' event, switch "basemaps" and then re-add layers
    //this is necessary because basemaps aren't a concept in Mapbox, all layers are added via the same primitives
    console.log("style change")
    switchStyle();
    var sliderVal = $("#date").val();
    var yr = parseInt(moment.unix(sliderVal).format("YYYY"));
    var date = parseInt(moment.unix(sliderVal).format("YYYYMMDD"));
    console.log(sliderVal)
    console.log(yr)
    console.log(date)
    setLayers();
    addLayers(yr, date);
});


//LAYER SWITCHING
function switchStyle() {
    var basemaps = document.getElementById('styleSwitcher');
    var inputs = basemaps.getElementsByTagName('input');
    console.log(inputs)
    console.log(inputs.length)

    function switchLayer(layer) {
        var layerId = layer.target.id;
        if (layerId == 'hidden') {
            // map.removeLayer('buildings')
            // map.removeLayer('netherlands_buildings-6wkgma')
            // map.removeLayer('manhattan_parcels_03-9qwzuf')
            // map.removeLayer('brooklyn_parcels_03-7y3mp4')
            // map.removeLayer('queens_parcels_03-cihsme')
            // map.removeLayer('bronx_parcels_03-4jgu91')
            // map.removeLayer('staten_island_parcels_03-1o8j1i')
            // map.removeLayer('US_Minor_Boundaries-1lyzcs')
            // map.removeLayer('US_Major_Boundaries_Lines-2706lh')
            // map.removeLayer('us_major_boundary_labels')
            // map.removeLayer('Indian_Subcontinent_Major_Bou-dpiee3')
            // map.removeLayer('Indian_Subcontinent_Major_Bou-5gq491')
            map.setStyle('mapbox://styles/nittyjee/ck2f3s0ks0u8o1cpfruf0qne6');
        } else {
            map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
        }
    }

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }
}




/////////////////////////////
//MAP LAYERS
/////////////////////////////

function addLayers(yr, date) {



    map.on('load', function() {




        //COUNTRIES

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "boundaries-0m2upp",
            type: "fill",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://nittyjee.9wwtr3tu"
            },
            "source-layer": "boundaries-0m2upp",
            paint: {
                "fill-color": "#d1d1d1",
                "fill-outline-color": "#b7b7b7",
                "fill-opacity": 0.8
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });

/*


        //AGG1.COVID ALL LAYER: ADM2 (COUNTIES)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "agg1-13tqas2",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://nittyjee.2mle18e2"
            },
            "source-layer": "agg1-13tqas",
            "minzoom": 5,
            paint: {
                "circle-radius": {
                    type: "exponential",
                    property: "count",
                    stops: [
                        [1, 1],
                        [100, 5],
                        [1000, 10],
                        [200000, 100]
                    ]
                },

                //CIRCLE COLOR
                "circle-color": "#FFA500",
                "circle-stroke-color": "#FFA500",
                "circle-opacity": {
                    type: "categorical",
                    property: "placetype",
                    stops: [
                        ["county", 0.15],
                        ["state", 0],
                    ]
                },
                "circle-stroke-opacity": {
                    type: "categorical",
                    property: "placetype",
                    stops: [
                        ["county", 1],
                        ["state", 0],
                    ]
                },



                "circle-stroke-width": 1,



            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });




        //AGG1.COVID ALL LAYER: ADM1 (STATES)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "agg1-13tqas",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://nittyjee.2mle18e2"
            },
            "source-layer": "agg1-13tqas",
            "minzoom": 3,
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "count",
                    stops: [
                        [1, 1],
                        [100, 5],
                        [1000, 10],
                        [200000, 100]
                    ]
                },

                //CIRCLE COLOR
                "circle-color": "#ff0000",
                "circle-stroke-color": "#ff0000",
                "circle-opacity": {
                    type: "categorical",
                    property: "placetype",
                    stops: [
                        ["county", 0],
                        ["state", 0.15],
                    ]
                },
                "circle-stroke-opacity": {
                    type: "categorical",
                    property: "placetype",
                    stops: [
                        ["county", 0],
                        ["state", 1],
                    ]
                },



                "circle-stroke-width": 1,



            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });


*/





        //CORONASTATE ALL


        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "all_locations-2wntvx",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://nittyjee.aqbb641j"
            },
            "source-layer": "all_locations-2wntvx",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [100, 5],
                        [1000, 10],
                        [1000000, 100]
                    ]
                },

                //CIRCLE COLOR
                "circle-color": {
                    property: "placetype",
                    type: "categorical",
                    stops: [
                        //Adm4: Green
                        ["adm3", "#039900"],
                        //County: Orange
                        ["adm2", "#ffa500"],
                        //State: Red
                        ["adm1", "#ff0000"],
                        //Country: Blue
                        ["adm0", "#0000ff"]
                    ]
                },
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": {
                    property: "placetype",
                    type: "categorical",
                    stops: [
                        //Adm4: Green
                        ["adm3", "#039900"],
                        //County: Orange
                        ["adm2", "#ffa500"],
                        //State: Red
                        ["adm1", "#ff0000"],
                        //Country: Blue
                        ["adm0", "#0000ff"]
                    ]
                },
                "circle-opacity": 0.15,
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });




/*

        //JHU ALL

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "jhu_all3-db6ri5",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://nittyjee.a28hpyud"
            },
            "source-layer": "jhu_all3-db6ri5",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "Cases",
                    stops: [
                        [1, 1],
                        [100, 5],
                        [1000, 10],
                        [200000, 100]
                    ]
                },

                //CIRCLE COLOR
                "circle-color": {
                    property: "placetype",
                    type: "categorical",
                    stops: [
                        //County: Red
                        ["state", "#ff0000"],
                        //Country: Blue
                        ["country", "#0000ff"]
                    ]
                },

                //CIRCLE STROKE COLOR
                "circle-stroke-color": {
                    property: "placetype",
                    type: "categorical",
                    stops: [
                        //County: Red
                        ["state", "#ff0000"],
                        //Country: Blue
                        ["country", "#0000ff"]
                    ]
                },
                "circle-opacity": 0.15,
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });

*/


        //JHU CLICK POPUP
        map.on('click', 'all_locations-2wntvx', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)

                //BEFORE MAP POP UP CONTENTS
                .setHTML(
                    e.features[0].properties.adm1 +
                    "<br>" +
                    "Cases: " +
                    e.features[0].properties.cases
                )

                .addTo(map);
        });



        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'all_locations-2wntvx', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'all_locations-2wntvx', function() {
            map.getCanvas().style.cursor = '';
        });




        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'all_locations-2wntvx', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            var coordinates = e.features[0].geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
                .setLngLat(coordinates)
				.setHTML(
					e.features[0].properties.adm1 +
					"<br>" +
					"Cases: " +
					e.features[0].properties.cases
				)
                .addTo(map);
        });

        map.on('mouseleave', 'all_locations-2wntvx', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
		});
	



	});
	
	


}