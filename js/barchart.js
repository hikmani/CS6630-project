
//let dataSet = null;

setup();
// Constants for the charts, that would be useful.
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 500;
const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
const ANIMATION_DURATION = 300;

extractData();


function setup(){
    d3.select('#Barchart-div')
    .append('svg')
    .attr('id', 'Barchart-svg')
    .append('g')
    .attr('id', 'Barchart-x-axis');
  d3.select('#Barchart-svg')
    .append('g')
    .attr('id', 'Barchart-y-axis');
  d3.select('#Barchart-svg')
    .append('g')
    .attr('id', 'BarChart')
    .attr('class', 'bar-chart');



}
//Render bar-chart
function update(data){
    const heightScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => parseInt(d['Price Per Gallon (USD)'])))])
      .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
      .nice();
  
    const barchartBandScale = d3.scaleBand()
      .domain(data.map(d => d.Country))
      .range([MARGIN.left, CHART_WIDTH])
      .padding(0.2)
      
  
    const xaxis = d3.select('#Barchart-x-axis')
      .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(barchartBandScale))
      .selectAll('text')
      .remove()

      d3.select('#Barchart-x-axis').selectAll('line')
      .remove()

    //   xaxis.selectAll('text')
    //   .remove()
  
    d3.select('#Barchart-y-axis')
      .call(d3.axisLeft(heightScale))
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

      //Define a color scale 
      //const colorScale = d3.scaleSequential(d3.interpolateRgb("red", "blue")(0.5))
      const colorScale = d3.scaleSequential(d3.interpolateRgb("red", "turquoise "))

      // Set input domain for color scale based on the min and max
      colorScale.domain([0,
          d3.max(data, d => parseInt(d['Price Per Gallon (USD)']))
      ])

      //Render Bar chart:

      d3.select('#BarChart')
      .selectAll('rect')
      .data(data, d => d.Country)
      .join(
        enter => enter
          .append('rect')
          .attr('width', barchartBandScale.bandwidth())
          .attr('x', d => barchartBandScale(d.Country))
          .attr('y', d => heightScale(parseInt(d['Price Per Gallon (USD)'])) + MARGIN.top)
          .attr('height', d => heightScale(0) - heightScale(parseInt(d['Price Per Gallon (USD)'])))
          .attr('opacity', 0)
          .attr('fill',d => colorScale(parseFloat(d['Price Per Gallon (USD)'])))
          .transition()
          .duration(ANIMATION_DURATION)
          .delay(ANIMATION_DURATION)
          .attr('height', d => heightScale(0) - heightScale(parseInt(d['Price Per Gallon (USD)'])))
          .attr('opacity', 1),
  
        update => update
          .transition()
          .duration(ANIMATION_DURATION)
          .attr('x', d => barchartBandScale(d.Country))
          .attr('y', d => heightScale(parseInt(d['Price Per Gallon (USD)'])) + MARGIN.top)
          .attr('width', barchartBandScale.bandwidth())
          .attr('height', d => heightScale(0) - heightScale(parseInt(d['Price Per Gallon (USD)']))),
  
        exit => exit
          .transition()
          .duration(ANIMATION_DURATION)
          .attr('width', 0)
          .attr('height', 0)
          .remove()
      )
  
    }

function extractData(){
    d3.csv(`data/processedDataset.csv`)
    .then(dataOutput => {
       const dataSet = dataOutput;
       update(dataSet);
        //console.log(d3.max(dataSet.map(d => d['Price Per Gallon (USD)'])))

        //return dataSet;
    })
}