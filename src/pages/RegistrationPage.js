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
  Link,
  Grid,
  Avatar,
  CircularProgress,
} from '@mui/material';
import theme from '../theme';
import logo from '../logo.svg';
import { poolData } from '../aws-config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { useNavigate } from 'react-router-dom';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from '../utils/FormValidations';
import { uploadUserImage } from '../resources/APIServices';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleNameChange = (newValue) => {
    setName(newValue);
    setFormErrors((errors) => ({
      ...errors,
      name: validateName(newValue),
    }));
  };

  const handleEmailChange = (newValue) => {
    setEmail(newValue);
    setFormErrors((errors) => ({
      ...errors,
      email: validateEmail(newValue),
    }));
  };

  const handlePasswordChange = (newValue) => {
    setPassword(newValue);
    setFormErrors((errors) => ({
      ...errors,
      password: validatePassword(newValue),
    }));
  };

  const handleConfirmPasswordChange = (password, newValue) => {
    setFormErrors((errors) => ({
      ...errors,
      confirmPassword: validateConfirmPassword(password, newValue),
    }));
  };

  const handlePhoneChange = (newValue) => {
    setPhone(newValue);
    setFormErrors((errors) => ({
      ...errors,
      phone: validatePhoneNumber(newValue),
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setProfileImage(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    try {
      reader.onload = async () => {
        const base64data = reader.result.split(',')[1];
        const url = await uploadUserImage(file.name, base64data);
        setImageUrl(url);
        console.log('File uploaded successfully:', imageUrl);
      };
      reader.onerror = () => {
        throw new Error('Error reading file.');
      };
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const hasErrors = Object.values(formErrors).some(
      (errorMessage) => errorMessage !== ''
    );

    if (!hasErrors) {
      const client = new CognitoIdentityProviderClient({
        region: 'us-east-1',
      });
      const input = {
        ClientId: poolData.ClientId,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'name', Value: name }],
        ValidationData: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'phone', Value: phone },
          { Name: 'imageUrl', Value: imageUrl },
        ],
      };
      console.log('Input:', input);
      try {
        const command = new SignUpCommand(input);
        const response = await client.send(command);
        displaySnackbar('Account Created Successfully', 'success');
        console.log('Response: ' + response);
        navigate('/');
      } catch (err) {
        displaySnackbar('Error Creating an Account', 'error');
      }
    } else {
      displaySnackbar('Please enter all Required Details', 'error');
    }
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
              sx={{ mb: 2 }}
            >
              Create a new Account
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={(e) => handleNameChange(e.target.value)}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={(e) => handleEmailChange(e.target.value)}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                required
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={(e) => handlePasswordChange(e.target.value)}
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    onChange={(e) =>
                      handleConfirmPasswordChange(password, e.target.value)
                    }
                    onBlur={(e) =>
                      handleConfirmPasswordChange(password, e.target.value)
                    }
                    error={Boolean(formErrors.confirmPassword)}
                    helperText={formErrors.confirmPassword}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Phone"
                type="tel"
                variant="outlined"
                fullWidth
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={(e) => handlePhoneChange(e.target.value)}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone}
                sx={{ mb: 2 }}
              />
              <Box display="flex" alignItems="center" mb={2}>
                <Button
                  component="label"
                  variant="contained"
                  size="large"
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  Upload Profile Photo
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png"
                  />
                </Button>
                {loading ? (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                ) : imageUrl ? (
                  <Avatar
                    src={imageUrl}
                    alt="Uploaded Image"
                    variant="rounded"
                    sx={{ width: 45, height: 45, ml: 2 }}
                  />
                ) : (
                  <Typography
                    sx={{ ml: 2, flexGrow: 1, wordBreak: 'break-all' }}
                  >
                    {profileImage || 'No file chosen'}
                  </Typography>
                )}
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  height: '55px',
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  textTransform: 'none',
                  borderRadius: '8px',
                  mb: 2,
                }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </form>
            <Typography variant="body1" align="center">
              Already have an account?{' '}
              <Link href="/" color="primary" fontWeight={600}>
                Login
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

export default RegistrationPage;
