//Megjelenítés
var adatok = []

async function kerdesek_fetch(kviz_id) {
    let x = await fetch("http://localhost:3000/kviz_kerdesek",{
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
    console.log(y)
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
            <td><button type="button" class="modositas" onclick="kerdesek_modositas(${item.kerdes_id})">
                <img src="kepek/edit.png" alt="" class="img-fluid">
            </button></td>
            <td><button type="button" class="torles" onclick="torles_ellenorzes(${item.kerdes_id})">X</button></td>
        </tr>
        `
    }
    document.getElementById("kerdesek_tablazat").innerHTML = sz
}


//Törlés
async function kerdesek_torles(id){
    let x = await fetch("http://localhost:3000/kerdesek_torles",{
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
        <button type="button" class="btn btn-danger" onclick="uzenet_eltuntetes()">OK</button>
    `
}

async function torles_ellenorzes(id) {
    let x = await fetch("http://localhost:3000/kerdes_id_alapjan",{
        method: "POST",
        body: JSON.stringify({
            "kerdes_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();

    console.log(adatok)
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan ki akarod törölni ezt a kérdést?</h2>
        <p id="idezet">„${y[0].kerdes}”</p>
        <button type="button" class="btn btn-danger" onclick="kerdesek_torles(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="uzenet_eltuntetes()">Nem</button>
    `
}


//Módosítás
const kerdesek_modositas = (id) => {

}



//Egyéb
const uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kerdesek_fetch(kviz_id)
}



//chatGPT
const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const kviz_id = getQueryParam("kviz_id");

if (kviz_id) {
    kerdesek_fetch(kviz_id);
} else {
    console.error("No kviz_id provided in the URL.");
}