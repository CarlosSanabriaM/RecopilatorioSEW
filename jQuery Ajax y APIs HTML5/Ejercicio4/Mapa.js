"use strict";
class Mapa{
    constructor(){
        this.mapa;
        this.marcadores=[]; //Array para guardar los marcadores
        this.posicionActual;
        this.marcadorPosicionActual;
    }
    
    inicializar() {
        //Cuando la api de geolocalizacion termine de cargar la ubicacion actual: inicializamos el mapa
        navigator.geolocation.getCurrentPosition(this.inicializarMapa.bind(this),this.erroresGeolocalizacion);
    }
    
    inicializarMapa(posicion){        
        //Creamos un estilo nocturno
        var estiloNocturno = this.getEstiloNocturno();
        
        var mapaOpciones = {
            zoom: 15,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'nocturno']
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        this.mapa = new google.maps.Map(document.getElementById('mapa-canvas'), mapaOpciones);
        
        //Asociamos el 'typeId' nocturno con el estilo 'estiloNocturno'
        this.mapa.mapTypes.set('nocturno', estiloNocturno);
        //Por defecto, le ponemos el modo nocturno
        this.mapa.setMapTypeId('nocturno');

        // Añade un marcador en la posicion inicial del usuario
        this.actualizarYMostrarPosicionActual(posicion);
        
        //Centramos el mapa en la posicion actual
        this.mapa.setCenter(this.posicionActual);
        
        this.mostrarBaresCercanos();
        
        //watchPosition va a llamar continuamente a la funcion de actualizarPosicionActual,
        //pasandole nuevos datos de la posicion actual del dispositivo
        //Con ello conseguimos datos actualizados de la posicion del dispositvo (por si se mueve o se reciben datos mas precisos)
        var watchID = navigator.geolocation.watchPosition(this.actualizarYMostrarPosicionActual.bind(this),this.erroresGeolocalizacion);
    }
    
    
    actualizarPosicionActual(posicion){
        var latitud = posicion.coords.latitude;
        var longitud = posicion.coords.longitude;

        //Le asignamos a posicion actual las coordenadas que nos pasan
        this.posicionActual = new google.maps.LatLng(latitud,  longitud);
    }
    
    actualizarYMostrarPosicionActual(posicion){
        
        this.actualizarPosicionActual(posicion);
        
        //Si habia antes un marcador para la posicion actual, lo borramos del mapa
        if(this.marcadorPosicionActual!=null)
            this.marcadorPosicionActual.setMap(null);
        
        //Creamos un icono azul y lo ponemos en la posicion actual del dispositivo
        var image = "marcador_azul.png";
        this.marcadorPosicionActual = new google.maps.Marker({
            position: this.posicionActual,
            map: this.mapa,
            icon: image,
            title: "Tu posición"
        });
    }
    
    mostrarBaresCercanos(){
        var service;
        var request = {
            location: this.posicionActual,
            radius: '1000',  //en un radio de 1km
            types: ['bar'],  //bares
            opennow: true    //abiertos en la hora actual
        };

        service = new google.maps.places.PlacesService(this.mapa);
        service.nearbySearch(request, this.crearMarcadoresBares.bind(this));
    }
    
    crearMarcadoresBares(results, status) {
        console.log(this);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //Iteramos por los resultados que nos devolvio Google
            for (var i = 0; i < results.length; i++) {
                //Sacamos los datos de cada bar
                var bar = results[i];
                
                var localizacion = bar.geometry.location;
                var nombre = bar.name;
                var puntuacion = bar.rating;
                var direccion = bar.vicinity;
                
                this.addMarcadorConInfoWindow(localizacion,nombre,puntuacion,direccion);
            }
        }
    }


    erroresGeolocalizacion(error){
        $("#error").html("<p>Se ha producido un error al intentar obtener su geolocalización</p>");
        $("#error").show();
    }


    //Añade un marcador y lo almacena en el array
    addMarcador(localizacion,nombre) {
        var marcador = new google.maps.Marker({
            position: localizacion,
            map: this.mapa,
            title: nombre
        });
        this.marcadores.push(marcador);
        return marcador;
    }
    
    
    addMarcadorConInfoWindow(localizacion,nombre,puntuacion,direccion){
        var marcador = this.addMarcador(localizacion,nombre);
        this.addInfoWindow(marcador,nombre,puntuacion,direccion);
    }
    
    addInfoWindow(marcador,nombre,puntuacion,direccion){
        var contentString = '<div id="content">'+
                                '<h1>'+ nombre +'</h1>'+
                                '<div id="bodyContent">'+
                                    '<ul>'+
                                        '<li> Dirección: '+ direccion +'</li>'+
                                        '<li> Puntuación: '+ puntuacion +'</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marcador.setTitle(nombre);
        
        marcador.addListener('click', this.clickInfoWindowHandler.bind(this,marcador,infowindow));
    }
    
    clickInfoWindowHandler(marcador,infowindow){
        infowindow.open(this.mapa, marcador);
    }

    //Activa todos los marcadores.
    activarMarcadores(mapa) {
        for (var i = 0; i < this.marcadores.length; i++) {
            this.marcadores[i].setMap(mapa);
        }
    }

    // Oculta todos los marcadores, pero siguen almacenados en el array 
    ocultarMarcadores() {
        this.activarMarcadores(null);
    }

    // Mostrar todos los marcadores del array    
    mostrarMarcadores() {
        this.activarMarcadores(this.mapa);
    }    
    
    getEstiloNocturno(){
        return new google.maps.StyledMapType(
            [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ],
            {name: 'Nocturno'});
    }
    
}

var mapa = new Mapa();
google.maps.event.addDomListener(window, 'load', mapa.inicializar.bind(mapa));
