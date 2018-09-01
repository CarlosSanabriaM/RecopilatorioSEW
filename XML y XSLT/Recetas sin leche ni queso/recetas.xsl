<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version ="1.0" xmlns:xsl= "http://www.w3.org/1999/XSL/Transform">
    <!-- El formato de salida va a ser html -->
    <xsl:output method="html" encoding="utf-8" indent="yes"/>

    <!-- Se crean variables con los ingredientes prohibidos -->
    <xsl:variable name="ingrediente_prohibido1" select="'leche'"/>
    <xsl:variable name="ingrediente_prohibido2" select="'queso'"/>

    <xsl:template match="/">
        <!-- html de salida -->
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Recetas</title>
                <meta name="author" content="Carlos Sanabria Miranda"/>
                <meta name="description" content="Página sobre recetas de cocina"/>
                <meta name="keywords" content="receta,cocina,pollo,vegana,comida,asturiana,asturias"/>
                <link rel="stylesheet" type="text/css" href="recetas.css" />
            </head>
            <body>
                <header><h1 id="arriba">Recetas sin leche ni queso</h1></header>
                <main>
                    <!--  Iteramos por cada una de las recetas -->
                    <xsl:for-each select="recetas/receta">
                        <!-- Si la receta actual no contiene entre sus ingredientes ninguno de los dos ingredientes prohibidos,
                      entonces dicha receta aparecerá en el documento html de salida -->
                        <xsl:if test="not(contains(translate(ingredientes, 'L', 'l'),$ingrediente_prohibido1))
                                      and not(contains(translate(ingredientes, 'Q', 'q'),$ingrediente_prohibido2))">
                            <article>
                                <header><h2><xsl:value-of select="nombre"/></h2></header>
                                <table>
                                    <tr>
                                        <th>Tipo de plato</th>
                                        <th>Dificultad</th>
                                        <th>Tiempo de elaboración</th>
                                        <xsl:if test="./calorias">
                                            <th>Calorías</th>
                                        </xsl:if>
                                    </tr>
                                    <tr>
                                        <td><xsl:value-of select="tipoPlato"/></td>
                                        <td><xsl:value-of select="dificultad"/></td>
                                        <td><xsl:value-of select="tiempo"/>&#160;<xsl:value-of select="tiempo/@unidad"/></td>
                                        <xsl:if test="./calorias">
                                            <td><xsl:value-of select="calorias"/></td>
                                        </xsl:if>
                                    </tr>
                                </table>
                                <section>
                                    <h3>Ingredientes:</h3>
                                    <ul>
                                        <xsl:for-each select="ingredientes/ingrediente">
                                            <li>
                                                <xsl:value-of select="."/> (<xsl:value-of select="@cantidad"/>&#160;<xsl:value-of select="@unidad"/>)
                                            </li>
                                        </xsl:for-each>
                                    </ul>
                                </section>
                                <section>
                                    <h3>Elementos utilizados para la elaboración:</h3>
                                    <ul>
                                        <xsl:for-each select="elementosElaboracion/elemento">
                                            <li>
                                                <xsl:value-of select="."/>
                                            </li>
                                        </xsl:for-each>
                                    </ul>
                                </section>
                                <section>
                                    <h3>Proceso de elaboración:</h3>
                                    <ol>
                                        <xsl:for-each select="procesoElaboracion/paso">
                                            <!-- Por si acaso, ordenamos por el orden de los pasos -->
                                            <xsl:sort order="ascending" select="@orden"/>
                                            <li>
                                                <xsl:value-of select="."/>
                                            </li>
                                        </xsl:for-each>
                                    </ol>
                                </section>
                                <footer>
                                    <h3>Orígen de la receta:</h3>
                                    <xsl:choose>
                                        <xsl:when test="starts-with(origen,'http')">
                                            <p><a href="{origen}"><xsl:value-of select="origen"/></a></p>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <p><xsl:value-of select="origen"/></p>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </footer>
                            </article>
                        </xsl:if>
                    </xsl:for-each>
                </main>
                <footer>
                    <a href="#arriba" >Volver arriba</a>
                    <p lang="en">Copyright © 2017 Carlos Sanabria Miranda</p>
                    <p>Esta página web ha sido validada satisfactoriamente:</p>
                    <a href="https://validator.w3.org/check?uri=referer">
                        <img src="https://www.w3.org/html/logo/badge/html5-badge-h-solo.png"
                             alt="HTML5 Válido" title="HTML5 Válido" />
                    </a>
                    <a href=" http://jigsaw.w3.org/css-validator/check/referer ">
                        <img src=" http://jigsaw.w3.org/css-validator/images/vcss"
                             alt="¡CSS Válido!" />
                    </a>
                </footer>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
