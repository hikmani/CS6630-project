
// async function loadData () {
//     const dataset = await d3.csv('data/processedDataset.csv');
//     const mapData = await d3.json('data/world.json');
//     return { dataset, mapData };
//   }


// d3.csv(`data/processedDataset.csv`)
// .then(dataOutput => {
//     const dataSet = loadData.dataset;
//     const worldData = loadData.mapData
//     update(dataSet);
//     drawMap(dataSet,worldData);
//     //console.log(d3.max(dataSet.map(d => d['Price Per Gallon (USD)'])))

//     //return dataSet;
// })

// ******* DATA LOADING *******
// We took care of that for you

async function loadData () {
    const petrolData = await d3.csv('data/processedDataset.csv');
    const mapData = await d3.json('data/world.json');
    return { petrolData, mapData };
  }
  
  
  // ******* STATE MANAGEMENT *******
  // This should be all you need, but feel free to add to this if you need to 
  // communicate across the visualizations
  const petrolPricesViz = {
    selectedLocations: [],
    petrolData: null,
    mapData: null,
    worldMap: null,
    barChart: null,
    lineChart: null

  };
  
  
  //******* APPLICATION MOUNTING *******
  loadData().then((loadedData) => {
    console.log('Here is the imported data:', loadedData.petrolData);
  
    // Store the loaded data into the petrolPricesViz
    petrolPricesViz.petrolData = loadedData.petrolData;
    petrolPricesViz.mapData = loadedData.mapData;
  
    // Creates the view objects with the global state passed in 
    const worldMap = new MapViz(petrolPricesViz);
    const barChart = new BarChart(petrolPricesViz);
    const lineChart = new LineChart(petrolPricesViz);

    // const lineChart = new LineChart(petrolPricesViz);
  
    petrolPricesViz.worldMap = worldMap;
    petrolPricesViz.barChart = barChart;
    petrolPricesViz.lineChart = lineChart;

    // petrolPricesViz.lineChart = lineChart;
  
    //TODO add interactions for Clear Selected Countries button

    // d3.select("#clear-button").on("click", () => {
    //   //d3.select("#overlay").selectAll("*").remove();
    //   d3.select("#countries").selectAll("path").attr("class", "country");
    //   petrolPricesViz.selectedLocations = [];
    //   lineChart.drawContinents();
    // });
  
    //Interaction: Update bar chart according to dropdown: 
    document.getElementById('metric').addEventListener('change', function() {
      console.log('You selected: ', this.value);
      petrolPricesViz.barChart.update(this.value)
    });



  });
  