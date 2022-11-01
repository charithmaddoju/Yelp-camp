const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {campgroundSchema,reviewSchema} = require('../schemas')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')



// router.get('/', (req,res) => {
//     // res.send("HELLO FROM YELPCAMP")
//     res.render('home')
// })

router.route('/')
.get(catchAsync(campgrounds.index))
.post( isLoggedIn ,validateCampground ,catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn ,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn ,validateCampground ,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn ,isAuthor ,catchAsync(campgrounds.renderEditCampground))


module.exports = router