# XML y XSLT
Esta carpeta contiene varios "ejercicios" en los que se practica con el metalenguaje XML y con el lenguaje de transformación XSLT.

- **ConvertXML2KML**: Se trata de una aplicación de consola, realizada en C#, la cuál convierte archivos XML a archivos KML (más info dentro de dicha carpeta).
- Las otras 3 carpetas contienen un documento XML bien formado (el mismo en las 3), escrito desde 0, y en cada una de ellas se utiliza XSLT para transformar dicho XML en HTML (y en ocasiones filtrar la información de salida). El documento XML contiene información sobre recetas de comida asturiana. El contenido de cada una de dicha carpetas es el siguiente:
    - **recetas.xml**: El documento XML con recetas de comida, y que está enlazado al documento XSLT contenido en la misma carpeta.
    - **recetas.xsl**: El documento XSLT que permite transformar la información contenida en el documento XML a HTML.
    - **recetas.css**: El fichero CSS que permite dar estilo al documento HTML resultante de la transformación con XSLT.
    - **recetas.html**: El fichero HTML que resulta de la transformación del fichero XML mediante XSLT. Ha sido creado mediante ingeniería inversa, inspeccionando el navegador después de abrir el XML.
    
Es importante recalcar que **los ficheros HTML que se incluyen NO son necesarios**. Es decir, al abrir el fichero XML con un navegador, el fichero XSLT que se encuentra en la misma carpeta ya se encarga de transformarlo en HTML al momento.
