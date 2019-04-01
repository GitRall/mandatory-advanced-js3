import React from 'react';

const AddTodo = (props) => (
    <div className='add-todo__container'>
      <form className='add-todo__form' onSubmit={props.onAddTodo}>
        <input className='add-todo__input' onChange={props.onTodoChange} value={props.value}></input>
        <button className='add-todo__submit-btn'>Add Todo</button>
      </form>
    </div>
  )

export default AddTodo;
