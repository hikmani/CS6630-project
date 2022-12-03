

async function loadData () {
    const petrolData = await d3.csv('data/processedDataset.csv');
    const mapData = await d3.json('data/world.json');
    return { petrolData, mapData };
  }
  
  const petrolPricesViz = {
    selectedLocations: [],
    petrolData: null,
    mapData: null,
    worldMap: null,
    barChart: null,
    lineChart: null

  };
  
  
  loadData().then((loadedData) => {
    console.log('Here is the imported data:', loadedData.petrolData);
  
    // Store the loaded data into the petrolPricesViz
    petrolPricesViz.petrolData = loadedData.petrolData;
    petrolPricesViz.mapData = loadedData.mapData;
  
    // Creates the view objects with the global state passed in 
    const worldMap = new MapViz(petrolPricesViz);
    const barChart = new BarChart(petrolPricesViz);
    const lineChart = new LineChart(petrolPricesViz);

    petrolPricesViz.worldMap = worldMap;
    petrolPricesViz.barChart = barChart;
    petrolPricesViz.lineChart = lineChart;

    let tableDiv = d3.select('#table')
      let table = new CountryTable(tableDiv, petrolPricesViz.petrolData);

      function updateTableFilter (input) {
        table.updateFilter(input);
      }


    //TODO add interactions for Clear Selected Countries button

    d3.select("#clear-button").on("click", () => {
      //d3.select("#overlay").selectAll("*").remove();
      d3.select("#countries").selectAll("path").attr("class", "country");
      petrolPricesViz.selectedLocations = [];
      barChart.update("Price Per Gallon (USD)");
      worldMap.updateMap("Price Per Gallon (USD)");

    });
  
    //Interaction: Update bar chart according to dropdown: 
    document.getElementById('metric').addEventListener('change', function() {
      console.log('You selected: ', this.value);
      petrolPricesViz.selectedLocations = [];
      d3.select("#countries").selectAll("path").attr("class", "country");
      petrolPricesViz.barChart.update(this.value)
      petrolPricesViz.worldMap.updateMap(this.value)

    });



  });
  