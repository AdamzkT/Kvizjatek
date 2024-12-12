//-----------------------------------------------------------------------------------------Megjelenítés-----------------------------------------------------------------------------------------
var adatok = []
var sorrend = "ASC"

async function visszajelzesek_fetch() {
    let x = await fetch("http://localhost:3000/visszajelzesek/" + sorrend);
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}
visszajelzesek_fetch()

const visszajelzesek_megjelenit = (y) =>{
    adatok = y
    //console.log(adatok)

    let sz = ""
 
    for (const item of adatok) {
        const megoldva = document.getElementById("megoldva_szures").checked;

        if (megoldva || !item.visszajelzes_megoldva) {
            const kartya_szin_class = item.visszajelzes_megoldva ? 'megoldva' : 'fuggo';

            sz += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="visszajelzesek_kartya ${kartya_szin_class}" type="button" data-bs-toggle="modal" data-bs-target="#reszletek_modal" onclick="modal_csere(${item.visszajelzes_id})">
                        <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                        <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                        <p class="visszajelzes_datum">${item.visszajelzes_datum.slice(0, 19).replace('T', ' ')}</p>
                    </div>
                </div>
            `;
        }
    }
    document.getElementById("visszajelzesek_doboz").innerHTML = sz
}


//-----------------------------------------------------------------------------------------Szűrés-----------------------------------------------------------------------------------------
const visszajelzesek_szures_ellenorzes = () =>
{
    let keresett = document.getElementById("visszajelzes_tipusok").value;
    
    if(document.getElementById("visszajelzes_tipusok").value == "összes")
    {
        visszajelzesek_fetch();
    }
    else 
    visszajelzesek_szures(keresett);
}

async function visszajelzesek_szures(keresett) {
    let x = await fetch(`http://localhost:3000/visszajelzesek_szures/${keresett}/${sorrend}`);
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}


//-----------------------------------------------------------------------------------------Modal csere-----------------------------------------------------------------------------------------
const modal_csere = (id) => {
    const item = adatok.find(i => i.visszajelzes_id == id);
    document.getElementById("modal_fej_cim").innerHTML = item.visszajelzes_tema;

    let sz = `
        <p class="visszajelzes_szoveg"><b>Dátum:</b> ${item.visszajelzes_datum.slice(0, 19).replace('T', ' ')}</p>
        <p class="visszajelzes_szoveg"><b>Típus:</b> ${item.visszajelzes_tipus}</p>
        <p class="visszajelzes_uzenet">„${item.visszajelzes_uzenet}”</p>
        ${item.visszajelzes_megoldva ?
            `
            <label class="switch">
                <input type="checkbox" id="visszajelzes_megoldva_${item.visszajelzes_id}" checked onclick="visszajelzesek_megoldva_valtas(${item.visszajelzes_id})">
                <span class="slider"></span>
            </label>
            `
            :
            `
            <label class="switch">
                <input type="checkbox" id="visszajelzes_megoldva_${item.visszajelzes_id}" onclick="visszajelzesek_megoldva_valtas(${item.visszajelzes_id})">
                <span class="slider"></span>
            </label>
            `
        }
        <script>
            document.getElementById("visszajelzes_megoldva_${item.visszajelzes_id}").checked = ${item.visszajelzes_megoldva};
        </script>
    `
    document.getElementById("modal_test").innerHTML = sz;
}


//------------------------------------------------------------------------------------Visszajelzések megoldása------------------------------------------------------------------------------------
async function visszajelzesek_megoldva_valtas(id) {
    let x = await fetch("http://localhost:3000/visszajelzesek_megoldva_valtas",{
        method: "PUT",
        body: JSON.stringify({
            "visszajelzes_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    console.log(y)
    visszajelzesek_szures_ellenorzes()
}


//-----------------------------------------------------------------------------------------Sorrend-----------------------------------------------------------------------------------------
let sortAscending = true;
const sorrend_valtas = () => {
    // Toggle the sort order
    sortAscending = !sortAscending;

    // Update the arrow icon based on the sort order
    const arrow = document.getElementById('sortArrow');
    arrow.classList.remove('up', 'down');
    arrow.classList.add(sortAscending ? 'down' : 'up');

    let gomb = document.getElementById("datum_sorrend_gomb")
    if (sorrend == "ASC") {
        sorrend = "DESC";
        gomb.innerHTML = 'Dátum alapján csökkenő <span id="sortArrow" class="arrow down"></span>';
    } else {
        sorrend = "ASC";
        gomb.innerHTML = 'Dátum alapján növekvő <span id="sortArrow" class="arrow up"></span>';
    }
    visszajelzesek_szures_ellenorzes()
}


