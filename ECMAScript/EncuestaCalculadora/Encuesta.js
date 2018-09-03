"use strict";
class Encuesta{
    constructor(){
        this.mediaRespuestas=0;
    }
    
    selOtro(){
        var elementoOtro=this.dameElementoOtro();
        var elementoValOtro = this.dameElementoValOtro();
        //Si el rb Otros esta seleccionado, mostramos el textField, si no lo ocultamos
        if(elementoOtro.checked)
            elementoValOtro.style="display: inline";
        else
            elementoValOtro.style="display: none";
    }
    
    mostrarTextoOtro(){
        var elementoTextoOtro=this.dameElementoTextoOtro();
        elementoTextoOtro.style="display: inline";
    }

    ocultarTextoOtro(){
        var elementoTextoOtro=this.dameElementoTextoOtro();
        elementoTextoOtro.style="display: none";
    }
    
    calcularEdad(fechaNacimiento){
        var hoy = new Date();
        var unDiaMiliSegundos = 1000 * 60 * 60 * 24;
        var edadDias  = Math.floor((hoy.getTime() - fechaNacimiento.getTime()) / unDiaMiliSegundos);
        var edadAños = Math.floor(edadDias / 365.256363004);
        return edadAños;
    }
    
    validar(){
        this.validarNombre();
        this.validarApellidos();
        this.validarEdad();
        this.validarDni();
        this.validarEmail();
        
        this.validarDispositivos();
        this.validarFuncionMasUtil();
        this.validarFuncionesAQuitar();
        this.validarValoracionFinalYCalcularNotaMediaSiEsValida();
        
        if(event.returnValue==false)
            this.mostrarErrorFinal();
        else
            this.ocultarErrorFinal();
    }
    
    validarNombre(){
        var nombreF=encuestaF.nombre.value;
        //Si el nombre es vacio o solo tiene un caracter o tiene numeros o tiene 3 letras iguales consecutivas 
        if (nombreF=='' || nombreF.length==1 || !this.todoLetras(nombreF) || this.tresCaracteresIgualesConsecutivos(nombreF)) {
            this.mostrarErrorNombre();
            event.returnValue=false;
        }else
            this.ocultarErrorNombre();
    }
    
    validarApellidos(){
        var apellidosF=encuestaF.apellidos.value;
        //Si el campo apellidos es vacio o solo tiene un caracter o tiene numeros o tiene 3 letras iguales consecutivas 
        if (apellidosF=='' || apellidosF.length==1 || !this.todoLetras(apellidosF) || this.tresCaracteresIgualesConsecutivos(apellidosF)) {
            this.mostrarErrorApellidos();
            event.returnValue=false;
        }else
            this.ocultarErrorApellidos();
    }
    
    validarEdad(){
        var fechaNacimiento = this.dameElementoFechaNacimiento().value;

        //Si la edad es menor de 1 o mayor de 125
        var edad = this.calcularEdad(new Date(fechaNacimiento));
        if(edad < 18 || edad > 125) {
            this.mostrarErrorFechaNacimiento();
            event.returnValue=false;
        }else
            this.ocultarErrorFechaNacimiento();
    }
    
    validarDni(){
        var dniF=encuestaF.dni.value;
        //Si el DNI es vacio o no es valido
        if (dniF=='' || !this.dniValido(dniF)) {
            this.mostrarErrorDni();
            event.returnValue=false;
        }else
            this.ocultarErrorDni();
    }
    
