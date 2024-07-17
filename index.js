require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express() 
const morgan = require('morgan')
const cors = require('cors')

/*
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
*/ 
app.use(express.json()) // used to access .body JSON

app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist')) // static page dist 

app.get('/', (request, response) => {
    response.send('<h1>Phonebook!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const numPeople = persons.length 
    const currentDate = new Date(); 
    response.send(
        `<div>
            <p>Phonebook has info for ${numPeople} people</p>
            <p>${currentDate}</p>
        </div>    
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        response.json(person)
    })
    .catch(error => {
        console.log('couldnt find', id)
        console.log('error message is: ', error.message)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    persons = persons.filter(p => p.id !== id)
    console.log(persons)
    response.status(204).end()
})

const genId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
     const body = request.body 
     console.log(body)
     if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
     } else if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
     }

     const person = new Person({
        name: body.name, 
        number: body.number,
     })
     person.save().then(savedPerson => {
        response.json(savedPerson)
     })
})



const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
    console.log(`running on ${PORT}, app initialized`)
})