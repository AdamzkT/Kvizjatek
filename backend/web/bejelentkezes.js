var admin_nev = ""
var admin_jelszo = ""

const bejelentkezes_ellenorzes = () => {
    admin_nev = document.getElementById("admin_felhasznalonev_bemenet").value;
    admin_jelszo = document.getElementById("admin_jelszo_bemenet").value;
    bejelentkezes_fetch()
}

async function bejelentkezes_fetch() {
    let x = await fetch("http://localhost:3000/admin_bejelentkezes",{
        method: "POST",
        body: JSON.stringify({
            "felhasznalo_nev":admin_nev,
            "felhasznalo_jelszo":admin_jelszo
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"},
        credentials: 'include'  // Ensure the session cookie is sent with the request
    });
    let y = await x.text();  // Expecting the full HTML file in the response
    console.log(y);  // Optional: See the response

    if (y) {
        window.location.href = "kvizek.html";  // Redirect to the kvizek.html page
    }
}