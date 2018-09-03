"use strict";
class Calculadora{
    constructor (){
        this.display="0";//en el display se muestran strings
        this.memoria=0;//pero la memoria guarda numeros
    }
    
    addDisplay(digito){
        //Añadimos el digito al display
        if(this.display=="0")//Si habia un 0, lo reemplazamos por el nuevo digito
            this.display=digito;
        else//si no añadimos el digito a la derecha de lo que ya habia
            this.display+=digito;
        
        this.actualizaDisplay();
    }
    
    clearDisplay(){
        //El display pasa a tener valor 0
        this.display="0";
        this.actualizaDisplay();
    }

    igual(){
        //Le pasamos lo que haya en el display y lo que devuelva lo mostramos por display
        try{
            this.display = eval(this.display);//A eval hay que pasarle un string como parametro
        }catch(error){
            this.display = "Error: " + error.message;
        }
        this.actualizaDisplay();
    }
    
    memoriaMas(){
        //Pulsa el boton m+ que lo que hace es sumar el valor del display a lo que haya en la memoria
        this.memoria+=Number(this.display);//Number puede devolver NaN si lo que hay en el display no es un numero
    }

    memoriaMenos(){
        //Pulsa el boton m- que lo que hace es restar el valor del display a lo que haya en la memoria
        this.memoria-=Number(this.display);//Number puede devolver NaN si lo que hay en el display no es un numero
    }
    
    memoriaRecall(){
        //En el display se muestra el valor que habia almacenado en memoria (se borra lo que habia antes en el display)
        this.display=String(this.memoria);
        this.actualizaDisplay();
    }
    
    memoriaClear(){
        //Se borra el contenido de la memoria (su valor pasa a ser 0)
        this.memoria=0;
    }
    
    actualizaDisplay(){
        //Imprimimos el contenido del display
        document.getElementById("display").value=this.display;
    }
    
}

var calculadora = new Calculadora();