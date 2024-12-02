//-----------------------------------------------------------------------------------------Megjelenítés-----------------------------------------------------------------------------------------
async function kvizek_fetch() {
    let x = await fetch("http://localhost:3000/kvizek");
    let y = await x.json();
    kvizek_megjelenit(y);
}
kvizek_fetch()

const kvizek_megjelenit = (adatok) =>{
    //console.log(adatok)

    let sz = ""
    for (const item of adatok) {
        sz += `

            <tr>
                <td>${item.kviz_nev}</td>
                <td>${item.felhasznalo_email}</td>
                <td>${item.kategoria_nev}</td>
                <td>${item.kviz_leiras}</td>
                <td>
                    <button type="button" onclick="window.location.href='kerdesek.html?kviz_id=${item.kviz_id}'" class="kerdesek_gomb gombok">Kérdések</button>
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


//-----------------------------------------------------------------------------------------Módosítás-----------------------------------------------------------------------------------------
async function kviz_fetch(kviz_id) {
    let x = await fetch("http://localhost:3000/kviz_id_alapjan",{
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
    document.getElementById("kategoria_modositas").value = adat[0].kategoria_id

    document.getElementById("modositas_ok_gomb").addEventListener("click", function(){
        kviz_modositas_ellenorzes(adat[0].kviz_id)
    })
}

async function kategoriak_fetch() {
    let x = await fetch("http://localhost:3000/kategoriak");
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

async function kviz_modositas(kviz_id) {
    let x = await fetch("http://localhost:3000/kviz_modositas",{
        method: "PUT",
        body: JSON.stringify({
            "kviz_nev":document.getElementById("kviz_nev_modositas").value,
            "kategoria_id":document.getElementById("kategoria_modositas").value,
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


//-----------------------------------------------------------------------------------------Törlés-----------------------------------------------------------------------------------------
async function kvizek_torles_ellenorzes(id) {
    let x = await fetch("http://localhost:3000/kviz_id_alapjan",{
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

async function kvizek_torles(id){
    let x = await fetch("http://localhost:3000/kvizek_torles",{
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


//-----------------------------------------------------------------------------------------Egyéb-----------------------------------------------------------------------------------------
const kviz_uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kvizek_fetch()
}


//-----------------------------------------------------------------------------------------chatGPT-----------------------------------------------------------------------------------------
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