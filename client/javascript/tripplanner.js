/* globals $,Mapper */ 

function Tripplanner(days, map, perm, attractions){
  this.currentIdx = 0;
  this.mapper = new Mapper(map, perm);
  this.days = days;
  this.attractions = attractions;
  if(this.days.length === 0)
    this.addDay();
  this.init();
  this.renderDayPicker(0);
}

Tripplanner.prototype.addDay = function(){
    this.days.push(
        {
          Hotels: [],
          Restaurants: [],
          Activities: []
        }
    );
    return this.days.length - 1;
};


Tripplanner.prototype.init = function(){
  var that = this;
  $('#dayPicker').on('click', 'li', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    that.currentIdx = $(this).index();
    that.renderDay();
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
    return this.attractions[category].filter(function(_item){
      return _item._id == id;
    })[0];
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
    this.currentIdx = idx;

    $('#dayPicker').empty();
    this.days.forEach(function(day, index){
      var link = $('<a />').html(index + 1);
      var li = $('<li />').append(link);
      if(idx === index)
        li.addClass('active');
      $('#dayPicker').append(li);
    });
    this.renderDay();
};

Tripplanner.prototype.renderDay = function(){
    this.resetLists();

    if(this.currentIdx === null)
      return;

    var day = this.days[this.currentIdx];
    this.categoryIterator(function(category){
      var ids = day[category];
      ids.forEach(function(id){
        var item = this.findItemByIdAndCategory(id, category);
        this.renderItem(item);
      }, this);
    });
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
