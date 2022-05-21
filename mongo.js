const mongoose = require('mongoose')

/** Mongoose schema and model for contact */
const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  }
)
const Person = mongoose.model('Person', personSchema)

/**
 * Prints error message and terminates process
 * @param {*} errorMsg - possible error message
 */
const handleError = (errorMsg) => {
  if (errorMsg.length === 0) {
    console.log('Some error happened')

  } else {
    console.log(errorMsg)
  }

  mongoose.connection.close()
  process.exit(1)
}


/**
 * Function to get mongo connection
 * @param {*} password mongo db password
 */
const openMongoConnection = (password) => {
  const url = `mongodb+srv://fsopenpt-jaylow:${password}@cluster0.twphc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  mongoose.connect(url).catch(error => handleError(error.message))
}

/**
 * Function to disconnect mongo and terminate process succesfully
 */
const disconnectAndTerminateProcess = () => {
  mongoose.connection.close()
  process.exit(0)
}

/**
 * Adds contact to db
 * @param {*} person personSchema compatible object
 */
const addContactToDb = (person) => {
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    disconnectAndTerminateProcess()
  }).catch(error => {
    handleError(error.message)
  })
}

/**
 * Function fetches all records from phonebook db
 */
const fetchAll = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')

    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

    disconnectAndTerminateProcess()
  })
}

/**
 * Main function
 */
const main = () => {

  // Use cases
  if (process.argv.length > 2) {
    openMongoConnection(process.argv[2])

    switch (process.argv.length) {
    case 3:{// cmd: *node mongo.js [secretpassword]* - returns all contacts
      fetchAll()
      break}

    case 5:{ // cmd: *node mongo.js [secretpassword] Anna 040-1234556* - Add single person to phonebook db
      const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      addContactToDb(newPerson)
      break}
    default:{
      disconnectAndTerminateProcess()
      break}
    }

  } else {
    console.log('Invalid command line parameters.')
    process.exit(0)
  }
}

// Similar check to python, runs main if file is started directly from command line with *node mongo.js ...*
if (require.main === module) {
  main()
}
