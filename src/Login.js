import React, { useState, useEffect } from 'react';
import './Login.css'
import axios from 'axios';
import { NavLink, Link, Redirect } from 'react-router-dom';
import { updateToken, token$ } from './Store';
import jwt from 'jsonwebtoken';

const Login = (props) => {
  const source = axios.CancelToken.source();

  const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectTodo, setRediectTodo] = useState(false);
  const [showValidation, setShowValidation] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    return () => {
      source.cancel('request canceled');
    }
  }, [])

  useEffect(() => {
    if(!token$.value){
      return;
    }
    else if(Object.entries(user).length <= 0 && token$.value){
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
    axios.post(`${API_ROOT}/auth`, {email, password}, { cancelToken: source.token })
    .then((res) => {
      const token = res.data.token;
      updateToken(token);
      setRediectTodo(true);
    })
    .catch((thrown) => {
      if(axios.isCancel(thrown)){
        return;
      }
      if(thrown.response.status === 400){
        setShowValidation(thrown.response.data.details[0].message);
      }
      else if(thrown.response.status === 401){
        setShowValidation(thrown.response.data.message);
      }
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
        <div className='header__link-wrapper'>
          <NavLink to='/todo' className='header__link'>{user.email}</NavLink>
        </div>
        <div className='header__link-wrapper'>
          <NavLink exact to='/' className='header__link'>Login</NavLink>
          <NavLink to='/register' className='header__link'>Register</NavLink>
          <button className='header__sign-out-btn' onClick={onLogout}>Sign out</button>
        </div>
      </header> :
      <header>
        <div className='header__link-wrapper'>
        </div>
        <div className='header__link-wrapper'>
          <NavLink exact to='/' className='header__link'>Login</NavLink>
          <NavLink to='/register' className='header__link'>Register</NavLink>
        </div>
      </header>
    }
    <section className='login__content'>
      <div className='login__wrapper'>
        <h3 className='login__title'>Sign in</h3>
        <form className='login__form' onSubmit={handleSubmit}>
          <input className='login__email-input' type='email' placeholder='email' onChange={handleEmail}></input>
          <input className='login__password-input' type='password' placeholder='password' onChange={handlePassword}></input>
          {showValidation ? <span className='login__invalid-msg'>{showValidation}</span> : null}
          <button className='login__login-btn'>Sign in</button>
        </form>
        <div className='login__line-between'>
          <span className='login__line'></span>
          <span className='login__line-text'>or</span>
          <span className='login__line'></span>
        </div>
        <span className='login__register-span'>Don't have an account? <Link className='login__register-link' to='/register'>Sign up here</Link></span>
      </div>
    </section>
  </div>
)
}

export default Login;
