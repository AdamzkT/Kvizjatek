const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt");
const app = express()
const port = 23016
//const port = 3000
app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))
app.use(bodyParser.json());
require('dotenv').config(); 

const SECRET_KEY = process.env.SECRET_KEY;

function kapcsolat()
{
    connection = mysql.createConnection({
        host: '192.168.255.3',
        user: 'u160_DB7JvC3JzZ',
        password: 'G.Tm@k5uSWAB7l7tj4ZmrcTC',
        database: 's160_db'
    })
    
    connection.connect()
}

/*function kapcsolat()
{
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'kvizjatek'
    })
    
    connection.connect()
}*/


//-------------------------------------------------------------GET-------------------------------------------------------------

//-------------------------------------------------------------Megjelenítés-------------------------------------------------------------
app.get('/kerdesek', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM kerdesek
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/kvizek', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kategoriak ON kvizek.kviz_kategoria = kategoriak.kategoria_id
        ORDER BY kvizek.kviz_id
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/kategoriak', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM kategoriak
        ORDER BY 
        CASE 
            WHEN kategoria_nev = 'Egyéb' THEN 1
            ELSE 0
        END,
        kategoria_nev;
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/kategoriak_db', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT kategoria_nev, COUNT(kviz_id) as db FROM kvizek
        RIGHT JOIN kategoriak ON kategoriak.kategoria_id = kvizek.kviz_kategoria
        GROUP BY kategoriak.kategoria_id
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/visszajelzesek/:sorrend', (req, res) => {
    kapcsolat()

    let sorrend = ""
    if (req.params.sorrend == "DESC") {
        sorrend = "DESC"
    }
    else{
        sorrend = "ASC"
    }

    connection.query(`
        SELECT * FROM visszajelzesek
        ORDER BY visszajelzes_datum ${sorrend}
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/kvizek_kerdesekkel', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kerdesek ON kvizek.kviz_id = kerdesek.kerdes_kviz
        INNER JOIN kategoriak ON kvizek.kviz_kategoria = kategoriak.kategoria_id
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/felhasznalok', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM felhasznalok
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/ertekelesek_kvizenkent', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT ertekeles_kviz, SUM(ertekeles_pont) AS kviz_ertekeles FROM ertekelesek
        INNER JOIN kvizek ON kvizek.kviz_id = ertekelesek.ertekeles_kviz
        GROUP BY ertekeles_kviz
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/kvizek_bovitett', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT kvizek.*, felhasznalok.felhasznalo_nev, SUM(ertekeles_pont) AS kviz_ertekeles FROM ertekelesek
        INNER JOIN kvizek ON kvizek.kviz_id = ertekelesek.ertekeles_kviz
        INNER JOIN felhasznalok ON felhasznalok.felhasznalo_email = kvizek.felhasznalo_email
        GROUP BY ertekeles_kviz
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

//-------------------------------------------------------------Keresés-------------------------------------------------------------
app.get('/kvizek_kereses/:keresett', (req, res) => {
    kapcsolat()

    const parameterek = [
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
    ]

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kategoriak ON kviz_kategoria = kategoriak.kategoria_id
        WHERE kviz_nev LIKE ? OR kviz_leiras LIKE ? OR kategoria_nev LIKE ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.get('/visszajelzesek_szures/:keresett/:sorrend', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.params.keresett,
    ]

    let sorrend = ""
    if (req.params.sorrend == "ASC") {
        sorrend = "ASC"
    }
    else{
        sorrend = "DESC"
    }

    connection.query(`
        SELECT * FROM visszajelzesek
        WHERE visszajelzes_tipus = ?
        ORDER BY visszajelzes_datum ${sorrend}
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})


//-------------------------------------------------------------POST-------------------------------------------------------------

//-------------------------------------------------------------Szűrés-------------------------------------------------------------
app.post('/kvizek_szures', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.felhasznalo_email,
        req.body.kviz_nev,
        req.body.kategoria_nev,
        req.body.kviz_leiras
    ]

    console.log(parameterek)

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kategoriak ON kviz_kategoria = kategoriak.kategoria_id
        WHERE felhasznalo_email LIKE ? AND kviz_nev LIKE ? AND kategoria_nev LIKE ? AND kviz_leiras LIKE ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

