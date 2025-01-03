import { AddToDoAction, RemoveToDoAction, EditToDoAction, SubmitToDoAction, SetDeadlineAction } from "./actions/ToDoActions";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { DatePicker } from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [todo, setTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [deadlineReached, setDeadlineReached] = useState(false);
  const dispatch = useDispatch();
  const { todos, workDone } = useSelector(state => state.Todo);

  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      todos.forEach(t => {
        if (t.deadline && new Date(t.deadline) < now) {
          setDeadlineReached(true);
        }
      });
    };

    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTodo) {
      dispatch(EditToDoAction({ ...editingTodo, todo }));
      setEditingTodo(null);
    } else {
      dispatch(AddToDoAction(todo));
    }
    setTodo("");
  };

  const removeHandler = (t) => {
    dispatch(RemoveToDoAction(t));
  };

  const setDeadlineHandler = (id) => {
    dispatch(SetDeadlineAction(id, selectedDate));
    setShowCalendar(false);
    setSelectedDate(null);
  };

  const handleDeadlineClick = (t) => {
    setShowCalendar(true);
    setEditingTodo(t);
  };

  const handleEditClick = (t) => {
    setEditingTodo(t);
    setTodo(t.todo);
  };

  const handleSubmitClick = (t) => {
    dispatch(SubmitToDoAction(t));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input 
          type="text" 
          value={todo} 
          onChange={(e) => setTodo(e.target.value)} 
          placeholder="Add a new task" 
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(t => (
          <li key={t.id} className="todo-item">
            <span className="todo-text">{t.todo}</span>
            <div className="todo-actions">
              <button onClick={() => removeHandler(t)} className="remove-button">Remove</button>
              <button onClick={() => handleEditClick(t)} className="edit-button">Edit</button>
              <button onClick={() => handleDeadlineClick(t)} className="deadline-button">Set Deadline</button>
              <button onClick={() => handleSubmitClick(t)} className="submit-button">Submit</button>
            </div>
            {t.deadline && (
              <span className="deadline-text">Deadline: {new Date(t.deadline).toLocaleDateString()}</span>
            )}
          </li>
        ))}
      </ul>
      {showCalendar && (
        <div className="calendar-popup">
          <DatePicker 
            onChange={setSelectedDate} 
            value={selectedDate} 
          />
          <button onClick={() => setDeadlineHandler(editingTodo.id)} className="set-deadline-button">Set Deadline</button>
        </div>
      )}
      {deadlineReached && (
        <div className="deadline-popup">
          <p>Deadline has been reached!</p>
          <button onClick={() => setDeadlineReached(false)} className="close-button">Close</button>
        </div>
      )}
      <h2>Work Done:</h2>
      <ul>
        {workDone.map(t => (
          <li key={t.id}>{t.todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;