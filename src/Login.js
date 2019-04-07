import React, { useState, useEffect } from 'react';
import './Login.css'
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { updateToken, token$ } from './Store';
import jwt from 'jsonwebtoken';

const Login = (props) => {
  const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectTodo, setRediectTodo] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    if(!token$.value){
      console.log('false');
      return;
    }
    else if(Object.entries(user).length <= 0 && token$.value){
      console.log('hej');
      const decoded = jwt.decode(token$.value);
      setUser(decoded);
    }
  })

  function handleEmail(e){
    setEmail(e.target.value);
  }
  function handlePassword(e){
    setPassword(e.target.value);
  }
  function handleSubmit(e){
    e.preventDefault();
    if(email.length <= 0 || password.length <= 0) return;
    axios.post(`${API_ROOT}/auth`, {email, password})
    .then((res) => {
      const token = res.data.token;
      updateToken(token);
      setRediectTodo(true);
    })
    .catch((thrown) => {
      setShowValidation(true);
      console.log('hej');
      console.log(thrown);
    })
  }
  function onLogout(e){
    updateToken(null);
    setUser({});
  }

  if(redirectTodo){
    return <Redirect to='/todo'/>
  }
  return(
    <div className='login__container'>
      {token$.value ? <header>
        <Link to='/todo' className='header__profile-link'>{user.email}</Link>
        <button className='header__sign-out-btn' onClick={onLogout}>Sign out</button>
      </header> : null}
      <div className='login__wrapper'>
        <h3 className='login__title'>Sign in</h3>
        <form className='login__form' onSubmit={handleSubmit}>
          <input className='login__email-input' type='email' placeholder='email' onChange={handleEmail}></input>
          <input className='login__password-input' type='password' placeholder='password' onChange={handlePassword}></input>
          {showValidation ? <span className='login__invalid-msg'>- Email or password is invalid -</span> : null}
          <button className='login__login-btn'>Sign in</button>
        </form>
        <div className='login__line-between'>
          <span className='login__line'></span>
          <span className='login__line-text'>or</span>
          <span className='login__line'></span>
        </div>
        <span className='login__register-span'>Don't have an account? <Link className='login__register-link' to='/register'>Sign up here</Link></span>
      </div>
    </div>
  )
}

export default Login;
