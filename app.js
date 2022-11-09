if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}



const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Joi = require('joi')
const {campgroundSchema,reviewSchema} = require('./schemas')
const Campground = require('./models/campground')
const { validate } = require('./models/campground')
const Review = require('./models/review')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const MongoDBStore = require('connect-mongo')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')


const session = require('express-session')


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR")
        console.log(err)
    })
    


const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const secret = process.env.SECRET || 'thisisnotasafesecretatall'


const sessionConfig = {
    name: 'session',
    secret: secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        secret: secret,
        touchAfter: 24 * 60 * 60
    })
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/',userRoutes)
app.use('/campgrounds/',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/fakeUser',async(req,res) => {
    const user = new User(
        {email:'colt@gmail.com',username:'colt'})
    const newUser = await User.register(user,'chicken')
    res.send(newUser)
})


app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No!! Something went wrong'
    res.status(statusCode).render('error',{err})
    
})

const port = process.env.PORT || 3000
app.listen(port,() => {
    console.log(`Serving on port ${port}`)
})