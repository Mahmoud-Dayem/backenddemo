const Tour = require('./../models/tourModel');

const sendError = (res, status, message) => res.status(status).json({ error: message });

exports.getAllTours = async (req, res) => {
    try {
        const queryObject = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((field) => delete queryObject[field]);



        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const filters = JSON.parse(queryString);

        let query = Tour.find(filters);
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)

        }
        //pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page-1)*limit;

        query = query.skip(skip).limit(limit)
        

        const tours = await query;
        res.status(200).json({
            results:tours.length,
            data: tours,
            requestTime: req.requestTime
        });
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Failed to fetch tours');
    }
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return sendError(res, 400, 'Name and price are required');
    }

    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price < 10) {
        return sendError(res, 400, 'Price must be at least 10');
    }

    next();
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        console.log(newTour);
        return res.status(201).json({ data: newTour });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Failed to create tour');
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        if (!tour) {
            return sendError(res, 404, 'Tour not found');
        }

        return res.status(200).json({ data: tour });
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Invalid tour id');
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!tour) {
            return sendError(res, 404, 'Tour not found');
        }

        return res.status(200).json({ data: tour });
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Failed to update tour');
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            return sendError(res, 404, 'Tour not found');
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Failed to delete tour');
    }
};

exports.checkID = (req, res, next, val) => {
    console.log('id is ', val);
    next();
};
