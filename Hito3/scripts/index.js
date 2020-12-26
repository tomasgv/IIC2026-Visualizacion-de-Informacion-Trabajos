const WIDTH = 500,
      HEIGHT = 400;

const TRANSLATE_LIMIT = 100;
const margin = {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
    };

const width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

const WIDTH_PLOT = 550,
      HEIGHT_PLOT = 400;

const marginPlot = {
    top: 50,
    bottom: 50,
    left: 80,
    right: 120,
    };

const widthPlot = WIDTH_PLOT - marginPlot.left - marginPlot.right,
    heightPlot = HEIGHT_PLOT - marginPlot.top - marginPlot.bottom;


const procesar_nombre = (especiales, nombre) => {
    if (especiales.hasOwnProperty(nombre)){
        return especiales[nombre];
    } 
    return nombre;
}

// Segunda vista!!
const svgPlot = d3.select('#contenedorGrafico')
    .append('svg')
    .attr('width', WIDTH_PLOT)
    .attr('height', HEIGHT_PLOT);

const contenedorPlot = svgPlot.append('g')
    .attr("transform", `translate(${marginPlot.left}, ${marginPlot.top})`);

svgPlot.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${marginPlot.left}, 
        ${HEIGHT_PLOT - marginPlot.bottom})`);
svgPlot.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${marginPlot.left},
            ${marginPlot.top})`);

svgPlot.append("text")     
    .attr("class", "title")
    .attr("transform", `translate(${2*marginPlot.left}, ${(marginPlot.top/2)})`);

svgPlot.append("text")  
    .attr("class", "label")
    .attr("id", "xLabel")
    .attr("transform", `translate(${width/2}, ${(HEIGHT_PLOT - marginPlot.bottom/4)})`);


const yLabel = svgPlot.append("text")
    .attr("class", "label")
    .attr("id", "yLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", marginPlot.left/3)
    .attr("x",0 - (heightPlot))
    .attr("dy", "1em");

