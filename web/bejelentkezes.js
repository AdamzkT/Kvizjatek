import { server } from "./backend_linkek.js";

var admin_nev = ""
var admin_jelszo = ""

export const bejelentkezes_ellenorzes = () => {
    admin_nev = document.getElementById("admin_felhasznalonev_bemenet").value;
    admin_jelszo = document.getElementById("admin_jelszo_bemenet").value;
    bejelentkezes_fetch()
}

const bejelentkezes_fetch = async () => {
    try {
        let response = await fetch(`${server}/admin_bejelentkezes`, {
            method: "POST",
            body: JSON.stringify({
                "felhasznalo_nev": admin_nev,
                "felhasznalo_jelszo": admin_jelszo
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        let data = await response.json();

        if (response.ok && data.token) {
            // Store the token in localStorage for subsequent requests
            localStorage.setItem('adminToken', data.token);
            window.location.href = "kvizek.html"; // Navigate to admin page
        } else {
            document.getElementById("hiba_uzenet").innerHTML = "Hibás felhasználó név vagy jelszó!";
        }
    } catch (error) {
        console.error("Hiba a bejelentkezés során:", error);
        document.getElementById("hiba_uzenet").innerHTML = "Hibás felhasználó név vagy jelszó!";
    }
}

window.bejelentkezes_ellenorzes = bejelentkezes_ellenorzes;