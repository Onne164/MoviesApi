const express = require('express')
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
]

const actors = [
    {id: 1, name: "Tom Hanks"},
    {id: 2, name: "Leonardo di Caprio"},
    {id: 3, name: "Rowan Atkinson"},
    {id: 4, name: "Silvester Stallone"},
]

const movieActors = [
    {actorId: 1, movieId: 8 },
    {actorId: 2, movieId: 1 },
    {actorId: 1, movieId: 1 }
]

app.get('/movies', (req, res) => {
    moviesWithActors = movies.map((movie) => {
        let results = movieActors.filter(function (item) {
            // console.log("movie", movie)
            // console.log("movieActors.item",item)
            return item.movieId == movie.id;
        });
        movie.actors = results.map((ma) => {
            return actors.find(function(actor) {
                return actor.id == ma.actorId;
            });
        });
        return movie;
    })
    res.send(moviesWithActors)
})

app.get('/movies/:id', (req, res) => {
    if (typeof movies[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Movie not found"})
    }
    res.send(movies[req.params.id - 1])
})

app.post('/movies', (req, res) => {
    if (!req.body.title || !req.body.year) {
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let movie = {
        id: movies.length + 1,
        title: req.body.title,
        year: req.body.year
    }
    movies.push(movie)

    res.status(201)
       .location(`${getBaseUrl(req)}/movies/${movies.length}`)
       .send(movie)
})

app.delete('/movies/:id', (req, res) => {
    if (typeof movies[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: 'Movie not found'})
    }

    movies.splice(req.params.id - 1, 1)

    res.status(204).send({error: "No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
    ? 'https' : 'http' + `://${req.headers.host}`
}