//-----------------------------------------------------------------------------------------Megjelenítés-----------------------------------------------------------------------------------------
async function visszajelzesek_fetch() {
    let x = await fetch("http://localhost:3000/visszajelzesek");
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}
visszajelzesek_fetch()

const visszajelzesek_megjelenit = (adatok) =>{
    //console.log(adatok)

    let sz = ""
    for (const item of adatok) {
        sz += `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="visszajelzesek_kartya">
                <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                <p class="visszajelzes_tipus">${item.visszajelzes_tipus}</p>
                <p class="visszajelzes_uzenet">${item.visszajelzes_uzenet}</p>
            </div>
        </div>
        `
    }
    document.getElementById("visszajelzesek_doboz").innerHTML = sz
}