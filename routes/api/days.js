var apiRoute = require('express').Router();
var Models   = require('../../db').models;
var Restaurant = Models.Restaurant;
var Activity = Models.Activity;
var Hotel = Models.Hotel;
var Day   = Models.Day;


// get all days

apiRoute.get('/days', function(req,res,next) {
  
  Day.find().then(function(days) {
    res.json(days);
  });
});

// get data for the day
apiRoute.get('/days/:id', function(req,res,next) {
  console.log(req.params.id);
  Day.findOne({number: req.params.id}).then(function(day) {
    res.json(day);
  });
});

// create a day
apiRoute.post('/days', function(req,res,next) {
  
  Day.count({}).then(function(count) {
    Day.create({
      number: count,
      restaurants: [],
      hotel: null,
      activities: []
    }).then( function(day) {
      console.log(day);
      res.json(day);
    }).then(null, next);
  });
});
// search
apiRoute.get('/search', function(req,res,next) {
  var category = req.body.category;
  var id = req.body.id;

  res.json({
    category: category,
    id: id
  });
});

// adding stuff for that day
apiRoute.post('/days/:id/:restaurants', function(req,res,next) {
  res.json('this worked');
});

apiRoute.post('/days/:id/activities', function(req,res,next) {
  res.json('this worked');
});

apiRoute.post('/days/:id/hotels', function(req,res,next) {
  res.json('this worked');
});

// deleting items off a day
apiRoute.delete('/days/:id/restaurants', function(req,res,next) {
  res.json('this worked');
});

apiRoute.delete('/days/:id/activities', function(req,res,next) {
  res.json('this worked');
});

apiRoute.delete('/days/:id/hotels', function(req,res,next) {
  res.json('this worked');
});

//test route 
apiRoute.get('/', function(req,res,next) {
  res.json('this worked');
});



module.exports = apiRoute;