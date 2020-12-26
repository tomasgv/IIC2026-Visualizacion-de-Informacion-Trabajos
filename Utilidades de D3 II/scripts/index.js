// El objetivo de este ejercicio es crear un line chart o gráfico de líneas sobre los precios de paltas a través del tiempo en USA. 
// Esta vez, utilizaremos el join de datos personalizado para cambiar entre paltas convencionales y orgánicas.
// Como eje X usaremos fechas y como eje Y el precio promedio de una palta en dicho periodo de tiempo.
// Si colocamos nuestro mouse sobre cada punto, deberíamos obtener el valor específico en el periodo, 
// en forma de tooltip sobre el nodo.

// 1. Definiremos las constantes de alto, ancho y márgenes de nuestro SVG.

const WIDTH = 800, // Completar
      HEIGHT = 600; // Completar

const margin = {
    left: 100,
    right: 100,
    top: 70,
    bottom: 70
};

const width = WIDTH - margin.left - margin.right, // Completar
      height = HEIGHT - margin.top - margin.bottom; // Completar

// 2. Crear un SVG dentro del div container, ubicado en el HTML. 
//   (Nota: el div tiene id = #container)
//   Mediante atributos, le damos el ancho y alto pedido.

const svg = d3.select('#container')
                .append('svg')
                .attr("width", WIDTH)
                .attr("height", HEIGHT); // Completar

// 3. Crear contenedor donde se agrupan los elementos de la visualización

const container = svg.append('g').attr(
    'transform', 
    `translate(${margin.left} ${margin.top})`
); // Completar

// 4. Le añadiremos al SVG contenedores para ambos ejes.
//    De momento, solo se appendea el 'g' al SVG 
//    y le aplicaremos una transformación según el margen especificado arriba.
//    También es clave darles una clase o id.
//    Esto se hace aquí ya que al ser el gráfico interactivo
//    Necesitaremos tener una referencia a sus clases/id para ir cambiando
//    Su contenido. De otra forma se generarán ejes duplicados en la visualización.

svg.append("g")
            .attr('class', 'xAxis')
            .attr('transform', `translate(${margin.left} ${HEIGHT - margin.bottom})`)
    // completar con los atributos pedidos para el eje X

svg.append("g")
            .attr('class', 'yAxis')
            .attr('transform', `translate(${margin.left} ${margin.top})`)
    // completar con los atributos pedidos para el eje Y

// 4. Le añadiremos al SVG elementos del tipo 'text', para los títulos y labels de ejes.
//    Nuevamente, solo le damos una clase y/o id y le aplicamos el transform para moverlo,
//    como en los ejercicios de la semana pasada.
//    También se le puede dar una posición fija x,y a los ejes, como aquí en el yLabel.
//    Lo que no se le da en este punto es el atributo 'text', que fija el contenido del texto.
//    Finalmente, como esta vez estamos trabajando con un archivo externo CSS, podrías comenzar a acostumbrarte
//    a escribir allí los estilos. En este caso, text-anchor se incluiría en el css externo. 
//    Tip para el CSS: aprovecha el uso de clases para agrupar las reglas.

svg.append("text")   // título  
    .attr('class', 'title')
    .attr('transform', `translate(${width/2 + margin.left} ${margin.top/2})`)

svg.append("text")  // eje X
    .attr('class', 'label')
    .attr('id', 'xLabel')
    .attr('transform', `translate(${width/2 + margin.left} ${margin.top + height + margin.bottom/2})`)

svg.append("text") // eje Y
    .attr('class', 'label')
    .attr('id', 'yLabel')
    .attr('transform', 'rotate(-90)')
    .attr('transform', `translate(${margin.left/2} ${margin.top + height/2})`)


// 5. Se agregan mediante D3 dos botones en el div dedicado específicamente a eso.
//    (Nota: el div tiene de id 'buttonContainer')

const convencionales = d3.select("#buttonContainer").append('button').text('Paltas Convencionales') // completar agregando botón para paltas convencionales.
const organicas = d3.select("#buttonContainer").append('button').text('Paltas Orgánicas') // completar agregando botón para paltas orgánicas.

// 6. Como en los ejercicios del módulo anterior, nuevamente generamos un parser 
//    para filtrar la información relevante del ejercicio,
//    y castear los tipos correctos a ciertas variables.

// Para parsear las fechas
const parseDate = d3.timeParse('%Y-%m-%d'); // Completar

// Filtramos los datos
const parser = (data) => { // Rellenar acordemente 
    return {
        date: parseDate(data.Date), // Fecha
        avgPrice: parseFloat(data.AveragePrice, 10), // Precio promedio de una palta (ojo que los datos son Float)
        totalVolume: parseFloat(data.TotalVolume, 10), // Volumen total vendido
        totalBags: parseFloat(data.TotalBags, 10), // Bolsas vendidas
        type: data.type, // Convencional u orgánica
    }
}

// 7. Para poder cambiar entre dos gráficos (paltas orgánicas o convencionales),
//    Debemos crear un filtro para separar los datos, ya que vienen en un solo dataset.
//    A esta funcion le entra el dataset data, y el string type, que puede ser
//    "conventional" o "organic".

const filterDataset = (data, type) => {
     // filtrar los items que tengan tipo igual al pedido y retornarlo. (hint: js tiene un filter bien bueno).
    data = data.filter((d) => d.type === type);
    return data
}

// 8. Esta función engloba la creación/actualización del gráfico.

