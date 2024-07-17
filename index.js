const express = require('express')
const app = express() 
const cors = require('cors')
app.use(cors())
require('dotenv').config()

const morgan = require('morgan')

const Person = require('./models/person')

app.use(express.json()) // used to access .body JSON

app.use(morgan('tiny'))

app.use(express.static('dist')) // static page dist 

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json( { error: error.message })
    }
  
    next(error)
  }

app.get('/', (request, response) => {
    response.send('<h1>Phonebook!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(result => {
            const date = new Date()
            response.send(`
                <p>Phonebook has info for ${result} people</p>
                <p>${date}</p>
                `)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        response.json(person)
    })
    .catch(error => {
        console.log('couldnt find', id)
        console.log('error message is: ', error.message)
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
     const body = request.body 

     const person = new Person({
        name: body.name, 
        number: body.number,
     })

     person.save().then(savedPerson => {
        console.log('person saved')
        response.json(savedPerson)
     })
        .catch(error => next(error))
     
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id 
    const person = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})
     

app.use(errorHandler)


const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
    console.log(`running on ${PORT}, app initialized`)
})