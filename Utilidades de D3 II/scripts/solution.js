// El objetivo de este ejercicio es crear un line chart o gráfico de líneas sobre los precios de paltas a través del tiempo en USA. 
// Esta vez, utilizaremos el join de datos personalizado para cambiar entre paltas convencionales y orgánicas.
// Como eje X usaremos fechas y como eje Y el precio promedio de una palta en dicho periodo de tiempo.
// Si colocamos nuestro mouse sobre cada punto, deberíamos obtener el valor específico en el periodo, 
// en forma de tooltip sobre el nodo.

// 1. Definiremos las constantes de alto, ancho y márgenes de nuestro SVG.

const WIDTH = 1200,
      HEIGHT = 600;

const margin = {
    top: 70,
    bottom: 70,
    left: 100,
    right: 100
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

// 2. Crear un SVG dentro del div container, ubicado en el HTML. 
//   (Nota: el div tiene id = #container)
//   Mediante atributos, le damos el ancho y alto pedido.

const svg = d3.select('#container')
              .append('svg')
              .attr("width", WIDTH)
              .attr("height", HEIGHT)

// 3. Crear contenedor donde se agrupan los elementos de la visualización

const container = svg.append('g')
                        .attr("transform", `translate(${margin.left}, 
                                                      ${margin.top})`);
// 4. Le añadiremos al SVG contenedores para ambos ejes.
//    De momento, solo se appendea el 'g' al SVG 
//    y los transformaremos según el margen especificado arriba.
//    También es clave darles una clase o id.
//    Esto se hace aquí ya que al ser el gráfico interactivo
//    Necesitaremos tener una referencia a sus clases/id para ir cambiando
//    Su contenido. De otra forma se generarán ejes duplicados en la visualización.

svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${margin.left}, 
            ${HEIGHT - margin.bottom})`);
svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left},
                ${margin.top})`);

// 4. Le añadiremos al SVG elementos del tipo 'text', para los títulos y labels de ejes.
//    Nuevamente, solo le damos una clase y/o id y le aplicamos el transform para moverlo,
//    como en los ejercicios de la semana pasada.
//    También se le puede dar una posición fija x,y a los ejes, como aquí en el yLabel.
//    Lo que no se le da en este punto es el atributo 'text', que fija el contenido del texto.
//    Finalmente, como esta vez estamos trabajando con un archivo externo CSS, podrías comenzar a acostumbrarte
//    a escribir allí los estilos. En este caso, text-anchor se incluiría en el css externo. 
//    Tip para el CSS: aprovecha el uso de clases para agrupar las reglas.

svg.append("text")     
    .attr("class", "title")
    .attr("transform",
        "translate(" + ((width/2) + margin.left) + " ," + 
        (margin.top/2) + ")");

svg.append("text")  
    .attr("class", "label")
    .attr("id", "xLabel")
    .attr("transform",
        "translate(" + ((width/2) + margin.left) + " ," + 
                        (HEIGHT - margin.bottom/4) + ")");

const yLabel = svg.append("text")
                  .attr("class", "label")
                  .attr("id", "yLabel")
                  .attr("transform", "rotate(-90)")
                  .attr("y", margin.left/2)
                  .attr("x",0 - (HEIGHT / 2))
                  .attr("dy", "1em");

// 5. Se agregan mediante D3 dos botones en el div dedicado específicamente a eso.
//    (Nota: el div tiene de id 'buttonContainer')

const convencionales = d3.select("#buttonContainer").append("button").text("Conventional Avocados");
const organicas = d3.select("#buttonContainer").append("button").text("Organic Avocados");

// 6. Como en los ejercicios del módulo anterior, nuevamente generamos un parser 
//    para filtrar la información relevante del ejercicio,
//    y castear los tipos correctos a ciertas variables.

// Para parsear las fechas
const parseDate = d3.timeParse("%Y-%m-%d");

// Filtramos los datos
const parser = (data) => {
    return {
        date: parseDate(data.Date), // Fecha
        avgPrice: parseFloat(data.AveragePrice, 10), // Precio promedio de una palta
        totalVolume: parseInt(data.TotalVolume, 10), // Volumen total vendido
        totalBags: parseInt(data.TotalBags, 10), // Bolsas vendidas
        type: data.type, // Convencional u orgánica
    }
}

// 7. Para poder cambiar entre dos gráficos (paltas orgánicas o convencionales),
//    Debemos crear un filtro para separar los datos, ya que vienen en un solo dataset.
//    A esta funcion le entra el dataset data, y el string type, que puede ser
//    "conventional" o "organic".

const filterDataset = (data, type) => {
    data = data.filter(item => item.type === type) // filtrar los items que tengan tipo igual al pedido y retornarlo.
    return data
}


// 8. Esta función engloba la creación/actualización del gráfico.

