const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide your password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fs-open:${password}@cluster0.3k8j8h0.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose.connect(url)
  .then(res => {
    console.log('phonebook:')

    Person.find({}).then(results => {
      results.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
  })

} else if (process.argv.length > 3) {
  const person = new Person(
    {
      name: process.argv[3],
      number: process.argv[4]
    }
  )

  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')
      return person.save()
    })
    .then(() => {
      console.log(`added ${person.name} ${person.number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

}