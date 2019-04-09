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
  const source = axios.CancelToken.source();
  const options = {
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${token$.value}`,
    }
  }

  const [redirectHome, setRedirectHome] = useState(false);
  const [user, setUser] = useState({});
  const [addTodo, setAddTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
      axios.get(`${API_ROOT}/todos`, options)
      .then((res) => {
        console.log(res);
        setTodos(res.data.todos);
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log('canceled')
          return;
        }
        console.log(thrown);
        setErrorMsg(true);
      })
      return () => {
        console.log('unmounting');
        source.cancel('Data request canceled');
      }
  }, [])

  useEffect(() => {
    if(!token$.value){
      setRedirectHome(true);
    }
    else if(Object.entries(user).length <= 0){
      const decoded = jwt.decode(token$.value);
      setUser(decoded);
    }
  })

  // useEffect(() => {
  //   if(todos.length > 0) return;
  //   else if(Object.keys(user).length === 0) return;
  //   else{
  //     axios.get(`${API_ROOT}/todos`, options)
  //     .then((res) => {
  //       console.log(res);
  //       setTodos(res.data.todos);
  //     })
  //     .catch((thrown) => {
  //       console.log(thrown);
  //       setErrorMsg(true);
  //     })
  //   }
  // })


  function onTodoChange(e){
    setAddTodo(e.target.value);
  }

  function onAddTodo(e){
    e.preventDefault();
    if(addTodo.length <= 0) return;
    axios.post(`${API_ROOT}/todos`, { content: addTodo }, options)
    .then((res) => {
      axios.get(`${API_ROOT}/todos`, options)
      .then((res) => {
        setTodos(res.data.todos);
        setAddTodo('');
      })
    })
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('canceled')
        return;
      }
      console.log(thrown);
      setErrorMsg(true);
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
    setRedirectHome(true);
  }

  if(redirectHome){
    return <Redirect to='/'/>
  }

  return(
    <div className='todo__container'>
      <header>
        <h2 className='header__profile-email'>{user.email}</h2>
        <button className='header__sign-out-btn' onClick={onLogout}>Sign out</button>
      </header>
      <AddTodo onTodoChange={onTodoChange} onAddTodo={onAddTodo} value={addTodo}></AddTodo>
      {errorMsg ? <span className='todo__error-msg'>Something went wrong, please sign out and try again later</span> : null}
      <TodoList todos={todos} deleteTodo={onDeleteTodo}></TodoList>
    </div>
  )
}

export default Todo;
