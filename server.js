require('dotenv').config()

const express = require('express')
const app = express()
//const port = 3000 // no hace falta al tener el fichero .env y apuntar el puerto

app.set("view engine", "hbs");
app.set("views", __dirname+"/views/");


const lessonsD = require("./lessonsData"); // importa el modulo que fue exportado de lessonsData

const DogApi = require('doggo-api-wrapper');
const myDog = new DogApi();

const hbs = require("hbs");
hbs.registerPartials(__dirname+"/views/partials")


app.get('/', (req, res) => {
  //res.send(`Bienvenido, tu clave secreta es: ${process.env.SECRET_KEY}`)
  
  res.render("home.hbs", {
      teacher: "Jorge"
  });
})

app.get("/lessons", (req,res) => {

 
    res.render("lessons.hbs", {
        lessonsL: lessonsD
    });
})

// una ruta donde el usuario vea solo las lecciones que estan aprobadas
app.get("/lessons/approved", (req, res) => {

    let newArr = [];

    // sacar solo las lecciones aprobadas
    lessonsD.forEach((eachLesson) => {
        if (eachLesson.approved === true) {
            newArr.push(eachLesson);
        }
    })

    //console.log(newArr);

    /*
        let filteredArr = lessonsD.filter((eachLesson) => {
            return eachLesson.approved === true;
        })
    */


    // renderizar estas en una vista
    res.render("lessons.hbs", {
        lessonsL: newArr // actualiza lessonsL y guarda los aprobados
    })


})

app.get("/lessons/:bootcamp", (req,res) => {

    // necesitamos la data por bootcamp
    let newArrBootcamp = lessonsD.filter((eachLesson) => {
        return eachLesson.bootcamp === req.params.bootcamp; // devuelve cada leccion que tenga como valor de la propiedad bootcamp la que pasemos por el req.params 
    })


    // renderizarla al usuario
    res.render("lessons.hbs", {
        lessonsL: newArrBootcamp // actualiza lessonsL y guarda los aprobados
    })

})
/*
app.get("/search", (req, res) => {
    // req.query 
    //console.log(req.query);

    const { searchLes } = req.query; // searchLess tiene que ser el mismo nombre que le pasamos al campo de texto del formulario de search.hbs

    let newArr = lessonsD.filter((eachLesson) => {
        return eachLesson.topic === searchLes 
    })

    res.render("search.hbs", {
        searchLesson: newArr
    })
})
*/

app.get("/search", (req, res) => {
    
    // req.query 
    //console.log(req.query);

    // si el usuario no ha enviado nada en el req.query (campo vacio)
    if (req.query.searchLes === undefined) {
        res.render("search.hbs", {
            searchLesson: " "
        })
    } else {
        const { searchLes } = req.query; // searchLess tiene que ser el mismo nombre que le pasamos al campo de texto del formulario de search.hbs

        let newObj = lessonsD.find((eachLesson) => {
            return eachLesson.topic.toUpperCase() === searchLes.toUpperCase() // por si escribimos en minus o mayus
        })
    
        res.render("search.hbs", {
            searchLesson: newObj
        })
    }

})

app.get("/dog", (req, res) => {

  
myDog.getARandomDog()
  .then(data => {
    res.render("dog.hbs", {
        dogPicture: data.message
    });
    
      //console.log(data)
  })
  .catch(err => {
      console.error(err)
  })
})

app.get("/breeds", (req, res) => {

myDog.getListOfAllBreeds()
.then(data => {
    //console.log(data)
    let arrayOfBreeds = Object.keys(data.message)
    //console.log(arrayOfBreeds)
    res.render("breeds.hbs", {
        dogBreeds: arrayOfBreeds
    })
})

.catch(err => console.error(err)) // Don't forget the catch it's important
})

app.get("/dogs-by-breed/:breed", (req,res) => {
    const { breed } = req.params;

    myDog.getAllDogsByBreed(breed)
    .then(data => {
        console.log(data)
        res.render("dogs-by-breed.hbs", {
            dogsArr: data.message
        })
    })
    .catch(err => console.error(err)) // Don't forget the catch it's important
})



// process.env.PORT variable de puerto almacenada en el fichero .env
app.listen(process.env.PORT, () => { 
  console.log(`Example app listening on port ${process.env.PORT}`)
})

