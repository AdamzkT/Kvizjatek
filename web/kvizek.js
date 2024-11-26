async function kvizek_fetch() {
    let x = await fetch("http://localhost:3000/kvizek");
    let y = await x.json();
    kvizek_megjelenit(y);
}
kvizek_fetch()

const kvizek_megjelenit = (adatok) =>{
    console.log(adatok)

    let sz = ""
    for (const item of adatok) {
        sz += `

            <tr>
                <td>${item.kviz_nev}</td>
                <td>${item.felhasznalo_email}</td>
                <td>${item.kategoria_nev}</td>
                <td>${item.kviz_leiras}</td>
                <td>
                    <button type="button" onclick="window.location.href='kerdesek.html?kviz_id=${item.kviz_id}'">Kérdések</button>
                </td>
                <td><button type="button" class="modositas">
                    <img src="kepek/pencil3.png" alt="" class="img-fluid">
                </button></td>
                <td><button type="button" class="torles">X</button></td>
            </tr>
        `
    }
    document.getElementById("kvizek_tablazat").innerHTML = sz
}