    validarEmail(){
        var mailformat = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]+$/;   
        //Si el email es vacio o no cumple el patron anterior
        var emailF=encuestaF.email.value;
        if (emailF=='' || !emailF.match(mailformat)) {
            this.mostrarErrorEmail();
            event.returnValue=false;
        }else
            this.ocultarErrorEmail();
    }
        
    validarDispositivos(){
        //Si no hay ningun dispositivo seleccionado        
        var checkboxs_dispositivos=document.getElementsByName("dipositivos");
        var numCheckbox = checkboxs_dispositivos.length;
        var alMenosUnoSeleccionado = false;
        
        for(var i=0; i<numCheckbox; i++){
            if(checkboxs_dispositivos[i].checked){
                alMenosUnoSeleccionado=true;
                break;
            }
        }
        
        if(!alMenosUnoSeleccionado){
            this.mostrarErrorDispositivos();
            event.returnValue=false;
        }else
            this.ocultarErrorDispositivos();
        
    }  
    
    validarFuncionMasUtil(){
        //Si no hay ninguna funcion_util seleccionada
        if(encuestaF.funcionMasUtil.value==""){
            this.mostrarErrorFuncionMasUtil();
            event.returnValue=false;
         }else
             this.ocultarErrorFuncionMasUtil();
    }  

    validarFuncionesAQuitar(){
        //Si no hay ninguna funcion a quitar seleccionada
        if (!(encuestaF.funcion_a_quitar[0].checked || encuestaF.funcion_a_quitar[1].checked || encuestaF.funcion_a_quitar[2].checked || 
             encuestaF.funcion_a_quitar[3].checked || encuestaF.funcion_a_quitar[4].checked || encuestaF.funcion_a_quitar[5].checked)) {
            this.mostrarErrorFuncionesAQuitar();
            event.returnValue=false;
        }else
            this.ocultarErrorFuncionesAQuitar();
        
        //Si esta seleccionado otros hay que comprobar que Otros tenga texto
        if(encuestaF.funcion_a_quitar[4].checked)
            this.validarOtros();
        //Si no esta seleccionado y se esta mostrando su error, lo quitamos
        else if(this.dameElementoValOtro().value.length == 0)
            this.ocultarErrorOtros();
    }  
        
    validarOtros(){
        var textoOtros = this.dameElementoValOtro().value;
        if(textoOtros==''){
            this.mostrarErrorOtros();
            event.returnValue=false;
        }else
            this.ocultarErrorOtros();
    }
    
    validarValoracionFinalYCalcularNotaMediaSiEsValida(){
        //Comprobamos para todos los buttonGroups, que hay un radioButton seleccionado
        if (!this.buttonGroupTieneUnRadioSeleccionado("funcionamiento") || !this.buttonGroupTieneUnRadioSeleccionado("facilidad_uso")
           || !this.buttonGroupTieneUnRadioSeleccionado("utilidad") || !this.buttonGroupTieneUnRadioSeleccionado("disenio_grafico")) 
        {
            this.mostrarErrorValoracionFinal();
            event.returnValue=false;
        }else{
            //Si entramos aqui es que los 4 buttonGroups tienen valor, por lo que podemos calcular su media
            this.ocultarErrorValoracionFinal();
            
            var valor_funcionamiento = parseInt( document.querySelector('input[name="funcionamiento"]:checked').value );
            var valor_facilidad_uso = parseInt( document.querySelector('input[name="facilidad_uso"]:checked').value );
            var valor_utilidad = parseInt( document.querySelector('input[name="utilidad"]:checked').value );
            var valor_disenio_grafico = parseInt( document.querySelector('input[name="disenio_grafico"]:checked').value );
            
            this.mediaRespuestas=(valor_funcionamiento + valor_facilidad_uso + valor_utilidad + valor_disenio_grafico) / 4;
            this.mostrarNotaMedia();
        }
    }
    
    quitarMensajes(){
        this.ocultarErrorNombre();
        this.ocultarErrorApellidos();
        this.ocultarErrorFechaNacimiento();
        this.ocultarErrorDni();
        this.ocultarErrorEmail();
        this.ocultarErrorDispositivos();
        this.ocultarErrorFuncionMasUtil();
        this.ocultarErrorFuncionesAQuitar();
        this.ocultarErrorOtros();
        this.ocultarErrorValoracionFinal();
        this.ocultarErrorFinal();
        
        this.ocultarNotaMedia();
    }
    
    dameElemento(elemento){
        return document.getElementById(elemento);
    }
    
    
    //NotaMedia
    dameElementoNotaMedia(){
        return this.dameElemento("notaMedia");
    }
    
    mostrarNotaMedia() {
        var pNotaMedia = this.dameElementoNotaMedia();
        pNotaMedia.innerHTML="Nota media de la valoración: " + this.mediaRespuestas;
    }
    
    ocultarNotaMedia() {
        var pNotaMedia = this.dameElementoNotaMedia();
        pNotaMedia.innerHTML="";
    }
    
    
    //Nombre
    dameElementoErrorNombre(){
        return this.dameElemento("mensajeErrorNombre");
    }
    
    mostrarErrorNombre() {
        var elementoErrorNombre = this.dameElementoErrorNombre();
        elementoErrorNombre.innerHTML="&nbsp;&nbsp;Nombre no válido";
    }
    
    ocultarErrorNombre() {
        var elementoErrorNombre = this.dameElementoErrorNombre();
        elementoErrorNombre.innerHTML="";
    }
    
    
    //Apellidos
    dameElementoErrorApellidos(){
        return this.dameElemento("mensajeErrorApellidos");
    }
    
    mostrarErrorApellidos() {
        var elementoErrorApellidos = this.dameElementoErrorApellidos();
        elementoErrorApellidos.innerHTML="&nbsp;&nbsp;Apellidos no válidos";
    }
    
    ocultarErrorApellidos() {
        var elementoErrorApellidos = this.dameElementoErrorApellidos();
        elementoErrorApellidos.innerHTML="";
    }
    
    
    //FechaNacimiento
    dameElementoErrorFechaNacimiento(){
        return this.dameElemento("mensajeErrorFechaNacimiento");
    }
    
    mostrarErrorFechaNacimiento() {
        var elementoErrorFechaNacimiento = this.dameElementoErrorFechaNacimiento();
        elementoErrorFechaNacimiento.innerHTML="&nbsp;&nbsp;Fecha de nacimiento no válida (la edad ha de estar entre 18 y 125 años)";
    }
    
    ocultarErrorFechaNacimiento() {
        var elementoErrorFechaNacimiento = this.dameElementoErrorFechaNacimiento();
        elementoErrorFechaNacimiento.innerHTML="";
    }
    
    
    //Dni
    dameElementoErrorDni(){
        return this.dameElemento("mensajeErrorDni");
    }
    
    mostrarErrorDni() {
        var elementoErrorDni = this.dameElementoErrorDni();
        elementoErrorDni.innerHTML="&nbsp;&nbsp;Dni no válido";
    }
    
    ocultarErrorDni() {
        var elementoErrorDni = this.dameElementoErrorDni();
        elementoErrorDni.innerHTML="";
    }
    
    
    //Email
    dameElementoErrorEmail(){
        return this.dameElemento("mensajeErrorEmail");
    }
    
    mostrarErrorEmail() {
        var elementoErrorEmail = this.dameElementoErrorEmail();
        elementoErrorEmail.innerHTML="&nbsp;&nbsp;Email no válido";
    }
    
    ocultarErrorEmail() {
        var elementoErrorEmail = this.dameElementoErrorEmail();
        elementoErrorEmail.innerHTML="";
    }
    
    
    //Dispositivos
    dameElementoErrorDispositivos(){
        return this.dameElemento("mensajeErrorDispositivos");
    }
    
    mostrarErrorDispositivos() {
        var elementoErrorDispositivos = this.dameElementoErrorDispositivos();
        elementoErrorDispositivos.innerHTML="Has de seleccioanar al menos un dispositivo desde el cuál has probado la calculadora";
    }
    
    ocultarErrorDispositivos() {
        var elementoErrorDispositivos = this.dameElementoErrorDispositivos();
        elementoErrorDispositivos.innerHTML="";
    }
    
    
    //FuncionMasUtil
    dameElementoErrorFuncionMasUtil(){
        return this.dameElemento("mensajeErrorFuncionMasUtil");
    }
    
    mostrarErrorFuncionMasUtil() {
        var elementoErrorFuncionMasUtil = this.dameElementoErrorFuncionMasUtil();
        elementoErrorFuncionMasUtil.innerHTML="Has de indicar cuál es la función que te parece más útil";
    }
    
    ocultarErrorFuncionMasUtil() {
        var elementoErrorFuncionMasUtil = this.dameElementoErrorFuncionMasUtil();
        elementoErrorFuncionMasUtil.innerHTML="";
    }
    
    
    //FuncionesAQuitar
    dameElementoErrorFuncionesAQuitar(){
        return this.dameElemento("mensajeErrorFuncionesAQuitar");
    }
    
    mostrarErrorFuncionesAQuitar() {
        var elementoErrorFuncionesAQuitar = this.dameElementoErrorFuncionesAQuitar();
        elementoErrorFuncionesAQuitar.innerHTML="Has de indicar una función a quitar (si no quitarías ninguna marca \"Ninguna\")";
    }
    
    ocultarErrorFuncionesAQuitar() {
        var elementoErrorFuncionesAQuitar = this.dameElementoErrorFuncionesAQuitar();
        elementoErrorFuncionesAQuitar.innerHTML="";
    }
    
    
    //Otros
    dameElementoErrorOtros(){
        return this.dameElemento("mensajeErrorOtros");
    }
    
    mostrarErrorOtros() {
        var elementoErrorOtros = this.dameElementoErrorOtros();
        elementoErrorOtros.innerHTML="Si seleccionas \"Otros\" en \"Funciones a quitar\" debes escribir cúal quitarías";
    }
    
    ocultarErrorOtros() {
        var elementoErrorOtros = this.dameElementoErrorOtros();
        elementoErrorOtros.innerHTML="";
    }
    
    
    //ValoracionFinal
    dameElementoErrorValoracionFinal(){
        return this.dameElemento("mensajeErrorValoracionFinal");
    }
    
    mostrarErrorValoracionFinal() {
        var elementoErrorValoracionFinal = this.dameElementoErrorValoracionFinal();
        elementoErrorValoracionFinal.innerHTML="Has de seleccionar un valor del 1 al 10 para cada uno de los 4 aspectos en la \"Valoración final\"";
    }
    
    ocultarErrorValoracionFinal() {
        var elementoErrorValoracionFinal = this.dameElementoErrorValoracionFinal();
        elementoErrorValoracionFinal.innerHTML="";
    }
    
    
    //Final
    dameElementoErrorFinal(){
        return this.dameElemento("mensajeErrorFinal");
    }
    
    mostrarErrorFinal() {
        var elementoErrorFinal = this.dameElementoErrorFinal();
        elementoErrorFinal.innerHTML="Para poder enviar la encuesta, has de corregir todos los errores que se muestran arriba";
    }
    
    ocultarErrorFinal() {
        var elementoErrorFinal = this.dameElementoErrorFinal();
        elementoErrorFinal.innerHTML="";
    }
    
    
    
    //Otro
    dameElementoOtro(){
        return this.dameElemento("otro");
    }
    
    //valOtro
    dameElementoValOtro(){
        return this.dameElemento("valOtro");
    }
    
    //textoOtro
    dameElementoTextoOtro(){
        return this.dameElemento("textoOtro");
    }
    
    //fechaNacimiento
    dameElementoFechaNacimiento(){
        return this.dameElemento("fechaNacimiento");
    }
    
    
    buttonGroupTieneUnRadioSeleccionado(nombreButtonGroup){
        var radioButtons=document.getElementsByName(nombreButtonGroup);
        var numRadioButtons = radioButtons.length;
        var alMenosUnoSeleccionado = false;
        
        for(var i=0; i<numRadioButtons; i++){
            if(radioButtons[i].checked){
                alMenosUnoSeleccionado=true;
                break;
            }
        }
        
        return alMenosUnoSeleccionado;
    }
    
    
    dniValido(dni){
        //Cogemos el dni y sacamos el numero y la letra
        var numeroDni, letraDni;
        //comprobamos la longitud (debe ser 8 o 9)
        if(dni.length==8){
            numeroDni = dni.substr(0,7);
            letraDni = dni.substr(7,1);
        }else if(dni.length==9){//
            numeroDni = dni.substr(0,8);
            letraDni = dni.substr(8,1);
        }else return false;
        
        //Calculamos el módulo 23 del numero
        var modulo23 = numeroDni % 23;
        
        //Sacamos la letra que se corresponde con el valor de ese modulo
        var letraModulo = this.letraModulo23(modulo23);
        
        if(letraDni==letraModulo)
            return true;
        else return false;
    }
    
    letraModulo23(modulo23){
        switch(modulo23){
            case 0: return "T";
            case 1: return "R";
            case 2: return "W";
            case 3: return "A";
            case 4: return "G";
            case 5: return "M";
            case 6: return "Y";
            case 7: return "F";
            case 8: return "P";
            case 9: return "D";
            case 10: return "X";
            case 11: return "B";
            case 12: return "N";
            case 13: return "J";
            case 14: return "Z";
            case 15: return "S";
            case 16: return "Q";
            case 17: return "V";
            case 18: return "H";
            case 19: return "L";
            case 20: return "C";
            case 21: return "K";
            case 22: return "E";
            default: return "";
        }
    }
    
    todoLetras(texto){  
        var letras = /^[A-Za-z]+$/;  
        if(texto.match(letras))  
            return true;  
       
        else return false;  
    }  
    
    tresCaracteresIgualesConsecutivos(texto){
        return /(.)\1\1/.test(texto);
    }
    
    
    
}

var encuesta = new Encuesta();