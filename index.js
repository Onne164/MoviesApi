const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(cors())
app.use(express.json())

const movies = [
    {id: 1, title: "Titanic", year: 1997}, 
    {id: 2, title: "Johnny English", year: 2003}, 
    {id: 3, title: "Kingsman", year: 2014}, 
    {id: 4, title: "The Notebook", year: 2004}, 
    {id: 5, title: "A Star Is Born", year: 2018}, 
    {id: 6, title:  "Rocky", year: 1976}, 
    {id: 7, title:  "Jurassic Park", year: 1993}, 
    {id: 8, title:  "Forrest Gump", year: 1994}, 
    {id: 9, title:  "The Hunger Games", year: 2012}, 
    {id: 10, title:  "Serena", year: 2014}, 
    {id: 11, title:  "The Great Gatsby", year: 2013}, 
    {id: 12, title:  "American Sniper", year: 2014}, 
]

const actors = [
    {id: 1, name: "Tom Hanks"},
    {id: 2, name: "Leonardo DiCaprio"},
    {id: 3, name: "Rowan Atkinson"},
    {id: 4, name: "Silvester Stallone"},
    {id: 5, name: "Kate Winslet"},
    {id: 6, name: "Colin Firth"},
    {id: 7, name: "Rachel McAdams"},
    {id: 8, name: "Bradley Cooper"},
    {id: 9, name: "Lady Gaga"},
    {id: 10, name: "Sylvester Stallone"},
    {id: 11, name: "Sam Neill"},
    {id: 12, name: "Jennifer Lawrence"},
    {id: 13, name: "Lenny Kravitz"},

]

const movieActors = [
    {actorId: 1, movieId: 8 },
    {actorId: 2, movieId: 1 },
    {actorId: 3, movieId: 2 },
    {actorId: 5, movieId: 1 },
    {actorId: 6, movieId: 3 },
    {actorId: 7, movieId: 4 },
    {actorId: 8, movieId: 5 },
    {actorId: 9, movieId: 5 },
    {actorId: 10, movieId: 6 },
    {actorId: 11, movieId: 7 },
    {actorId: 12, movieId: 9 },
    {actorId: 13, movieId: 9 },
    {actorId: 12, movieId: 10 },
    {actorId: 2, movieId: 11 },
    {actorId: 8, movieId: 12 },

]

app.get('/movies', (req, res) => {
    moviesWithActors = movies.map((movie) => {
        movie.actors = getMovieActors(movie.id)
        return movie;
    })
    res.send(moviesWithActors)
})

app.get('/movies/:id', (req, res) => {

    let currentMovie = movies.find(movie => movie.id == req.params.id);
    if (!currentMovie) {
        return res.status(404).send({error: "Movie not found"})
    } 
    res.send(currentMovie)
})

app.post('/movies', (req, res) => {
    if (!req.body.title || !req.body.year) {
        return res.status(400).send({error: 'One or all params are missing'})
    }

    let movie = createMovie(req.body)
    for (let actor of req.body.actors) {
        if (actor.id === undefined) {
            let newActor = findOrCreateActor(actor)
            console.log(newActor, movie)
            movieActors.push( {actorId: newActor.id, movieId: movie.id })
        }
    }
    
    res.status(201)
       .location(`${getBaseUrl(req)}/movies/${movies.length}`)
       .send(movie)
})

app.put('/movies/:id', async (req, res) => {

    let movieId = req.params.id;
    for (let actor of req.body.actors) {
        if (actor.id === undefined) {
            let newActor = findOrCreateActor(actor)
            movieActors.push( {actorId: newActor.id, movieId })
        }
    }
    
    //leia erinevused http-andmete ja andmebaasi vahel
    let prev = getMovieActors(movieId)
    for (let existingActor of prev) {
        let found = req.body.actors.find(actor => actor.name == existingActor.name)
        if (found === undefined) {
            let index = movieActors.findIndex(ma => ma.actorId == existingActor.id && ma.movieId == movieId)
            movieActors.splice(index, 1)
        }
    }
    

    try {
      //await updateMovie(req.params.id, { title, year, actors });
      // Update existing movie
      let currentMovie = movies.find(movie => movie.id == req.params.id);
    //   console.log(currentMovie, req.params.id, movies, actors)
   
      if (currentMovie) {
        for (let key in req.body) {
          currentMovie[key] = req.body[key]
        }
      }
  
      return res.status(200).send({ success: 'Successfully updated!', movie: currentMovie});
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: 'An error occurred in movie modifications...' });
    }
  });

app.delete('/movies/:id', (req, res) => {
    let currentMovie = movies.find(movie => movie.id == req.params.id);
    if (currentMovie) {
        let index = movies.findIndex(m => m.id == currentMovie.id)
        movies.splice(index, 1)
    }
    // if (typeof movies[req.params.id - 1] === 'undefined') {
    //     return res.status(404).send({error: 'Movie not found'})
    // }

    // movies.splice(req.params.id - 1, 1)

    res.status(204).send({error: "No content"})
})

function createMovie(movie) {
    let lastId = movies[movies.length-1].id;
    let newMovie = {
        id: lastId +1,
        title: movie.title,
        year: movie.year,
        // actors: req.body.actors
    }
    movies.push(newMovie)
    return newMovie
}

function getMovieActors(movieId) {
    let results = movieActors.filter(function (item) {
        // console.log("movie", movie)
        // console.log("movieActors.item",item)
        return item.movieId == movieId;
    });
    return results.map((ma) => {
        return actors.find(function(actor) {
            return actor.id == ma.actorId;
        });
    });
}

function findOrCreateActor(actor) {
    let existing;
    // Find by id
    existing = actors.find(a => a.id == actor?.id)
    if (existing)
        return existing;
    
    // Find by name
    existing = actors.find(a => a.name == actor?.name)
    if (existing)
        return existing;
    
    // create new
    let lastId = actors[actors.length-1].id;
    let newActor = {
        ...actor,
        id: lastId + 1,
    };
    actors.push(newActor);
    return newActor;
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
    ? 'https' : 'http' + `://${req.headers.host}`
}