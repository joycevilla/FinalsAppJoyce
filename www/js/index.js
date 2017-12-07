"use strict";

var TodoList = React.createClass({
  displayName: "TodoList",
  getInitialState: function getInitialState() {
    return {
      todos: [{
        name: 'Movie Night',
        date: new Date(),
        priority: 1,
        done: false
      }],
      complete: false
    };
  },
  addTodo: function addTodo(todo) {
    this.state.todos.push(todo);
    this.setState({
      todos: this.state.todos
    });
  },
  delete: function _delete(toDelete) {
    _.remove(this.state.todos, function (todo) {
      return todo.date === toDelete;
    });
    this.setState({ todos: this.state.todos });
  },
  renderTodos: function renderTodos(deleteTodo, toggleComplete, _changePriority) {
    return this.state.todos.map(function (todo) {
      return React.createElement(TodoItem, {
        name: todo.name,
        priority: todo.priority,
        date: todo.date,
        done: todo.done,
        "delete": deleteTodo,
        toggle: toggleComplete,
        changePriority: _changePriority
      });
    });
  },
  changePriority: function changePriority(inc, date) {
    this.state.todos.forEach(function (todo) {
      if (todo.date === date) {
        inc ? todo.priority++ : todo.priority--;
      }
    });
    this.state.todos = _.sortBy(this.state.todos, ["priority"]).reverse();
    this.setState({ todos: this.state.todos });
  },
  _toggleComplete: function _toggleComplete(date) {
    var status = undefined;
    this.state.todos.forEach(function (todo) {
      if (todo.date === date) {
        todo.done = !todo.done;
      }
      status = todo.done;
    });
    this.setState({
      complete: status ? true : false,
      toDelete: date,
      todos: this.state.todos
    });
  },
  _completeTask: function _completeTask(remove) {
    var _this = this;

    if (remove) this.delete(this.state.toDelete);else {
      this.state.todos.forEach(function (todo) {
        if (todo.date === _this.state.toDelete) {
          todo.priority = 0;
        }
      });
    };
    this.state.todos = _.sortBy(this.state.todos, ["priority"]).reverse();
    this.setState({
      complete: false,
      toDelete: null,
      todos: this.state.todos
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "todoList" },
      React.createElement(
        "h1",
        null,
        React.createElement("img", { className: "reactLogo", src: "http://red-badger.com/blog/wp-content/uploads/2015/04/react-logo-1000-transparent.png" }),
        "Planner"
      ),
      React.createElement(Complete, { complete: this.state.complete, _remove: this._completeTask.bind(this, true), _keep: this._completeTask.bind(this, false) }),
      React.createElement(
        "ul",
        { className: "list-group" },
        this.renderTodos(this.delete, this._toggleComplete.bind(this), this.changePriority.bind(this))
      ),
      React.createElement(Add, { addTodo: this.addTodo })
    );
  }
});

var Complete = React.createClass({
  displayName: "Complete",
  render: function render() {
    var style = {
      display: this.props.complete ? 'initial' : 'none'
    };
    return React.createElement(
      "div",
      { style: style, className: "complete animated fadeIn" },
      React.createElement("span", { className: "fa fa-thumbs-up" }),
      React.createElement(
        "h3",
        null,
        "Great Job!"
      ),
      React.createElement(
        "button",
        { onClick: this.props._keep, className: "btn keep" },
        "Keep"
      ),
      React.createElement(
        "button",
        { onClick: this.props._remove, className: "btn remove" },
        "Delete"
      )
    );
  }
});

var TodoItem = React.createClass({
  displayName: "TodoItem",
  _toggle: function _toggle() {
    this.props.toggle(this.props.date);
  },
  _changePriority: function _changePriority(inc, date) {
    this.props.changePriority(inc, date);
  },
  render: function render() {
    var style = {
      color: this.props.done ? 'green' : 'red'
    };
    var hidePlus = {
      visibility: this.props.priority > 4 || this.props.done ? 'hidden' : 'initial'
    };
    var hideMinus = {
      visibility: this.props.priority < 1 || this.props.done ? 'hidden' : 'initial'
    };
    var priorityColor = {
      0: 'gray',
      1: 'blue',
      2: 'green',
      3: 'gold',
      4: 'orange',
      5: 'red'
    };
    var color = {
      'background-color': priorityColor[this.props.priority]
    };
    return React.createElement(
      "li",
      { className: "list-group-item" },
      React.createElement(
        "span",
        { className: "priority" },
        React.createElement("a", { style: hideMinus, className: "fa fa-minus", onClick: this._changePriority.bind(this, false, this.props.date) }),
        React.createElement(
          "span",
          { style: color, className: "badge" },
          this.props.priority
        ),
        React.createElement("a", { style: hidePlus, className: "fa fa-plus", onClick: this._changePriority.bind(this, true, this.props.date) })
      ),
      React.createElement(
        "span",
        { style: style, className: "todoName" },
        this.props.name
      ),
      React.createElement("i", { className: "fa fa-close", onClick: this.props.delete.bind(this, this.props.date) }),
      React.createElement("i", { className: "fa fa-check", onClick: this._toggle })
    );
  }
});

var Add = React.createClass({
  displayName: "Add",
  getInitialState: function getInitialState() {
    return { name: '' };
  },
  _submit: function _submit(e) {
    e.preventDefault();
    if (this.state.name.length < 1) return;
    this.props.addTodo({
      name: this.state.name,
      date: new Date(),
      priority: 1,
      done: false
    });
    this.setState({ name: '' });
  },

  _input: function _input(e) {
    this.setState({ name: e.target.value });
  },
  render: function render() {
    return React.createElement(
      "form",
      { onSubmit: this._submit },
      React.createElement(
        "div",
        { className: "input-group" },
        React.createElement("input", {
          className: "form-control",
          type: "text",
          placeholder: "Add a todo",
          value: this.state.name,
          onChange: this._input
        }),
        React.createElement(
          "span",
          { className: "input-group-btn" },
          React.createElement("input", {
            className: "btn btn-default",
            type: "submit",
            value: "ADD"
          })
        )
      )
    );
  }
});

React.render(React.createElement(TodoList, null), document.getElementById("TodoApp"));