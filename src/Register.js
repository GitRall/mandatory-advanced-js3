import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { NavLink, Link, Redirect } from 'react-router-dom';
import { token$, updateToken } from './Store';
import axios from 'axios';
import './Register.css'

const Register = (props) => {
  const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [redirectHome, setRedirectHome] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState({});

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
  function handleRepeatPassword(e){
    setRepeatPassword(e.target.value);
  }
  function handleSubmit(e){
    e.preventDefault();
    if(!regExEmail.test(email) ||
    password.length < 3 ||
    password !== repeatPassword ||
    repeatPassword.length < 3) return;
    axios.post(`${API_ROOT}/register`, {email, password})
    .then((res) => {
      setRedirectHome(true);
    })
    .catch((thrown) => {
      if(thrown.response.data.message === 'Validation error'){
        setErrorMsg(thrown.response.data.details[0].message)
      }
      else{
        setErrorMsg(thrown.response.data.message);
      }
    })
  }
  function onLogout(e){
    updateToken(null);
    setUser({});
  }
  if(redirectHome){
    return(
      <Redirect to='/' />
    )
  }

  return(
    <div className='register__container'>
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
      <section className='register__content'>
        <div className='register__wrapper'>
          <h3 className='register__title'>Sign up</h3>
          <form className='register__form' onSubmit={handleSubmit}>
            <div className='register__input-wrapper'>
              <label className='register__label'>Email</label>
              <input className='register__input' type='email' onChange={handleEmail}></input>
              <span className='register__helper-text'>Must contain valid email</span>
              {regExEmail.test(email) && email.length > 0 ? <i className="material-icons register__icon">check</i> : null}
            </div>
            <div className='register__input-wrapper'>
              <label className='register__label'>Password</label>
              <input className='register__input' type='password' onChange={handlePassword}></input>
              <span className='register__helper-text'>Must contain atleast 3 characters</span>
              {password.length >= 3 ? <i className="material-icons register__icon">check</i> : null}
            </div>
            <div className='register__input-wrapper'>
              <label className='register__label'>Repeat password</label>
              <input className='register__input' type='password' onChange={handleRepeatPassword}></input>
              <span className='register__helper-text'>Repeat password</span>
              {password === repeatPassword && repeatPassword.length >= 3 ? <i className="material-icons register__icon">check</i> : null}
            </div>
            {errorMsg ? <span className='register__error-msg'>{errorMsg}</span> : null}
            <button className='register__submit-btn' type='submit'>Sign up</button>
          </form>
          <div className='register__line-between'>
            <span className='register__line'></span>
            <span className='register__line-text'>or</span>
            <span className='register__line'></span>
          </div>
          <span className='login__register-span'>Already have an account? <Link className='login__register-link' to='/'>Sign in here</Link></span>
        </div>
      </section>
    </div>
  )
}

export default Register;
