function Events() {
  
}

Events.prototype.on = function(element, eventName, callback) {
  element.addEventListener(eventName, callback, false);
};

Events.prototype.subscribe = function(eventName, callback) {
  document.addEventListener(eventName, callback, false);
};

Events.prototype.send = function(eventName, details) {
  details = details || {};

  var event = new CustomEvent(eventName, {
    detail: details
  });

  document.dispatchEvent(event);
};

Events.prototype.deleteEvent = function() {
  document.removeEventListener(eventName, callback, false);
};

var events = new Events();
