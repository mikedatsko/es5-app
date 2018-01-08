function getId() {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var id = '';

  for (var i = 0; i < 6; i++ ) {
    id += letters[Math.floor(Math.random() * 26)];
  }
  return id;
}
