import { server } from "./backend_linkek.js";

//--------------------------------------------------------Megjelenítés--------------------------------------------------------
var adatok = []
var sorrend = "ASC"

const visszajelzesek_fetch = async () => {
    let x = await fetch(`${server}/visszajelzesek/` + sorrend);
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
                        <p class="visszajelzes_felhasznalo">${item.visszajelzes_felhasznalo}</p>
                        <p class="visszajelzes_datum">${item.visszajelzes_datum.slice(0, 19).replace('T', ' ')}</p>
                    </div>
                </div>
            `;
        }
    }
    document.getElementById("visszajelzesek_doboz").innerHTML = sz
}


//--------------------------------------------------------Szűrés--------------------------------------------------------
export const visszajelzesek_szures_ellenorzes = () =>
{
    let keresett = document.getElementById("visszajelzes_tipusok").value;
    
    if(document.getElementById("visszajelzes_tipusok").value == "összes")
    {
        visszajelzesek_fetch();
    }
    else 
    visszajelzesek_szures(keresett);
}

const visszajelzesek_szures = async (keresett) => {
    let x = await fetch(`${server}/visszajelzesek_szures/${keresett}/${sorrend}`);
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}


//--------------------------------------------------------Modal csere--------------------------------------------------------
export const modal_csere = (id) => {
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


//--------------------------------------------------------Visszajelzések megoldása--------------------------------------------------------
const visszajelzesek_megoldva_valtas = async (id) => {
    let x = await fetch(`${server}/visszajelzesek_megoldva_valtas`,{
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


//--------------------------------------------------------Sorrend--------------------------------------------------------
let sortAscending = true;
export const sorrend_valtas = () => {
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

window.modal_csere = modal_csere
window.visszajelzesek_megoldva_valtas = visszajelzesek_megoldva_valtas
window.sorrend_valtas = sorrend_valtas
window.visszajelzesek_szures_ellenorzes = visszajelzesek_szures_ellenorzes