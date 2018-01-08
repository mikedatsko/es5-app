
function ListTodos() {
  var todos = data.read('todos');
  if (!todos) {
    todos = [];
    data.update('todos', JSON.stringify(todos));
  }

  var self = this;

  events.subscribe('get-todos-list', function() {
    self.getList();
  });
}

ListTodos.prototype.getList = function() {
  var self = this;
  var todos = data.read('todos');
  todos = JSON.parse(todos);

  var todosEl = document.getElementById('todo_items');
  todosEl.innerHTML = '';

  var todosBodyEl = markup.create({
    tag: 'tbody',
    parent: todosEl
  });

  if (!todos.length) {
    return false
  }

  todos.forEach(function(todo, index) {
    var todoEl = markup.create({
      tag: 'tr',
      parent: todosBodyEl,
      className: todo.checked ? 'success' : ''
    });

    var todoCellCheckboxEl = markup.create({
      tag: 'td',
      parent: todoEl,
      attrs: [
        { width: '30' }
      ]
    });

    var todoCellTextEl = markup.create({
      tag: 'td',
      parent: todoEl,
      content: todo.text,
      className: todo.checked ? 'checked' : ''
    });

    var todoCellActionsEl = markup.create({
      tag: 'td',
      parent: todoEl,
      attrs: [
        { width: '70' }
      ]
    });

    var todoCheckboxEl = markup.create({
      tag: 'span',
      className: 'glyphicon glyphicon-' + (todo.checked ? 'check' : 'unchecked'),
      parent: todoCellCheckboxEl
    });

    var todoActionEditEl = markup.create({
      tag: 'button',
      attrs: [
        { type: 'button' }
      ],
      className: 'btn btn-info btn-xs',
      content: '<span class="glyphicon glyphicon-pencil"></span>',
      parent: todoCellActionsEl
    });

    var todoActionDeleteEl = markup.create({
      tag: 'button',
      attrs: [
        { type: 'button' }
      ],
      className: 'btn btn-danger btn-xs',
      content: '<span class="glyphicon glyphicon-remove"></span>',
      parent: todoCellActionsEl
    });

    events.on(todoCellCheckboxEl, 'click', function(event) {
      event.preventDefault();
      self.doCheck(todoEl, todoCheckboxEl, todoCellTextEl, todos, todo, index);
    });

    events.on(todoCellTextEl, 'click', function(event) {
      event.preventDefault();
      self.doCheck(todoEl, todoCheckboxEl, todoCellTextEl, todos, todo, index);
    });

    events.on(todoActionDeleteEl, 'click', function(event) {
      self.delete(index, todos);
    });

    events.on(todoActionEditEl, 'click', function(event) {
      events.send('edit-todo-item', {
        todo: todo,
        index: index
      });
    });
  });
};

ListTodos.prototype.doCheck = function(
  todoEl,
  todoCheckboxEl,
  todoCellTextEl,
  todos,
  todo,
  index
) {
  var isChecked = todoCheckboxEl.className === 'glyphicon glyphicon-check'

  if (isChecked) {
    todoEl.className = '';
    todoCheckboxEl.className = 'glyphicon glyphicon-unchecked';
    todoCellTextEl.className = '';
    todo.checked = false;
  } else {
    todoEl.className = 'success';
    todoCheckboxEl.className = 'glyphicon glyphicon-check';
    todoCellTextEl.className = 'checked';
    todo.checked = true;
  }

  todos[index] = todo;
  data.update('todos', JSON.stringify(todos));
  events.send('get-todos-list');
};

ListTodos.prototype.delete = function(index, todos) {
  todos.splice(index, 1);
  data.update('todos', JSON.stringify(todos));
  events.send('get-todos-list');
};

var listTodos = new ListTodos();
