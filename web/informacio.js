//--------------------------------------------------------Kvízek kategóriánként--------------------------------------------------------
const kategoriak_db_fetch = async () => {
    let x = await fetch("http://localhost:3000/kategoriak_db");
    let y = await x.json();
    console.log(y)
    kategoriak_db_megjelenites(y)
}
kategoriak_db_fetch()

const kategoriak_db_megjelenites = (adatok) => {
    let kategoria_nevek = []
    let kategoria_db = []

    for (const item of adatok) {
        if (item.db > 0) {
            kategoria_nevek.push(item.kategoria_nev)
            kategoria_db.push(item.db)
        }
    }

    let kategoriak_adatok = [{
        values: kategoria_db,
        labels: kategoria_nevek,
        type: 'pie',
        textfont: {
            color: 'white'
        },
        marker: {
            line: {
                color: 'white', // Border color of each slice
                width: 2        // Border width of each slice
            }
        },
    }];
      
    let layout = {
        height: 500,  // Set the height of the chart
        width: 600,   // Set the width of the chart
        paper_bgcolor: '#1e62bb',  // Set the background color of the chart's paper
        font: {
            size: 15,      // Set the font size for general text
            color: 'white' // Set the font color for general text
        },
        title: {
            text: 'Kategóriák Diagram',  // Set the title of the chart
            font: {
                size: 30,      // Set the font size of the title
                color: 'white' // Set the font color of the title
            }
        },
        hoverlabel: {
            bordercolor: 'white' // Set the border color of the hover label
        },
        legend: {
            font: {
                color: 'white' // Set the font color for the legend
            }
        },
    };
      
    Plotly.newPlot('kategoriak_db_diagram', kategoriak_adatok, layout);
}