const avocadoCount = (data, type) => {

    // Ordenamos los datos en forma creciente para el gráfico y sacamos el máximo para hacer las escalas.
    // (tip: recordar que d3 tiene d3.min, d3.max, d3.mean, etc.,)

    const maxValue = d3.max(data, (d) => d.avgPrice);

    // (tip: recordar que a los arrays de JS se les puede aplicar .sort )

    data.sort((a, b) => a.date - b.date);

    // Escala del eje X. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
    // dominio y rango como mínimo.

    const xScale = d3.scaleBand()
                        .domain(data.map((d) => d.date))
                        .range([0, width])
                        .padding(0.3);

    // Escala del eje Y. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
    // dominio y rango como mínimo.

    const yScale = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([height, 0]);

    // Las siguientes lineas generan la 'línea' del line chart. Como es materia no vista, 
    // De momento, se explica brevemente como funciona. 
    // Si quieres saber más, puede leer sobre d3.line() en:
    // https://observablehq.com/@d3/d3-line

    const line = d3.line() // inicialización
    .x((d) => xScale(d.date)) // Con esto le damos las coordenadas 'x' que tendrán los puntos por donde pasará la línea
    .y((d) => yScale(d.avgPrice)) // Con esto le damos las coordenadas 'y' que tendrán los puntos por donde pasará la línea 
    .curve(d3.curveMonotoneX) // Opcional. Suaviza la línea. Prueba comentándolo para ver cómo se ve sin esto.

    // Se crean los ejes X e Y. Se les debe dar como parámetro la escala X e Y hecha previamente.
    // Únicamente por motivos visuales, se le puede dar un formato a los ticks del eje X 
    // (hint: .tickFormat(), investigue como darle un formato de tiempo)

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%y-%m"))
    const yAxis = d3.axisLeft(yScale);

    // Necesitamos recuperar los 'g' hechos para el eje X más arriba. Esto
    // debería hacerse mediante un 'selectAll' de la clase o ID dada arriba.
    // Una vez hecho, use chaining para añadirle, en el siguiente orden:
    // transition, duration de 1000, llamado a xAxis
    // seleccionar con 'selectAll' cualquier celda de tipo texto y rotarla en 45 grados.
    // Tip para rotar: use transform.
    // Con esto último, rotaremos las etiquetas en los ticks del eje X para mayor legibilidad.

    svg.selectAll(".xAxis")
        .transition()
        .duration(1000)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", `rotate(45)`)

    // Necesitamos recuperar los 'g' hechos para el eje Y más arriba. Esto
    // debería hacerse mediante un 'selectAll' de la clase o ID dada arriba.
    // Una vez hecho, use chaining para añadirle, en el siguiente orden:
    // transition, duration de 1000, llamado a yAxis
    // Ahora, seleccionar con 'selectAll' cualquier celda de tipo 'line'.
    // Les agregamos el atributo "x1" con valor width.
    // Cómo último, les damos una opacidad de 0.2
    // Esto nos crea líneas grises horizontales a lo largo del gráfico, para ayudar al usuario a conectar
    // Los puntos con los ejes.

    svg.selectAll(".yAxis")
        .transition()
        .duration(1000)
        .call(yAxis)
        .selectAll("line")
        .attr("x1", width)
        .attr("opacity", 0.2);
    
    // Necesitamos recuperar los 'text' hechos para el título y las label de los ejes
    // más arriba. Hacemos 'selectAll' por cada clase o ID que se les asigno arriba,
    // y simplemente, mediante el método .text(), se les rellena con el texto adecuado.

    svg.selectAll(".title")
        .text(`Date vs. Avg. Price of avocado 🥑 (${type})`);
    
    svg.selectAll("#xLabel")            
        .text("Date (Year-Month)");

    svg.selectAll("#yLabel")
        .text("Avg. price per avocado (USD)"); 

    
    // Ahora seleccionamos el 'trazo' o 'linea' del gráfico que habiamos creado antes con .line().
    // El binding de los datos se debe hacer así: .data([data]).
    // A continuación, implementaremos nuestro primer data join personalizado:
    // Primero usamos .join(). Como argumento, se le da (enter), para indicar como funcionará la agregación de una línea inicial
    // Luego, (update) para indicar cómo se comportarán las líneas existentes al cambiar la información que llevaban
    // y (exit), para indicar cómo se comportará una linea que se va a eliminar.
    // Como en este ejercicio en particular sabemos que crearemos primero una línea, y luego la actualizaremos,
    // pero nunca la borraremos, no se ha agregado el exit en el join.

    container.selectAll("path")
    .data([data])
    .join(
      (enter) => 
        enter
            .append("path") // cuando entre appendeamos un path
            .attr("class", "line") // le damos la clase para fines de CSS
            .attr("d", line) // el dato que tendrá este path es el objetivo line que se había generado más arriba.
            .selection(), 
      (update) => 
        update
            .transition() // avisamos que partirá con una transicion
            .duration(1000) // tiempo de la transicion
            .attr("d", line) // dato por el que se cambiará el antiguo
            .selection()
    );

    // Haremos nuestro segundo data join personalizado, para incluir los 'nodos' del line chart.
    // Esta vez seleccionamos todos los objetos con la clase ".dot" (o cualquier otro nombre que quieras darle)
    // e iniciamos el join.
    // Por como vienen definidos los datos, sabemos que siempre hay uno por mes para los 3 años de los datos (2015,2016,2017)
    // Por lo que no necesitamos a exit ya que nunca 'sobrarán' nodos.
    // En enter, se deben generar los círculos en el svg con append.
    // A todos se les asigna la clase "dot" (o cualquier otra, mientras se use solo para círculos)
    // Le damos las coordenadas de su centro (cx, cy) usando las escalas previamente creadas como intermedio.
    // Por temas únicamente visuales, se le añade una transición para que aparezcan lentamente
    // y se define su radio inicial como 5.
    // Al actualizar, añadimos primero una transicion con duración de 1000.
    // Lo único que debería cambiar son las posiciones del centro.
    // Aprovechamos la clase asignada 'dot' y nuestro archivo externo de CSS para poner las reglas de estilo de los nodos.

    //Finalizando el join, deberás hacer chaining para incluir el comportamiento que tendrán los nodos
    // cuando se les pase el mouse por encima. Esto se hace con .on("evento", (event, d) => {}), donde lo primero es
    // el tipo de evento y lo segundo la función que se ejecutará cuando se active. Ver las capsulas de la semana
    // para mas detalles.

    container.selectAll(".dot")
    .data(data)
    .join(
        (enter) => 
            enter
                .append("circle") // Creo un circulo nuevo
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", (d) => xScale(d.date) )
                .attr("cy", (d) => yScale(d.avgPrice) )
                .transition()
                .duration(1000)
                .attr("r", 5)
                .selection(),
        (update) =>
            update
                .transition()
                .duration(1000)
                .attr("cx", function(d) { return xScale(d.date) })
                .attr("cy", function(d) { return yScale(d.avgPrice) })
                .selection()
        ) // Ahora definimos el comportamiento de los circulos cuando entre o salga el mouse.
    .on("mouseenter", (event, d) => {
            d3.select(event.currentTarget) // seleccionamos el nodo actual
              .transition() // avisamos transicion
              .duration(500) // tiempo transicion
              .attr("class", "selected") // cambiamos la clase. En el CSS se define otro color.
              .attr("r", 10); // cambiamos el radio.
            svg.append("text") // creamos texto
            .attr("id","tooltip") // con este ID para borrarlo después
            .attr("x", xScale(d.date)+125) // posición X, (jugar con coordenadas)
            .attr("y", yScale(d.avgPrice)+50) // posición Y, (jugar con coordenadas)
             .text(`Avg. Price: ${d.avgPrice}`);
          }) // definimos que pasa cuando el mouse sale (revertir cambios)
          .on("mouseleave", (event, d) => {
            d3.select(event.currentTarget)
              .transition()
              .duration(500)
              .attr("class", "dot") // devuelve la clase
              .attr("r", 5); // devuelve el radio
            d3.select("#tooltip").remove();  // Borra el texto anterior
          });
    
}

