const express = require('express');


const parseId = (req) => parseInt(req.params.id, 10);
const sendError = (res, status, message) => res.status(status).json({ error: message });
 

 const controller = require('../controllers/tourController')
 const authController = require('../controllers/authController')
 
// tour router                                        tour router 👀

const router = express.Router();
// router.param('id',controller.checkID)

 
router.route('/')
    .get(authController.protect,authController.restrictTo('admin','lead-guide'),controller.getAllTours)
    .post(authController.protect,controller.checkBody,controller.createTour);

router.route('/:id')
    .get(controller.getTourById)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);
 

 
 
module.exports = router;
