//-------------------------------------------------------------------------------------Kvízek kategóriánként-------------------------------------------------------------------------------------
async function kategoriak_db_fetch() {
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
        kategoria_nevek.push(item.kategoria_nev)
        kategoria_db.push(item.db)
    }

    let kategoriak_adatok = [{
        values: kategoria_db,
        labels: kategoria_nevek,
        type: 'pie',
        textfont: {
            color: 'white'
        }
    }];
      
    let layout = {
        height: 500,
        width: 600,
        paper_bgcolor: '#1e62bb',
        font: {
            size: 15,
            color: 'white'
        },
        title: {
            text: 'Kategóriák Diagram',
            font: {
                size: 30,
                color: 'white'
            }
        },
        hoverlabel: {
            bordercolor: 'white'
        },
        legend: {
            font: {
                color: 'white'
            }
        },
    };
      
    Plotly.newPlot('kategoriak_db_diagram', kategoriak_adatok, layout);
}
