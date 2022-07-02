require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function(req, res) {
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
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name || !person.number) {
    return res.status(400).json({ error: 'content missing' })
  }
  
  const newPerson = new Person(
    {
      name: person.name,
      number: person.number
    }
  )

  newPerson.save().then(personAdded => {
    res.json(personAdded)
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  next(err)
}
app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})