const mongoose = require('mongoose')

// do not require strict query
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to: ', url)

mongoose.connect(url)
    .then((result) => {
        console.log('connected to mongodb')
    })
    .catch(error => {
        console.log('error is', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

// remove id and v
personSchema.set('toJSON', {
    // 'transform' function called when person is converted to JSON
    transform: (document, returnedObject) => {
        console.log(`transforming ${returnedObject} since converting to JSON`)
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', personSchema)