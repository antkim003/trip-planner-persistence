$(function() {
    var fn = function(map, marker){
      new Tripplanner([], map, marker, attractions);
    }
    initialize_gmaps(fn);
});