//-------------------------------------------------------------Felvitel-------------------------------------------------------------
app.post('/kviz_felvitel',  (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kviz_nev,
        req.body.felhasznalo_email,
        req.body.kviz_kategoria,
        req.body.kviz_leiras,
    ]

    connection.query(`
        INSERT INTO kvizek 
        VALUES(null, ?, ?, ?, ?, 0)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres kvíz felvitel!")
            res.status(200).send("Sikeres kvíz felvitel!")
        }
    })

    connection.end() 
})

app.post('/kerdes_felvitel',  (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes_kviz,
        req.body.kerdes,
        req.body.valasz_jo,
        req.body.valasz_rossz1,
        req.body.valasz_rossz2,
        req.body.valasz_rossz3
    ]

    connection.query(`
        INSERT INTO kerdesek 
        VALUES(null, ?, ?, ?, ?, ?, ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres kérdés felvitel!")
            res.status(200).send("Sikeres kérdés felvitel!")
        }
    })

    connection.end() 
})

app.post('/uzenet_kuldes', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.visszajelzes_felhasznalo,
        req.body.visszajelzes_datum,
        req.body.visszajelzes_tema,
        req.body.visszajelzes_tipus,
        req.body.visszajelzes_uzenet
    ]

    connection.query(`
        INSERT INTO visszajelzesek 
        VALUES(null, ?, ?, ?, ?, ?, 0)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Üzenet elküldve!")
            res.status(200).send("Üzenet elküldve!")
        }
    })

    connection.end() 
})

app.post('/kategoria_felvitel',  (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kategoria_nev,
    ]

    connection.query(`
        INSERT INTO kategoriak 
        VALUES(null, ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres kategória felvitel!")
            res.status(200).send("Sikeres kategória felvitel!")
        }
    })

    connection.end() 
})

app.post('/komment_felvitel',  (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.komment_felhasznalo,
        req.body.komment_kviz,
        req.body.komment_szoveg,
    ]

    connection.query(`
        INSERT INTO kommentek 
        VALUES(null, ?, ?, ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres komment felvitel!")
            res.status(200).send("Sikeres komment felvitel!")
        }
    })

    connection.end() 
})

app.post('/ertekeles_felvitel',  (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.ertekeles_felhasznalo,
        req.body.ertekeles_kviz,
        req.body.ertekeles_pont,
    ]

    connection.query(`
        INSERT INTO ertekelesek 
        VALUES(null, ?, ?, ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres értékelés felvitel!")
            res.status(200).send("Sikeres értékelés felvitel!")
        }
    })

    connection.end() 
})

//-------------------------------------------------------------Megjelenítés id alapján-------------------------------------------------------------
app.post('/kviz_kerdesek', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes_kviz
    ]

    connection.query(`
        SELECT * FROM kerdesek
        WHERE kerdes_kviz = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/kerdes_id_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes_id
    ]

    connection.query(`
        SELECT * FROM kerdesek
        WHERE kerdes_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/kviz_id_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kviz_id
    ]

    connection.query(`
        SELECT * FROM kvizek
        WHERE kviz_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/kategoria_id_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kategoria_id
    ]

    connection.query(`
        SELECT * FROM kategoriak
        WHERE kategoria_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end()
})

