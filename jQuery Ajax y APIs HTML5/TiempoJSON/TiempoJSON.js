"use strict";
class Meteo {
    constructor(){
        this.apikey = "7fc07660c3a999e7e1a9e6f53a925d92";
        this.unidades = "&units=metric";
        this.idioma = "&lang=es";
    }
    
    inicializar(){
        $("#cabeceraTiempo").prepend("<h2 id='tiempoEn'></h2>");
        $("#estacionMeteorologica").prepend("<h3 id='nombreEstacion'></h3>");
    }
    
    cargarDatos(ciudad){
        var urlOpenWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + ciudad + this.unidades + this.idioma + "&APPID=" + this.apikey;
        
        $.ajax({
            dataType: "json",
            url: urlOpenWeather,
            method: 'GET',
            success: this.obtenerYMostrarTiempo.bind(this,ciudad),
            error: function(){
                $("#mensajeError").html("No se ha podido obtener la información meteorológica de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
    
    obtenerYMostrarTiempo(ciudad,datos){
        //Recogemos los datos del tiempo
        var horaMedida = new Date(datos.dt *1000).toLocaleTimeString();
        var fechaMedida = new Date(datos.dt *1000).toLocaleDateString();
        var ultimaMedida = fechaMedida + " " + horaMedida; 
        var nubosidad =  datos.clouds.all;
        var humedad = datos.main.humidity;
        var presion = datos.main.pressure;
        var codigoIcono = datos.weather[0].icon;
        var srcIconoTiempo = "http://openweathermap.org/img/w/" + codigoIcono + ".png";
        var gradosTemp = datos.main.temp;
        var gradosTempMin = datos.main.temp_min;
        var gradosTempMax = datos.main.temp_max;
        var descripcion = datos.weather[0].description;
            descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);//Pasamos la primera letra de la descripcion a mayúsculas
        var vientoKM_H = datos.wind.speed * 3.6;
            vientoKM_H = vientoKM_H.toFixed(2);
        var direccionViento = datos.wind.deg;
        
        var visibilidad_KM = datos.visibility;
        
        if(visibilidad_KM!=null)
            visibilidad_KM = visibilidad_KM / 1000;
        
        var horaAmanece = new Date(datos.sys.sunrise *1000).toLocaleTimeString();
        var horaOscurece = new Date(datos.sys.sunset *1000).toLocaleTimeString();

        var nombreEstacion = datos.name;
        var latitudEstacion = datos.coord.lat;
        var longitudEstacion = datos.coord.lon;
        
        //Los mostramos
        this.mostrarTiempo(ciudad,fechaMedida,ultimaMedida,gradosTemp,srcIconoTiempo,descripcion,
                           gradosTempMin,gradosTempMax,nubosidad,humedad,vientoKM_H,direccionViento,presion,
                           horaAmanece,horaOscurece,visibilidad_KM,latitudEstacion,longitudEstacion,nombreEstacion);
    }
    
    mostrarTiempo(ciudad,fechaMedida,ultimaMedida,gradosTemp,srcIconoTiempo,descripcion,
                           gradosTempMin,gradosTempMax,nubosidad,humedad,vientoKM_H,direccionViento,presion,
                           horaAmanece,horaOscurece,visibilidad_KM,latitudEstacion,longitudEstacion,nombreEstacion){
        
        $("#seccionTiempo").show();                
        $("#tiempoEn").html("El tiempo en " + ciudad);

        var _7horas = Date.parse(fechaMedida + ' 7:00:00');
        var _19horas = Date.parse(fechaMedida + ' 19:00:00');
        var ultimaActualizacion = Date.parse(ultimaMedida);
        
        //Si la temperatura es <= de 10ºC, consideramos que esta frio
        var srcIconoTemp;
        if(gradosTemp <= 10)
            srcIconoTemp="iconos/frio.png";
        else srcIconoTemp="iconos/calor.png";

        //Si la hora de la ultima actualizacion esta entre las 7:00 y las 19:00 se considera que es de dia 
        var esDeDia = ultimaActualizacion >= _7horas && ultimaActualizacion <= _19horas;

        //Establecemos un color de fondo en funcion de la hora
        this.establecerColores(esDeDia);

        $("#ultimaMedida").html(ultimaMedida);
        $("#divIconoTiempo").html("<img id='iconoTiempo' src='" + srcIconoTiempo + "'/>");
        $("#gradosTemperatura").html(gradosTemp + "ºC");
        $("#descripcion").html(descripcion);
        $("#divIconoTemperatura").html("<img id='iconoTemperatura' src='" + srcIconoTemp + "'/>");
        $("#gradosMin").html(gradosTempMin + "ºC");
        $("#gradosMax").html(gradosTempMax + "ºC");    

        var stringRestoDatos = "<ul><li>Nubosidad: " + nubosidad + " %</li>";        
                stringRestoDatos += "<li>Humedad: " + humedad + " %</li>";        
                stringRestoDatos += "<li>Velocidad viento: " + vientoKM_H + " km/h</li>";

                //Si la direccion de viento no esta disponible, lo indicamos
                if(direccionViento==null)
                    stringRestoDatos += "<li>Dirección viento: No disponible</li>";
                else
                    stringRestoDatos += "<li>Dirección viento: " + direccionViento + "º</li>";

                stringRestoDatos += "<li>Presión: " + presion + " mb</li>";
                stringRestoDatos += "<li>Amanece a las: " + horaAmanece + "</li>";
                stringRestoDatos += "<li>Oscurece a las: " + horaOscurece + "</li>";
                
                if(visibilidad_KM==null)
                    stringRestoDatos += "<li>Visibilidad: No disponible</li>";
                else
                    stringRestoDatos += "<li>Visibilidad: " + visibilidad_KM + " km</li></ul>";

        $("#restoDatos").html(stringRestoDatos);

        var coordenadasEstacion = "<ul id='latitudLongitud'><li>Latitud: " + latitudEstacion + "º</li>";
            coordenadasEstacion += "<li>Longitud: " + longitudEstacion + "º</li></ul>";

        $("#nombreEstacion").html("Estación meteorológica: " + nombreEstacion);
        $("#coordenadasEstacion").html(coordenadasEstacion);
    }
    
    establecerColores(esDeDia){
        if(esDeDia){
            $("#seccionTiempo").css("background-color","white");
            $("#seccionTiempo").css("color","black")
            $("#datosPrincipales").css("border-right","medium black solid");
            $("#cabeceraTiempo").css("border-bottom","medium black solid");
            $("#nombreEstacion").css("border-top","medium black solid");
        }else{
            $("#seccionTiempo").css("background-color","dimgray");
            $("#seccionTiempo").css("color","white");
            $("#datosPrincipales").css("border-right","medium white solid");
            $("#cabeceraTiempo").css("border-bottom","medium white solid");
            $("#nombreEstacion").css("border-top","medium white solid");
        }
    }
    
    verTiempo(){
        var ciudad = document.getElementsByName("ciudad")[0].value;
        this.cargarDatos(ciudad);
    }
    
    ocultarSeccionTiempo(){
        $("#seccionTiempo").hide();
    }
    
    
}
var meteo = new Meteo();