const avocadoCount = (data, type) => {

    // Ordenamos los datos en forma creciente para el gráfico y sacamos el máximo para hacer las escalas.
    // (tip: recordar que d3 tiene d3.min, d3.max, d3.mean, etc.,)

    const maxValue = d3.max(data, (d) => d.avgPrice); // Rellenar

    // (tip: recordar que a los arrays de JS se les puede aplicar .sort )

    data =  data.sort((a, b) => a.date - b.date);// Aquí debes rellenar con una forma de ordenar los datos de más antiguos a mas nuevos. 👀

    // Escala del eje X. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
    // dominio y rango como mínimo.

    const xScale = d3.scaleBand()
                        .domain(data.map((d) => d.date)) // completar
                        .range([0, width]); // completar
                        //.padding(margin.left); // completar

    // Escala del eje Y. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
    // dominio y rango como mínimo.

    const yScale = d3.scaleLinear()
                        .domain([0, maxValue]) // completar
                        .range([height, 0]); // completar;

    // Las siguientes lineas generan la 'línea' del line chart. Como es materia no vista, 
    // De momento, se explica brevemente como funciona. 
    // Si quieres saber más, puede leer sobre d3.line() en:
    // https://observablehq.com/@d3/d3-line

    const line = d3.line() // inicialización
    .x((d) => xScale(d.date)) // Completar
    .y((d) => yScale(d.avgPrice)) // Completar
    .curve(d3.curveMonotoneX); // Opcional. Suaviza la línea. Prueba comentándolo para ver cómo se ve sin esto.

    // Se crean los ejes X e Y. Se les debe dar como parámetro la escala X e Y hecha previamente.
    // Únicamente por motivos visuales, se le puede dar un formato a los ticks del eje X 
    // (hint: .tickFormat(), investigue como darle un formato de tiempo)

    const xAxis = d3.axisBottom(xScale);// completar
    const yAxis = d3.axisLeft(yScale); // completar

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
            .attr('transform', 'rotate(45)')

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
            .attr('x1', width)
            .attr('opacity', 0.2)
    
    // Necesitamos recuperar los 'text' hechos para el título y las label de los ejes
    // más arriba. Hacemos 'selectAll' por cada clase o ID se les asigno arriba,
    // y simplemente, mediante el método .text(), se les rellena con el texto adecuado.

    svg.selectAll(".title")
            .text("Paltas convencionales presio")
    
    svg.selectAll("#xLabel")
            .text("Fecha")

    svg.selectAll("#yLabel")
            .text("Precio Promedio")

    
    // Ahora seleccionamos el 'trazo' o 'linea' del gráfico que habiamos creado antes con .line().
    // El binding de los datos se debe hacer así: .data([data]).
    // A continuación, implementaremos nuestro primer data join personalizado:
    // Primero usamos .join(). Como argumento, se le da (enter), para indicar como funcionará la agregación de una línea inicial
    // Luego, (update) para indicar cómo se comportarán las líneas existentes al cambiar la información que llevaban
    // y (exit), para indicar cómo se comportará una linea que se va a eliminar.
    // Como en este ejercicio en particular sabemos que crearemos primero una línea, y luego la actualizaremos,
    // pero nunca la borraremos, no se ha agregado el exit en el join.

    container.selectAll("path")
    .data([data]) // completar
    .join(
      (enter) => 
        enter
            .append("path")
            .attr("class", "line")
            .attr("d", line)
            .selection(), // completar
            
      (update) => 
        update
            .transition()
            .duration(1000)
            .attr("d", line)
            .selection() // completar
    );

    // Haremos nuestro segundo data join personalizado, para incluir los 'nodos' del line chart.
    // Esta vez seleccionamos todos los objetos con la clase ".dot" (o cualquier otro nombre de clase que quieras darle)
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
    // el tipo de evento y lo segundo la función que se ejecutará cuando se active. Ver las cápsulas de la semana
    // para mas detalles.

    container.selectAll(".dot")
    .data() // completar, ahora sin '[]'
    .join(
        // completar
        ) // Ahora definimos el comportamiento de los circulos cuando entre o salga el mouse.
    .on("", (event, d) => { // completar dentro de esta función la interaccion.
            }) 
    .on("", (event, d) => { // definimos que pasa cuando el mouse sale (revertir cambios). Completar
          });
    
}

// 9. Como último paso, debemos cargar los datos del CSV y ejecutar
//    la función que genera el gráfico tras parsear los datos.
//    Además, no olvidar el definir aquí cual será el comportamiento de los botones del inicio.
//    Para esta parte, recomiendo ver las cápsulas del profesor de este módulo o el código de ejemplo dado si no
//    Estás segurx de cómo proceder.

// completar el cargado y llamado a funciones completo. Si necesitas ayuda revisa los ejercicios propuestos del módulo anterior.
d3.csv()

// Has llegado al final, ¡Felicitaciones! Deberías tener un lindo gráfico de paltas.

// Algunas implementaciones propuestas que podrías hacer si quedaste con ganas:
// -Haz que el tooltip incluya más info que tiene el dataset (Número de bolsas, volumen, etc.)
// Para esto, recomiendo buscar ejemplos de tooltips más complejos en internet, como:
// http://bl.ocks.org/d3noob/ec6a394a1fe50b8afa103190ba755f4b
// -Haz más botones y filtros distintos: ¿Filtrar por año y tipo de palta? ¿Que en vez de precio, mida bolsas vendidas?
// -Mejora el CSS de la página y de la visualización a tu gusto! ✨