app.post('/ertekeles_felhasznalo_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.ertekeles_felhasznalo,
    ]

    connection.query(`
        SELECT * FROM ertekelesek
        WHERE ertekeles_felhasznalo = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/kommentek_kviz_id_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.komment_kviz,
    ]

    connection.query(`
        SELECT kommentek.*, felhasznalo_nev FROM kommentek
		INNER JOIN felhasznalok ON felhasznalok.felhasznalo_email = kommentek.komment_felhasznalo
        WHERE komment_kviz = ?
		ORDER BY komment_id DESC
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/komment_id_alapjan', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.komment_id,
    ]

    connection.query(`
        SELECT * FROM kommentek
        WHERE komment_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end()
})

//-------------------------------------------------------------Bejelentkezés-------------------------------------------------------------
app.post('/bejelentkezes', (req, res) => {
    kapcsolat();

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev,
    ];

    connection.query(`
        SELECT * from felhasznalok
        WHERE (felhasznalo_email LIKE BINARY ? OR felhasznalo_nev LIKE BINARY ?) AND felhasznalo_admin = 0;
        `, parameterek, async (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba");
            console.log(err);
            res.status(500).send(rows);
        }
        else{
            if (rows.length === 0) {
                console.log("Hibás bejelentkezési adatok!");
                res.status(401).send("Hibás bejelentkezési adatok!");
            } else {
                const felhasznalo = rows[0];

                // Check password with bcrypt
                const match = await bcrypt.compare(req.body.felhasznalo_jelszo, felhasznalo.felhasznalo_jelszo);
                if (match) {
                    console.log("Sikeres bejelentkezés!");
                    console.log(rows);
                    res.status(200).send(rows);
                } else {
                    res.status(401).send("Hibás bejelentkezési adatok!");
                }
            }
        }
    });

    connection.end()
})

app.post('/admin_bejelentkezes', (req, res) => {
    kapcsolat();

    let parameterek = [
        req.body.felhasznalo_nev,
    ];

    connection.query(`
        SELECT * from felhasznalok
        WHERE felhasznalo_nev LIKE BINARY ? AND felhasznalo_admin = 1;
        `, parameterek, async (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba");
            console.log(err);
            res.status(500).send("Hiba");
        }
        else{
            if (rows.length === 0) {
                console.log("Hibás felhasználó név vagy jelszó!");
                res.status(401).send("Hibás felhasználó név vagy jelszó!");
            }
            else{
                const felhasznalo = rows[0];

                // Check password with bcrypt
                const match = await bcrypt.compare(req.body.felhasznalo_jelszo, felhasznalo.felhasznalo_jelszo);
                if (match) {
                    console.log("Sikeres bejelentkezés!");

                    // Create JWT token
                    const token = jwt.sign(
                        { felhasznalo_nev: felhasznalo.felhasznalo_nev },
                        SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    res.status(200).json({ message: "Sikeres bejelentkezés!", token });
                } else {
                    res.status(401).send("Hibás felhasználó név vagy jelszó!");
                }
            }
        }
    });

    connection.end()
})

//-------------------------------------------------------------Regisztráció-------------------------------------------------------------
app.post('/regisztracio', async (req, res) => {
    kapcsolat()

    // Hash the password
    const titkositott_jelszo = await bcrypt.hash(req.body.felhasznalo_jelszo, 10);

    const parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev,
        titkositott_jelszo,
    ]

    connection.query(`
        INSERT INTO felhasznalok
        VALUES(?, ?, ?, 0)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres regisztráció!")
            res.status(200).send("Sikeres regisztráció!")
        }
    })

    connection.end() 
})

