import React from 'react';

const TodoList = (props) => {
  const todoArray = props.todos.map((todo) => {
    return(
      <li className='todo__list-item' key={todo.id}>{todo.content}
        <i onClick={() => {props.deleteTodo(todo.id)}} className="material-icons todo__list-item-delete">cancel</i>
      </li>
    )
  })
  return(
    <ul className='todo__list'>
      {todoArray}
    </ul>
  )
}

export default TodoList;
