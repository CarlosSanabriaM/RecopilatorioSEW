# MapaBares
Al abrir la página, es necesario darle permiso para que acceda a nuestra ubicación. Es posible que si se tienen deshabilitados los mensajes emergentes no salga dicha notificación.

El punto azul indica nuestra posición, y los puntos rojos representan los bares que tenemos cerca. Cada x segundos se vuelve a consultar la posición actual del dispositivo y se actualiza el punto azul.

Arriba hay dos botones:
- *Ocultar bares cercanos*: Oculta los puntos rojos que representan los bares.
- *Mostrar bares cercanos*: Muestra los puntos rojos que representan los bares.

Si se hace click en un punto rojo, se muestra información sobre dicho bar. En concreto:
- Nombre
- Dirección
- Puntuación en Google Maps

Arriba a la izquierda se puede cambiar el estilo del mapa (normal, nocturno, satélite, ...)

**IMPORTANTE**: Al utilizar la API de Google Maps, es necesario solicitar una API Key, la cual nos permite un cierto número de solicitudes a sus servicios web de forma gratuita. Si se sobrepasa dicho número es posible que no se muestre arriba a la izquierda la opción de cambiar el estilo del mapa y que salte un mensaje emergente. El mapa mostrará también el mensaje "For development purposes only".
