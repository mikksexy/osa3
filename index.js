require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (req) => {
  if (req.method === 'POST') return '' + JSON.stringify(req.body)
  else return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]


  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req, res) => {
  const people = persons.length
  const date = new Date()
  res.send(`Phonebook has info for  ${people} people <br> <br> ${date}`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

/*app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})*/

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  /*if (!person.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.some(existing => existing.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  //person.id = Math.floor(Math.random(0, 1000) * 100)

  //persons = persons.concat(person)

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})