
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../App';

const FloatingAddButton = ({handleClose, handleOpen}) => {
  const { state } = useStore();
  const { loggedInUser } = state;

  
  const visibility = loggedInUser ? 'visible' : 'hidden';

  
  const buttonStyle = {
    position: 'fixed',
    bottom: '2rem',
    left: '80%',
    transform: 'translateX(-50%)',
    zIndex: 9999, 
    visibility, 
  };

  return (
    <Fab
      color="primary"
      aria-label="add"
      style={buttonStyle} 
      onClick={handleOpen}
    >
      <AddIcon />
    </Fab>
  );
};

export default FloatingAddButton;