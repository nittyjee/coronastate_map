/////////////////////////////
//ACCESS TOKEN
/////////////////////////////
mapboxgl.accessToken =
    "pk.eyJ1IjoiY29yb25hc3RhdGUiLCJhIjoiY2s5OHN0aTM1MDVmdDNnbnhpN3FpbmdkbyJ9.Atz_138DSFlOs9zqCZ0M1A";

// Use this function
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/////////////////////////////
//ADD MAP CONTAINER
/////////////////////////////

var map = new mapboxgl.Map({
    container: "map",
    //Old, working, but no basemaps have labels
    //style: "mapbox://styles/nittyjee/ck2f3s0ks0u8o1cpfruf0qne6",
    //New, Not working
    style: "mapbox://styles/coronastate/ck9ae4mvz0xtd1ipfpb1vpw20",
    hash: true,
    center: [20, 12],
    zoom: 1.5,
    pitchWithRotate: false,
	//attributionControl: false
});
// Added the following for hover codes
var hoveredFeatureId = null;
var newQueryCount = null;
var oldQueryCount = null;
/////////////////////////////
//ADD NAVIGATION CONTROL (ZOOM IN AND OUT)
/////////////////////////////

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "bottom-right");

map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
map.addControl(new mapboxgl.AttributionControl(), "top-left");



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


    map.setFilter("covid_country_boundaries-dqpfoq", dateFilter);

    map.setFilter("adm0_test", dateFilter);

    map.setFilter("static_adm1_test", dateFilter);

    map.setFilter("adm1_bunch1_test", dateFilter);

    map.setFilter("adm1_bunch2_test", dateFilter);

    map.setFilter("adm2_test", dateFilter);

    map.setFilter("adm2_test_closer", dateFilter);

    map.setFilter("adm3-1aj9ap", dateFilter);



} //end function changeDate




/////////////////////////////
//LAYERS AND LEGEND
/////////////////////////////


function setLayers() {

    //TOGGLE LAYERS
    var toggleableLayerIds = [

    ];

    //LEGEND?
	/*A
    var legend = document.getElementById("legend");
    while (legend.hasChildNodes()) {
        legend.removeChild(legend.lastChild);
    }
	*/

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
//    Initialize the style using the current date
    const today = new Date()
    var sliderVal = today;
    var year = parseInt(moment.unix(moment(sliderVal).unix()).format("YYYY"));
    var date = parseInt(moment.unix(moment(sliderVal).unix()).format("YYYYMMDD"));

    setLayers();
    addLayers(year, date);
});

//LAYER SWITCHING
function switchStyle() {
    var basemaps = document.getElementById('styleSwitcher');
    var inputs = basemaps.getElementsByTagName('input');


    function switchLayer(layer) {
        var layerId = layer.target.id;

        if (layerId == 'hidden') {
            // map.removeLayer('buildings')
            // map.removeLayer('netherlands_buildings-6wkgma')
            // map.removeLayer('manhattan_parcels_03-9qwzuf')
            // map.removeLayer('brooklyn_parcels_03-7y3mp4')
            // map.removeLayer('queens_parcels_03-cihsme')
            // map.removeLayer('bronx_parcels_03-4jgu91')
            // map.removeLayer('Indian_Subcontinent_Major_Bou-dpiee3')
            // map.removeLayer('Indian_Subcontinent_Major_Bou-5gq491')
            map.setStyle('mapbox://styles/coronastate/ck9ae4mvz0xtd1ipfpb1vpw20');

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




        //COUNTRY BOUNDARIES

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "covid_country_boundaries-dqpfoq",
            type: "fill",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.3htx1534"
            },
            "source-layer": "covid_country_boundaries-dqpfoq",
            paint: {
                "fill-color": "#d1d1d1",
                "fill-outline-color": "#b7b7b7",
                "fill-opacity": 0.8
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });




        //Admin 0 (Countries)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm0_test",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.adm0-test"
            },
            "source-layer": "adm0_test",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#0000ff",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#0000ff",


//                "circle-opacity": 0.15,
                //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });


        //Admin 1 (States and Provinces, etc)


        ////////////////////////////////
        //Admin 1 Bunch 1 (less dense)
        ////////////////////////////////


        //Layer 1: Static Time, Faint
        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "static_adm1_test",
            type: "circle",
            minzoom: 1.5,
            maxzoom: 1.99,
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.static_adm1-test"
            },
            "source-layer": "static_adm1_test",
            paint: {
                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#ff0000",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#ff0000",

//                "circle-opacity": 0.15,
                //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-opacity": 0.35,

                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });

        //Admin 1 Bunch 1 (less dense)
        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm1_bunch1_test",
            type: "circle",
            minzoom: 2.0,
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.adm1_bunch1-test"
            },
            "source-layer": "adm1_bunch1_test",
            paint: {
                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#ff0000",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#ff0000",

//                "circle-opacity": {
//                    stops: [
//                        [0, 0],
//                        [3, 0.15]
//                    ]
//                },

                "circle-stroke-opacity": {
                    stops: [
                        [0, 0],
                        [3, 1]
                    ]
                },


//here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-width": 1,

            },

            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });



        //Admin 1 Bunch 2 (more dense)
        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm1_bunch2_test",
            type: "circle",
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.adm1_bunch2-test"
            },
            "source-layer": "adm1_bunch2_test",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#ff0000",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#ff0000",
