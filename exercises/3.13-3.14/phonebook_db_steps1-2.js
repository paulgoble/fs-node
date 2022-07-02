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


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.send(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => {
    if (!person) {
      res.status(404).send(`<h2>Person ${req.params.id} is not found!</h2>`)
    } else {
      res.send(person)
    }
  })
})

app.delete('/api/persons/:id', (req, res) => {
  res.status(405).send(`<h2>Person ${req.params.id} cannot be deleted at this time!</h2>`)
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})