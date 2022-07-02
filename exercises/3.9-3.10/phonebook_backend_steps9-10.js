const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})
// NOTE: the above seems to return only the body of the response not that of the original POST request, which does not include an id. I have been unable to resolve this issue.

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/info', (req, res) => {
  const responseText = `<h2>The phonebook has info for ${persons.length} people</h2>`
  const responseTime = new Date

  res.send(responseText.concat(responseTime))
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).send(`<h2>Person ${id} is not found!</h2>`)
  } else {
    res.send(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).send(`<h2>Person ${id} is not found!</h2>`)
  } else {
    persons = persons.filter(p => p.id !== id)
    res.end()
  }
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body
  newPerson.id = Math.floor(Math.random() * 100) + persons.length

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({error: 'missing content'})
  } else if (persons.find(p => p.name === newPerson.name)) {
    return res.status(400).json({error: 'Person already exists'})
  }
  
  res.send(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})