import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';

const defaultTheme = createTheme();

const LoginScreen = () => {

  const navigate = useNavigate();
  const { dispatch } = useStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
  
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      });

      const { token, user } = response.data;
      document.cookie = `jwt=${token}; Path=/`;
  
      console.log('Login successful:', response.data.user?.rows[0]);
      console.log('Login successful:', response.data.user?.rows[0].id);
      toast.success('Login is successful!');

      dispatch({ type: 'SET_LOGGED_IN_USER', payload: user?.rows[0] });

      const respNotes = await axios.get('http://localhost:3001/notes', {
        userId: response.data.user?.rows[0].id
      })

      console.log("respNotes",respNotes)

      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error.response.data.error);
      toast.error(error.response.data.error);
    }
  };
    
      return (
         <ThemeProvider theme={defaultTheme}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            
            <Grid item component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Your Username"
                    name="username"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Register here"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
         </ThemeProvider>
      );
}

export default LoginScreen
