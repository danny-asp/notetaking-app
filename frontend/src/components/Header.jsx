import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../App';
import { toast } from 'react-toastify';

const Header = () => {

  const { state, dispatch } = useStore(); 
  const { loggedInUser } = state; 




  const handleLogout = () => {
    dispatch({ type: 'SET_LOGGED_IN_USER', payload: null });
    dispatch({ type: 'SET_USER_NOTES', payload: [] });
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Login is successful! cookie deleted user in store del');
  };

  

  return (
    
      <AppBar  >
            <Toolbar>
                <Typography variant="h6" className='app'>
                My Note App
                </Typography> 
                <Button color="inherit" component={Link} to="/">Home</Button>
                {loggedInUser ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
            </Toolbar>
            
        </AppBar>
    
  )
}

export default Header


