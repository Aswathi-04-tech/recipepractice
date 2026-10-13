const mongoose = require('mongoose');

 connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
}); 