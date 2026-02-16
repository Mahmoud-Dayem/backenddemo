const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
});

// Read data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

// Define schema
const tourSchema = new mongoose.Schema({
    id: Number,
    name: String,
    duration: Number,
    maxGroupSize: Number,
    difficulty: String,
    ratingsAverage: Number,
    ratingsQuantity: Number,
    price: Number,
    summary: String,
    description: String,
    imageCover: String,
    images: [String],
    startDates: [String]
}, { collection: 'tours' });

const Tour = mongoose.model('tours', tourSchema);

// Insert data
async function importData() {
    try {
        await Tour.insertMany(tours);
        console.log('✅ Data imported successfully!');
        console.log(`Inserted ${tours.length} tours`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

importData();
