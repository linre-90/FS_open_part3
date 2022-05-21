require('dotenv').config()

const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


/** --------------- LOGGER ---------------- */
// Custom token to display req.body if method is POST and body exists
morgan.token('postData', function (req, _res ) {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  } else {
    return ' '
  }
})

// Middleware to log requests
//:method :url :status :res[content-length] - :response-time ms <---- tiny format
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)




/** --------------- GET ---------------- */
// api/persons/:id return person info based on id.
// Returns 404 if person not found or id is not a number.
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(result => {
    if (result) {
      res.json(result)
    } else {
      res.sendStatus(404)
    }
  }).catch(error => next(error))

})

// api/persons route
// Returns all persons as json array
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))
})

// /info route. Displays info about saved contacts.
// Returns html containing num of contacts and request time.
app.get('/info', (req, res, next) => {
  Person.count().then(result => {
    const HTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Puhelinluettelo API</title>
        </head>
        <body>
            <p>Phonebook has info for ${result} people</p>
            <p>${new Date()}</p>
        </body>
        </html>
        `
    res.send(HTML)


  }).catch(error => next(error))
})




/** --------------- POST ---------------- */
// Post method to add contact.
// Returns 404 if person name exists also if (name or number is empty) or missing.
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    res.json(result)
  }).catch(error => next(error))
})




/** --------------- UPDATE ---------------- */
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})




/** --------------- DELETE ---------------- */
// Deletes contacts based on id.
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(_result => {
      res.sendStatus(204)
    })
    .catch(error => next(error))
})

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




/** --------------- CATCH ROUTE MIDDLEWARE ---------------- */
// Not supported routes catch
const unknownEndpoint = (req, res) => {
  res.sendStatus(404)
}
app.use(unknownEndpoint)


/** --------------- ERROR MIDDLEWARE ---------------- */
const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  else if (error.name) {
    return res.status(404).send({ error: error.name })
  }

  next(error)
}

app.use(errorHandler)
