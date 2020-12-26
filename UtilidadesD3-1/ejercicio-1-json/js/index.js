// 0. Seleccionamos que atributos queremos que se vean representados. 
//    Estos pueden ser HP, Attack, Defense, Sp. Attack, Sp. Defence o Speed
//    xAttribute: atributo representado en la posición X
//    yAttribute: atributo representado en la posición Y
//    rAttribute: atributo representado por el radio del círculo
//    cAttribute: atributo representado por el color del círculo

const xAttribute = "Attack",
        yAttribute = "Defense",
        rAttribute = "HP",
        cAttribute = "Sp. Attack";

// 1. Definir alto y ancho de nuestro SVG

const WIDTH = 800, // cambiar 
      HEIGHT = 500; // cambiar

// 2. Definir margenes, alto y ancho del contenedor

const margin = {
    // Completar
    left: 100,
    right: 100,
    top: 70,
    bottom: 70
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

// Seleccionamos el div correspondiente en el HTML y agregar nuestro contenedor 
// SVG (Nota: el div tiene id = #container)

const svg = d3.select('#container').append('svg');

// Ajustamos el SVG a las medidas anteriormente especificadas

svg.attr("width", WIDTH).attr("height", HEIGHT);

// 5. Agregar el contenedor que tendrá los círculos, y trasladarlo.

const container = svg.append('g').attr(
    // completar (traslado)
    'transform', 
    `translate(${margin.left} ${margin.top})`
);

// 6. Función para generar nuestro scatter plot
const scatter = (data) => {

// 6.1 Creación de escalas
// 6.1.1 En primer lugar, queremos crear la escala del eje x. Esto lo podemos 
//    hacer con la utilidad scaleLinear de D3. Dado que el eje x aumenta hacia la 
//    derecha, tanto el dominio como el recorrido deben ser incrementales. 
//    Queremos que el dominio se encuentre entonces entre 0 y el máximo del 
//    atributo xAttribute, y el rango entre 0 y el ancho del contenedor.
    
    const xScale = d3.scaleLinear()
                        .domain(
                            [0, d3.max(data, (d) => d.base[xAttribute])]
                        )
                        .range(
                            [0, width]
                        )

// 6.1.2 Luego, queremos crear la escala del eje y. 
//    Esto lo podemos hacer nuevamente con la utilidad scaleLinear de D3. Dado 
//    que acá los pixeles aumentan hacia abajo y nosotros queremos que a mayor 
//    valor, más arriba esté el circulo, el dominio debe ser incremental y el 
//    rango decremental. El dominio se encuentra entonces entre 0 y el máximo
//    del atributo yAttribute, y el rango vaya desde el alto del contenedor a 0

    const yScale = d3.scaleLinear()
                        .domain(
                            [0, d3.max(data, (d) => d.base[yAttribute])]
                        )
                        .range(
                            [height, 0]
                        );

// 6.1.3 En tercer lugar, queremos crear la escala para el radio.
//    Es importante mencionar que esta escala no es del todo necesaria, pero 
//    ayuda a que la comparación de radios sea un poco más realista(¿Por qué?) 
//    Esto lo podemos hacer nuevamente con la utilidad scaleLinear de D3, pero 
//    en este caso usaremos scaleExp (¿Cómo dice que dijo?).
//    El rango lo dejaremos fijo, pero pueden experimentar con otros valores. 
//    Si quieren también pueden probar otras escalas (Log, Linear, etc.)

    const rScale = d3.scaleSqrt()
                        .domain(
                            [0, d3.max(data, (d) => d.base[rAttribute])]
                        )
                        .range(
                            [0, 5]
                        );
    
// 6.1.3 Por último, crearemos una escala para el COLOR.
//    Los colores son representados, después de todo, por números hexadecimales
//    Podemos entonces utilizar una escala linear para hacer un mapeo desde un 
//    rango de números a un rango de colores
    const cScale = d3.scaleLinear()
                        .domain(
                            [0, d3.max(data, (d) => d.base[cAttribute])]
                        )
                        .range(
                            ['yellow', '#0000FF'] 
                        );
// Acá podemos utilizar los nombres genéricos de los colores (red, green, blue), 
// o bien su representación hexadecimal (#FF0000, #00FF00, #0000FF)

// 6.2 Creación de ejes
// 6.2.1 Eje X - El eje X se encontrará abajo (bottom) de nuestro scatterPlot.
//    Usaremos axisBottom de d3, la que crea un eje horizontal con ticks abajo
    const xAxis = d3.axisBottom(xScale);

    // Queremos poner este eje abajo de nuestro scatterplot
    svg
          .append("g")
          .attr("transform", 
          `translate(${margin.left}, ${HEIGHT - margin.bottom})`
           )
          .call(
              xAxis
          );

// 6.2.2 Eje Y, a diferencia del x, el eje Y debe estar a la izquierda y con los
//    ticks hacia la izquiera también. Para eso utilizamos la utilidad axisLeft
    const yAxis = d3.axisLeft(yScale);

    // Posicionamos el eje a la izquierda del scatterPlot
    svg
          .append("g")
          .attr("transform", 
          `translate(${margin.left}, ${margin.top})`
           )
          .call(
              yAxis
          );
    
    // Nombres de los Ejes
    svg.append("text")             
          .attr("transform",
                "translate(" + ((width/2) + margin.left) + " ," + 
                               (height + margin.top + margin.bottom/2) + ")")
          .style("text-anchor", "middle")
          .text(xAttribute);
    
    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left/2)
          .attr("x",0 - (HEIGHT / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yAttribute); 
    
    // Título del gráfico
    svg.append("text")             
          .attr("transform",
                "translate(" + ((width/2) + margin.left) + " ," + 
                               (margin.top/2) + ")")
          .style("text-anchor", "middle")
          .text(`Pokemon: ${yAttribute} vs ${xAttribute}`);

// 6.3 Agregar Círculos
//    Para agregar círculos, es similar a las barras (rect), pero utilizamos 'circle'
//    Un circulo tiene atributos distintos que un rectángulo, los básicos son:
//    cx -> coordenada x de su centro
//    cy -> coordenada y de su centro
//    r  -> define el radio del círculo. recordar que el área será pi * (r ^ 2)
//    fill -> Igual que rect, determina el color

    container
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("fill", (d) => cScale(d.base[cAttribute]))
        .attr("r",
            (d) => rScale(d.base[rAttribute])
        )
        .attr("cx", 
            (d) => xScale(d.base[xAttribute])
        )
        .attr("cy",
            (d) => yScale(d.base[yAttribute])
        );
}

// Abrimos el archivo json y llamamos a la función para generar el scatter.
// Nótese que el archivo json viene con todos los datos en el formato necesario 
// (todas las estadísticas son ints, por ejemplo), por lo que ningún 
// procesamiento/parseo es necesario

d3.json("./data/pokedex.json")
    .then((data) => {
        scatter(data);
    })
    .catch((err) => console.log(err));