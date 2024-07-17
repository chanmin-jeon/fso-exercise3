const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log('incorrect number of arguments')
    process.exit(1)
}
const password = process.argv[2]

const url = 
`mongodb+srv://chanmin:${password}@cluster0.4djkaso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// fields not defined in schema are accepted
mongoose.set('strictQuery', false)

// connect to mongo database
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String, 
    number: String, 
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // find all Person schemas
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log('id: ', person.id, 'name: ', person.name, 'number: ', person.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3], 
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
