const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

mongoose.connect(url).then(_result => console.log('Mongo connection ok!')).catch(error => console.log(error.message))

/** Mongoose schema and model for contact */
const personSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 3, required: true },
    number: {
      type: String,
      validate: {
        validator: (v) => {
          return /\b\d{2,3}-\d{7,8}\b/.test(v)
        },
        message: props => `${props.value} is not correct format. Format must be: 040-12345678 or 09-1234567.`
      },
      required: [true, 'phone number is required']
    },
  }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)