require('dotenv').config()

const express = require('express')
const app = express()
//const port = 3000

app.get('/', (req, res) => {
  res.send(`Bienvenido, tu clave secreta es: ${process.env.SECRET_KEY}`)
})

// process.env.PORT variable de puerto almacenada en el fichero .env
app.listen(process.env.PORT, () => { 
  console.log(`Example app listening on port ${process.env.PORT}`)
})


