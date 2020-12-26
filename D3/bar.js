const barGraph = (width, height, margin, dataset) => {
  // Define svg
  const svg = d3
    .select('#graph')
    .classed('row center', true)
      .append('div')
      .classed('col-12', true)
      .append('svg')
        .attr('width', width)
        .attr('height', height);
        

  // Define Scales
  const xScale = d3
    .scaleBand()
    .domain(dataset.map((d) => d.label))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.05);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.value)])
    .range([height - margin.bottom, margin.top]);

  const hScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.value)])
    .range([0, height - margin.bottom - margin.top]);

  
  // Define axes
  const x = svg.append("g");
  const y = svg.append("g");


  // Define Axes functions
  const xAxis = (g) =>  g
    .transition('xAxis')
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  const yAxis = (g) => g
    .transition('yAxis')
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  
  // Define mouse functions
  const onMouseOver = (d, i, all) => {
    d3.select(all[i])
      .transition('onMouseOverHigh')
      .style('fill', 'red');

    d3.selectAll(all)
      .filter((other) => other.id !== d.id)
      .transition('onMouseOverLow')
      .style('opacity', 0.5);
  }

  const onMouseOut = (d, i, all) => {
    d3.selectAll(all)
      .transition('onMouseOut')
      .style('fill', 'blue')
      .style('opacity', 1);
  }

  const onClick = (d) => {
    const index = dataset.findIndex(({ id }) => id === d.id);
    dataset.splice(index, 1);
  }


  // Define join functions
  const enter = (enter) => {
    return enter
        .append('rect')
        .attr('x', (d) => xScale(d.label))
        .attr('y', height - margin.bottom)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .style('fill', 'blue')
        .style("pointer-events","visible")
      .call((enter) => enter
        .transition('enter')
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => hScale(d.value)));
  }

  const update = (update) => {
    return update
      .call((update) => update
        .transition('update')
        .attr('x', (d) => xScale(d.label))
        .attr('y', (d) => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => hScale(d.value)));
  }

  const exit = (exit) => {
    return exit
      .call((exit) => exit
        .transition('exit')
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .remove());
  }


  // Define Plot function
  const plotGraph = () => {
    // Set domains
    xScale.domain(dataset.map((d) => d.label));
    yScale.domain([0, d3.max(dataset, (d) => d.value)]);
    hScale.domain([0, d3.max(dataset, (d) => d.value)]);
  
    // Plot Axes
    x.call(xAxis);
    y.call(yAxis);
  
    // Plot Bars
    svg.selectAll('rect')
      .data(dataset, (d) => d.id)
      .join(enter, update, exit)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)
      .on('click', (d) => {
        onClick(d);
        plotGraph();
      });
  }

   // Define button click events
  // On Submit
  d3.select('#submit>button')
    .on('click', () => {
      const value = Number(d3.select('#submit input').property("value"));
      const newId = Math.max(...dataset.map(({ id }) => id), dataset.length) + 1;
      dataset.push({
        id: newId,
        label: newId,
        value
      });
      plotGraph();
    })

  // On Sort
  d3.select('#sort')
    .on('click', () => {
      const compare = (a, b) => {
        if (a.value > b.value) return 1
        if (a.value < b.value) return -1
        else return 0
      }
      dataset.sort(compare);
      plotGraph();
    })

  // On shuffle
  d3.select('#shuffle')
    .on('click', () => {
      dataset.sort(() => Math.random() - 0.5);
      plotGraph();
    });

  // Plot
  plotGraph();
}

// Set minimum value of input to 1
const input = document.getElementById('value')
input.addEventListener('change', () => {
  const value = input.value
  input.value = value > 0 ? value : 1
}) 

// Define initial dataset
const dataBar = [
  {
    id: 0,
    label: 'A',
    value: Math.random() * 10,
  },
  {
    id: 1,
    label: 'B',
    value:  Math.random() * 10,
  },
  {
    id: 2,
    label: 'C',
    value:  Math.random() * 10,
  },
  {
    id: 3,
    label: 'D',
    value:  Math.random() * 10,
  },
  {
    id: 4,
    label: 'E',
    value:  Math.random() * 10,
  },
  {
    id: 5,
    label: 'F',
    value:  Math.random() * 10,
  },
  {
    id: 6,
    label: 'G',
    value:  Math.random() * 10,
  },
  {
    id: 7,
    label: 'H',
    value:  Math.random() * 10,
  },
];

// Define graph margins
margin = {
  top: 20,
  left: 40,
  bottom: 20,
  right: 40,
};

// Plot graph
barGraph(500, 500, margin, dataBar);
