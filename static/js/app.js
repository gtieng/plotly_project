//PLOTLY PROJECT by Gerard Tieng
// *****************************


// Step 1: Read-in the samples.json script with all code within the function 
d3.json("samples.json").then(function(i) {
    
    //set variables for relevant data
    var samples = i.samples,
        metadata = i.metadata;
    
    //console.log for confirmation + structure analysis
    console.log(samples[0]);
    console.log(metadata[0]);

    
    // Create Option tags for the Dropdown Menu
    var selector = d3.select("#selDataset");
    selector.selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        // Set value to index for uniform value callback
        .attr("value", (d, i) => i)
        .text(d => d.id);


    // Add event listener for dataset value change
    d3.select("#selDataset").on("change", updatePlotly);

    // Create function to update Summary, Bar, and Bubble plots to reflect the new dataset value
    function updatePlotly() {

        var dataset = selector.property("value");
        // console.log for dataset confirmation
        console.log(dataset);

        // slice top10 OTU ids and convert integers to strings for plot label
        var topTenIds = samples[dataset]["otu_ids"].slice(0,10);
        var ttiStrings = topTenIds.map(d => "OTU " + d.toString());
        console.log(ttiStrings);

        // slice top10 OTU values for plot
        var topTenValues = samples[dataset]["sample_values"].slice(0,10);
        console.log(topTenValues);


        // Step 2: Plotly Bar Chart Code
        var dataBar = [{
            type: 'bar',
            x: topTenValues.reverse(),
            y: ttiStrings.reverse(),
            orientation: 'h'
          }];
        
          var layoutBar = {
            height: 500,
            width: 800
          };
    
          Plotly.newPlot('bar', dataBar, layoutBar);

        // Step 3: Plotly Bubble Chart Code
          var trace1 = {
            x: samples[dataset]["otu_ids"],
            y: samples[dataset]["sample_values"],
            text: samples[dataset]["otu_labels"],
            mode: 'markers',
            marker: {
                size: samples[dataset]["sample_values"],
                color: samples[dataset]["otu_ids"]
            }
          };
          
          var dataBubble = [trace1];
          
          var layoutBubble = {
            showlegend: false,
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', dataBubble, layoutBubble);


        // Step 4: Summary Chart Code

        // Unpack metadata object and convert to array
        var summary = []
        Object.entries(metadata[dataset]).forEach(([key, value]) => {
            summary.push(`${key.toString()}: ${value.toString()}`);
        });
        // console.log confirmation
        console.log(summary);

        // identify summary chart insertion point
        var chart = d3.select("#sample-metadata")

        // clears chart before data insertion
        chart.selectAll("p")
            .remove();
        
        // update chart with unpacked metadata
        chart.selectAll("p")
            .data(summary)
            .enter()
            .append("p")
            .text(d => d);

        // OPTIONAL: Gauge Plot

        var dataGauge = [
            {
                value: metadata[dataset]["wfreq"],
                title: { text: "Wash Frequency" },
                type: "indicator",
                mode: "gauge+number",
                // text: ["0-1", "1-2", "2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
                gauge: {
                    axis: {range: [0, 9]},
                    steps: [
                        { range: [0, 1], color: "#FFFFFF", name: "0-1"},
                        { range: [1, 2], color: "#EFEFEF" },
                        { range: [2, 3], color: "#DFDFDF" },
                        { range: [3, 4], color: "#CFCFCF" },
                        { range: [4, 5], color: "#BFBFBF" },
                        { range: [5, 6], color: "#AFAFAF" },
                        { range: [6, 7], color: "#9F9F9F" },
                        { range: [7, 8], color: "#8F8F8F" },
                        { range: [8, 9], color: "#7F7F7F" },
                    ]
                }
            }
        ];
        
        var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', dataGauge, layoutGauge);

    }; // end of on.change function

    // onchange code copy for initial landing plot displays 
    function init() {
        var dataset = selector.property("value");
    
        var topTenIds = samples[dataset]["otu_ids"].slice(0,10);
        var ttiStrings = topTenIds.map(d => "OTU " + d.toString());

        var topTenValues = samples[dataset]["sample_values"].slice(0,10);
        
        var dataBar = [{
            type: 'bar',
            x: topTenValues.reverse(),
            y: ttiStrings.reverse(),
            orientation: 'h'
            }];
        
            var layoutBar = {
            height: 500,
            width: 800
            };
    
            Plotly.newPlot('bar', dataBar, layoutBar);

        
            var trace1 = {
            x: samples[dataset]["otu_ids"],
            y: samples[dataset]["sample_values"],
            text: samples[dataset]["otu_labels"],
            mode: 'markers',
            marker: {
                size: samples[dataset]["sample_values"],
                color: samples[dataset]["otu_ids"]
            }
            };
            
            var dataBubble = [trace1];
            
            var layoutBubble = {
            showlegend: false,
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            height: 600,
            width: 1200
            };
            
            Plotly.newPlot('bubble', dataBubble, layoutBubble);

        var summary = []
        Object.entries(metadata[dataset]).forEach(([key, value]) => {
            summary.push(`${key.toString()}: ${value.toString()}`);
        });
                
        var chart = d3.select("#sample-metadata")

        chart.selectAll("p")
            .remove();
        
        chart.selectAll("p")
            .data(summary)
            .enter()
            .append("p")
            .text(d => d);
        
        var dataGauge = [
            {
                value: metadata[dataset]["wfreq"],
                title: { text: "Wash Frequency" },
                type: "indicator",
                mode: "gauge+number",
                // text: ["0-1", "1-2", "2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
                gauge: {
                    axis: {range: [0, 9]},
                    steps: [
                        { range: [0, 1], color: "#FFFFFF", name: "0-1"},
                        { range: [1, 2], color: "#EFEFEF" },
                        { range: [2, 3], color: "#DFDFDF" },
                        { range: [3, 4], color: "#CFCFCF" },
                        { range: [4, 5], color: "#BFBFBF" },
                        { range: [5, 6], color: "#AFAFAF" },
                        { range: [6, 7], color: "#9F9F9F" },
                        { range: [7, 8], color: "#8F8F8F" },
                        { range: [8, 9], color: "#7F7F7F" },
                    ]
                }
            }
        ];
        
        var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', dataGauge, layoutGauge);

    }; init();

}); // end of json read in