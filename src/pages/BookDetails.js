import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  ThemeProvider,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import BookIcon from '@mui/icons-material/Book';
import theme from '../theme';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';

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

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Avatar
              sx={{ width: '100%', height: 700, borderRadius: '10px' }}
              alt="Cover Image"
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt="Book Cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <BookIcon style={{ fontSize: 200 }} />
              )}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              {book.title}
            </Typography>
            <Divider />
            <List disablePadding>
              {[
                { label: 'Author(s)', value: book.author },
                { label: 'ISBN', value: book.isbn },
                { label: 'Publisher', value: book.publisher },
                { label: 'Publication Year', value: book.publicationYear },
                { label: 'Summary', value: book.summary },
                { label: 'Number of Pages', value: book.numberOfPages },
                { label: 'Language', value: book.language },
                {
                  label: 'Genres',
                  value: book.genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      sx={{ ml: index ? 1 : 0 }}
                    />
                  )),
                },
              ].map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {item.label}
                      </Typography>
                    }
                    secondary={item.value}
                    secondaryTypographyProps={{
                      sx: { mt: 0.5 }, // Adds space between primary and secondary text
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CustomButton
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </CustomButton>
      </Box>
    </ThemeProvider>
  );
};

export default BookDetails;
