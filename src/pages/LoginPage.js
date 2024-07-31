import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import theme from '../theme';
import Link from '@mui/material/Link';
import logo from '../logo.svg';
import { poolData } from '../aws-config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const UserPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: UserPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.setAuthenticationFlowType('USER_SRP_AUTH');

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('Authentication Successful.', result);
        login();
        navigate('/home');
        displaySnackbar('Login Successful', 'success');
      },
      onFailure: (err) => {
        displaySnackbar(err.message, 'error');
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={1}
        bgcolor="#e6effc"
      >
        <Card
          sx={{ width: '100%', maxWidth: 600, py: 2, borderRadius: '20px' }}
        >
          <CardContent>
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: '400px', height: 'auto' }}
              />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              align="center"
              fontWeight={300}
              sx={{ mb: 3 }}
            >
              Sign in to your account
            </Typography>
            <form onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mb: 2,
                  height: '55px',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  textTransform: 'none',
                  borderRadius: '8px',
                }}
              >
                Login
              </Button>
            </form>
            <Typography variant="body1" align="center">
              Don't have an account?{' '}
              <Link href="/register" color="primary" fontWeight={600}>
                Register
              </Link>{' '}
              here.
            </Typography>
          </CardContent>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
