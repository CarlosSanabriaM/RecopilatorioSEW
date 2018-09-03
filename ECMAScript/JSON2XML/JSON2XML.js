"use strict";
class Conversor{
    constructor(){ }
    
    comprobarAPIFile(){
        //Si el navegador no sporta el API File se lo indicamos al usuario
        if (! (window.File && window.FileReader && window.FileList && window.Blob) ) {  
            document.getElementById("errorApiFile").innerHTML="¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
         }
    }

    leerArchivo(files){ 
        //Solamente toma un archivo
        var archivo = files[0];
        
        //Si el usuario cancela la operacion de seleccionar fichero
        if(archivo==null){
            return;
        }
        
        var nombre = document.getElementById("nombreArchivo");
        var contenido = document.getElementById("contenidoArchivo");
        var errorArchivo = document.getElementById("errorArchivo");
        
        //Limpiamos el contenido del textArea y del mensaje de error
        contenido.value = "";
        this.limpiarMensajeError();
        
        nombre.innerText = "Nombre del archivo: " + archivo.name;
        
        //Solamente admite archivos de tipo json
        var tipoTexto = /json.*/;
        if (archivo.type.match(tipoTexto)){
            var tamaño = archivo.size;//tamaño en bytes
            
            //Si el tamaño del archivo es mayor de 1MB (1000000 bytes)
            if(tamaño > 1000000){
                errorArchivo.innerText = "¡Archivo demasiado grande! El tamaño máximo permitido para el archivo es de 1MB";
                return;
            }
            
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura

                //Mostramos en el textArea el contenido del fichero json
                contenido.value = lector.result;                
            }      
            lector.readAsText(archivo);
        }
        else {
             errorArchivo.innerText = "¡Archivo no válido! Solo se admiten archivos de tipo json";
        }       
    }
    
    drop(ev){
        console.log("Drop");
        ev.preventDefault();
        
        //Sacamos la informacion del archivo soltado
        var dt = ev.dataTransfer;
        this.leerArchivo(dt.files);
    }
    
    allowDrop(ev){
        //Por defecto un elemento no deja que le suelten otro elemento
        //Para hacer que si se le pueda hacer drop tenemos que evitar el manejador por defecto del elemento
        console.log("dragOver");
        // Prevent default select and drag behavior
        ev.preventDefault();
    }
    
    limpiarMensajeError(){
        var errorArchivo = document.getElementById("errorArchivo");
        errorArchivo.innerText = "";
    }
    
    convertir(){
        //Si no hay nada en el primer textarea, le mostramos un mensaje
        var contenido = document.getElementById("contenidoArchivo");
        var errorArchivo = document.getElementById("errorArchivo");
        
        if(contenido.value.trim().length == 0){
            errorArchivo.innerText = "¡No has introducido ningún contenido JSON!";
            return;
        }
        
        //Vaciamos el contenido del segundo textarea y del mensaje de error
        var salida = document.getElementById("contenidoSalida");
        this.limpiarMensajeError();
        
        salida.value="";
        
        //Convertimos el json a xml y mostramos su contenido en el otro textarea
        var contenidoArchivoJson = contenido.value;
        var json;
        
        try{
            json = JSON.parse(contenidoArchivoJson);
            var xml = this.json2xml(json,"\t");
            salida.value = xml;
        }
        catch(e){
            errorArchivo.innerText = "¡El archivo JSON no tiene un formato válido!";
        }
    }
    
    
    json2xml(json, tab) {
       var xml = this.toXml( json );
       // If tab given, do pretty print, otherwise remove white space
       return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
    }
    
    toXml(v, name, ind, mySiblingAttrs){
      if ( typeof name == 'undefined' ) name = null;
      if ( typeof ind  == 'undefined' ) ind="";
      if ( typeof mySiblingAttrs == 'undefined' ) mySiblingAttrs = {};

      var xml = "";

      if (v instanceof Array) {
         xml += ind + "<" + name;
         // Since we are dealing with an Array, there cannot be child attributes, 
         // but there can be sibling attributes passed by caller
         for (var m in mySiblingAttrs) {
               xml += " " + m + "=\"" + mySiblingAttrs[m].toString() + "\"";            
         }
         xml += ">\n";
         for (var i=0, n=v.length; i<n; i++) {
            if (v[i] instanceof Array) {
               xml += ind + this.toXml(v[i], name, ind+"\t") + "\n";
            }
            else if ( typeof v[i] == 'object' ) {
               xml += this.toXml(v[i], null, ind);
            }
            else {
               xml += ind + "\t" + v[i].toString();
               xml += (xml.charAt(xml.length-1)=="\n"?"":"\n");
            }
         }
         if( name != null ) {
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         if (name === null ) {
            // root element
            // note: for convenience, if the top level in json has multiple elements, we'll just output multiple xml documents after each other
            // ... this space intentionally left blank ...
         }
         else {
            xml += ind + "<" + name;
         }
         // Before doing anything else, check for and separate those that 
         // are attributes of the "sibling attribute" type (see below)
         var newSiblingAttrs = {};
         for (var m in v) {
            if( m.search("@") >= 1 ) { // @ exists, but is not the first character
               var parts = m.split("@");
               if( typeof newSiblingAttrs[parts[0]] == 'undefined' ) newSiblingAttrs[parts[0]] = {};
               newSiblingAttrs[parts[0]][parts[1]] = v[m];
               delete v[m];
            }
         }
         for (var m in v) {
            // For backward compatibility we allow both forms. An attribute can 
            // either be a child, like so: {e : {@attribute : value}} or a
            // sibling, like so: {e : ..., e@attribute : value }
            // This test for the child (legacy)
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         // Now add sibling attributes (passed by caller)
         for (var m in mySiblingAttrs) {
               xml += " " + m + "=\"" + mySiblingAttrs[m].toString() + "\"";            
         }
         if( name != null ) {
            xml += hasChild ? "" : "/";
            xml += ">\n";
         }
         if (hasChild) {
            for (var m in v) {
               // legacy form
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if ( m.charAt(0) != "@" )
                  xml += this.toXml(v[m], m, ind+"\t", newSiblingAttrs[m]) + "\n";
            }
            if( name != null ) {
               xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
            }
         }
      }
      else {
         // string or number value
         xml += ind + "<" + name;
         // Add sibling attributes (passed by caller)
         for (var m in mySiblingAttrs) {
               xml += " " + m + "=\"" + mySiblingAttrs[m].toString() + "\"";            
         }
         xml += ">";
         xml += v.toString() +  "</" + name + ">";
      }
      return xml;
   }

    
}

var conversor = new Conversor();