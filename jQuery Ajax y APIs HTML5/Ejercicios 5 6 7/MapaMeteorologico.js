"use strict";
class MapaMeteorologico{
    constructor(){
        this.mapa;
        this.posicionActual;
        this.marcadorPosicionActual;
        
        this.apikeyOpenWeather = "7fc07660c3a999e7e1a9e6f53a925d92";
        this.unidades = "&units=metric";
        this.idioma = "&lang=es";
        
        this.horaMedida;
        this.fechaMedida;
        this.ultimaMedida; 
        this.nubosidad;
        this.humedad;
        this.presion;
        this.srcIconoTiempo;
        this.gradosTemp;
        this.gradosTempMin;
        this.gradosTempMax;
        this.descripcion;
        this.vientoKM_H;
        this.direccionViento;
        this.visibilidad_KM;
        this.horaAmanece;
        this.horaOscurece;
        this.nombreEstacion;
        this.latitudEstacion;
        this.longitudEstacion;
        
        this.autocomplete;
        
        this.infowindow;
        
        this.buscadoAlgunSitio = false;
    }
    
    inicializar() {
        //Cuando la api de geolocalizacion termine de cargar la ubicacion actual: inicializamos el mapa
        navigator.geolocation.getCurrentPosition(this.inicializarMapa.bind(this),this.erroresGeolocalizacion);
    }
    
    inicializarMapa(posicion){        
        var estiloNocturno = this.getEstiloNocturno();//Creamos un estilo nocturno
        
        var mapaOpciones = {
            zoom: 15,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'nocturno']
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        this.mapa = new google.maps.Map(document.getElementById('mapa-canvas'), mapaOpciones);
        this.mapa.mapTypes.set('nocturno', estiloNocturno);//Asociamos el 'typeId' nocturno con el estilo 'estiloNocturno'
        this.mapa.setMapTypeId('nocturno');//Por defecto, le ponemos el modo nocturno

        // Añade un marcador en la posicion inicial del usuario y le coloca una ventana 
        //con informacion meteorologica relativa a dichas coordenadas
        this.actualizarYMostrarPosicionActual(posicion);
        
        this.mapa.setCenter(this.posicionActual);
        this.marcadorPosicionActual.setTitle("Tu posición");
        
        this.crearAutocompletado();
    }
    
    actualizarYMostrarPosicionActual(posicion){   
        this.actualizarPosicionActual(posicion);
        this.addMarcadorConMeteorologicInfoWindow();//Añadimos una ventana con informacion del tiempo en la posicion actual
    }
    
    actualizarPosicionActual(posicion){
        //Si la posicion es un objeto de tipo LatLng del api de google, lo asignamos directamente a la posicion actual
        if(posicion instanceof google.maps.LatLng)
            this.posicionActual = posicion;
        
        else{
            //Si no, es que es un objeto de tipo Position devuelto por la api de geolocalizacion
            var latitud = posicion.coords.latitude;
            var longitud = posicion.coords.longitude;
            this.posicionActual = new google.maps.LatLng(latitud,  longitud);    
        }
    }
    
    addMarcadorConMeteorologicInfoWindow(){
        this.addMarcadorPosicionActual();
        this.addMeteorologicInfoWindow();
    }
    
    addMarcadorPosicionActual() {
        //Si habia antes un marcador para la posicion actual, lo borramos del mapa
        if(this.marcadorPosicionActual!=null)
            this.marcadorPosicionActual.setMap(null);
        
        //Creamos un icono azul y lo ponemos en la posicion actual del dispositivo
        var image = "iconos/marcador_azul.png";
        this.marcadorPosicionActual = new google.maps.Marker({
            position: this.posicionActual,
            map: this.mapa,
            icon: image
        });
    }
    
