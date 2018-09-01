using System;
using System.IO; // Para manejo de archivos 
using System.Xml; //Para procesar XML
using System.Collections.Generic;

namespace ConvertXML2KML
{

    //Almacena los datos de cada bar
    class Bar
    {
        public string identificador;
        public string nombre;
        public string direccion;
        public string coordenadas;
        public string longitud;
        public string latitud;
        public string descripcion;
        public string horario;
        public string correo;
        public string url_foto;
        public string url_web;
        public string telefono;
        public List<string> categorias;
    }

    /* Esta clase va a leer un XML con los bares de Gijón y generar un KML con su situación geográfica */
    class ConvertXML2KML
    {

        static void Main(string[] args)
        {

            //Vamos a almacenar los bares en una lista
            List<Bar> bares = new List<Bar>();

            //Leemos los bares del xml, mostramos su información por consola y guardamos sus datos en la lista
            leerXML(bares);

            //Creamos un fichero bares.kml y escribimos en él la info de los bares
            crearKML(bares);

        }//fin del Main 


        public static void leerXML(List<Bar> bares)
        {
            //Leemos del fichero bares.xml
            try
            {
                String pathLocalArchivo = "bares.xml";

                XmlDocument documento = new XmlDocument();
                documento.Load(pathLocalArchivo);

                XmlNodeList nodes = documento.GetElementsByTagName("directorio");//Almacenamos los directorios (bares/locales)

                foreach (XmlNode node in nodes)
                {
                    //Si la dirección del bar es vacía (la etiqueta no tiene contenido) nos lo saltamos (ese directorio no es un bar)
                    //Directorios que tienen la direccion vacía en el XML:
                    //Parque de La Serena
                    //Playa de San Lorenzo (Naútico)
                    //Playa de San Lorenzo (Piles)
                    //Plaza del Humedal
                    //Policía Local (Hermanos Felgueroso)
                    //NO SON BARES
                    if ("".Equals(node.SelectSingleNode("direccion").InnerText))
                        continue;

                    //Hay bares que tienen la localizacion (coordenadas) vacía
                    //Estos bares tampoco los vamos a tener en cuenta
                    if ("".Equals(node.SelectSingleNode("localizacion").InnerText))
                        continue;


                    //Si es un bar (su direccion no es vacia) con coordenadas: lo creamos
                    Bar bar = crearBar(node);

                    //Añadimos el bar a la lista de bares
                    bares.Add(bar);
                }

                System.Console.WriteLine("Número total de bares: " + bares.Count);

            }//fin del try
            catch (IOException e)
            {
                Console.WriteLine("Error al cargar el fichero.");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error no documentado: " + e);
            }
            finally
            {
                Console.WriteLine("\nPulse intro para continuar...");
                Console.ReadLine();
            }
        }

        public static Bar crearBar(XmlNode node)
        {
            Bar bar = new Bar();//Creamos el bar

            //Le damos valor a sus atributos
            bar.identificador = node.SelectSingleNode("identificador").InnerText;
            bar.nombre = node.SelectSingleNode("nombre").InnerText;
            bar.direccion = node.SelectSingleNode("direccion").InnerText;
            bar.coordenadas = node.SelectSingleNode("localizacion").InnerText;
            bar.descripcion = node.SelectSingleNode("descripcion").InnerText;
            bar.horario = node.SelectSingleNode("horario").InnerText;
            bar.correo = node.SelectSingleNode("correo-electronico").InnerText;
            if (node.SelectSingleNode("foto") != null)
                bar.url_foto = node.SelectSingleNode("foto").InnerText;
            bar.url_web = node.SelectSingleNode("web").InnerText;
            bar.telefono = node.SelectSingleNode("telefono").InnerText;

            //La longitud y la latitud hay que sacarlas de las coordenadas
            //Primero viene la latitud y después la longitud, separadas por un espacio en blanco
            String[] lat_lon = bar.coordenadas.Split(' ');
            bar.latitud = lat_lon[0];
            bar.longitud = lat_lon[1];

            //para cada etiqueta categorias, tenemos que sacar cada categoria que tiene
            bar.categorias = new List<string>();

            XmlNode nodo_categorias = node.SelectSingleNode("categorias");
            //Creamos un iterador para iterar por los nodos categoria
            System.Collections.IEnumerator iterador = nodo_categorias.GetEnumerator();
            while (iterador.MoveNext())
            {
                string categoria_string = ((XmlElement)iterador.Current).FirstChild.Value;
                bar.categorias.Add(categoria_string);
            }

            //Sacamos los datos del bar por consola
            Console.WriteLine("Datos del bar actual:");
            Console.WriteLine("Identificador: " + bar.identificador);
            Console.WriteLine("Nombre: " + bar.nombre);
            Console.WriteLine("Coordenadas: " + bar.coordenadas);
            Console.WriteLine("Dirección: " + bar.direccion);
            if (bar.descripcion != "") Console.WriteLine("Descripción: " + bar.descripcion);
            if (bar.horario != "") Console.WriteLine("Horario: " + bar.horario);
            if (bar.correo != "") Console.WriteLine("Correo: " + bar.correo);
            if (bar.url_foto != null) Console.WriteLine("Foto: " + bar.url_foto);
            if (bar.url_web != "") Console.WriteLine("Web: " + bar.url_web);
            if (bar.telefono != "") Console.WriteLine("Teléfono: " + bar.telefono);

            Console.WriteLine(); Console.WriteLine(); Console.WriteLine(); Console.WriteLine();

            return bar;
        }

