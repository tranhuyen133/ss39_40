import React, { useReducer, useEffect } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  name: string;
}

export default function TodoList() {
  // Khai báo state trước
  const initial = {
    todos: [],
    isloading: false,
    todo: {
      id: 0,
      name: '',
      status: false,
    },
  };

  // Khởi tạo hàm useReducer
  const reducer = (state: any = initial, action: any) => {
    switch (action.type) {
      case 'CHANGE-INPUT':
        return {
          ...state,
          todo: {
            ...state.todo,
            name: action.payload,
          },
        };
      case 'HANDLE-ADD':
        const existingTodoIndex = state.todos.findIndex((todo: Todo) => todo.id === action.payload.id);
        let updatedTodos;
        if (existingTodoIndex >= 0) {
          updatedTodos = state.todos.map((todo: Todo, index: number) => 
            index === existingTodoIndex ? action.payload : todo
          );
        } else {
          updatedTodos = [...state.todos, { ...action.payload, id: Date.now() }];
        }
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        return { ...state, todos: updatedTodos, todo: initial.todo };
      case 'LOAD-TODOS':
        return { ...state, todos: action.payload };
      case 'HANDLE-DELETE':
        const filteredTodos = state.todos.filter((todo: Todo) => todo.id !== action.payload);
        localStorage.setItem('todos', JSON.stringify(filteredTodos));
        return { ...state, todos: filteredTodos };
      case 'HANDLE-FIX':
        return { ...state, todo: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initial);

  // lấy giá trị ô input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    dispatch(action('CHANGE-INPUT', inputValue));
  };

  // khởi tao hàm tạo action
  const action = (type: string, payload: any): any => {
    return {
      type: type,
      payload: payload,
    };
  };

  // khai báo hàm thêm công việc
  const handleAdd = () => {
    if (state.todo.name.trim() === '') return;
    dispatch(action('HANDLE-ADD', state.todo));
  };

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      dispatch(action('LOAD-TODOS', JSON.parse(savedTodos)));
    }
  }, []);

  // xoá
  const handleDelete = (id: number) => {
    dispatch(action('HANDLE-DELETE', id));
  };

  // sửa
  const handleFix = (todo: Todo) => {
    dispatch(action('HANDLE-FIX', todo));
  };

  return (
    <div className="container">
      <div className="input-container">
        <input 
          value={state.todo.name} 
          onChange={handleChange} 
          type="text" 
          className="input" 
          placeholder="Nhập công việc"
        />
        <button onClick={handleAdd} className="add-button">
          {state.todo.id === 0 ? 'Thêm' : 'Sửa'}
        </button>
      </div>
      <p>Danh sách công việc</p>
      <ul className="list">
        {state.todos.map((item: Todo) => (
          <li key={item.id} className="list-item">
            {item.name} 
            <div>
              <button onClick={() => handleFix(item)} className="fix-button">Sửa</button> 
              <button onClick={() => handleDelete(item.id)} className="delete-button">Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
