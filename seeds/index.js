const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR")
        console.log(err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20)+10
        const camp = new Campground({
            author: '635aa7c26325d0ec8dc7861c',
            location : `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem quaerat fugiat perferendis hic, sapiente fuga eum. Illum architecto iure nam.',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dh3wmirf8/image/upload/v1667890606/YelpCampgrounds/avdgvloibxd3hnjprnsr.jpg',
                  filename: 'YelpCampgrounds/avdgvloibxd3hnjprnsr',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dh3wmirf8/image/upload/v1667890606/YelpCampgrounds/zh2miaqdvccs30lxoftv.jpg',
                  filename: 'YelpCampgrounds/zh2miaqdvccs30lxoftv',
                  
                }
              ]
        })
        await camp.save()
    }
}

seedDB().then(() => mongoose.connection.close())