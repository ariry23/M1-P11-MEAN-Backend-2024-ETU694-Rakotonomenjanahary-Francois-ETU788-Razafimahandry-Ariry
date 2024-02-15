
const database = 'saonbeaute';
const collection = 'NEW_COLLECTION_NAME';

use(database);

// Create a new collection.
db.createCollection(collection);




var rolesData = [
    { name: "employee", description: "Employee role description" },
    { name: "admin", description: "Admin role description" },
    { name: "customer", description: "Customer role description" }
  ];
  
  // Insert role data into the "roles" collection
  db.roles.insertMany(rolesData);
  
  
  db.createCollection('paiements', {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["amount", "payment_date"],
        properties: {
          amount: {
            bsonType: "double",
            description: "must be a double and is required"
          },
          payment_date: {
            bsonType: "date",
            description: "must be a date and is required"
          } , 
          reservation: {
            bsonType: 'objectId',
            description: 'must be an objectId and is required'
          }
        }
      }
    }
  });

  
  
  
  db.getCollection("users").find({});
  db.getCollection("users").deleteOne({"email" :"emp@test.com" }) ; 
  db.getCollection("roles").deleteMany({});
  
  
  
  
  
