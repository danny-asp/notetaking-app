
import { createTheme, ThemeProvider } from '@mui/material';
import { useStore } from '../App';




const defaultTheme = createTheme();

const HomeScreen = () => {
  const { state } = useStore();
  
  
  return (
    <ThemeProvider theme={defaultTheme}>
      {state.userNotes.length>0 ? "length yes" : state.loggedInUser ? "You still have no added notes" : "Please, register or login"}
    </ThemeProvider>
    
  )
}

export default HomeScreen