// 9. Como último paso, debemos cargar los datos del CSV y ejecutar
//    la función que genera el gráfico tras parsear los datos.
//    Además, no olvidar el definir aquí cual será el comportamiento de los botones del inicio.
//    Para esta parte, recomiendo ver las cápsulas del profesor de este módulo o el código de ejemplo dado si no
//    Estás segurx de cómo proceder.

d3.csv("data/avocado.csv", parser)
    .then((data) => {
        // primero una carga normal, para inicializar el gráfico
        avocadoData = filterDataset(data, 'conventional');
        avocadoCount(avocadoData, 'conventional');
        // definimos qué funciones se llaman cuando aprieto cada botón
        convencionales.on("click", () => {
        avocadoData = filterDataset(data, 'conventional');
        avocadoCount(avocadoData, 'conventional');
        });
        // definimos qué funciones se llaman cuando aprieto cada botón
        organicas.on("click", () => {
            avocadoData = filterDataset(data, 'organic');
            avocadoCount(avocadoData, 'organic');
            });
    }) // atrapa errores
    .catch((err) => console.log(err));
    
// Has llegado al final, ¡Felicitaciones! Deberías tener un lindo gráfico de paltas.

// Algunas implementaciones propuestas que podrías hacer si quedaste con ganas:
// -Haz que el tooltip incluya más info que tiene el dataset (Número de bolsas, volumen, etc.)
// Para esto, recomiendo buscar ejemplos de tooltips más complejos en internet, como:
// http://bl.ocks.org/d3noob/ec6a394a1fe50b8afa103190ba755f4b
// -Haz más botones y filtros distintos: ¿Filtrar por año y tipo de palta? ¿Que en vez de precio, mida bolsas vendidas?
// -Mejora el CSS de la página y de la visualización a tu gusto! ✨