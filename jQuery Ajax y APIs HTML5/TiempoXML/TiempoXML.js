"use strict";
class Meteo {
    constructor(){
        this.apikey = "47b790fd0fc41878c80c57c9846132cb";
        this.tipo = "&mode=xml";
        this.unidades = "&units=metric";
        this.idioma = "&lang=es";
    }
    
    inicializar(){
        $("#cabeceraTiempo").prepend("<h2 id='tiempoEn'></h2>");
        $("#estacionMeteorologica").prepend("<h3 id='nombreEstacion'></h3>");
    }
    
    cargarDatos(ciudad){
        var urlOpenWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + ciudad + this.tipo + this.unidades + this.idioma + "&APPID=" + this.apikey;
        
        $.ajax({
            dataType: "xml",
            url: urlOpenWeather,
            method: 'GET',
            success: this.obtenerYMostrarTiempo.bind(this,ciudad),
            error:function(){
                $("#mensajeError").html("No se ha podido obtener la información meteorológica de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
    
    obtenerYMostrarTiempo(ciudad,datos){
        //Recogemos los datos del tiempo
        var minutosZonaHoraria      = new Date().getTimezoneOffset();

        var horaMedida              = $('lastupdate',datos).attr("value");
        var horaMedidaMiliSeg1970   = Date.parse(horaMedida);
            horaMedidaMiliSeg1970   -= minutosZonaHoraria * 60 * 1000;
        var horaMedidaLocal         = (new Date(horaMedidaMiliSeg1970)).toLocaleTimeString("es-ES");
        var fechaMedida             = (new Date(horaMedidaMiliSeg1970)).toLocaleDateString("es-ES");

        var ultimaMedida            = fechaMedida + " " + horaMedidaLocal; 
        var nubosidad               = $('clouds',datos).attr("value");
        var humedad                 = $('humidity',datos).attr("value");

        var presion                 = $('pressure',datos).attr("value");
        var presionUnit             = $('pressure',datos).attr("unit");

        var codigoIcono             = $('weather',datos).attr("icon");
        var srcIconoTiempo          = "http://openweathermap.org/img/w/" + codigoIcono + ".png";
        var gradosTemp              = $('temperature',datos).attr("value");
        var gradosTempMin           = $('temperature',datos).attr("min");
        var gradosTempMax           = $('temperature',datos).attr("max");
        var descripcion             = $('weather',datos).attr("value");
            descripcion             = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);//Pasamos la primera letra de la descripcion a mayúsculas
        var vientoKM_H              = $('speed',datos).attr("value") * 3.6;
            vientoKM_H              = vientoKM_H.toFixed(2);
        var direccionViento         = $('direction',datos).attr("value");
        var codigoViento            = $('direction',datos).attr("code");
        var visibilidad_KM          = $('visibility',datos).attr("value");
        
        if(visibilidad_KM!=null)
            visibilidad_KM = visibilidad_KM / 1000;
        
        var amanecer                = $('sun',datos).attr("rise");
        var minutosZonaHoraria      = new Date().getTimezoneOffset();
        var amanecerMiliSeg1970     = Date.parse(amanecer);
            amanecerMiliSeg1970     -= minutosZonaHoraria * 60 * 1000;
        var horaAmanece             = (new Date(amanecerMiliSeg1970)).toLocaleTimeString("es-ES");
        var oscurecer               = $('sun',datos).attr("set");          
        var oscurecerMiliSeg1970    = Date.parse(oscurecer);
            oscurecerMiliSeg1970    -= minutosZonaHoraria * 60 * 1000;
        var horaOscurece            = (new Date(oscurecerMiliSeg1970)).toLocaleTimeString("es-ES");

        var precipitacionValue      = $('precipitation',datos).attr("value");
        var precipitacionMode       = $('precipitation',datos).attr("mode");

        var nombreEstacion          = $('city',datos).attr("name");
        var latitudEstacion         = $('coord',datos).attr("lat");
        var longitudEstacion        = $('coord',datos).attr("lon");

        //Los mostramos
        this.mostrarTiempo(ciudad,fechaMedida,ultimaMedida,gradosTemp,srcIconoTiempo,descripcion,gradosTempMin,gradosTempMax,
                  nubosidad,precipitacionMode,precipitacionValue,humedad,vientoKM_H,direccionViento,codigoViento,presion,
                   presionUnit,horaAmanece,horaOscurece,visibilidad_KM,latitudEstacion,longitudEstacion,nombreEstacion);
    }
    
    mostrarTiempo(ciudad,fechaMedida,ultimaMedida,gradosTemp,srcIconoTiempo,descripcion,gradosTempMin,gradosTempMax,
                  nubosidad,precipitacionMode,precipitacionValue,humedad,vientoKM_H,direccionViento,codigoViento,presion,
                   presionUnit,horaAmanece,horaOscurece,visibilidad_KM,latitudEstacion,longitudEstacion,nombreEstacion){
        
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

        //Si hay precipitaciones, indicamos sus mm, si no, un mensaje de que no hay
        if(precipitacionMode=="no")
            stringRestoDatos += "<li>No hay precipitaciones</li>";
        else
            stringRestoDatos += "<li>Precipitaciones: " + precipitacionValue + " mm</li>";

        stringRestoDatos += "<li>Humedad: " + humedad + " %</li>";        
        stringRestoDatos += "<li>Velocidad viento: " + vientoKM_H + " km/h</li>";

        //Si la direccion de viento no esta disponible, lo indicamos
        if(direccionViento==null)
            stringRestoDatos += "<li>Dirección viento: No disponible</li>";
        else
            stringRestoDatos += "<li>Dirección viento: " + direccionViento + "º " + codigoViento +"</li>";

        stringRestoDatos += "<li>Presión: " + presion + " " + presionUnit + "</li>";
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
