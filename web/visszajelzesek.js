//-----------------------------------------------------------------------------------------Megjelenítés-----------------------------------------------------------------------------------------
var adatok = []

async function visszajelzesek_fetch() {
    let x = await fetch("http://localhost:3000/visszajelzesek");
    let y = await x.json();
    visszajelzesek_megjelenit(y);
}
visszajelzesek_fetch()

const visszajelzesek_megjelenit = (y) =>{
    adatok = y
    //console.log(adatok)

    let sz = ""
 
    for (const item of adatok) {
        if (document.getElementById("megoldva_szures").checked) {
            if (item.visszajelzes_megoldva) {
                sz += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="visszajelzesek_kartya megoldva" type="button" data-bs-toggle="modal" data-bs-target="#reszletek_modal" onclick="modal_csere(${item.visszajelzes_id})">
                        <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                        <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                    </div>
                </div>
                `
            }
            else{
                sz += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="visszajelzesek_kartya fuggo" type="button" data-bs-toggle="modal" data-bs-target="#reszletek_modal" onclick="modal_csere(${item.visszajelzes_id})">
                        <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                        <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                    </div>
                </div>
                `
            }
        }
        else{
            if (!item.visszajelzes_megoldva) {
                sz += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="visszajelzesek_kartya fuggo" type="button" data-bs-toggle="modal" data-bs-target="#reszletek_modal" onclick="modal_csere(${item.visszajelzes_id})">
                        <p class="visszajelzes_tema">${item.visszajelzes_tema}</p>
                        <p class="felhasznalo_email">${item.felhasznalo_email}</p>
                    </div>
                </div>
                `
            }
        }
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


//-----------------------------------------------------------------------------------------Modal csere-----------------------------------------------------------------------------------------
const modal_csere = (id) => {
    const item = adatok.find(i => i.visszajelzes_id == id);
    document.getElementById("modal_fej_cim").innerHTML = item.visszajelzes_tema;

    let sz = `
        <p class="visszajelzes_szoveg"><b>Típus:</b> ${item.visszajelzes_tipus}</p>
        <p class="visszajelzes_uzenet">„${item.visszajelzes_uzenet}”</p>
        ${item.visszajelzes_megoldva ?
            `
            <label class="switch">
                <input type="checkbox" id="visszajelzes_megoldva_${item.visszajelzes_id}" checked onclick="visszajelzesek_megoldva_valtas(${item.visszajelzes_id})">
                <span class="slider"></span>
            </label>
            `
            :
            `
            <label class="switch">
                <input type="checkbox" id="visszajelzes_megoldva_${item.visszajelzes_id}" onclick="visszajelzesek_megoldva_valtas(${item.visszajelzes_id})">
                <span class="slider"></span>
            </label>
            `
        }
        <script>
            document.getElementById("visszajelzes_megoldva_${item.visszajelzes_id}").checked = ${item.visszajelzes_megoldva};
        </script>
    `
    document.getElementById("modal_test").innerHTML = sz;
}


//------------------------------------------------------------------------------------Visszajelzések megoldása------------------------------------------------------------------------------------
async function visszajelzesek_megoldva_valtas(id) {
    let x = await fetch("http://localhost:3000/visszajelzesek_megoldva_valtas",{
        method: "PUT",
        body: JSON.stringify({
            "visszajelzes_id":id
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let y = await x.text();

    console.log(y)
    visszajelzesek_szures_ellenorzes()
}