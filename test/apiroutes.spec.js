var request = require('supertest-as-promised')(require('../app'));
var expect = require('chai').expect;
var db = require('../db');
var seed = require('./seed');
var cheerio = require('cheerio');
var Models   = db.models;
var Restaurant = Models.Restaurant;
var Activity = Models.Activity;
var Hotel = Models.Hotel;
var Day   = Models.Day;


describe('api routes', function () {
  

  describe('day routes', function () {
    it('POST /days - create a day', function () {
      return request.post('/api/days')
        .send({
          activities: [],
          restaurants: [],
          hotel: null
        })
        .expect(200)
        .then(function(res) {
          console.log(res);
          expect(res.text).to.contain('restaurants');
          expect(res.text).to.contain('activities');
          expect(res.text).to.contain('temple');
        });
    });

  });
});