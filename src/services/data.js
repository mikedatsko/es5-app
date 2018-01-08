function Data() {
  this.create = function(key, data) {
    key = key || prompt('Key:');
    data = data || prompt('Data:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (typeof data === 'undefined') {
      console.error('No data');
      return false;
    }

    localStorage.setItem(key, data);
  }

  this.read = function(key) {
    if (typeof key === 'undefined') {
      console.error('No data');
      return false;
    }

    var data = localStorage.getItem(key);

    if (!data) {
      console.error('No data');
      return false;
    }

    return data;
  }

  this.update = function(key, data) {
    key = key || prompt('Key:');
    data = data || prompt('Data:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (typeof data === 'undefined') {
      console.error('No data');
      return false;
    }

    if (!localStorage.getItem(key)) {
      console.error('No data found');
      return false;
    }

    localStorage.setItem(key, data);
  }

  this.delete = function(key) {
    key = key || prompt('Key:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (!localStorage.getItem(key)) {
      console.error('No data found');
      return false;
    }

    localStorage.removeItem(key);
  }
}

var data = new Data();
