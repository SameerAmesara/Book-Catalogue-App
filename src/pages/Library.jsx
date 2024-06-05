import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Button } from "@mui/material";
import BookCard from "../components/BookCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getBooks, deleteBook } from "../resources/apiServices";

const Library = (props) => {
  const [books, setBooks] = useState([]); // State to store fetched books

  // Function to fetch books from the backend
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // useEffect to fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBookDetails = async (bookId, imageUrl) => {
    // console.log(JSON.stringify({ id: bookId }));
    const data = await deleteBook({ id: bookId, url: imageUrl });
    // Call to your backend to save the data in DynamoDB
    if (data.message) {
      alert("Book deleted successfully!");
    } else {
      alert("Failed to delete the book.");
    }
    await fetchBooks();
  };

  return (
    <Grid container component="main">
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={8} md={9}>
                <Typography variant="h4" fontWeight={600}>
                  Book Catalogue
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={(e) => props.updateTab("addBook")}
                >
                  <AddCircleOutlineIcon />
                  &nbsp; Add Book
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      <Grid container spacing={2} marginTop="2">
        {books.length > 0 ? (
          books.map((book, index) => (
            <BookCard key={index} {...book} onDelete={deleteBookDetails} />
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
                display: "flex",
                height: "300px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">No books available.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Library;
