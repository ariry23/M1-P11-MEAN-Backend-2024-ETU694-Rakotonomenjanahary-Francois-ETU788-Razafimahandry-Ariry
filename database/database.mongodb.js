/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'learnmongo';
const collection = 'NEW_COLLECTION_NAME';

// The current database to use.
use(database);

// Create a new collection.
db.createCollection(collection);

db.users.insertOne({
        username: "ariry",
        email: "ariryrazafimahandr@gmail.com",
        password: "<PASSWORD>",
        age: 25,
        role: "admin"}) ; 

db.users.findOne({username: "ariry"}) ; 
db.users.find() ; 
