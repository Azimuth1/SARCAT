//State/Province/Region
//COunty/District

labelUnits = function (currentUnit, type) {
    var unitType = {
        height: {
            Metric: 'cm',
            US: 'in'
        },
        weight: {
            Metric: 'kg',
            US: 'lbs'
        },
        distanceMed: {
            Metric: 'Meters',
            US: 'Yards'
        },
        distanceSmall: {
            Metric: 'Meters',
            US: 'Feet'
        },
        distance: {
            Metric: 'Kilometers',
            US: 'Miles'
        },
        distanceSmall: {
            Metric: 'Meters',
            US: 'Feet'
        },
        temperature: {
            Metric: '°C',
            US: '°F'
        },
        speed: {
            Metric: 'kph',
            US: 'mph'
        }
    };
    return unitType[type][currentUnit]
};
boundsString2Array = function (bounds) {
    if (!bounds) {
        return;
    }
    bounds = bounds.split(',')
        .map(function (d) {
            return +d;
        });
    return [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]]
    ];
};
setMap = function (context, bounds, agencyMapComplete) {
    var map = L.map(context, {});
    var layers = {
        Streets: L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png'),
        Outdoors: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.h4gh1idp/{z}/{x}/{y}.png'),
        Satellite: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.map-7z4qef6u/{z}/{x}/{y}.png')
    };
    layers.Outdoors.addTo(map);
    L.control.layers(layers)
        .addTo(map);
    map.scrollWheelZoom.disable();
    map.fitBounds(bounds);
    var lc = L.control.locate({
            drawCircle: false,
            markerStyle: {
                fillOpacity: 0,
                opacity: 0
            },
            onLocationError: function (err) {
                alert(err.message);
            },
            onLocationOutsideMapBounds: function (context) {
                alert(context.options.strings.outsideMapBoundsMsg);
            },
            locateOptions: {
                maxZoom: 13,
            }
        })
        .addTo(map);
    /*if (agencyMapComplete) {
        $('#geolocate').addClass('hide');
         return;
    }*/
    var searching;
    if (!navigator.geolocation) {
        $('#geolocate')
            .html('Geolocation is not available');
    } else {
        geolocate.onclick = function (e) {
            if (searching) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            $('#geolocate')
                .html('Locating.....');
            searching = true;
            //map.locate();
            lc.start();
            //setTimeout(function () {
            //lc.stop();
            //}, 8000);
        };
    }
    map.on('locationfound', function (e) {
        $('#geolocate')
            .remove();
        $('.mapCrosshair')
            .css('color', '#00CB00');
    });
    map.on('locationerror', function () {
        $('#geolocate')
            .html('Position could not be found - Drag map to set extent');
    });
    map.on('moveend', function () {
        var bnds = map.getBounds()
            .toBBoxString();
        $('[name="bounds"]')
            .val(bnds)
            .trigger("change");
    });
    return map;
}
newProjectSetMap = function (context, bounds, points) {
    var obj = {};
    var marker;
    var map = L.map(context);
    /*L.mapbox.accessToken = 'pk.eyJ1IjoibWFwcGlza3lsZSIsImEiOiJ5Zmp5SnV3In0.mTZSyXFbiPBbAsJCFW8kfg';
    var map = L.mapbox.map(context);
    L.control.scale().addTo(map);
    var layers = {
        Outdoors: L.mapbox.tileLayer('examples.ik7djhcc'),
        Streets: L.mapbox.tileLayer('jasondalton.h4gh1idp'),
        Satellite: L.mapbox.tileLayer('jasondalton.map-7z4qef6u')
    };
    */
    var layers = {
        Streets: L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png'),
        Outdoors: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.h4gh1idp/{z}/{x}/{y}.png'),
        Satellite: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.map-7z4qef6u/{z}/{x}/{y}.png')
    };
    layers.Outdoors.addTo(map);
    L.control.layers(layers)
        .addTo(map);
    var latLngBounds = L.latLngBounds(bounds);
    var center = latLngBounds.getCenter();
    obj.editPoint = function (lat, lng) {
        marker.setLatLng([lat, lng]);
    };
    obj.reset = function () {
        map.fitBounds(bounds);
        marker.setLatLng(center);
        $('[name="' + points.name + '.lng"]')
            .val(center.lng)
            .trigger("change");
        $('[name="' + points.name + '.lat"]')
            .val(center.lat)
            .trigger("change");
        $('[name="coords.bounds"]')
            .val(bounds.toString())
            .trigger("change");
    };
    map.scrollWheelZoom.disable();
    var ipp = {
        val: "ippCoordinates",
        name: "coords.ippCoordinates",
        text: 'IPP Location. <br>Direction of Travel (hover to edit): <div class="fa fa-arrow-circle-up fa-2x fa-fw travelDirection"></div>', //"IPP Location",
        icon: 'fa-times-circle-o',
        color: 'red'
    };
    var myIcon = L.AwesomeMarkers.icon({
        icon: ipp.icon,
        prefix: 'fa',
        markerColor: ipp.color,
        iconColor: '#fff',
    });
    var marker = L.marker(center, {
        draggable: true,
        //editable: false,//true,
        icon: myIcon,
        name: ipp.name,
        val: ipp.val,
    });
    marker.addTo(map);
    marker.on('dragend', function (event) {
        var marker = event.target;
        var position = marker.getLatLng();
        $('[name="' + points.name + '.lng"]')
            .val(position.lng)
            .trigger("change");
        $('[name="' + points.name + '.lat"]')
            .val(position.lat)
            .trigger("change");
    });
    return obj;
};
getCoords = function (record) {
    var mapPoints = [{
        val: "ippCoordinates",
        name: "coords.ippCoordinates",
        text: 'IPP Location. <br>Direction of Travel (hover to edit): <div class="fa fa-arrow-circle-up fa-2x fa-fw travelDirection"></div>', //"IPP Location",
        icon: 'fa-times-circle-o',
        color: 'red'
    }, {
        val: "decisionPointCoord",
        name: "coords.decisionPointCoord",
        text: "Decision Point",
        icon: 'fa-code-fork',
        color: 'orange'
    }, {
        val: "destinationCoord",
        name: "coords.destinationCoord",
        text: "Intended Destination",
        icon: 'fa-flag-checkered',
        color: 'blue'
    }, {
        val: "revisedLKP_PLS",
        name: "coords.revisedLKP_PLS",
        text: "Revised IPP",
        icon: 'fa-male',
        color: 'red'
    }, {
        val: "findCoord",
        name: "coords.findCoord",
        text: "Find Location",
        icon: 'fa-flag-checkered',
        color: 'green'
    }, {
        val: "intendedRoute",
        name: "coords.intendedRoute",
        text: "Intended Route",
        path: {
            stroke: '#37A8DA'
        }
    }, {
        val: "actualRoute",
        name: "coords.actualRoute",
        text: "Actual Route",
        path: {
            stroke: 'green',
            weight: 8
        }
    }];
    mapPoints = _.object(_.map(mapPoints, function (x) {
        return [x.val, x];
    }));
    if (!record.coords) {
        return mapPoints;
    }
    var coords = record.coords;
    _.each(mapPoints, function (d, e) {
        mapPoints[e].coords = coords[e];
    });
    return _.map(mapPoints, function (d) {
        return d;
    });
};
formSetMap = function (context, recordId) {
    var markers = {};
    var paths = {};
    var coords = {};
    var obj = {};
    var map = L.map(context, {
        measureControl: true
    });
    var layers = {
        Streets: L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png'),
        Outdoors: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.h4gh1idp/{z}/{x}/{y}.png'),
        Satellite: L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.map-7z4qef6u/{z}/{x}/{y}.png')
    };
    layers.Outdoors.addTo(map);
    L.control.layers(layers)
        .addTo(map);
    drawnPaths = new L.FeatureGroup()
        .addTo(map);
    drawnPoints = new L.FeatureGroup()
        .addTo(map);
    map.scrollWheelZoom.disable();
    map.on('moveend', function () {
        var bounds = map.getBounds()
            .toBBoxString();
        $('[name="coords.bounds"]')
            .val(bounds)
            .trigger("change");
    });
    obj.add = function (d) {
        var val = d.val;
        if (!d.path) {
            coords[val] = d;
            obj.addPoint(d);
        }
        if (val === 'intendedRoute') {
            coords[d.val] = d;
            if (d.coords) {
                obj.addPoly(d, JSON.parse(d.coords));
                return;
            }
            var start = coords.ippCoordinates.layer.getLatLng();
            var end = (coords.destinationCoord) ? coords.destinationCoord.layer.getLatLng() : map.getCenter();
            var latlngs = [
                [start.lat, start.lng],
                [end.lat, end.lng]
            ];
            obj.addPoly(d, latlngs);
        }
        if (val === 'actualRoute') {
            coords[d.val] = d;
            if (d.coords) {
                obj.addPoly(d, JSON.parse(d.coords));
                return;
            }
            var start = coords.ippCoordinates.layer.getLatLng();
            var end = (coords.findCoord) ? coords.findCoord.layer.getLatLng() : map.getCenter();
            var latlngs = [
                [start.lat, start.lng],
                [end.lat, end.lng]
            ];
            obj.addPoly(d, latlngs);
        }
    };
    obj.remove = function (d) {
        if (d.path) {
            obj.removePoly(d);
        } else {
            obj.removePoint(d);
            return;
        }
    };
    obj.addPoly = function (d, latlngs) {
        color = d.path.stroke;
        var polyline = L.polyline(latlngs, {
            color: color,
            opacity: 0.9,
            name: d.name,
            val: d.val,
            //editable: true
        });
        drawnPaths.addLayer(polyline);
        marker.setZIndexOffset(4);
        coords[d.val].layer = polyline;
        var lineString = JSON.stringify(latlngs);
        $('[name="' + d.name + '"]')
            .val(lineString)
            .trigger("change");
        polyline.on('click', function (d) {
            polyline.editing.enable();
        });
        polyline.on('dblclick', function (d) {
            polyline.editing.disable();
        });
        $('#formMap')
            .on('mouseup', '.leaflet-editing-icon', function (d) {
                drawnPaths.eachLayer(function (layer) {
                    var name = layer.options.name;
                    if (layer._path) {
                        latlngs = layer.getLatLngs()
                            .map(function (d) {
                                return [d.lat, d.lng]
                            });
                        var lineString = JSON.stringify(latlngs);
                        $('[name="' + name + '"]')
                            .val(lineString)
                            .trigger("change");
                        return;
                    }
                });
            })
            //var lineString = JSON.stringify(layer.toGeoJSON());
    };
    obj.removePoly = function (d) {
        var path = coords[d.val].layer;
        $('[name="' + d.name + '"]')
            .val('')
            .trigger("change");
        drawnPaths.removeLayer(path);
        delete coords[d.val];
    };
    obj.removePoint = function (d) {
        var marker = coords[d.val].layer;
        if (!marker) {
            return;
        }
        $('[name="' + d.name + '.lng"]')
            .val('')
            .trigger("change");
        $('[name="' + d.name + '.lat"]')
            .val('')
            .trigger("change");
        drawnPoints.removeLayer(marker);
        delete coords[d.val];
    };
    obj.editPoint = function (name) {
        console.log(name)
        var coords = Records.findOne(recordId)
            .coords[name];
        console.log(coords)
        var layer = drawnPoints.getLayers()
            .filter(function (d) {
                return d.options.name === 'coords.' + name;
            });
        if (!layer.length) {
            return;
        }
        layer[0].setLatLng([coords.lat, coords.lng]);
        obj.fitBounds();
    };
    obj.addPoint = function (d) {
        var _coords = d.coords; // || map.getCenter();
        if (!d.coords) {
            var ne = map.getBounds()
                ._northEast;
            var center = map.getCenter();
            _coords = {
                lat: center.lat,
                lng: (center.lng + (ne.lng - center.lng) / 2)
            }
        }
        var myIcon = L.AwesomeMarkers.icon({
            icon: d.icon,
            prefix: 'fa',
            markerColor: d.color,
            iconColor: '#fff',
        });
       /* if (d.name === "coords.ippCoordinates") {
            var myIcon = L.divIcon({
                iconSize: [50, 50],
                iconAnchor: [25, 25],
                className: 'fa ' + d.icon + ' fa-5x fa-fw _pad1 text-danger'
            });
        }*/
        var draggable = (Roles.userIsInRole(Meteor.userId(), ['editor', 'admin'])) ? true : false;
        marker = L.marker(_coords, {
            draggable: draggable,
            //editable: false,//true,
            icon: myIcon,
            name: d.name,
            val: d.val,
        });
        var text = d.text;
        //marker.dragging.disable()
        coords[d.val].layer = marker;
        drawnPoints.addLayer(marker);
        // }
        //marker.setZIndexOffset(4);
        $('[name="' + d.name + '.lng"]')
            .val(_coords.lng)
            .trigger("change");
        $('[name="' + d.name + '.lat"]')
            .val(_coords.lat)
            .trigger("change");

        function newElev(d) {
                console.log(d)
                if (d.name !== 'coords.ippCoordinates' && d.name !== 'coords.findCoord') {
                    return;
                }
                var record = Records.findOne(recordId);
                Meteor.call('setLocale', record._id, function (err, d) {
                    console.log(d);
                    if (err) {
                        return console.log(err);
                    }
                });
                Meteor.call('setDistance', record._id, function (err, d) {
                    console.log('distance: ' + d);
                    if (err) {
                        return console.log(err);
                    }
                });
                Meteor.call('setFindBearing', record._id, function (err, d) {
                    console.log('bearing: ' + d);
                    if (err) {
                        return console.log(err);
                    }
                });
                Meteor.call('setEcoRegion', recordId, function (err, d) {
                    if (err) {
                        return;
                    }
                });
                Meteor.call('setElevation', record._id, function (err, d) {
                    console.log('elevation: ' + d);
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            /*marker.on('dragstart', function (event) {
                confirm('Are you sure you want to update your IPP?')
            });*/
        marker.on('dragend', function (event) {
            var marker = event.target;
            var position = marker.getLatLng();
            console.log(recordId, d.name, position)
            Meteor.call('updateRecord', recordId, d.name, position, function (err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (d.name === 'coords.ippCoordinates' || d.name === 'coords.findCoord') {
                    newElev(d);
                }
            });
        });
        return marker;
    }
    obj.fitBounds = function () {
        map.fitBounds(drawnPoints.getBounds()
            .extend(drawnPaths.getBounds())
            .pad(0));
    };
    return obj;
}
