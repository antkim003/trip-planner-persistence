/* globals $,Mapper */ 

function Tripplanner(days, map, perm, attractions){
  this.currentIdx = 0;
  this.mapper = new Mapper(map, perm);
  this.days = days;
  this.attractions = attractions;
  // if(this.days.length === 0)
  //   this.addDay();
  this.init();
  this.renderDayPicker(0);
}

Tripplanner.prototype.addDay = function(idx){
    var self = this;
    $.ajax({
        method: 'POST',
        url: '/api/days',
        data: {
          day: this.days.length
        },
        success: function (responseData) {
          console.log('successful Add day', responseData);
          self.renderDayPicker(self.days.length);

        },
        error: function (error) {
          console.err(error);
        }
    });
    
};

// EVENT BINDERS
Tripplanner.prototype.init = function(){
  var that = this;
  $('#dayPicker').on('click', 'li', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    that.currentIdx = $(this).index();
    that.renderDay(that.currentIdx);
  });

  this.dayListIterator(function(list){
    var that = this;
    list.on('click', 'li', function(){
      var id = $(this).attr('data-id');
      var category = $(this).attr('data-category');
      var item = that.findItemByIdAndCategory(id, category);
      $(this).remove();
      that.removeItemFromDay(item);
    });
  });

  this.categoryIterator(function(category){
    var btn = $('#' + category + 'Add');
    var that = this;

    btn.click(function(){
      debugger;
      var selector = that.getChooser(category);
      if(that.days.length === 0 || !selector.val())
        return;
      var item = that.findItemByIdAndCategory(selector.val(), category);
      that.days[that.currentIdx][category].push(item._id);
      that.renderItem(item);
    });
  });

  $('#dayAdder').click(function(){
    that.renderDayPicker(that.addDay());
  });

  $('#dayRemover').click(function(){
    that.days.splice(that.currentIdx, 1);
    that.renderDayPicker(that.days.length > 0 ? 0: null);
  });
};

Tripplanner.prototype.findItemByIdAndCategory = function(id, category){
    // return this.attractions[category].filter(function(_item){
    //   return _item._id == id;
    // })[0];
    debugger;
    $.ajax({
      url: 'api/search',
      method: 'GET',
      data: {
        id: id,
        category: category
      },
      success: function(successData){
        console.log('successful finditembyidandcategory', successData);
        debugger;
        return successData;
      },
      error: function(err){
        console.error('there was an error with findItemByIdAndCategory', err);
      }
    })
};

Tripplanner.prototype.categoryIterator = function(fn){
  fn = fn.bind(this);
  ['Hotels', 'Restaurants', 'Activities'].forEach(fn);
};

Tripplanner.prototype.getChooser = function(category){
    return $('#' + category + 'Chooser');
};

Tripplanner.prototype.chooserIterator = function(fn){
  this.categoryIterator(function(cat){
      fn(this.getChooser(cat));
  });
};

Tripplanner.prototype.getDayList = function(category){
    return $('#dayList' + category );
};

Tripplanner.prototype.dayListIterator = function(fn){
    this.categoryIterator(function(cat){
        fn(this.getDayList(cat));
    });
};

Tripplanner.prototype.resetLists = function(){
    this.dayListIterator(function(dayList){
      dayList.empty();
    });

    this.chooserIterator(function(chooser){
      chooser.children().removeClass('hidden').show();
    });
    this.mapper.reset();
};

Tripplanner.prototype.hideItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.hide().addClass('hidden');
    var sibs = option.siblings(':not(.hidden)');
    if(sibs.length)
      chooser.val(sibs[0].value);
    else 
      chooser.val(null);
};

Tripplanner.prototype.showItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.show().removeClass('hidden');
};

Tripplanner.prototype.removeItemFromDay = function(item){
    this.showItemInChooser(item);
    var collection = this.days[this.currentIdx][item.category]; 
    var idx = collection.indexOf(item._id);
    collection.splice(idx, 1);
    this.mapper.removeMarker(item);
};

Tripplanner.prototype.renderDayPicker = function(idx){
    var self = this;
    this.currentIdx = idx;

    $.ajax({
        method: 'GET',
        url: '/api/days',
        success: function (responseData) {
          console.log('successful Add day', responseData);
          $('#dayPicker').empty();
          self.days.push(responseData);
          responseData.forEach(function(day, index){
            var link = $('<a />').html(day.number + 1);
            link.attr('data', day.number).attr('id', 'dayLink');
            var li = $('<li />').append(link);
            if(idx === index)
              li.addClass('active');
            $('#dayPicker').append(li);
          });
          self.renderDay(idx);
        },
        error: function (errorObj) {
            // some code to run if the request errors out
        }
    });

};

Tripplanner.prototype.renderDay = function(currentIndex){
    this.resetLists();
    var self = this;
    if(this.currentIdx === null)
      return;
    $.ajax({
      method: 'GET',
      url: '/api/days/' + currentIndex,
      success: function(responseData) {
        var day = responseData;
        self.categoryIterator(function(category){
          var objKey = {
            Hotels: 'hotel',
            Restaurants: 'restaurants',
            Activities: 'activity'
          };
          var categoryItems = day[objKey[category]];
          if (!categoryItems) categoryItems = [];

          categoryItems.forEach(function(item){
            if (!item) {
              self.renderItem(item);  
            }
            
          }, self);
        });
      },
      error: function(err) {

      }
    })

};

Tripplanner.prototype.renderItem = function(item){
    var list = this.getDayList(item.category);
    var li = $('<li />').addClass('list-group-item');
    li.attr('data-id', item._id);
    li.attr('data-category', item.category);
    li.html(item.name);
    list.append(li);
    this.hideItemInChooser(item);
    this.mapper.addMarker(item);
};
