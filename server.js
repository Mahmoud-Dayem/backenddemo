const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT;
mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Connected to MongoDB👌');
}).catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
});


 

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

 