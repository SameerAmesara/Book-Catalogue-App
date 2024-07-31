import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  ListItemText,
  Checkbox,
  CircularProgress,
  Grid,
  Card,
  Divider,
  Avatar,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import BookIcon from '@mui/icons-material/Book';
import theme from '../theme';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { genresOptions, languagesOptions, getYears } from '../utils/FormLists';
import { updateBookDetails, uploadBookImage } from '../resources/APIServices';

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

const UpdateBook = () => {
  const location = useLocation();
  const book = location.state?.book;
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState({
    book_id: '',
    user_id: '',
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    genres: [],
    summary: '',
    coverImage: '',
    numberOfPages: '',
    language: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setBookDetails({
        book_id: book.book_id,
        user_id: book.user_id,
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publicationYear: book.publicationYear || '',
        genres: book.genres || [],
        summary: book.summary || '',
        coverImage: book.coverImage || '',
        numberOfPages: book.numberOfPages.toString() || '',
        language: book.language || '',
      });
    }
  }, [book]);

  const handleInputChange = (field, value) => {
    setBookDetails({ ...bookDetails, [field]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64data = event.target.result.split(',')[1];
        try {
          const url = await uploadBookImage(file.name, base64data);
          setBookDetails((prevDetails) => ({
            ...prevDetails,
            coverImage: url,
          }));
          setLoading(false);
        } catch (error) {
          console.error('Error uploading book image:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    console.log('Book Details:', JSON.stringify(bookDetails, null, 2));
    event.preventDefault();

    try {
      const message = await updateBookDetails(bookDetails);
      console.log('Response:', message);
      alert(message);
      navigate('/home');
    } catch (error) {
      console.error('Failed to update book:', error);
      alert('Failed to update book: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 1300, mx: 'auto', my: 4, p: 3 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
          Update a Book
        </Typography>
        <Divider />
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="start"
          sx={{ p: 3 }}
        >
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <Avatar
                  sx={{ width: 350, height: 485, mb: 2, borderRadius: '10px' }}
                  alt="Cover Image"
                >
                  {bookDetails.coverImage ? (
                    <img
                      src={bookDetails.coverImage}
                      alt="Book Cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <BookIcon style={{ fontSize: 200 }} />
                  )}
                </Avatar>
              )}
              <CustomButton
                variant="contained"
                component="label"
                disabled={loading}
                sx={{ borderRadius: '10px' }}
              >
                Update Cover Image
                <input type="file" hidden onChange={handleFileChange} />
              </CustomButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={bookDetails.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Summary/Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={bookDetails.summary}
                    onChange={(e) =>
                      handleInputChange('summary', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    fullWidth
                    label="Author(s)"
                    variant="outlined"
                    value={bookDetails.author}
                    onChange={(e) =>
                      handleInputChange('author', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    fullWidth
                    label="Publisher"
                    variant="outlined"
                    value={bookDetails.publisher}
                    onChange={(e) =>
                      handleInputChange('publisher', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    variant="outlined"
                    value={bookDetails.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Publication Year</InputLabel>
                    <Select
                      value={bookDetails.publicationYear}
                      onChange={(e) =>
                        handleInputChange('publicationYear', e.target.value)
                      }
                      label="Publication Year"
                    >
                      {getYears().map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Genre/Category</InputLabel>
                    <Select
                      multiple
                      value={bookDetails.genres}
                      onChange={(e) =>
                        handleInputChange('genres', e.target.value)
                      }
                      input={<OutlinedInput label="Genre/Category" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {genresOptions.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          <Checkbox
                            checked={bookDetails.genres.includes(genre)}
                          />
                          <ListItemText primary={genre} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Number of Pages"
                variant="outlined"
                value={bookDetails.numberOfPages}
                onChange={(e) =>
                  handleInputChange('numberOfPages', e.target.value)
                }
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={bookDetails.language}
                  onChange={(e) =>
                    handleInputChange('language', e.target.value)
                  }
                  label="Language"
                >
                  {languagesOptions.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <CustomButton
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  fontSize: '1rem',
                  fontWeight: 300,
                  borderRadius: '10px',
                }}
              >
                Save Changes
              </CustomButton>
            </form>
          </Grid>
        </Grid>
      </Card>
    </ThemeProvider>
  );
};

export default UpdateBook;
