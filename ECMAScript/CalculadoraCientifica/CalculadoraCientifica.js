"use strict";
class CalculadoraCientifica extends Calculadora{
    constructor(){
        super();
    }
    
    sin(){
        //Calculamos el seno del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.sin(Number(this.display)));//el resultado sale en radianes
        this.actualizaDisplay();
    }
    
    cos(){
        //Calculamos el coseno del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.cos(Number(this.display)));//el resultado sale en radianes
        this.actualizaDisplay();
    }
    
    tan(){
        //Calculamos la tangente del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.tan(Number(this.display)));//el resultado sale en radianes
        this.actualizaDisplay();
    }
    
    eElevadoAX(){
        //Calculamos el valor de elevar el numero e al valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( Math.E , Number(this.display) ));
        this.actualizaDisplay();
    }
    
    cuadrado(){
        //Calculamos el cuadrado del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( Number(this.display), 2 ));
        this.actualizaDisplay();
    }
    
    cubo(){
        //Calculamos el cubo del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( Number(this.display), 3 ));
        this.actualizaDisplay();
    }
    
    diezElevadoAX(){
        //Calculamos el valor de elevar 10 al valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( 10, Number(this.display) ));
        this.actualizaDisplay();
    }

    
    pi(){
        //Añadimos al final del valor del display el valor de PI

        var pi_string = String(Math.PI);
                
        if(this.display=="0")//Si habia un 0, lo reemplazamos por el nuevo digito
            this.display=pi_string;
        else//si no añadimos el digito a la derecha de lo que ya habia
        this.display+=pi_string;
        
        this.actualizaDisplay();
    }
    
    e(){
        //Añadimos al final del valor del display el valor de e

        var e_string = String(Math.E);
                
        if(this.display=="0")//Si habia un 0, lo reemplazamos por el nuevo digito
            this.display=e_string;
        else//si no añadimos el digito a la derecha de lo que ya habia
        this.display+=e_string;
        
        this.actualizaDisplay();
    }
    
    unoEntreX(){
        //Calculamos el valor de dividir 1 entre lo que habia en el display y mostramos el resultado en el display
        this.display=String( 1 / Number(this.display) );
        this.actualizaDisplay();
    }
    
    raizCuadrada(){
        //Calculamos la raiz cuadrada del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.sqrt( Number(this.display), 2 ));
        this.actualizaDisplay();
    }
    
    raizCubica(){
        //Calculamos la raiz cubica del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( Number(this.display), 1/3 ));
        this.actualizaDisplay();
    }
    
    dosElevadoAX(){
        //Calculamos el valor de elevar 2 al valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.pow( 2, Number(this.display) ));
        this.actualizaDisplay();
    }

    
    log(){
        //Calculamos el logaritmo del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.log10( Number(this.display) ));
        this.actualizaDisplay();
    }
    
    ln(){
        //Calculamos el logaritmo neperiano del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.log( Number(this.display) ));//el Math.log(x) de JS es el ln(x) de matemáticas
        this.actualizaDisplay();
    }
    
    retroceso(){
        //Borramos el caracter de la derecha del display
        var display_size = this.display.length;
        
        //Si solo hay un elemento o el display pone NaN
        if(display_size==1 || this.display=="NaN"){
            //Si ese elemento NO es el 0, ponemos el valor 0 en el display (si es el 0 no hacemos nada)
            if(this.display!="0")
                this.display="0";
        }else{//Si hay mas de un elemento en el display, borramos el caracter de mas a la derecha
            this.display = this.display.substr(0,display_size-1);
        }
        
        this.actualizaDisplay();
    }
    
    factorial(){
        //Calculamos el factorial del valor que hay en el display y lo mostramos por el display
        this.display=String(this.factorialN(Number(this.display)));
        this.actualizaDisplay();
    }
    
    factorialN(n){
        if(n==0) return 1;
        if(n>1) return n * this.factorialN(n-1);
        else return n;
    }
    
    porcentaje(){
        //Dividimos entre 100 el valor del display y lo mostramos por el display
        this.display=String(Number(this.display) / 100);
        this.actualizaDisplay();
    }
    
    masMenos(){
        //Multiplicamos por -1 el valor del display y lo mostramos por el display
        this.display=String(Number(this.display) * -1);
        this.actualizaDisplay();
    }
    
    abs(){
        //Calculamos el valor absoluto del valor que hay en el display y mostramos el resultado en el display
        this.display=String(Math.abs( Number(this.display) ));
        this.actualizaDisplay();
    }
        
}

var calculadoraCientifica = new CalculadoraCientifica();