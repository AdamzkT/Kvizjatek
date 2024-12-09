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
            <div class="visszajelzesek_kartya" type="button" data-bs-toggle="modal" data-bs-target="#reszletek_modal" onclick="modal_csere(${item.visszajelzes_id})">
                <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                <p class="visszajelzes_tipus">${item.visszajelzes_tipus}</p>
                <p class="visszajelzes_uzenet">${item.visszajelzes_uzenet}</p>
                <p class="visszajelzes_uzenet">${item.visszajelzes_megoldva?"Megoldva":"Függő"}</p>
            </div>
        </div>
        `
    }
    document.getElementById("visszajelzesek_doboz").innerHTML = sz
}


//-----------------------------------------------------------------------------------------Szűrés-----------------------------------------------------------------------------------------
const visszajelzesek_szures_ellenorzes = () =>
{
    let keresett = document.getElementById("visszajelzes_tipusok").value;
    if(document.getElementById("visszajelzes_tipusok").value == "összes")
    {
        visszajelzesek_fetch();
    }
    else 
    visszajelzesek_szures(keresett);
}

async function visszajelzesek_szures(keresett) {
    let x = await fetch("http://localhost:3000/visszajelzesek_szures/" + keresett);
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}