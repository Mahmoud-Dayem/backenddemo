const mongoose = require('mongoose');
const { default: slugify } = require('slugify');




const tourSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        trim:true,
        required: [true, 'A tour must have a name']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: Number,
    difficulty: String,
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: Number,
    price: {
        type:Number,
        required:[true,'Price is a must']
    },
    summary: String,
    description: String,
    imageCover: String,
    images: [String],
    startDates: [String],
    slug: String,
    secretTour:{
        type:Boolean,
        default:false
    }
}, { collection: 'tours' });

tourSchema.pre('save',function(  ){
    this.slug = slugify(this.name,{lower:true,})
   
})

// tourSchema.post('save',function(doc){
//     console.log('❤❤❤🌹🌹🌹🌹🌹',doc)
// })
// query middleware to hide secret tours from public results
tourSchema.pre(/^find/, function () {
    this.find({ secretTour: { $ne: true } });
});
const Tour = mongoose.model('Tour',tourSchema)


module.exports = Tour