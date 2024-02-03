/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'learnmongo';
const collection = 'NEW_COLLECTION_NAME';

// The current database to use.
use(database);

// Create a new collection.
db.createCollection(collection);

db.getCollection("users").drop() ; 


db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'Username must be a string',
        },
        email: {
          bsonType: 'string',
          pattern: '^.+@.+$',
          description: 'Email must be a string with a valid email format',
        },
        password: {
          bsonType: 'string',
          description: 'Password must be a string',
        },
      },
    },
  },
});



db.getCollection("users").find({});
db.getCollection("users").deleteMany({});




