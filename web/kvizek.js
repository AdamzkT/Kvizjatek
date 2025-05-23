import { server } from "./backend_linkek.js";

//---------------------------------------------Megjelenítés---------------------------------------------
var ertekelesek = []

const kvizek_fetch = async () => {
    let x = await fetch(`${server}/kvizek`);
    let y = await x.json();
    
    kvizek_megjelenit(y);
}

const ertekelesek_fetch = async () => {
    let x = await fetch(`${server}/ertekelesek_kvizenkent`);
    let y = await x.json();
    ertekelesek = y

    kvizek_fetch()
}
ertekelesek_fetch()

const kvizek_megjelenit = (adatok) =>{
    //console.log(adatok)
    //console.log(ertekelesek)

    let sz = ""
    for (const item of adatok) {
        let ertekeles = 0
        for (const ertek of ertekelesek) {
            if (ertek.ertekeles_kviz == item.kviz_id) {
                ertekeles = ertek.kviz_ertekeles
            }
        }

        sz += `
            <tr>
                <td>${item.kviz_nev}</td>
                <td>${item.felhasznalo_email}</td>
                <td>${item.kategoria_nev}</td>
                <td>${item.kviz_leiras}</td>
                <td>${item.kviz_kitoltesek}</td>
                <td>${ertekeles}</td>
                <td>
                    <button type="button" onclick="window.location.href='kerdesek.html?kviz_id=${item.kviz_id}'" class="tablazat_gomb gombok">Kérdések</button>
                </td>
                <td>
                    <button type="button" onclick="window.location.href='kommentek.html?kviz_id=${item.kviz_id}'" class="tablazat_gomb gombok">Kommentek</button>
                </td>
                <td><button type="button" class="modositas_gomb gombok" onclick="window.location.href='kvizek_modositas.html?kviz_id=${item.kviz_id}'">
                    <img src="kepek/edit.png" alt="" class="img-fluid">
                </button></td>
                <td><button type="button" class="torles_gomb gombok">
                    <img src="kepek/delete.png" alt="" class="img-fluid" onclick="kvizek_torles_ellenorzes(${item.kviz_id})">
                </button></td>
            </tr>
        `
    }
    try {
        document.getElementById("kvizek_tablazat").innerHTML = sz
    } catch (error) {
        
    }
}


//---------------------------------------------Módosítás---------------------------------------------
const kviz_fetch = async (kviz_id) => {
    let x = await fetch(`${server}/kviz_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "kviz_id":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();
    kviz_megjelenit(y);
}

const kviz_megjelenit = (adat) => {
    //console.log(adat)

    document.getElementById("kviz_nev_modositas").value = adat[0].kviz_nev
    document.getElementById("leiras_modositas").value = adat[0].kviz_leiras
    document.getElementById("kategoria_modositas").value = adat[0].kviz_kategoria

    document.getElementById("modositas_ok_gomb").addEventListener("click", function(){
        kviz_modositas_ellenorzes(adat[0].kviz_id)
    })
}

const kategoriak_fetch = async () => {
    let x = await fetch(`${server}/kategoriak`);
    let y = await x.json();
    kategoriak_megjelenit(y);
}


const kategoriak_megjelenit = (adatok) => {
    let sz = ""
    for (const item of adatok) {
        sz += `
        <option value="${item.kategoria_id}">${item.kategoria_nev}</option>
        `
    }
    try {
        document.getElementById("kategoria_modositas").innerHTML = sz
    } catch (error) {
        
    }
}

export const kviz_modositas = async (kviz_id) => {
    let x = await fetch(`${server}/kviz_modositas`,{
        method: "PUT",
        body: JSON.stringify({
            "kviz_nev":document.getElementById("kviz_nev_modositas").value,
            "kviz_kategoria":document.getElementById("kategoria_modositas").value,
            "kviz_leiras":document.getElementById("leiras_modositas").value,
            "kviz_id":kviz_id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="kviz_uzenet_eltuntetes()">OK</button>
    `
    kvizek_fetch()
}

const kviz_modositas_ellenorzes = (id) => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan akarod módosítani ezt a kvízet?</h2>
        <button type="button" class="btn btn-success" onclick="kviz_modositas(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="kviz_uzenet_eltuntetes()">Nem</button>
    `
}


//---------------------------------------------Törlés---------------------------------------------
export const kvizek_torles_ellenorzes = async (id) => {
    let x = await fetch(`${server}/kviz_id_alapjan`,{
        method: "POST",
        body: JSON.stringify({
            "kviz_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan ki akarod törölni ezt a kvízet?</h2>
        <h2 style="color: red;">Ez ki fogja törölni a kvíz kérdéseit is!</h2>
        <p id="idezet">„${y[0].kviz_nev}”</p>
        <button type="button" class="btn btn-danger" onclick="kvizek_torles(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="kviz_uzenet_eltuntetes()">Nem</button>
    `
}

export const kvizek_torles = async (id) => {
    let x = await fetch(`${server}/kviz_torles`,{
        method: "DELETE",
        body: JSON.stringify({
            "kviz_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="kviz_uzenet_eltuntetes()">OK</button>
    `
}


//---------------------------------------------Keresés---------------------------------------------
export const kvizek_kereses_ellenorzes = () =>
{
    let keresett = document.getElementById("kereses_bemenet").value;
    if(document.getElementById("kereses_bemenet").value == "")
    {
        kvizek_fetch();
    }
    else 
    kvizek_kereses(keresett);
}

const kvizek_kereses = async (keresett) => {
    let x = await fetch(`${server}/kvizek_kereses/` + keresett);
    let y = await x.json();
    kvizek_megjelenit(y);
}


//---------------------------------------------Egyéb---------------------------------------------
export const kviz_uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kvizek_fetch()
}

const kvizek_kereses_enter = () => {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("kereses_bemenet").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents any unintended behavior
                kvizek_kereses_ellenorzes();
            }
        });
    });
}
kvizek_kereses_enter()


//---------------------------------------------Paraméter továbbadása másik html oldalra (chatGPT-vel)---------------------------------------------
const getQueryParam_kviz_modositas = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const kviz_id_modositas = getQueryParam_kviz_modositas("kviz_id");

if (kviz_id_modositas) {
    kategoriak_fetch()
    .then(() => kviz_fetch(kviz_id_modositas)
    .then(kviz_megjelenit));
}

window.kviz_modositas = kviz_modositas
window.kvizek_torles_ellenorzes = kvizek_torles_ellenorzes
window.kvizek_torles = kvizek_torles
window.kvizek_kereses_ellenorzes = kvizek_kereses_ellenorzes
window.kviz_uzenet_eltuntetes = kviz_uzenet_eltuntetes