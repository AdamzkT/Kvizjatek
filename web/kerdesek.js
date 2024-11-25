async function kerdesek_fetch() {
    let x = await fetch("http://localhost:3000/kerdesek");
    let y = await x.json();
    kerdesek_megjelenit(y);
}
kerdesek_fetch()

const kerdesek_megjelenit = (adatok) =>{
    console.log(adatok)

    let sz = ""
    for (const item of adatok) {
        sz += `
        <tr>
            <td>${item.kerdes}</td>
            <td>${item.valasz_jo}</td>
            <td>${item.valasz_rossz1}</td>
            <td>${item.valasz_rossz2}</td>
            <td>${item.valasz_rossz3}</td>
        </tr>
        `
        document.getElementById("kerdesek_tablazat").innerHTML = sz
    }
}