const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long.'],
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Not a valid phone number.'],
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message: 'Number must be in the correct format.'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)