
function AddTodo() {
  var self = this;
  var row = markup.create({
    className: 'row',
    parent: '#todo_add'
  });

  var cell = markup.create({
    className: 'col-lg-12',
    parent: row
  });
  
  var form = markup.create({
    tag: 'form',
    attrs: [
      { action: 'javascript:void(0)' },
      { method: 'POST' }
    ],
    parent: cell
  });
  
  var inputGroup = markup.create({
    className: 'input-group',
    parent: form
  });

  var addField = markup.create({
    tag: 'input',
    attrs: [
      { type: 'text' },
      { placeholder: 'Todo text...' }
    ],
    className: 'form-control',
    parent: inputGroup
  });

  var buttonGroup = markup.create({
    tag: 'span',
    className: 'input-group-btn',
    parent: inputGroup
  });

  var addButton = markup.create({
    tag: 'button',
    attrs: [
      { type: 'submit' }
    ],
    content: 'Add',
    className: 'btn btn-primary',
    parent: buttonGroup
  });

  events.on(form, 'submit', function(event) {
    event.preventDefault();
    self.add(form, addField, addButton);
  });

  events.subscribe('edit-todo-item', function(event) {
    var details = event.detail;

    if (!details.todo) { return }

    self.edit(form, addField, addButton, details);
  });
}

AddTodo.prototype.add = function(form, addField, addButton) {
  var todos = data.read('todos');
  if (!todos) {
    todos = [];
    data.create('todos', JSON.stringify([]));
  } else {
    todos = JSON.parse(todos);
  }

  if (form.type && form.type.value === 'save' && form.index) {
    todos[+form.index.value].text = addField.value;
    form.type.remove();
    form.index.remove();
  } else {
    todos.push({
      text: addField.value,
      checked: false
    });
  }

  addButton.innerHTML = 'Add';

  data.update('todos', JSON.stringify(todos));

  form.reset();

  events.send('get-todos-list');
};

AddTodo.prototype.edit = function(form, addField, addButton, details) {
  if (!form.type) {
    var typeField = markup.create({
      tag: 'input',
      attrs: [
        { type: 'hidden' },
        { name: 'type' },
        { value: 'save' }
      ],
      className: 'form-control',
      parent: form
    });
  } else {
    form.type.value = 'save';
  }

  if (!form.index) {
    var indexField = markup.create({
      tag: 'input',
      attrs: [
        { type: 'hidden' },
        { name: 'index' },
        { value: details.index }
      ],
      className: 'form-control',
      parent: form
    });
  } else {
    form.index.value = details.index;
  }

  addButton.innerHTML = 'Save';
  addField.value = details.todo.text;
};

var addTodo = new AddTodo();
