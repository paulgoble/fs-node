require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function(req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const responseText = `<h2>The phonebook has info for ${persons.length} people</h2>`
    const responseTime = new Date

    res.send(responseText.concat(responseTime))
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.send(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        res.status(404).end()
      } else {
        res.send(person)
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body

  const newPerson = new Person(
    {
      name: person.name,
      number: person.number
    }
  )

  Person.find({}).then(persons => {
    if (persons.find(p => p.name === newPerson.name)) {
      next(new Error('Person already exists'))
    }
  })

  newPerson.save()
    .then(personAdded => {
      res.json(personAdded)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  const options = { new: true, runValidators: true }

  Person.findByIdAndUpdate(req.params.id, person, options )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

const errorHandler = (err, req, res) => {
  res.status(400).send({ error: err.message })
}
app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
