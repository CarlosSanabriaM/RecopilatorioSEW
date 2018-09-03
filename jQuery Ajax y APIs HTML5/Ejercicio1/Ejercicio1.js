$(document).ready(function() {
    
    //Ocultar, mostrar y eliminar h1
    $('#botonOcultarh1').click(function() {
        $("h1").hide();
    });
    
    $('#botonMostrarh1').click(function() {
        $("h1").show();
    });
    
    $('#botonEliminarh1').click(function() {
        $("h1").remove();
    });
    
    
    //Ocultar, mostrar y eliminar h2
    $('#botonOcultarh2').click(function() {
        $("h2").hide();
    });
    
    $('#botonMostrarh2').click(function() {
        $("h2").show();
    });
    
    $('#botonEliminarh2').click(function() {
        $("h2").remove();
    });
    
    
    //Ocultar, mostrar y eliminar h3
    $('#botonOcultarh3').click(function() {
        $("h3").hide();
    });
    
    $('#botonMostrarh3').click(function() {
        $("h3").show();
    });
    
    $('#botonEliminarh3').click(function() {
        $("h3").remove();
    });
    
    
    //Ocultar, mostrar y eliminar p
    $('#botonOcultarParrafos').click(function() {
        $("p").hide();
    });
    
    $('#botonMostrarParrafos').click(function() {
        $("p").show();
    });
    
    $('#botonEliminarParrafos').click(function() {
        $("p").remove();
    });
    
    
    //Ocultar, mostrar y eliminar listas
    $('#botonOcultarListas').click(function() {
        $("ul,ol").hide();
    });
    
    $('#botonMostrarListas').click(function() {
        $("ul,ol").show();
    });
    
    $('#botonEliminarListas').click(function() {
        $("ul,ol").remove();
    });
    
    
    //Ocultar, mostrar y eliminar labels
    $('#botonOcultarCamposTexto').click(function() {
        $("label").hide();
    });
    
    $('#botonMostrarCamposTexto').click(function() {
        $("label").show();
    });
    
    $('#botonEliminarCamposTexto').click(function() {
        $("label").remove();
    });
    
    
    //Ocultar, mostrar y eliminar botones
    $('#botonOcultarBotones').click(function() {
        $("input[type='button']").hide();
    });
    
    $('#botonMostrarBotones').click(function() {
        $("input[type='button']").show();
    });
    
    $('#botonEliminarBotones').click(function() {
        $("input[type='button']").remove();
    });
    
    
    //Ocultar, mostrar y eliminar la tabla
    $('#botonMostrarTabla').click(function() {
        $("table").show();
    });
    
    $('#botonOcultarTabla').click(function() {
        $("table").hide();
    });
    
    $('#botonEliminarTabla').click(function() {
        $("table").remove();
    });
    
    //Ocultar y mostrar filas
    $('#botonOcultarFilas').click(function() {
        $("table tr td").each(function() {
            var celda = $.trim($(this).text());
            if (celda.length == 0) {
                $(this).parent().hide();
            }
        });
    });
    
    $('#botonMostrarFilas').click(function() {
        $("table tr").each(function() {
            $(this).show();
        });
    });
    
    
    //Cambiar datos
    $("#botonCambiarDatosABecarios").click(function(){
        $("h1").text("jQuery: Ejercicio 1 - Inventario de becarios");
        $("#titulo2").text("Se van a repasar varias características de jQuery (con la ayuda de los datos del inventario de becaría)");
        $("#inventario").text("Inventario becarios");
        $("#introduccion").text("A continuación se muestra una tabla con datos de los componentes informáticos del aula de becaría");
        $("a").attr("href","https://www.pccomponentes.com/");
        
        //Modificamos la css de la tabla
        $("table").css("background-color", "antiquewhite");
        $("th").css("background-color", "#7F6246");
        $("tr:nth-child(odd)").css("background-color", "#FFF2DF");
    });
    
    $("#botonCambiarDatosAVideojuegos").click(function(){
        $("h1").text("jQuery: Ejercicio 1 - Inventario de videojuegos");
        $("#titulo2").text("Se van a repasar varias características de jQuery (con la ayuda de los datos del inventario de videojuegos)");
        $("#inventario").text("Inventario videojuegos");
        $("#introduccion").text("A continuación se muestra una tabla con datos de los componentes que tengo en casa para jugar a videojuegos");
        $("a").attr("href","https://www.game.es/");
        
        //Modificamos la css de la tabla
        $("table").css("background-color", "#F0F0F0");
        $("th").css("background-color", "#464646");
        $("tr:nth-child(odd)").css("background-color", "#DBDBDB");
    });
    
    
    //Añadir, modificar y eliminar filas
    $("#botonAñadirFila").click(function(){
        //Comprobamos que todos los campos sean validos
        var nombre = $("#nombreAñadir").val();
        var cantidad = parseInt( $("#cantidadAñadir").val() );
        var precio = parseFloat( $("#precioAñadir").val() );
        var descripcion = $("#descripcionAñadir").val();
            
        //Si nombre, cantidad o precio estan vacios, no dejamos que introduzca la fila
        if($.trim(nombre).length == 0 || $.trim(cantidad).length == 0 || $.trim(precio).length == 0){
            $("#mensajeErrorAñadirFila").text("El nombre, la cantidad y el precio no pueden estar vacíos");
            return false;
        }
        
        //Cantidad y precio han de ser numeros
        if(isNaN(cantidad) || isNaN(precio)){
            $("#mensajeErrorAñadirFila").text("La cantidad y el precio han de ser valores numéricos");
            return false;
        }
        //Cantidad ha de ser además un numero entero
        if(!Number.isInteger(cantidad)){
            $("#mensajeErrorAñadirFila").text("La cantidad ha de ser un numero entero");
            return false;
        }
        
        //Aqui todos los campos son validos
        $("#mensajeErrorAñadirFila").text("");
        
        //Tenemos que añadir la fila que nos indican al final de la tabla
        var numFilas = $("table tr").length - 1;//No contamos la fila de la cabecera
        var nuevoNumero;
        
        if(numFilas==0)
            nuevoNumero = 1;
        else
            nuevoNumero = parseInt($("tr:last td:first").text()) + 1;
        
        $("table").append("<tr><td>"+ nuevoNumero +"</td><td>"+ nombre +"</td><td>"+ cantidad +"</td><td>"+ precio +"</td><td>"+ descripcion +"</td></tr>");
        
    });
    
    $("#botonEliminarFila").click(function(){
        $("table tr:last:not(:has(th))").remove();
    });
    
    $("#botonModificarFila").click(function(){
        //Comprobamos que todos los campos sean validos
        var numero = parseInt( $("#numeroModificar").val() );
        var nombre = $("#nombreModificar").val();
        var cantidad = parseInt( $("#cantidadModificar").val() );
        var precio = parseFloat( $("#precioModificar").val() );
        var descripcion = $("#descripcionModificar").val();
            
        //Si numero, nombre, cantidad o precio estan vacios, no dejamos que introduzca la fila
        if($.trim(numero).length == 0 || $.trim(nombre).length == 0 || 
           $.trim(cantidad).length == 0 || $.trim(precio).length == 0){
            $("#mensajeErrorModificarFila").text("El numero, el nombre, la cantidad y el precio no pueden estar vacíos");
            return false;
        }
        
        //Numero cantidad y precio han de ser numeros
        if(isNaN(numero) || isNaN(cantidad) || isNaN(precio)){
            $("#mensajeErrorModificarFila").text("El numero, la cantidad y el precio han de ser valores numéricos");
            return false;
        }
        //Numero y cantidad han de ser además enteros
        if(!Number.isInteger(numero) || !Number.isInteger(cantidad)){
            $("#mensajeErrorModificarFila").text("El numero y la cantidad han de ser valores enteros");
            return false;
        }
        //El numero ha de estar en la tabla        
        var numFilas = $("table tr").length - 1;//No contamos la fila de la cabecera
        
        //Si no hay filas, o el numero introducido es mayor que el numero de filas o menor de 1
        if(numFilas == 0 || numero < 1 || numero > numFilas){
            $("#mensajeErrorModificarFila").text("Has de introducir un numero de fila que esté en la tabla");
            return false;
        }
        
        //Aqui todos los campos son validos
        $("#mensajeErrorModificarFila").text("");
        
        //Tenemos que modificar la fila que nos indican
        var numTr = numero + 1; //hay que sumar uno por la tr del th
        $("table tr:nth-child("+ numTr +")").each(function(){
            $(this).html("<td>"+ numero +"</td><td>"+ nombre +"</td><td>"+ cantidad +"</td><td>"+ precio +"</td><td>"+ descripcion +"</td></tr>");
        });
        
    });
    
    
    //Sumar celdas de una fila
    $("#botonSumarCantidad").click(function(){
        var sumaCantidad = 0;
        //Iteramos por cada fila
        $("table tr td:nth-child(3)").each(function(){
            //Para cada fila, sacamos el valor de la 3 celda
            sumaCantidad += parseInt( $(this).text() );
        });
        
        //Mostramos el valor en el parrafo de debajo de la tabla
        $("#cantidad").text("Cantidad total: " + sumaCantidad);
    });


    //Recorrer el arbol
    $("#botonRecorrerArbol").click(function(){
        $("#informacion").append("<h3>Información de cada elemento del documento:</h3>");
        //Metemos toda esa informacion en una lista ordenada
        $("#informacion").append("<ol></ol>");
        $("#informacion ol").css("list-style-type" ,"decimal-leading-zero");
        //Tenemos que recorrer todo el body 
        $("*", document.body).each(function() {
            var etiquetaPadre = $(this).parent().get(0).tagName;
            $("#informacion ol").append("<li>Etiqueta padre: "  + etiquetaPadre + " - Elemento: " + $(this).get(0).tagName +"</li>");
        });
    });    
    
    
    //Eliminar todo
    $("#botonEliminarTodo").click(function(){
        $("*", document).each(function() {
            $(this).remove();
        });
    });
     
    
});