const parser = (data) => {
    return {
        id: parseInt(data.ID),
        region: parseInt(data.REGION),
        provincia: parseInt(data.PROVINCIA),
        comuna: parseInt(data.COMUNA),
        nom_region: data.NOM_REGION,
        nom_provin: data.NOM_PROVIN,
        nom_comuna: data.NOM_COMUNA,
        total_vivi: parseInt(data.TOTAL_VIVI),
        particular: parseInt(data.PARTICULAR),
        colectivas: parseInt(data.COLECTIVAS),
        total_pers: parseInt(data.TOTAL_PERS),
        hombres: parseInt(data.HOMBRES),
        mujeres: parseInt(data.MUJERES),
        densidad: parseInt(data.DENSIDAD),
        indice_mas: parseInt(data.INDICE_MAS),
        indice_dep: parseInt(data.INDICE_DEP),
        ind_dep_ju: parseInt(data.IND_DEP_JU),
        ind_dep_ve: parseInt(data.IND_DEP_VE)
    }
}
const graficar = async () => {

    const selectedComunas = new Set();
    const geodatos = await d3.json("data/comunas.geojson");
    const censo = await d3.csv("data/censo.csv", parser);
    const maxColor = await d3.max(censo, (d) => d.indice_mas);
    const minColor = await d3.min(censo, (d) => d.indice_mas);
    const nombres_especiales = await d3.json('data/nombres_especiales.json');

    const svg = d3
        .select("#contenedorMapa")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    const contenedor = svg.append('g')
                            .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const zoom = d3.zoom()
            .scaleExtent([1, 25])
            .translateExtent([
                        [- TRANSLATE_LIMIT, 0],
                        [width + TRANSLATE_LIMIT, height]])
            .on("zoom", (e) => contenedor.attr("transform", e.transform));
    
    
    const proyeccion = d3.geoMercator().fitSize([width, height], geodatos);
    const caminosGeo = d3.geoPath().projection(proyeccion);

    svg.call(zoom);
    
    //const trans_inicial = d3.zoomIdentity.scale(4).translate(3.3*-TRANSLATE_LIMIT, 0);
    //svg.transition().duration(1000).call(zoom.transform, trans_inicial);

    //d3.interpolateRgb("steelblue", "brown");
    const escalaColores = d3
        .scaleSequential()
        .interpolator(d3.interpolateGreens)
        .domain([-1, maxColor]);
    const clicked = (event, d, nombres_especiales) => {
        
        let paths = contenedor.selectAll('path');
        let path_change = paths.filter((dd) => dd === d);
        console.log(path_change);
        if (selectedComunas.has(d)){
            selectedComunas.delete(d);
            path_change
                .transition()
                .duration(250)
                .attr("fill", (d) => {
                    let filtrado = censo.filter(dd => dd.id === d.id);
                    return escalaColores(filtrado[0].indice_mas);
                })
        } else {
            selectedComunas.add(d);
            path_change
                .transition()
                .duration(250)
                .attr('fill', '#c94c4c');
        }
    }

    contenedor
        .selectAll("path")
        .data(geodatos.features)
        .enter()
        .append("path")
        .attr("d", caminosGeo)
        .attr("fill", (d) => {
            let filtrado = censo.filter(dd => dd.id === d.id);
            return escalaColores(filtrado[0].indice_mas);
            })
        .attr("stroke", "black")
        .attr("stroke-width", 0.1)
        .on('click', (event, d) => {
            clicked(event, d, nombres_especiales);
            crear_grafico(censo, selectedComunas, nombres_especiales);
        });
    
    d3.select("#contenedorBotones")
        .append("button")
        .text("Quitar Zoom")
        .on("click", () => {
          const transformacion = d3.zoomIdentity.scale(1).translate(0, 0);
          svg.transition().duration(1000).call(zoom.transform, transformacion);
        });
    d3.select('#contenedorBotones')
        .append("button")
        .text("Quitar Selección")
        .on("click", () => {
            contenedor
                .selectAll("path")
                .data(geodatos.features)
                .transition().duration(1000)
                .attr("fill", (d) => {
                    let filtrado = censo.filter(dd => dd.id === d.id);
                    return escalaColores(filtrado[0].indice_mas);
                })
            selectedComunas.clear();
            crear_grafico(censo, selectedComunas);
        });


    
    let gradiente = svg.append('defs').append('linearGradient')
        .attr('id', `gradienteMapa`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    gradiente.append('stop')
        .attr("offset", "0%")
        .attr("stop-color", escalaColores(maxColor));
    
    gradiente.append('stop')
        .attr("offset", "100%")
        .attr("stop-color", escalaColores(minColor));

    svg.append('rect')
        .attr('x', 8*margin.left)
        .attr('y', height/3 - height/15)
        .style('fill', (d) => `url(#gradienteMapa)`)
        .attr('width', width/20)
        .attr('height', width/3 + width/15)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
    
    svg.append('text')
        .attr('x', 8.5*margin.left)
        .attr('y', height/3 - height/15 - 10)
        .text(maxColor)
        .attr('font-size', '0.8em')
    svg.append('text')
        .attr('x', 9*margin.left)
        .attr('y', height/2 + height/4 + height/9 - height/15)
        .text(minColor)
        .attr('font-size', '0.8em')
    
    svg.append("text")
        .attr('x', 6*margin.left)
        .attr('y', height/2 + height/4 + height/25 - height/15)
        .attr("transform", `rotate(-90, ${6*margin.left}, ${height/2 + height/4 + height/25 - height/15})`)
        .text('Índice de masculinidad')
    
    crear_grafico(censo, selectedComunas);
    svgPlot.append('rect')
        .attr('x', widthPlot + marginPlot.left)
        .attr('y', heightPlot/2)
        .attr('fill', 'orchid')
        .attr('width', widthPlot/25)
        .attr('height', widthPlot/25)

    svgPlot.append('text')
        .attr('x', widthPlot + marginPlot.left + widthPlot/20)
        .attr('y', heightPlot/2 + widthPlot/30)
        .text('Jóvenes')
        .attr('font-size', '0.8em')
    
    svgPlot.append('rect')
        .attr('x', widthPlot + marginPlot.left)
        .attr('y', heightPlot/2 + widthPlot/10)
        .attr('fill', 'lightskyblue')
        .attr('width', widthPlot/25)
        .attr('height', widthPlot/25)
    
    svgPlot.append('text')
        .attr('x', widthPlot + marginPlot.left + widthPlot/20)
        .attr('y', heightPlot/2 + widthPlot/10 + widthPlot/30)
        .text('Adultos Mayores')
        .attr('font-size', '0.8em')
}

const crear_grafico = (datos, comunas) => {
    comunas = Array.from(comunas);
    const maxDependencia = d3.max(comunas, (d) => datos.filter(dd => 
        dd.id === d.id)[0].indice_dep);

    const xScale = d3.scaleBand()
        .domain(comunas.map((d) => d.properties.comuna))
        .range([0, widthPlot])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, maxDependencia])
        .range([heightPlot, 0]);

    const hScale = d3.scaleLinear()
        .domain([0, maxDependencia])
        .range([0, heightPlot]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svgPlot.selectAll(".xAxis")
        .transition()
        .duration(1000)
        .call(xAxis)
        //.selectAll("text")
        //.attr("transform", `rotate(45)`)
    
    svgPlot.selectAll(".yAxis")
        .transition()
        .duration(1000)
        .call(yAxis);

    svgPlot.selectAll(".title")
        .text(`Índice de dependencia por comuna`);

    svgPlot.selectAll("#xLabel")            
        .text("Comunas");

    svgPlot.selectAll("#yLabel")
        .text("Indice de dependencia total"); 
    const gradientes = svgPlot.append('defs').selectAll('linearGradient')
        .data(comunas)
        .join(
            (enter) => {
            let gradient = enter.append('linearGradient')
                .attr('id', (d) => `gradiente${d.id}`)
                .attr('gradientTransform', 'rotate(90)')
            gradient.append('stop')
                .attr('offset', (d) => {
                    let dato = datos.filter(dd => 
                        dd.id === d.id)[0];
                    return `${dato.ind_dep_ju*100/dato.indice_dep}%`;})
                .attr('stop-color', 'orchid')
            gradient.append('stop')
                .attr('offset', (d) => {
                    let dato = datos.filter(dd => 
                        dd.id === d.id)[0];
                    return `${dato.ind_dep_ju*100/dato.indice_dep}%`;})
                .attr('stop-color', 'lightskyblue')
            },
            (exit) => 
            exit.transition('exit')
                .duration(500)
                .remove()
        )
    contenedorPlot.selectAll('rect')
        .data(comunas, (d) => d.properties.comuna)
        .join(
            (enter) => 
                enter.append('rect')
                    .attr('x', (d) => xScale(d.properties.comuna))
                    .attr('y', HEIGHT_PLOT - marginPlot.bottom)
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0)
                    .style('fill', (d) => `url(#gradiente${d.id})`)
                    .call(
                        (enter) => enter
                                    .transition('enter')
                                    .duration(500)
                                    .attr('y', (d) => yScale(datos.filter(dd => 
                                        dd.id === d.id)[0].indice_dep))
                                    .attr('height', (d) => hScale(datos.filter(dd => 
                                        dd.id === d.id)[0].indice_dep))
                    ).selection(),
            (update) => 
                {update
                    .transition('update')
                    .duration(500)
                    .attr('x', (d) => xScale(d.properties.comuna))
                    .attr('y', (d) => yScale(datos.filter(dd => 
                        dd.id === d.id)[0].indice_dep))
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d) => hScale(datos.filter(dd => 
                        dd.id === d.id)[0].indice_dep)).selection();
                if (comunas.length >= 5){
                        svgPlot.selectAll(".xAxis")
                        .transition()
                        .duration(1000)
                        .call(xAxis)
                        .selectAll("text")
                        .attr("transform", `rotate(30)`)
                } else {
                    svgPlot.selectAll(".xAxis")
                        .transition()
                        .duration(1000)
                        .call(xAxis)
                        .selectAll("text")
                        .attr("transform", `rotate(0)`)
                }
                },
            (exit) => 
                exit
                    .transition('exit')
                    .duration(500)
                    .attr('y', heightPlot)
                    .attr('height', 0)
                    .remove()
        )
    
}


graficar();
// d3.geoMercator();
// d3.geoCylindricalEqualArea();
// d3.geoWinkel3();

// .translate([width / 2, height / 2])
// .scale(80);
// .fitSize([width, height], geodatos.features[41])
