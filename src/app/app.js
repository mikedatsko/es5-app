
function App() {
  window.parent.postMessage('FRAME_LOADED','https://jsmeasure.herokuapp.com');
  // var todos = data.read('todos');
  var todos = [];

  for (var i = 0; i < 1000; i++) {
    todos.push({
      text: 'Test',
      checked: false
    });
  }

  data.update('todos', JSON.stringify(todos));

  listTodos.getList();

}