    addMeteorologicInfoWindow(){
        //Creamos una infoWindow con esta estructura html
        var contentString = '<div id="mensajeError"></div>'+
                            '<div id="seccionTiempo">'+
                                '<div id="cabeceraTiempo">'+
                                    '<h2 id="tiempoEn"></h2>'+
                                    '<div id="divIconoTiempo"></div>'+
                                '</div>'+
                                '<p id="ultimaMedida"></p>'+
                                '<div id="datos">'+
                                    '<div id="datosPrincipales">'+
                                        '<div id="divTemperaturaTiempo">'+
                                            '<div id="divTemperatura"><span id="gradosTemperatura"></span></div>'+
                                        '</div>'+
                                        '<p id="descripcion"></p>'+
                                        '<div id="datosExtraTemperatura">'+
                                            '<div id="divTabla">'+
                                                '<table>'+
                                                    '<tr>'+
                                                        '<th>Min</th><th>Máx</th>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<td id="gradosMin"></td><td id="gradosMax"></td>'+
                                                    '</tr>'+
                                                '</table>'+
                                            '</div>'+
                                            '<div id="divIconoTemperatura"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div id="restoDatos"></div> '+
                                '</div>'+
                                '<div id="estacionMeteorologica">'+
                                    '<h3 id="nombreEstacion"></h3>'+
                                    '<div id="coordenadasEstacion"></div>'+
                                '</div>'+
                            '</div>';
        
        this.infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        
        //Guardamos los datos meteorologicos de la posicion actual
        var latitud = this.posicionActual.lat();
        var longitud = this.posicionActual.lng();
        this.cargarDatosMeteorologicos(latitud,longitud);
        
        //Le añadimos al marcador de la posicion actual un escuchador al evento click, para que pase a ejecutar la funcion que muestra la informacion meteorologica
        this.marcadorPosicionActual.addListener('click', this.abrirInformacionMeteorologica.bind(this));
    }
    
    abrirInformacionMeteorologica(){
        this.infowindow.open(this.mapa, this.marcadorPosicionActual);//Abrimos la info window
        this.mostrarDatosTiempo();//Mostramos los datos del tiempo que teniamos almacenados previamente
    }
    
    cargarDatosMeteorologicos(latitud,longitud){
        var urlOpenWeather = "http://api.openweathermap.org/data/2.5/weather?lat="+ latitud +"&lon="+ longitud + this.unidades + this.idioma + "&APPID=" + this.apikeyOpenWeather;
        
        $.ajax({
            dataType: "json",
            url: urlOpenWeather,
            method: 'GET',
            success: this.guardarDatosMeteorologicos.bind(this),
            error:function(){
                $("#mensajeError").html("¡En este momento no se puede obtener la información meteorológica!"); 
            }
        });
    }
    
    guardarDatosMeteorologicos(datos){
        this.horaMedida = new Date(datos.dt *1000).toLocaleTimeString();
        this.fechaMedida = new Date(datos.dt *1000).toLocaleDateString();
        this.ultimaMedida = this.fechaMedida + " " + this.horaMedida; 
        this.nubosidad =  datos.clouds.all;
        this.humedad = datos.main.humidity;
        this.presion = datos.main.pressure;
        var codigoIcono = datos.weather[0].icon;
        this.srcIconoTiempo = "http://openweathermap.org/img/w/" + codigoIcono + ".png";
        this.gradosTemp = datos.main.temp;
        this.gradosTempMin = datos.main.temp_min;
        this.gradosTempMax = datos.main.temp_max;
        this.descripcion = datos.weather[0].description;
            this.descripcion = this.descripcion.charAt(0).toUpperCase() + this.descripcion.slice(1);//Pasamos la primera letra de la descripcion a mayúsculas
        this.vientoKM_H = datos.wind.speed * 3.6;
            this.vientoKM_H = this.vientoKM_H.toFixed(2);
        this.direccionViento = datos.wind.deg;
        
        if(this.direccionViento!=null)
            this.direccionViento = this.direccionViento.toFixed(2);
        
        (datos.visibility!=null ? this.visibilidad_KM = datos.visibility / 1000 : this.visibilidad_KM = null );
        this.horaAmanece = new Date(datos.sys.sunrise *1000).toLocaleTimeString();
        this.horaOscurece = new Date(datos.sys.sunset *1000).toLocaleTimeString();

        this.nombreEstacion = datos.name;
        this.latitudEstacion = datos.coord.lat;
        this.longitudEstacion = datos.coord.lon;
        
        
        //Al guardar los datos, abrimos la infoWindow directamente, excepto la primera vez que se llama al metodo,
        //que es cuando se guarda la informacion de la ubicacion actual del dispositivo
        //Dejamos que sea el usuario el que haga click si quiere en la posicion actual para ver la informacion meteorologica
        if(this.buscadoAlgunSitio)
            this.abrirInformacionMeteorologica();
    }
    
