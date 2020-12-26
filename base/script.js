data = [
  {date: '30/08', cases: 1965, tests: 34769},
  {date: '29/08', cases: 2037, tests: 32237},
  {date: '28/08', cases: 1870, tests: 30274},
  {date: '27/08', cases: 1737, tests: 27019}
];

colors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78'];

// Fuente: wikipedia
d3.select('#title-cont').append('h1').text('I made this i guess');

d3.select('#day-head').text('Día');
d3.select('#tests-head').text('Tests');
d3.select('#cases-head').text('Contagiades');

d3.selectAll('.day').text((d, i) => data[i].date);
d3.selectAll('.tests').text((d, i) => data[i].tests);
d3.selectAll('.cases').text((d, i) => data[i].cases);

d3.selectAll('.odd').style('background-color', '#cccccc');

d3.select('#plot-title').text('tests');

const svg = d3.select('#plot-cont').append('svg');
svg.attr('width', 200).attr('height', 200);
svg.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('width', 30)
    .attr('x', (d, i) => 50*i)
    .attr('y', (d, i) => 180 - d.tests/200)
    .attr('height', (d, i) => d.tests/200)
    .attr('fill', (d, i) => colors[i])
svg.selectAll('text')
    .data(data)
    .join('text')
    .text((d, i) => d.date)
    .attr('x', (d, i) => 50*i)
    .attr('y', (d, i) => 200)
    .attr('fill', 'black')
    .attr('font-size', 10);

let option = 'cases';
const boton = document.getElementById('btn-cont');
boton.addEventListener('click', () => {
  if (option === 'cases') option = 'tests';
  else option = 'cases';
  d3.select('#plot-title').text(option);


  svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => 50*i)
      .attr('y', (d, i) => 180)
      .transition()
      .duration(2000)
      .attr('y', (d, i) => 180 - d[option]/200)
      .attr('height', (d, i) => d[option]/200);
})

const rectangulo = d3.select('#example').append('svg')
                      .append('rect')
                      .attr('height', 300)
                      .attr('width', 100)
                      .attr('fill', 'black');

rectangulo.transition().duration(3000).attr('width', 500).attr('fill','magenta')