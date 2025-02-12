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
    let uj_kategoria = document.getElementById("kviz_hozzadas").value
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
        <button type="button" class="btn btn-secondary" onclick="kviz_uzenet_eltuntetes()">OK</button>
    `
    }
}

const kategoria_hozzadas = async () => {

}


//---------------------------------------------Egyéb---------------------------------------------
const kviz_uzenet_eltuntetes = () => {
    let uzenet_ablak = document.getElementById("uzenet_kulso_id")
    uzenet_ablak.style.display = "none"

    kategoriak_fetch()
}