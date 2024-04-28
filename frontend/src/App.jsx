import  {useEffect, createContext, useReducer, useContext, useState } from 'react';
import './App.css'
import { Outlet } from "react-router-dom";
import axios from 'axios';

import Header from './components/Header';
import { Container } from '@mui/material';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FloatingAddButton from './components/FloatingAddButton';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
const StoreContext = createContext();

const initialState = {
  loggedInUser: null,
  userNotes: [],
};


const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN_USER':
      return { ...state, loggedInUser: action.payload };
      case 'SET_USER_NOTES':
        return { ...state, userNotes: action.payload };
    default:
      return state;
  }
};

export const useStore = () => useContext(StoreContext);

const STORAGE_KEY = 'my_app_state';



function App() {

  
  const persistedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const [state, dispatch] = useReducer(reducer,persistedState || initialState);
 
  // modal
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setOpen(false);
  };
  
  const handleSave = async() => {
    const user = state.loggedInUser.id
    
    try {
      const response = await axios.post('http://localhost:3001/notes', {
        title,
        content,
        userId: user, // assuming your backend expects userId, not user
      });
      console.log(response.data.message); // log success message
      dispatch({ type: 'ADD_NOTE', payload: { title, content } });
      setTitle('');
      setContent('');
      handleClose();
      toast.success('A new note is successfully created!');
      fetchUserNotes();
    } catch (err) {
      console.error('Error creating a note', err.response.data.error); // log error message
      // Handle error in your UI, e.g., show a message to the user
    }
  };

   const fetchUserNotes = async () => {
    const userId = state.loggedInUser.id;
    console.log("userid", userId)
    console.log("FETCH STARTED", userId)
    try {
      const response = await axios.get(`http://localhost:3001/notes/${userId}`);
      console.log("resp", response.data);
      if (state.loggedInUser) {
        dispatch({ type: 'SET_USER_NOTES', payload: response.data });
      }
      
    } catch (err) {
      console.error('Error fetching user notes', err.response.data.error);
    }
  };

  useEffect(() => {
    if (state.loggedInUser) {
      fetchUserNotes();
    }
  }, [state.loggedInUser]);

  console.log(state)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <ToastContainer />
      <Container className='header' sx={{position:"absolute", top:0, left:0, width:"100%"}}>
        <Header />
      </Container>
      <Container className='main' sx={{paddingY:"5rem"}}>
        <Outlet/>
      </Container>
      {!open && <FloatingAddButton handleClose={handleClose} handleOpen={handleOpen}/>}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleClose}>Cancel</Button>
          
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StoreContext.Provider>
  )
}

export default App
