# ConvertXML2KML

Se trata de una aplicación de consola, la cuál convierte archivos XML (que han de tener el formato específico del fichero bares.xml) a archivos KML (un lenguaje de marcado basado en XML para representar datos geográficos en tres dimensiones, y que pueden ser abiertos con Google Earth para visualizar dichos datos). Ha sido desarrollada en el lenguaje de programación C#.

Recalcar que el código está hecho para aceptar unicamente archivos XML que tengan el mismo formato que bares.xml.

## Contenido
- **El fichero *ConvertXML2KML.cs*** contiene el código de la aplicación.
- **El fichero *ConvertXML2KML.exe*** contiene el ejecutable de la aplicación.
- **El fichero *bares.xml*** se trata de un archivo XML con información sobre bares de Gijón.
- **El fichero *bares.kml*** se trata del fichero KML generado a partir de bares.xml, utilizando el ejecutable ConvertXML2KML.exe.

## Cómo ejecutar la aplicación
Ya se proporciona el fichero KML de salida. Para probar el correcto funcionamiento del conversor, borrar dicho fichero (bares.kml).

- **Windows**: Hacer doble click en el ejecutable ConvertXML2KML.exe. 
    - Si da problemas, generar de nuevo el ejecutable. Para ello, situarse desde el cmd en la carpeta y ejecutar el comando ``csc ConvertXML2KML.cs``.

- **Mac**: Ejecutar el .exe utilizando Mono. Para ello, situarse desde la Terminal en la carpeta y ejecutar el comando ``mono ConvertXML2KML.exe``.
    - Si da problemas, generar de nuevo el ejecutable. Para ello, situarse desde la Terminal en la carpeta y ejecutar el comando ``mcs ConvertXML2KML.cs``.

Una vez hecho esto, se generará el fichero bares.kml. Ese fichero podrá ser abierto utilizando Google Earth, para observar las localizaciones de los bares.
