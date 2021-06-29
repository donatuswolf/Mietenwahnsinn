window.onload = function () {

    var radiusMin = 10;
    var radiusMax = 20;

    var color = {
        1: '#8cb369',
        2: '#E56399',
        3: '#E56399',
     



    }

    //// day/night theme ////////

    var timeState = urlParam('time');
    
    if (timeState == null) {
        timeState = 'day';
    };


    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    }

    var timeTheme = {
        day: {
            mapUrl: 'https://api.mapbox.com/styles/v1/mieten/ckn93f2pm0tbt17mhtwqzj5bg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWlldGVuIiwiYSI6ImNrbXhhc2ZzeDBsZXkycXBmY29vZmlhemkifQ.krIV4erLQm1Ma-ZHEJPi_w',
            sidebarColor: '#FFFFFF',
            fontColor: '#646978',
        }
    }

    //// load map ////////

    var lat = 52.51;
    var lng = 13.35;
    var zoom = 13;

    var mymap = L.map('mapid').setView([lat, lng], zoom);
    L.tileLayer(timeTheme[timeState].mapUrl).addTo(mymap);

    //// load dataset from json ////////

    var places = $.getJSON('places.json', function (json) {
        // console.log(json); // show the JSON file content into console
        for (var i = 0; i < json.length; i++) {
            if (json[i].time === timeState) {                   // filter day/night
                drawPlace(json[i]);                             // load one circle
            }
        }

        //// create circles ////////

        function drawPlace(data) {
            var circle = L.circleMarker([data.x, data.y], {
                // color: data.type,
                color: color[data.type], // color cirlces with type-colors
                // fillColor: '#f03',
                fillOpacity: 1,
                radius: radiusMin // default size of cirlces
            }).addTo(mymap);

            //// mouseover ////////

            // circle.on('mouseover', function () {
            //     playSound(data.id, data.vol);
            //     // this.setRadius(radiusMax)
            //     this.setRadius(map(data.db, 0, 1, radiusMin, radiusMax)); // size of cirlces when hovered

            //     $('#photo').css('background-image', 'url(assets/photos/' + data.id + '.jpg)'); // load photo
            //     $('#label').html(data.label); // add text
            //     $('#photo').removeClass('hidden'); // show photo
            //     $('#photobg').removeClass('hidden');
            // });

            //// click ////////
            circle.on('click', function () {
                playSound(data.id, data.vol);
                // this.setRadius(radiusMax)
                this.setRadius(map(data.db, 0, 1, radiusMin, radiusMax)); // size of cirlces when hovered

                $('#photo').css('background-image', 'url(assets/photos/' + data.id + '.jpg)'); // load photo

                //set aspect ratio based on data.type
                var width = "300px";;
                var height = "200px";;
                switch (data.type) {
                    case 1:
                        break;
                    case 2:
                        width = "774px";
                        height = "573px";
                        break;
                    case 3:
                        width = "756px";
                        height = "1146px";
                        break;
                     default:
                        break;
                }

                $('#photo').css('width', width.toString());
                $('#photo').css('height', height.toString());


                $('#label').html(data.label); // add text
                $('#photo').removeClass('hidden'); // show photo
                $('#photobg').removeClass('hidden');
            });

            // doubleclick ////////

            circle.on('dblclick', function () {
                if (data.googlemaps != '') {
                    window.open(data.googlemaps, '_blank'); // create link
                }
            });

            function playSound(name, volume) {
                var audio = new Audio('assets/sounds/' + name + '.mp3'); // load audio
                audio.volume = volume; // set to custom volume from dataset
                audio.loop = false;
                audio.play();

                //// mouseout ////////

                circle.on('mouseout', function () {
                    audio.pause();
                    circle.setRadius(radiusMin)
                    $('#photo').addClass('hidden'); // hide photo
                    $('#photobg').addClass('hidden');
                });
            }
        }
    });

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
}