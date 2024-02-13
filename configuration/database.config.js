const mongoose = require('mongoose');

//const connectionString = 'mongodb://mongo:27017/learnmongo';  //for docker
const connectionString = 'mongodb+srv://mean_sb:9ZltGbHkYtz8gxBl@clustermean.durkqk3.mongodb.net/salonbeaute?retryWrites=true&w=majority'
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
