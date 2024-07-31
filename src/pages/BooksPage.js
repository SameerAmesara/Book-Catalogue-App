import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Button,
  TextField,
  Card,
  Box,
  MenuItem,
  Typography,
} from '@mui/material';
import BookCard from '../components/BookCard';
import { getCurrentUser } from '../utils/getCurrentUser';
import { styled } from '@mui/system';
import { fetchBooksForUser } from '../resources/APIServices';

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

const BooksPage = () => {
  const [userBooks, setUserBooks] = useState([]);
  let [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('title');
  const [searchText, setSearchText] = useState('');
  const [text, setText] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const attributes = await getCurrentUser();
      const userId = attributes.sub;
      const books = await fetchBooksForUser(userId);
      setUserBooks(books);
      setFilteredBooks(books);
    } catch (error) {
      setUserBooks([]);
      setFilteredBooks([]);
      setText(error.response.data.message);
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    filteredBooks = userBooks;

    filteredBooks = filteredBooks.filter((book) => {
      switch (filter) {
        case 'title':
          return book.title.toLowerCase().includes(searchText.toLowerCase());
        case 'author':
          return book.author.toLowerCase().includes(searchText.toLowerCase());
        case 'isbn':
          return book.isbn.includes(searchText);
        default:
          return true;
      }
    });

    if (filteredBooks.length === 0) {
      setText(
        `No book with ${filter.replace(/^\w/, (c) =>
          c.toUpperCase()
        )} named ${searchText.replace(/^\w/, (c) => c.toUpperCase())} found.`
      );
    }
    setFilteredBooks(filteredBooks);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredBooks(userBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ paddingTop: 4, flexGrow: 1, width: '90%', margin: 'auto' }}>
        <Card sx={{ borderRadius: '10px' }}>
          <Grid
            container
            spacing={2}
            sx={{ p: 1, flexGrow: 1, width: '100%', margin: 'auto' }}
          >
            <Grid item xs={12} sm={5}>
              <TextField
                label="Search Text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Filter by"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                fullWidth
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="isbn">ISBN</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomButton
                variant="contained"
                fullWidth
                onClick={handleFilter}
              >
                Filter
              </CustomButton>
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomButton variant="contained" fullWidth onClick={handleReset}>
                Reset
              </CustomButton>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Grid
        container
        spacing={4}
        paddingTop="20px"
        paddingBottom="0px"
        justifyContent="center"
        sx={{ margin: '0 auto', maxWidth: '1500px' }}
      >
        {loading ? (
          <CircularProgress />
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Grid xs={12} sm={3} lg={3} key={book.book_id}>
              <BookCard book={book} fetchBooks={fetchBooks} />
            </Grid>
          ))
        ) : (
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                display: 'flex',
                height: '300px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4">{text}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default BooksPage;
