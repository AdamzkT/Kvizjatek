import { server } from "./backend_linkek.js";

//--------------------------------------------------------Megjelenítés--------------------------------------------------------
var adatok = []

const kerdesek_fetch = async (kviz_id) => {
    let x = await fetch(`${server}/kviz_kerdesek`,{
        method: "POST",
        body: JSON.stringify({
            "kviz_id":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kerdesek_megjelenit(y);
}

const kerdesek_megjelenit = (y) => {
    //console.log(y)
    adatok = y

    let sz = ""
    for (const item of adatok) {
        sz += `
        <tr>
            <td>${item.kerdes}</td>
            <td>${item.valasz_jo}</td>
            <td>${item.valasz_rossz1}</td>
            <td>${item.valasz_rossz2}</td>
            <td>${item.valasz_rossz3}</td>
            <td><button type="button" class="modositas_gomb gombok" onclick="window.location.href='kerdesek_modositas.html?kerdes_id=${item.kerdes_id}'">
                <img src="kepek/edit.png" alt="" class="img-fluid">
            </button></td>
            <td><button type="button" class="torles_gomb" onclick="kerdesek_torles_ellenorzes(${item.kerdes_id})">
                <img src="kepek/delete.png" alt="" class="img-fluid">
            </button></td>
        </tr>
        `
    }
    try {
        document.getElementById("kerdesek_tablazat").innerHTML = sz
    } catch (error) {
        
    }
}


//--------------------------------------------------------Törlés--------------------------------------------------------
export const kerdesek_torles_ellenorzes = async (id) => {
    let x = await fetch(`${server}/kerdes_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "kerdes_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan ki akarod törölni ezt a kérdést?</h2>
        <p id="idezet">„${y[0].kerdes}”</p>
        <button type="button" class="btn btn-danger" onclick="kerdesek_torles(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="kerdes_uzenet_eltuntetes()">Nem</button>
    `
}

export const kerdesek_torles = async (id) => {
    let x = await fetch(`${server}/kerdes_torles`,{
        method: "DELETE",
        body: JSON.stringify({
            "kerdes_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="kerdes_uzenet_eltuntetes()">OK</button>
    `
}


//--------------------------------------------------------Módosítás--------------------------------------------------------
const kerdes_fetch = async (kerdes_id) => {
    let x = await fetch(`${server}/kerdes_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "kerdes_id":kerdes_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kerdes_megjelenit(y);
}

const kerdes_megjelenit = (adat) => {
    //console.log(adat)

    document.getElementById("kerdes_modositas").value = adat[0].kerdes
    document.getElementById("valasz_jo_modositas").value = adat[0].valasz_jo
    document.getElementById("valasz_rossz1_modositas").value = adat[0].valasz_rossz1
    document.getElementById("valasz_rossz2_modositas").value = adat[0].valasz_rossz2
    document.getElementById("valasz_rossz3_modositas").value = adat[0].valasz_rossz3

    document.getElementById("modositas_ok_gomb").addEventListener("click", function(){
        kerdes_modositas_ellenorzes(adat[0].kerdes_id)
    })
}

export const kerdes_modositas = async (kerdes_id) => {
    let x = await fetch(`${server}/kerdes_modositas`,{
        method: "PUT",
        body: JSON.stringify({
            "kerdes":document.getElementById("kerdes_modositas").value,
            "valasz_jo":document.getElementById("valasz_jo_modositas").value,
            "valasz_rossz1":document.getElementById("valasz_rossz1_modositas").value,
            "valasz_rossz2":document.getElementById("valasz_rossz2_modositas").value,
            "valasz_rossz3":document.getElementById("valasz_rossz3_modositas").value,
            "kerdes_id":kerdes_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="kerdes_uzenet_eltuntetes()">OK</button>
    `
}

const kerdes_modositas_ellenorzes = (id) => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan akarod módosítani ezt a kérdést?</h2>
        <button type="button" class="btn btn-success" onclick="kerdes_modositas(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="kerdes_uzenet_eltuntetes()">Nem</button>
    `
}


//--------------------------------------------------------Keresés--------------------------------------------------------
export const kerdesek_kereses_ellenorzes = () =>
{
    let keresett = document.getElementById("kereses_bemenet").value;
    if(document.getElementById("kereses_bemenet").value == "")
    {
        kerdesek_fetch(kviz_id);
    }
    else 
    kerdesek_kereses(keresett);
}

const kerdesek_kereses = async (keresett) => {
    let x = await fetch(`${server}/kerdesek_kereses/` + keresett, {
        method: "POST",
        body: JSON.stringify({
            "kviz_id":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kerdesek_megjelenit(y);
}


//--------------------------------------------------------Egyéb--------------------------------------------------------
export const kerdes_uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kerdesek_fetch(kviz_id)
}



//------------------------------------Paraméter továbbadása másik html oldalra (chatGPT-vel)------------------------------------
const getQueryParam_kviz = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const kviz_id = getQueryParam_kviz("kviz_id");

if (kviz_id) {
    kerdesek_fetch(kviz_id);
}


const getQueryParam_kerdes = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const kerdes_id = getQueryParam_kerdes("kerdes_id");

if (kerdes_id) {
    kerdes_fetch(kerdes_id);
}

window.kerdesek_torles_ellenorzes = kerdesek_torles_ellenorzes
window.kerdesek_torles = kerdesek_torles
window.kerdes_modositas = kerdes_modositas
window.kerdesek_kereses_ellenorzes = kerdesek_kereses_ellenorzes
window.kerdes_uzenet_eltuntetes = kerdes_uzenet_eltuntetes