//
//                "circle-opacity": {
//                    stops: [
//                        [2, 0],
//                        [3.5, 0.15]
//                    ]
//                },
                //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],

                "circle-stroke-opacity": {
                    stops: [
                        [2, 0],
                        [3.5, 1]
                    ]
                },


                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });




        //Admin 2 (Counties and Districts, etc)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm2_test",
            type: "circle",
            minzoom: 4.5,
            maxzoom: 5.499,
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.adm2-test"
            },
            "source-layer": "adm2_test",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#ffa500",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#ffa500",

//                "circle-opacity": 0.15,
                  //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });


        //Admin 2 (Counties and Districts, etc)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm2_test_closer",
            type: "circle",
            minzoom: 5.5,
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.adm2-test"
            },
            "source-layer": "adm2_test",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 2],
                        [5, 5],
                        [20, 8],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#ffa500",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#ffa500",

//                "circle-opacity": 0.15,
                   //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });




        //Admin 3 (More Local)

        map.addLayer({
            //ID: CHANGE THIS, 1 OF 3
            id: "adm3-1aj9ap",
            type: "circle",
            minzoom: 6.5,
            source: {
                type: "vector",
                //URL: CHANGE THIS, 2 OF 3
                url: "mapbox://coronastate.3dagq4o4"
            },
            "source-layer": "adm3-1aj9ap",
            paint: {


                "circle-radius": {
                    type: "exponential",
                    property: "cases",
                    stops: [
                        [1, 1],
                        [500, 2],
                        [5000, 5],
                        [100000, 20],
                        [2000000, 100]
                    ]
                },


                //CIRCLE COLOR
                "circle-color": "#039900",
                
                //CIRCLE STROKE COLOR
                "circle-stroke-color": "#039900",

//                "circle-opacity": 0.15,
                  //here we implement the 'feature-state' based on the 'hover' property we are setting
//we can use the same logic to any paint{} property

                "circle-opacity": [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.15
				    ],
                "circle-stroke-width": 1,
            },
            filter: ["all", ["<=", "DayStart", date],
                [">=", "DayEnd", date]
            ]
        });













































