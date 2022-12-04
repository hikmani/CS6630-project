// Constants for the chart, that would be useful.
// const CHART_WIDTH = 1000;
// const CHART_HEIGHT = 500;
// const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
// const ANIMATION_DURATION = 300;

//Set up

d3.select('#Linechart-div')
.append('svg')
.attr('id', 'Linechart-svg')
.append('g')
.attr('id', 'Linechart-x-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'Linechart-y-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'LineChart')
.attr('class', 'line-chart')
.append('path');


class LineChart{

    constructor(petrolPricesViz) {
      // Set some class level variables
      this.petrolPricesViz = petrolPricesViz;
  
      this.data = petrolPricesViz.petrolTimeData;
      this.update();


      let test = petrolPricesViz.petrolData;


      
  }

update(){

    const yScale= d3.scaleLinear()
    .domain([0, Math.max(...this.data.map((row) => row['pump price']))])
    .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
    .nice();
    //.domain([0, d3.max(this.data.map(d => parseInt(d['pump price'])))])



    // Use d3 group to get the line data in groups
    const groupedCountries = d3.group(this.data, (d) => d['Country Name']);
    const countryNames = groupedCountries.keys();
// console.log(groupedCountries)
// console.log(countryNames)

    //Get countries for color scale
  // let countries = [];
  // petrolPricesViz.petrolData.forEach(row => {
  //   countries.push(row['Country'])
  // });

//Color sclae:
const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...countryNames]);




    const xScale = d3.scaleTime()
    .domain(d3.extent(this.data.map((row) => new Date(row.year))))
    .range([MARGIN.left, CHART_WIDTH])

    const xaxis = d3.select('#Linechart-x-axis')
    .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale))
    // .selectAll('text')
    // .remove()

    // d3.select('#Linechart-x-axis').selectAll('line')
    // .remove()

    // Append x axis label
    d3.select('#Linechart-svg')
      .append('text')
      .text('Year')
      .attr('x', 966)
      .attr('y', CHART_HEIGHT);

          // Append Y axis label
    d3.select('#Linechart-svg')
    .append('text')
    .text('Pump Price')
    .attr('x', 0)
    .attr('y', 12);

    d3.select('#Linechart-y-axis')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    

//Append lines

let svg =d3.select('#Linechart-svg')
.append('g')
.attr('id', 'lines')
.selectAll('.line')
      .data(groupedCountries)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', ([country, values]) => colorScale(values[0]['Country Name']))
      .attr('stroke-width', 1)
      .attr('d', ([country, values]) => {
        return d3.line()
          .x((d) => xScale(new Date(d.year)) )
          .y((d) => yScale(d['pump price']))
          (values);
      });

      d3.select('#Linechart-svg')
      .append('g')
      .attr('id', 'overlay')
      .append('line')

          // Add an interaction for the x position over the lines
    svg.on('mousemove', (event) => {
      const svgEdge = svg.node().getBoundingClientRect().x;
      const distanceFromSVGEdge = event.clientX - svgEdge;

      if (distanceFromSVGEdge > 0) {
        // Set the line position
console.log('twst')
        svg
          .select('#overlay')
          .select('line')
          .attr('stroke', 'black')
          .attr('x1', distanceFromSVGEdge)
          .attr('x2', distanceFromSVGEdge)
          .attr('y1', CHART_HEIGHT - 0)
          .attr('y2', 0);

        // Find the relevant data (by date and location)
        const dateHovered = xScale.invert(distanceFromSVGEdge - 0).toISOString().substring(0, 10);
        const filteredData = petrolPricesViz.petrolTimeData
          .filter((row) => (
            row.year === dateHovered
            && (
              (petrolPricesViz.selectedLocations.length > 0 &&
                petrolPricesViz.selectedLocations.includes(row['Country ISO Code']))
              ||
              (petrolPricesViz.selectedLocations.length === 0 )
            )
          ))
          .sort((rowA, rowB) => rowB['pump price'] - rowA['pump price']);

        // // Remove any existing text
        // this.svg
        //     .select('#overlay')
        //     .selectAll('text')
        //     .remove();

        // Add text to the SVG
        svg.select('#overlay')
        .selectAll('text')
          .data(filteredData)
          .join('text')
          .text((d) => `${d['Country Name']}, ${d3.format(".2s")(d['pump price'])}`)
          // .attr('x', distanceFromSVGEdge > 500 ? distanceFromSVGEdge - 200 : distanceFromSVGEdge + 5)
          .attr('x', distanceFromSVGEdge > 500 ? distanceFromSVGEdge - 5 : distanceFromSVGEdge + 5)
          .attr('text-anchor', distanceFromSVGEdge > 500 ? 'end' : 'start')
          .attr('y', (d, i) => (i + 1) * 20)
          .attr('fill', (d) => colorScale(d['Country Name']));
      }
    });





      // const lineGenerator = d3.line()
      // .x((data) => xScale(data.x))
      // .y((data) => yScale(data.y) + MARGIN.top);
    
      // d3.select('#Linechart-div')
      // .select('path')
      // .datum(data)
      // .transition(2200)
      // .attr('d', lineGenerator);
    
    
}








}





