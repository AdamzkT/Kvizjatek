import { server } from "./backend_linkek.js";

//--------------------------------------------------------Megjelenítés--------------------------------------------------------
var adatok = []

const kommentek_fetch = async (kviz_id) => {
    let x = await fetch(`${server}/kommentek_kviz_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "komment_kviz":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kommentek_megjelenit(y);
}

const kommentek_megjelenit = (y) => {
    //console.log(y)
    adatok = y

    let sz = ""
    for (const item of adatok) {
        sz += `
        <tr>
            <td>${item.komment_felhasznalo}</td>
            <td>${item.komment_szoveg}</td>
            <td><button type="button" class="torles_gomb" onclick="kommentek_torles_ellenorzes(${item.komment_id})">
                <img src="kepek/delete.png" alt="" class="img-fluid">
            </button></td>
        </tr>
        `
    }
    try {
        document.getElementById("kommentek_tablazat").innerHTML = sz
    } catch (error) {
        
    }
}


//--------------------------------------------------------Törlés--------------------------------------------------------
export const kommentek_torles_ellenorzes = async (id) => {
    let x = await fetch(`${server}/komment_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "komment_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan ki akarod törölni ezt a kommentet?</h2>
        <p id="idezet">„${y[0].komment_szoveg}”</p>
        <button type="button" class="btn btn-danger" onclick="kommentek_torles(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="komment_uzenet_eltuntetes()">Nem</button>
    `
}

export const kommentek_torles = async (id) => {
    let x = await fetch(`${server}/komment_torles`,{
        method: "DELETE",
        body: JSON.stringify({
            "komment_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="komment_uzenet_eltuntetes()">OK</button>
    `
}


//--------------------------------------------------------Keresés--------------------------------------------------------
export const kommentek_kereses_ellenorzes = () =>
{
    let keresett = document.getElementById("kereses_bemenet").value;
    if(document.getElementById("kereses_bemenet").value == "")
    {
        kommentek_fetch(kviz_id);
    }
    else 
    kommentek_kereses(keresett);
}

const kommentek_kereses = async (keresett) => {
    let x = await fetch(`${server}/kommentek_kereses/` + keresett, {
        method: "POST",
        body: JSON.stringify({
            "komment_kviz":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kommentek_megjelenit(y);
}


//--------------------------------------------------------Egyéb--------------------------------------------------------
export const komment_uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kommentek_fetch(kviz_id)
}

const kommentek_kereses_enter = () => {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("kereses_bemenet").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents any unintended behavior
                kommentek_kereses_ellenorzes();
            }
        });
    });
}
kommentek_kereses_enter()


//------------------------------------Paraméter továbbadása másik html oldalra (chatGPT-vel)------------------------------------
const getQueryParam_kviz = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const kviz_id = getQueryParam_kviz("kviz_id");

if (kviz_id) {
    kommentek_fetch(kviz_id);
}

window.kommentek_torles_ellenorzes = kommentek_torles_ellenorzes
window.kommentek_torles = kommentek_torles
window.kommentek_kereses_ellenorzes = kommentek_kereses_ellenorzes
window.komment_uzenet_eltuntetes = komment_uzenet_eltuntetes