/////////////////////////
//HOVER CLICK POPUP
/////////////////////////

        ////////
        //ADM0
        ////////





        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'adm0_test', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'adm0_test', function() {
            map.getCanvas().style.cursor = '';
        });


        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'adm0_test', function(e) {
            //if we got a highlighted feature, we remove the hover state
            if (e.features.length > 0) {
             if (hoveredFeatureId) {
              map.setFeatureState(
              { source: 'adm0_test', sourceLayer: 'adm0_test', id: hoveredFeatureId},
              { hover: false }
              );
            }
            }
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
					e.features[0].properties.adm0 +
					"<br>" +
					"Cases: " +
					formatNumber(e.features[0].properties.cases)
				)
                .addTo(map);
        });

        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['adm0_test']});
            var boldFeat=overlap_tool(features, e.lngLat);


            if(typeof boldFeat !== 'undefined')
            {
        //      console.log(boldFeat.id);
              hoverpopupShow(e,boldFeat,popup);
            }

            if (features.length !== oldQueryCount)
            {
                newQueryCount=oldQueryCount;
                oldQueryCount=features.length;
                //console.log("Change");
                //remove old hovered
                if (hoveredFeatureId) {
                    map.setFeatureState(
                        { source: 'adm0_test', sourceLayer: 'adm0_test', id: hoveredFeatureId},
                        { hover: false }
                    );
                }

                //remove popup
                //popup.remove();
                //change hovered to new one
                if(typeof boldFeat !== 'undefined')
                {
                    hoveredFeatureId =  boldFeat.id;
                    map.setFeatureState(
                    { source: 'adm0_test', sourceLayer: 'adm0_test', id: boldFeat.id},
                    { hover: true }
                    );
                //ADD NEW POPUP HERE
                   //popupShow(e,boldFeat,popup);
                }

            }

        });
        map.on('mouseleave', 'adm0_test', function() {
            map.getCanvas().style.cursor = '';
//            popup.remove();
            if (hoveredFeatureId) {
                    map.setFeatureState(
                    { source: 'adm0_test', sourceLayer: 'adm0_test', id: hoveredFeatureId},
                    { hover: false }
                    );
            }

            hoveredFeatureId =  null;
        });
          //ADM0 CLICK POPUP
        map.on('click', 'adm0_test', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['adm0_test']});
	        var boldFeat=overlap_tool(features, e.lngLat);
        });



        //return feature id to the closest feature center
        function overlap_tool(featArr, mLoc){
        //console.log(featArr.length);
            var retval = 99999;
            var retid = null;

        //if nothing, we keep 0, and we avoid type warnings...
            var retFeature=featArr[0];

            for (var i = 0; i < featArr.length; i++) {
            distance=pointDistance(featArr[i].geometry.coordinates[1], featArr[i].geometry.coordinates[0], mLoc.lat, mLoc.lng,'K');
            if (distance < retval)
            {
            retval = distance;
            retid = featArr[i].id;
            //mapbox needs featureByID..
            retFeature= featArr[i];
            }
            }
        //    console.log("RetID:", retid);
            return retFeature;
        }


        function pointDistance(lat1, lon1, lat2, lon2, unit) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
            }
            else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
            }
        }


        function hoverpopupShow(e,feature,popup)
        {
        popup.remove();

        var placement = e.lngLat;
        while (Math.abs(e.lngLat.lng - placement[0]) > 180) {
            placement[0] += e.lngLat.lng > placement[0] ? 360 : -360;
        }
//        console.log(placement);

        //placement.lat = placement.lat+5;


        popup.setLngLat(placement)
             .setHTML(
                    feature.properties.adm0 +
                    "<br>" +
                    "Cases: " +
                    formatNumber(feature.properties.cases)).addTo(map);
        }

        ////////
        //ADM1 Bunch 1
        ////////

        //ADM1_Bunch1 CLICK POPUP
        map.on('click', 'adm1_bunch1_test', function(e) {
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
                    e.features[0].properties.adm0 +
                    "<br>" +
                    "Cases: " +
                    formatNumber(e.features[0].properties.cases)
                )

                .addTo(map);
        });



        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'adm1_bunch1_test', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'adm1_bunch1_test', function() {
            map.getCanvas().style.cursor = '';
        });




        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'adm1_bunch1_test', function(e) {
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
					formatNumber(e.features[0].properties.cases)
				)
                .addTo(map);
        });

        map.on('mouseleave', 'adm1_bunch1_test', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
        


        ////////
        //ADM1 Bunch 2
        ////////

        //ADM1_Bunch1 CLICK POPUP
        map.on('click', 'adm1_bunch2_test', function(e) {
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
                    e.features[0].properties.adm0 +
                    "<br>" +
                    "Cases: " +
                    formatNumber(e.features[0].properties.cases)
                )

                .addTo(map);
        });



        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'adm1_bunch2_test', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'adm1_bunch2_test', function() {
            map.getCanvas().style.cursor = '';
        });




        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'adm1_bunch2_test', function(e) {
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
					formatNumber(e.features[0].properties.cases)
				)
                .addTo(map);
        });

        map.on('mouseleave', 'adm1_bunch2_test', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
        


        ////////
        //ADM2
        ////////

        //ADM1_Bunch1 CLICK POPUP
        map.on('click', 'adm2_test', function(e) {
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
                    e.features[0].properties.adm2 +
                    "<br>" +
                    e.features[0].properties.adm1 +
                    "<br>" +
                    e.features[0].properties.adm0 +
                    "<br>" +
                    "Cases: " +
                    formatNumber(e.features[0].properties.cases)
                )

                .addTo(map);
        });



        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'adm2_test', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'adm2_test', function() {
            map.getCanvas().style.cursor = '';
        });




        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'adm2_test', function(e) {
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
					e.features[0].properties.adm2 +
					"<br>" +
					"Cases: " +
					formatNumber(e.features[0].properties.cases)
				)
                .addTo(map);
        });

        map.on('mouseleave', 'adm2_test', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
        


        ////////
        //ADM2_Closer
        ////////

        //ADM1_Bunch1 CLICK POPUP
        map.on('click', 'adm2_test_closer', function(e) {
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
                    e.features[0].properties.adm2 +
                    "<br>" +
                    e.features[0].properties.adm1 +
                    "<br>" +
                    e.features[0].properties.adm0 +
                    "<br>" +
                    "Cases: " +
                    formatNumber(e.features[0].properties.cases)
                )

                .addTo(map);
        });



        //CURSOR ON HOVER

        //ON HOVER
        map.on('mouseenter', 'adm2_test_closer', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        //OFF HOVER
        map.on('mouseleave', 'adm2_test_closer', function() {
            map.getCanvas().style.cursor = '';
        });




        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'adm2_test_closer', function(e) {
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
					e.features[0].properties.adm2 +
					"<br>" +
					"Cases: " +
					formatNumber(e.features[0].properties.cases)
				)
                .addTo(map);
        });

        map.on('mouseleave', 'adm2_test_closer', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
		});
	
	



	});
	
	


}