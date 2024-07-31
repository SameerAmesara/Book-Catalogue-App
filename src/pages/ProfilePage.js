import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  Button,
  Avatar,
  Box,
  Grid,
  TextField,
  Divider,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserDetails,
  updateUserDetails,
  uploadUserImage,
} from '../resources/APIServices';

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1rem',
  padding: '12px 24px',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const CameraIconButton = styled(IconButton)({
  backgroundColor: 'white',
  borderRadius: '50%',
  padding: '6px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const ProfilePage = () => {
  const { userDetails } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user = await fetchUserDetails(userDetails.user_id);
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.image);
        setPhone(user.phone);
        if (user.address) {
          setAddress(user.address);
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
    };

    getUserDetails();
  }, [userDetails.user_id]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    if (file) {
      const reader = new FileReader();
      try {
        reader.onload = async () => {
          const base64data = reader.result.split(',')[1];
          const url = await uploadUserImage(file.name, base64data);
          setAvatar(url);
          console.log('File uploaded successfully:', url);
        };
        reader.onerror = () => {
          throw new Error('Error reading file.');
        };
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setLoading(false);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: userDetails.user_id,
      avatar: avatar,
      phone: phone,
      address: address,
    };

    try {
      const message = await updateUserDetails(payload);
      alert(message);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          width="50%"
          padding={5}
          sx={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mx: 'auto',
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: '20px',
              boxShadow: 3,
            }}
          >
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={
                    <CameraIconButton component="label">
                      <CameraAltIcon />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </CameraIconButton>
                  }
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Avatar
                      src={avatar}
                      sx={{
                        width: 200,
                        height: 200,
                        mb: 2,
                      }}
                    />
                  )}
                </Badge>
                <Typography variant="h4" fontWeight="bold">
                  {name}
                </Typography>
                <Typography variant="body" color="textSecondary">
                  {email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider />
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="Name"
                        name="name"
                        value={name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="Email"
                        name="email"
                        value={email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        type="number"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{ borderRadius: '12px' }}
                      >
                        Update Profile
                      </CustomButton>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;
