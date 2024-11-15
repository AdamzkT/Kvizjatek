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



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})