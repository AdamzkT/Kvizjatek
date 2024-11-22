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
        INNER JOIN kerdesek ON kvizek.id = kerdesek.kviz_id
        INNER JOIN kategoriak ON kvizek.kategoria_id = kategoriak.id
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


app.post('/kviz_kerdesek', (req, res) => {
    kapcsolat()

    let parameterek = [
        req.body.id
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
        req.body.tema,
        req.body.tipus,
        req.body.uzenet
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
        req.body.email,
        req.body.nev,
        req.body.jelszo,
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE (email LIKE BINARY ? OR nev LIKE BINARY ?) AND jelszo LIKE BINARY ?;
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
        req.body.email,
        req.body.nev,
        req.body.jelszo,
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
        req.body.email,
        req.body.nev
    ]

    connection.query(`
        SELECT * from felhasznalok
        WHERE email = ? OR nev = ?;
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})