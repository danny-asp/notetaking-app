import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../App';

const FloatingAddButton = ({handleClose, handleOpen}) => {
  const { state } = useStore();
  const { loggedInUser } = state;

  // Toggle visibility based on loggedInUser
  const visibility = loggedInUser ? 'visible' : 'hidden';

  // Style for the button
  const buttonStyle = {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999, // Ensure it's above other content
    visibility, // Toggle visibility
  };

  return (
    <Fab
      color="primary"
      aria-label="add"
      style={buttonStyle} // Apply inline styles
      onClick={handleOpen}
    >
      <AddIcon />
    </Fab>
  );
};

export default FloatingAddButton;