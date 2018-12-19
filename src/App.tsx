import React, { Component } from "react";

const actionTypes = {
  edit: "edit",
  add: "add",
  remove: "remove",
  filter: "filter",
  resetFilter: "resetFilter",
  check: "check"
};

type TodoType = {
  id: number;
  name: string;
  checked: boolean;
  filtered?: boolean;
};

type Action = {
  type: string;
  item: TodoType;
};

function todosReducer(initialState = new Array<TodoType>(), action: Action) {
  switch (action.type) {
    case actionTypes.add:
      return initialState.concat(action.item);
    case actionTypes.edit:
      return initialState.map(
        (item) => (item.id === action.item.id ? action.item : item)
      );
    case actionTypes.remove:
      return initialState.filter((item) => item.id !== action.item.id);
    case actionTypes.check:
      return initialState.map(
        (item) => (item.id === action.item.id ? action.item : item)
      );
    case actionTypes.resetFilter:
      return initialState.map((item) => ({
        ...item,
        filtered: false
      }));
    case actionTypes.filter:
      return initialState.map((item) => ({
        ...item,
        filtered: !item.name.includes(action.item.name)
      }));
    default:
      return initialState;
  }
}

type TodoProps = {
  onRemove: (todo: TodoType) => void;
  onEdit: (todo: TodoType) => void;
  onCheck: (todo: TodoType) => void;
  todo: TodoType;
};

const Todo = ({ todo, onRemove, onEdit, onCheck }: TodoProps) => (
  <div>
    <button onClick={() => onEdit(todo)}>Edit</button>
    <button onClick={() => onRemove(todo)}>Remove</button>
    <button onClick={() => onCheck(todo)}>Check</button>
    {todo.name}
    <input type="checkbox" checked={todo.checked} />
  </div>
);

type State = {
  todos: TodoType[];
  search: string;
};

class App extends Component<{}, State> {
  state = {
    todos: new Array<TodoType>(),
    search: ""
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: e.currentTarget.value });
  };

  handleAction = (action: Action) => {
    this.setState({ todos: todosReducer(this.state.todos, action) });
  };

  render() {
    return (
      <div>
        <input onChange={this.handleChange} />
        <button
          onClick={() =>
            this.handleAction({
              type: actionTypes.add,
              item: {
                id: Math.random(),
                name: `Todo №${Math.random()}`,
                checked: false
              }
            })
          }
        >
          Add todo
        </button>
        <button
          onClick={() =>
            this.handleAction({
              type: actionTypes.resetFilter,
              item: {
                id: Math.random(),
                name: "",
                checked: false
              }
            })
          }
        >
          Reset filter
        </button>
        <button
          onClick={() =>
            this.handleAction({
              type: actionTypes.filter,
              item: {
                id: Math.random(),
                name: this.state.search,
                checked: false
              }
            })
          }
        >
          Filter
        </button>
        {this.state.todos.filter((todo) => !todo.filtered).map((todo) => (
          <Todo
            onRemove={(todo) =>
              this.handleAction({
                item: todo,
                type: actionTypes.remove
              })
            }
            onEdit={(todo) =>
              this.handleAction({
                item: { ...todo, name: `New name Todo №${todo.name}` },
                type: actionTypes.edit
              })
            }
            onCheck={(todo) =>
              this.handleAction({
                item: { ...todo, checked: !todo.checked },
                type: actionTypes.check
              })
            }
            key={todo.id}
            todo={todo}
          />
        ))}
      </div>
    );
  }
}

export default App;
