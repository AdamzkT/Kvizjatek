const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))
app.use(bodyParser.json());
require('dotenv').config(); 

const SECRET_KEY = process.env.SECRET_KEY;

function kapcsolat()
{
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'kvizjatek'
    })
    
    connection.connect()
}


//----------------------------------------------------------------------------------GET----------------------------------------------------------------------------------

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
        INNER JOIN kategoriak ON kvizek.kategoria_id = kategoriak.kategoria_id
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
        RIGHT JOIN kategoriak ON kategoriak.kategoria_id = kvizek.kategoria_id
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
        INNER JOIN kerdesek ON kvizek.kviz_id = kerdesek.kviz_id
        INNER JOIN kategoriak ON kvizek.kategoria_id = kategoriak.kategoria_id
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


app.get('/kvizek_kereses/:keresett', (req, res) => {
    kapcsolat()

    let parameterek = [
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
    ]

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kategoriak ON kvizek.kategoria_id = kategoriak.kategoria_id
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

    let parameterek = [
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


//----------------------------------------------------------------------------------POST----------------------------------------------------------------------------------

app.post('/kvizek_szures', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.kviz_nev,
        req.body.kategoria_nev,
        req.body.kviz_leiras
    ]

    console.log(parameterek)

    connection.query(`
        SELECT * FROM kvizek
        INNER JOIN kategoriak ON kvizek.kategoria_id = kategoriak.kategoria_id
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

app.post('/kviz_felvitel',  (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.kviz_nev,
        req.body.kategoria_id,
        req.body.kviz_leiras
    ]

    connection.query(`
        INSERT INTO kvizek 
        VALUES(null, ?, ?, ?, ?)
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

    let parameterek = [
        req.body.kviz_id,
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


//Egy adott id-val rendelkező kvíz kérdései
app.post('/kviz_kerdesek', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.kviz_id
    ]

    connection.query(`
        SELECT * FROM kerdesek
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


app.post('/uzenet_kuldes', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
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


app.post('/bejelentkezes', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev,
        req.body.felhasznalo_jelszo,
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE (felhasznalo_email LIKE BINARY ? OR felhasznalo_nev LIKE BINARY ?) AND felhasznalo_jelszo LIKE BINARY ? AND felhasznalo_admin = 0;
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send(rows)
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})


app.post('/admin_bejelentkezes', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_nev,
        req.body.felhasznalo_jelszo,
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE felhasznalo_nev LIKE BINARY ? AND felhasznalo_jelszo LIKE BINARY ? AND felhasznalo_admin = 1;
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            if (rows.length === 0) {
                console.log("Hibás felhasználó név vagy jelszó!")
                res.status(401).send("Hibás felhasználó név vagy jelszó!")
            }
            else{
                const felhasznalo = rows[0]; // Get user details
                console.log("Sikeres bejelentkezés!");
        
                // Create JWT token (valid for 1 hour)
                const token = jwt.sign(
                    { felhasznalo_nev: felhasznalo.felhasznalo_nev },
                    SECRET_KEY,
                    { expiresIn: '1h' }
                );
        
                // Return token in the response
                res.status(200).json({ message: "Sikeres bejelentkezés!", token });
            }

        }
    })

    connection.end() 
})


app.post('/regisztracio', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev,
        req.body.felhasznalo_jelszo,
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


app.post('/regisztracio_email', (req, res) => {
    kapcsolat()

    let parameterek = [
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

app.post('/regisztracio_felhasznalo', (req, res) => {
    kapcsolat()

    let parameterek = [
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

app.post('/kerdes_id_alapjan', (req, res) => {
    kapcsolat()

    let parameterek = [
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

    let parameterek = [
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


app.post('/kerdesek_kereses/:keresett', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.kviz_id,
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
        '%' + req.params.keresett + '%',
    ]

    connection.query(`
        SELECT * FROM kerdesek
        WHERE kviz_id = ? AND (kerdes LIKE ? OR valasz_jo LIKE ? OR valasz_rossz1 LIKE ? OR valasz_rossz2 LIKE ? OR valasz_rossz3 LIKE ?)
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


//----------------------------------------------------------------------------------PUT----------------------------------------------------------------------------------

app.put('/kerdes_modositas', (req, res) => {
    kapcsolat()

    let parameterek = [
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

    let parameterek = [
        req.body.kviz_nev,
        req.body.kategoria_id,
        req.body.kviz_leiras,
        req.body.kviz_id,
    ]

    connection.query(`
        UPDATE kvizek SET
        kviz_nev = ?, kategoria_id = ?, kviz_leiras = ?
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

    let parameterek = [
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


//----------------------------------------------------------------------------------DELETE----------------------------------------------------------------------------------

app.delete('/kerdesek_torles', (req, res) => {
    kapcsolat()

    let parameterek = [
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


app.delete('/kvizek_torles', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.kviz_id
    ]

    //kérdések törlése
    connection.query(`
        DELETE FROM kerdesek
        WHERE kviz_id = ?
        `, parameterek, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            //ha sikeres, kvíz törlése
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
        }
    })

    res.on('finish', () => {
        connection.end();
    });
})


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})