## COMANDO /tiempo

- Modo de ejecucion
    - /tiempo Madrid
    - /tiempo Barcelona
    - /tiempo Santiago de Compostela

1. Generar el comando y que funcione
2. ¿Como extraigo la ciudad? (ctx.message)
3. Peticion web a la siguiente url:https://api.openweathermap.org/data/2.5/weather?
q=NOMBREDELACIUDAD&appid=12cc61f3282afaca14152a6185f43de0&units=metric

    - ¿Cómo hago la petición web?
        - Instalar y usar axios
        - Usar fetch

4. Con los datos que nos devuelva la petición hay que responder al bot con: temperatura máxima, temperatura mínima, temperatura actual y humedad