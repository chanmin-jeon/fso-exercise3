const express = require('express')
const app = express() 
const morgan = require('morgan')
const cors = require('cors')


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

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    const personFound = persons.find(person => person.id === id)
    if (!personFound) {
        return response.status(404).end()
    }
    response.json(personFound)
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
    const info = request.body 

    if (!info.name || !info.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (persons.find(p => p.name === info.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    if (persons.find(p => p.number === info.number)) {
        return response.status(400).json({
            error: "number must be unique"
        })
    }
    
    const newPerson = {
        name: info.name,
        number: info.number, 
        id: genId()
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)

})



const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
    console.log(`running on ${PORT}, app initialized`)
})