const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))

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


//----------------------------------------------------------------------------------POST----------------------------------------------------------------------------------

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
        req.body.visszajelzes_tema,
        req.body.visszajelzes_tipus,
        req.body.visszajelzes_uzenet
    ]

    connection.query(`
        INSERT INTO visszajelzesek 
        VALUES(null, ?, ?, ?, ?)
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
        WHERE (felhasznalo_email LIKE BINARY ? OR felhasznalo_nev LIKE BINARY ?) AND felhasznalo_jelszo LIKE BINARY ?;
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


app.post('/regisztracio', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev,
        req.body.felhasznalo_jelszo,
    ]

    connection.query(`
        INSERT INTO felhasznalok
        VALUES(?, ?, ?)
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


app.post('/regisztracio_ellenorzes', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.felhasznalo_email,
        req.body.felhasznalo_nev
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE felhasznalo_email = ? OR felhasznalo_nev = ?;
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



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})