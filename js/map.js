class MapViz {


    constructor(petrolPricesViz) {
        this.petrolPricesViz = petrolPricesViz;

        // Set up the map projection
        const projection = d3.geoWinkel3()
            .scale(150) // This set the size of the map
            .translate([400, 250]); // This moves the map to the center of the SVG




        let world_data = this.petrolPricesViz.mapData;
        let pData = 1.1
        console.log("abc" + world_data);

        let nation = topojson.feature(world_data, world_data.objects.countries);
        console.log(nation.features);

        let countries = [];
        for (let x of nation.features) {
            countries.push(x.id);
        }

        let path = d3.geoPath(projection);
        //console.log(path);
        let graticule = d3.geoGraticule();

        let map_svg = d3.select('#map');

        map_svg
            .select('#graticules')
            .append('path')
            .attr('d', path(graticule()))
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .style('opacity', 0.2);


        let petrol_data = this.petrolPricesViz.petrolData;
        console.log(petrol_data);

        const dict = {};
        for (let y of countries) {
            let temp = true
            for (let x of petrol_data) {
                if (y == x.iso_code) {
                    if (x['Price Per Gallon (USD)'] != "") {
                        dict[y] = parseFloat(x['Price Per Gallon (USD)']);
                        console.log(x['Price Per Gallon (USD)']);
                        temp = false
                    }
                }
                if (temp) {
                    dict[y] = pData
                }
            }
        }

        var values = Object.values(dict);

        console.log("Aa" + d3.max(values));

        let colorScale = d3.scaleSequentialLog(d3.interpolateRdYlGn).domain([d3.max(values), d3.min(values)]);

        // var step = d3.scaleLinear()
        //     .domain([1, 8])
        //     .range([d3.max(values), d3.min(values)]);

        // var color3 = d3.scaleLinear()
        //     .domain([1, step(2), step(3), step(4), step(5), step(6), step(7), 20])
        //     .range(['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'])


        map_svg
            .select('#countries')
            .append('path')
            .attr('d', path(nation))
            .attr('fill', 'none')
            .attr('stroke', 'lightgrey')


        const stateD3 = map_svg
            .select('#countries')
            .selectAll('path')
            .data(nation.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', (d) => colorScale(dict[d.id]))
            .attr('stroke', 'lightgrey')
            .on('click', (d) => {
                console.log('clicked', d)
            })

        let legend = d3.select('#legend')
            .append('rect')
            .attr('width', 150)
            .attr('y', 0)
            .attr('height', 25)
            .attr("transform", "translate(0 475)")
            .attr('fill', 'url(#color-gradient)');

        d3.select("#legend")
            .append("text")
            .attr("transform", "translate(5 470)")
            .text("0");

        d3.select("#legend")
            .append("text")
            .attr("transform", "translate(140 470)")
            .text("660k");

        let groupedCovidData = d3.group(petrol_data, (d) => d.iso_code);
        //console.log(groupedCovidData);

        stateD3.on("click", (d) => this.updateSelectedCountries(d));


        ////---


    }

    //     updateSelectedCountries (data) {

    //       // d3.select("#overlay").selectAll("*").remove();

    //       let checkifexists = this.petrolPricesViz.selectedLocations.indexOf(
    //         data.currentTarget.__data__.id
    //       );
    //       if(checkifexists == -1){
    //         this.petrolPricesViz.selectedLocations.push(data.currentTarget.__data__.id);
    //         data.currentTarget.setAttribute("class", "country selected");
    //       }
    //       else{
    //         this.petrolPricesViz.selectedLocations.splice(checkifexists, 1);
    //         data.currentTarget.setAttribute("class", "country");

    //       }
    //   //----
    //       let selected = this.petrolPricesViz.selectedLocations;
    //       console.log(this.petrolPricesViz.selectedLocations);
    //       if (selected.length > 0) {
    //         this.petrolPricesViz.lineChart.drawCountries(selected);
    //       } 
    //       else {
    //         this.petrolPricesViz.lineChart.drawContinents();
    //       }



    //     }

}
