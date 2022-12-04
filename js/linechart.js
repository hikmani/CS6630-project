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
  
      this.data = petrolPricesViz.petrolData;
      this.update();
      //console.log(this.data)
      
  }

update(){

    const yScale= d3.scaleLinear()
    .domain([0, d3.max(this.data.map(d => parseInt(d['Price Per Gallon (USD)'])))])
    .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
    .nice();

    const xScale = d3.scaleBand()
    .domain(this.data.map(d => d.Country))
    .range([MARGIN.left, CHART_WIDTH])
    .padding(0.2)

    const xaxis = d3.select('#Linechart-x-axis')
    .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .remove()

    d3.select('#Linechart-x-axis').selectAll('line')
    .remove()



    d3.select('#Linechart-y-axis')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    
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