//email ellenőrzése
app.post('/regisztracio_email', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.felhasznalo_email
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE felhasznalo_email = ?;
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

//felhasználó név ellenőrzése
app.post('/regisztracio_felhasznalo', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.felhasznalo_nev
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE felhasznalo_nev = ?;
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

//-------------------------------------------------------------Keresés-------------------------------------------------------------
app.post('/kerdesek_kereses/:keresett', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes_kviz,
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
    ]

    connection.query(`
        SELECT * FROM kerdesek
        WHERE kerdes_kviz = ? AND (kerdes LIKE ? OR valasz_jo LIKE ? OR valasz_rossz1 LIKE ? OR valasz_rossz2 LIKE ? OR valasz_rossz3 LIKE ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/kommentek_kereses/:keresett', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.komment_kviz,
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
    ]

    connection.query(`
        SELECT * FROM kommentek
        WHERE komment_kviz = ? AND (komment_felhasznalo LIKE ? OR komment_szoveg LIKE ?)
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})


//-------------------------------------------------------------PUT-------------------------------------------------------------

//-------------------------------------------------------------Módosítás-------------------------------------------------------------
app.put('/kerdes_modositas', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes,
        req.body.valasz_jo,
        req.body.valasz_rossz1,
        req.body.valasz_rossz2,
        req.body.valasz_rossz3,
        req.body.kerdes_id,
    ]

    connection.query(`
        UPDATE kerdesek SET
        kerdes = ?, valasz_jo = ?, valasz_rossz1 = ?, valasz_rossz2 = ?, valasz_rossz3 = ?
        WHERE kerdes_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})

app.put('/kviz_modositas', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kviz_nev,
        req.body.kviz_kategoria,
        req.body.kviz_leiras,
        req.body.kviz_id,
    ]

    connection.query(`
        UPDATE kvizek SET
        kviz_nev = ?, kviz_kategoria = ?, kviz_leiras = ?
        WHERE kviz_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})

app.put('/jelszo_modositas', async (req, res) => {
    kapcsolat()

    // Hash the password
    const titkositott_jelszo = await bcrypt.hash(req.body.felhasznalo_jelszo, 10);

    const parameterek = [
        titkositott_jelszo,
        req.body.felhasznalo_email,
    ]

    connection.query(`
        UPDATE felhasznalok
        SET felhasznalo_jelszo = ?
        WHERE felhasznalo_email = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Jelszó módosítva!")
            res.status(200).send("Jelszó módosítva!!")
        }
    })

    connection.end() 
})

app.put('/kviz_kitoltes', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kviz_id,
    ]

    connection.query(`
        UPDATE kvizek SET
        kviz_kitoltesek = kviz_kitoltesek + 1
        WHERE kviz_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})

app.put('/visszajelzesek_megoldva_valtas', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.visszajelzes_id,
    ]

    connection.query(`
        UPDATE visszajelzesek
        SET visszajelzes_megoldva = CASE 
            WHEN visszajelzes_megoldva = 1 THEN 0
            WHEN visszajelzes_megoldva = 0 THEN 1
            ELSE visszajelzes_megoldva
        END
        WHERE visszajelzes_id = ?;    
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})

app.put('/ertekeles_modositas', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.ertekeles_pont,
        req.body.ertekeles_id,
    ]

    connection.query(`
        UPDATE ertekelesek SET
        ertekeles_pont = ?
        WHERE ertekeles_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})

app.put('/kategoria_id_modositas', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kategoria_id,
    ]

    connection.query(`
        UPDATE kvizek SET
        kviz_kategoria = 1
        WHERE kviz_kategoria = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres módosítás.")
            res.status(200).send("Sikeres módosítás.")
        }
    })

    connection.end() 
})


//-------------------------------------------------------------DELETE-------------------------------------------------------------

//-------------------------------------------------------------Törlés-------------------------------------------------------------
app.delete('/kerdes_torles', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kerdes_id
    ]

    connection.query(`
        DELETE FROM kerdesek
        WHERE kerdes_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres törlés.")
            res.status(200).send("Sikeres törlés.")
        }
    })

    connection.end() 
})

app.delete('/kviz_torles', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kviz_id
    ]

    connection.query(`
        DELETE FROM kvizek
        WHERE kviz_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres törlés.")
            res.status(200).send("Sikeres törlés.")
        }
    })

    connection.end()  
})

app.delete('/kategoria_torles', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.kategoria_id
    ]

    connection.query(`
        DELETE FROM kategoriak
        WHERE kategoria_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres törlés.")
            res.status(200).send("Sikeres törlés.")
        }
    })

    connection.end() 
})

app.delete('/komment_torles', (req, res) => {
    kapcsolat()

    const parameterek = [
        req.body.komment_id
    ]

    connection.query(`
        DELETE FROM kommentek
        WHERE komment_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres törlés.")
            res.status(200).send("Sikeres törlés.")
        }
    })

    connection.end() 
})


//------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})