        public static void crearKML(List<Bar> bares)
        {
            Console.WriteLine("Se va a crear un fichero bares.kml asociado a bares.xml.");
            StreamWriter sw = null;

            //Creamos el fichero
            try
            {
                sw = new StreamWriter("bares.kml");

                //LLamamos a la función que escribe el contenido del fichero kml pasandole la info de los bares
                escribirKML(sw, bares);
            }
            catch (Exception e)
            {
                Console.WriteLine("Excepción: " + e.Message);
            }
            finally
            {
                //Cerramos el fichero
                if (sw != null) sw.Close();
                Console.WriteLine("Fichero bares.kml creado satisfactoriamente.");
                Console.WriteLine("El fichero puede ser abierto con, por ejemplo, Google Earth.");
                Console.WriteLine("\nGracias por usar ConvertXML2KML");
                Console.WriteLine("Versión 1.0, 11/10/2017");
                Console.WriteLine("Autor: Carlos Sanabria Miranda");
                Console.ReadKey();
            }
        }


        public static void escribirKML(StreamWriter sw, List<Bar> bares)
        {
            //Escribimos en el fichero bares.kml
            prologoKML(sw);
            contenidoKML(sw, bares);
            epilogoKML(sw);
        }

        public static void prologoKML(StreamWriter sw)
        {
            //Escribe en el archivo de salida el prólogo del archivo KML
            sw.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sw.WriteLine("<kml xmlns=\"http://www.opengis.net/kml/2.2\">");
            sw.WriteLine("<Document>");

            sw.WriteLine("<name>bares.kml</name>");
            sw.WriteLine("<description>Documento kml que contiene los bares de Gijón</description>");

            sw.WriteLine("<visibility>1</visibility>");
            sw.WriteLine("<open>1</open>");

            //Creamos un estilo compartido
            sw.WriteLine("<Style id = \"estilo\">");
            sw.WriteLine("<LabelStyle>");
            sw.WriteLine("<color> 0971b2 </color>");
            sw.WriteLine("</LabelStyle>");
            sw.WriteLine("</Style>");

            //Creamos estilos para los iconos cuando el usuario pone el raton encima
            sw.WriteLine("<Style id = \"highlightPlacemark\">");
            sw.WriteLine("<IconStyle>");
            sw.WriteLine("<Icon>");
            sw.WriteLine("<href>http://maps.google.com/mapfiles/kml/paddle/red-stars.png</href>");
            sw.WriteLine("</Icon>");
            sw.WriteLine("</IconStyle>");
            sw.WriteLine("</Style>");

            //Creamos estilos para los iconos cuando el usuario NO pone el raton encima
            sw.WriteLine("<Style id = \"normalPlacemark\">");
            sw.WriteLine("<IconStyle>");
            sw.WriteLine("<Icon>");
            sw.WriteLine("<href>icono_normal.png</href>");//CAMBIAR ICONO
            sw.WriteLine("</Icon>");
            sw.WriteLine("</IconStyle>");
            sw.WriteLine(" </Style>");

            //Creamos un diccionario
            sw.WriteLine("<StyleMap id = \"exampleStyleMap\">");
            sw.WriteLine("<Pair>");
            sw.WriteLine("<key>normal</key>");
            sw.WriteLine("<styleUrl>#normalPlacemark</styleUrl>");
            sw.WriteLine("</Pair>");
            sw.WriteLine("<Pair>");
            sw.WriteLine("<key>highlight</key>");
            sw.WriteLine("<styleUrl>#highlightPlacemark</styleUrl>");
            sw.WriteLine("</Pair>");
            sw.WriteLine("</StyleMap>");

            sw.WriteLine();
        }

        public static void contenidoKML(StreamWriter sw, List<Bar> bares)
        {

            foreach (Bar bar in bares)
            {
                //Creamos un punto en el mapa que representa el bar
                sw.WriteLine("<Placemark>");
                sw.WriteLine("<name>" + bar.nombre + "</name>");
                if (bar.descripcion != "") sw.WriteLine("<description>" + bar.descripcion + "</description>");
                sw.WriteLine("<address>" + bar.direccion + "</address>");
                if (bar.telefono != "") sw.WriteLine("<phoneNumber>" + bar.telefono + "</phoneNumber>");
                sw.WriteLine("<styleUrl>#exampleStyleMap </styleUrl>");//Hacemos que haga referencia al diccionario con los estilos de los iconos
                sw.WriteLine("<Point>");
                sw.WriteLine("<coordinates>" + bar.longitud + "," + bar.latitud + ",0</coordinates>");//longitud,latitud,altitud (que va a ser 0) separadas por comas
                sw.WriteLine("<altitudeMode>relativeToGround</altitudeMode>");//La altitud la saca él
                sw.WriteLine("</Point>");
                sw.WriteLine("</Placemark>");
            }

            sw.WriteLine();
        }

        public static void epilogoKML(StreamWriter sw)
        {
            //Escribe en el archivo de salida el epí́logo del archivo KML
            sw.WriteLine("</Document>");
            sw.WriteLine("</kml>");
        }

    } //fin de la clase ConvertXML2KML

} // fin namespace
