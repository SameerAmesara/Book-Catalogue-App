import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import { deleteBook } from '../resources/APIServices';

const CustomButton = styled(Button)(({ theme, color }) => ({
  fontSize: '1.1rem',
  padding: '8px 16px',
  border: `2px solid ${theme.palette[color].main}`,
  backgroundColor: theme.palette[color].main,
  borderRadius: '10px',
  color: theme.palette.getContrastText(theme.palette[color].main),
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette[color].main,
    borderColor: theme.palette[color].main,
  },
}));

const BookCard = ({ book, fetchBooks }) => {
  const navigate = useNavigate();
  const displayImage = book.coverImage;
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDeleteDialog = () => setOpenDelete(true);
  const handleCloseDeleteDialog = () => setOpenDelete(false);

  const handleViewDetails = () => {
    navigate(`/bookDetails/${encodeURIComponent(book.book_id)}`, {
      state: { book },
    });
  };

  const handleDeleteBook = async () => {
    const bookDetails = {
      book_id: book.book_id,
      coverImage: displayImage,
    };

    try {
      const message = await deleteBook(bookDetails);
      alert(message);
      handleCloseDeleteDialog();
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/updateBook/${encodeURIComponent(book.book_id)}`, {
      state: { book },
    });
  };

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        border: '2px solid #e0e7ff',
        borderRadius: '20px',
        padding: 2,
      }}
    >
      <Box
        sx={{
          height: '470px',
          width: '300px',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        <img
          src={displayImage}
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
        />
      </Box>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography
          variant="h5"
          component="div"
          onClick={() => handleViewDetails()}
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {book.title}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          mt={1}
        >
          <strong>Author:</strong> {book.author}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          mt={1}
        >
          <strong>ISBN:</strong> {book.isbn}
        </Typography>
        <Box mt={2} sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6}>
              <CustomButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleUpdate}
              >
                <Edit fontSize="small" />
              </CustomButton>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <CustomButton
                color="error"
                variant="contained"
                fullWidth
                onClick={handleOpenDeleteDialog}
              >
                <Delete fontSize="small" />
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <DeleteDialog
        open={openDelete}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteBook}
      />
    </Card>
  );
};

export default BookCard;
