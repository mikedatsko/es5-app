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

function Markup() {
  
}

Markup.prototype.create = function(options) {
  // tag
  // content
  // parent
  // className
  // id
  // callback

  var optionsDefault = {
    tag: 'div',
    content: '',
    parent: 'body',
    className: '',
    id: '',
    callback: undefined,
    attrs: []
  };

  options = options || {};

  for(var i in optionsDefault) {
    if (!options.hasOwnProperty(i)) {
      options[i] = optionsDefault[i];
    }
  }

  var element;

  if (options.tag === 'input#checkbox') {
    element = document.createElement('input');
    element.type = 'checkbox';
    element.value = 1;
  } else {
    element = document.createElement(options.tag);
  }

  element.innerHTML = options.content;

  if (options.className) {
    element.className += options.className;
  }

  if (options.id) {
    element.id = options.id;
  }

  if (options.tag === 'form') {
    element.action = 'javascript:void(0)';
    element.method = 'post';
  }

  if (options.attrs.length) {
    options.attrs.forEach(function(attr) {
      for (var name in attr) {
        switch (name) {
          default:
            element[name] = attr[name];
            break;
        }
      }
    });
  }

  if (options.parent) {
    var prnt = typeof options.parent === 'string'
      ? document.querySelector(options.parent)
      : options.parent;

    if (!prnt) {
      console.error('No element found');
      return false;
    }
    prnt.appendChild(element);
  } else {
    document.body.appendChild(element);
  }
  return element;
};

Markup.prototype.update = function(query, content) {
  var elements = this.find(query);
  elements[0].innerHTML = content;
};

Markup.prototype.delete = function(query) {
  var elements = this.find(query);
  elements[0].remove();
};

Markup.prototype.find = function(query) {
  var elements = document.querySelectorAll(query);
  return elements;
};

var markup = new Markup();

function getId() {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var id = '';

  for (var i = 0; i < 6; i++ ) {
    id += letters[Math.floor(Math.random() * 26)];
  }
  return id;
}


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


function App() {
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
  window.parent.postMessage('FRAME_LOADED','http://localhost:3000');
}

// native
// jquery
// backbone
// angular

var app = new App();
