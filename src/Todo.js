import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Todo.css';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import jwt from 'jsonwebtoken';
import { token$, updateToken } from './Store';

const Todo = () => {
  const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000'
  const options = {
    headers: {
      Authorization: `Bearer ${token$.value}`,
    },
  }
  const [redirectHome, setRedirectHome] = useState(false);
  const [user, setUser] = useState({});
  const [addTodo, setAddTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    let token = window.localStorage.getItem('token');
    if(!token){
      setRedirectHome(true);
    }
    else if(Object.entries(user).length <= 0){
      const decoded = jwt.decode(token);
      setUser(decoded);
    }
  })

  useEffect(() => {
    if(todos.length > 0){
      return;
    }
    else{
      axios.get(`${API_ROOT}/todos`, options)
      .then((res) => {
        setTodos(res.data.todos);
      })
      .catch((thrown) => {
        console.log(thrown);
        onLogout();
      })
    }
  })

  function onTodoChange(e){
    setAddTodo(e.target.value);
  }

  function onAddTodo(e){
    e.preventDefault();
    axios.post(`${API_ROOT}/todos`, { content: addTodo }, options)
    .then((res) => {
      axios.get(`${API_ROOT}/todos`, options)
      .then((res) => {
        setTodos(res.data.todos);
        setAddTodo('');
      })
    })
  }
  function onDeleteTodo(id){
    axios.delete(`${API_ROOT}/todos/${id}`, options)
    .then((res) => {
      let todosCopy = [...todos];
      let index = todosCopy.findIndex((todo) => {
        return todo.id === id;
      })
      todosCopy.splice(index, 1);
      setTodos(todosCopy);
    })
  }
  function onLogout(e){
    updateToken(null);
    window.localStorage.removeItem('token');
    setRedirectHome(true);
  }
  if(redirectHome){
    return <Redirect to='/'/>
  }
  return(
    <div className='todo__container'>
      <div className='todo__profile-wrapper'>
        <h2 className='todo__profile-email'><span>Logged in as: </span><br/>{user.email}</h2>
        <button className='todo__logout-btn' onClick={onLogout}>Sign out</button>
      </div>
      <AddTodo onTodoChange={onTodoChange} onAddTodo={onAddTodo} value={addTodo}></AddTodo>
      <TodoList todos={todos} deleteTodo={onDeleteTodo}></TodoList>
    </div>
  )
}

export default Todo;
