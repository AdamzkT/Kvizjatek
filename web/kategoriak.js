//---------------------------------------------Megjelenítés---------------------------------------------
const kategoriak_fetch = async () => {
    let x = await fetch("http://localhost:3000/kategoriak");
    let y = await x.json();
    kategoriak_megjelenit(y);
}
kategoriak_fetch()

const kategoriak_megjelenit = (adatok) => {
    let sz = ""
    for (const item of adatok) {
        sz += `
        <option value="${item.kategoria_id}">${item.kategoria_nev}</option>
        `
    }
    document.getElementById("kategoria_lista").innerHTML = sz
}


//---------------------------------------------Hozzáadás---------------------------------------------
const kategoria_hozzadas_ellenorzes = () => {
    let uj_kategoria = document.getElementById("kategoria_hozzadas").value
    if (uj_kategoria != "") {
        uj_kategoria = uj_kategoria.charAt(0).toUpperCase() + uj_kategoria.slice(1).toLowerCase();
        console.log(uj_kategoria)
        kategoria_hozzadas(uj_kategoria)
    }
    else{
        let uzenet_ablak = document.getElementById("uzenet_kulso_id")
        uzenet_ablak.style.display = "table"
        let uzenet = document.getElementById("uzenet")
        uzenet.innerHTML = `
        <h2>Írd be a kategória nevét!</h2>
        <button type="button" class="btn btn-secondary" onclick="uzenet_eltuntetes()">OK</button>
    `
    }
}

const kategoria_hozzadas = async (uj_kategoria) => {
    let x = await fetch("http://localhost:3000/kategoria_felvitel",{
        method: "POST",
        body: JSON.stringify({
            "kategoria_nev":uj_kategoria
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();
    console.log(y)

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="uzenet_eltuntetes()">OK</button>
    `
}


//---------------------------------------------Törlés---------------------------------------------
const kategoria_torles_ellenorzes = async () => {
    let id = document.getElementById("kategoria_lista").value

    let x = await fetch("http://localhost:3000/kategoria_id_alapjan",{
        method: "POST",
        body: JSON.stringify({
            "kategoria_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.json();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>Biztosan ki akarod törölni ezt a kategóriát?</h2>
        <p id="idezet">„${y[0].kategoria_nev}”</p>
        <button type="button" class="btn btn-danger" onclick="kategoria_torles(${id})">Igen</button>
        <button type="button" class="btn btn-secondary" onclick="uzenet_eltuntetes()">Nem</button>
    `
}

const kategoria_torles = async (id) => {
    let x = await fetch("http://localhost:3000/kategoriak_torles",{
        method: "DELETE",
        body: JSON.stringify({
            "kategoria_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "table"
    let uzenet = document.getElementById("uzenet")
    uzenet.innerHTML = `
        <h2>${y}</h2>
        <button type="button" class="btn btn-secondary" onclick="uzenet_eltuntetes()">OK</button>
    `
}

//---------------------------------------------Egyéb---------------------------------------------
const uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kategoriak_fetch()
}