    mostrarDatosTiempo(){
        //Si la temperatura es <= de 10ºC, consideramos que esta frio
        var srcIconoTemp;
        if(this.gradosTemp <= 10)
            srcIconoTemp="iconos/frio.png";
        else srcIconoTemp="iconos/calor.png";

        $("#tiempoEn").html("El tiempo en " + this.nombreEstacion);

        $("#ultimaMedida").html("Ultima medición: "+this.ultimaMedida);
        $("#divIconoTiempo").html("<img id='iconoTiempo' src='" + this.srcIconoTiempo + "'/>");
        $("#gradosTemperatura").html(this.gradosTemp + "ºC");
        $("#descripcion").html(this.descripcion);
        $("#divIconoTemperatura").html("<img id='iconoTemperatura' src='" + srcIconoTemp + "'/>");
        $("#gradosMin").html(this.gradosTempMin + "ºC");
        $("#gradosMax").html(this.gradosTempMax + "ºC");    

        var stringRestoDatos = "<ul><li>Nubosidad: " + this.nubosidad + " %</li>";        
                stringRestoDatos += "<li>Humedad: " + this.humedad + " %</li>";        
                stringRestoDatos += "<li>Velocidad viento: " + this.vientoKM_H + " km/h</li>";

                if(this.direccionViento==null)
                    stringRestoDatos += "<li>Dirección viento: No disponible</li>";
                else
                    stringRestoDatos += "<li>Dirección viento: " + this.direccionViento + "º</li>";

                stringRestoDatos += "<li>Presión: " + this.presion + " mb</li>";
                stringRestoDatos += "<li>Amanece a las: " + this.horaAmanece + "</li>";
                stringRestoDatos += "<li>Oscurece a las: " + this.horaOscurece + "</li>";
        
                if(this.visibilidad_KM==null)
                    stringRestoDatos += "<li>Visibilidad: No disponible</li>";
                else
                    stringRestoDatos += "<li>Visibilidad: " + this.visibilidad_KM + " km</li></ul>";
                

        $("#restoDatos").html(stringRestoDatos);

        var coordenadasEstacion = "<ul id='latitudLongitud'><li>Latitud: " + this.latitudEstacion + "º</li>";
            coordenadasEstacion += "<li>Longitud: " + this.longitudEstacion + "º</li></ul>";

        $("#nombreEstacion").html("Estación meteorológica: " + this.nombreEstacion);
        $("#coordenadasEstacion").html(coordenadasEstacion);
    }

    crearAutocompletado(){
        // Creamos el objeto de autocompletado y lo asociamos al campo de texto
        this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
            $("#autocomplete").get(0)), 
            {
              types: ['geocode'], //Solo queremos que devuelva lugares, no establecimientos, etc
            });
        
        this.autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
    }
    
    onPlaceChanged() {
        // Si cambia el lugar elegido por el usuario, nos movemos en el mapa a dicho lugar y movemos tambien el marcador,
        // así como actualizamos la informacion de la infoWindow con los datos de ese lugar
        var place = this.autocomplete.getPlace();
        if (place.geometry) {
            this.buscadoAlgunSitio = true;
            this.mapa.panTo(place.geometry.location);
            this.mapa.setZoom(15);
            this.actualizarYMostrarPosicionActual(place.geometry.location);
        } else {
            $("#autocomplete").placeholder = 'Introduce un lugar';
        }
    }

    erroresGeolocalizacion(error) {
        $("#error").html("<p>Se ha producido un error al intentar obtener su geolocalización</p>");
        $("#error").show();
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

var mapa = new MapaMeteorologico();
google.maps.event.addDomListener(window, 'load', mapa.inicializar.bind(mapa));