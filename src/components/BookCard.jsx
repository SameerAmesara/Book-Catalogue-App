import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

const BookCard = ({ id, title, author, description, imageUrl, onDelete }) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card
        sx={{
          borderRadius: "10px",
          padding: 2,
          maxWidth: 600,
        }}
      >
        <CardMedia
          component="img"
          alt={title}
          height="300"
          image={imageUrl || "default-image-url.jpg"}
          sx={{ borderRadius: "10px" }}
        />
        <CardContent sx={{ paddingY: "3px" }}>
          <Box
            textAlign="center"
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Typography
              variant="h5"
              component="div"
              fontWeight={"600"}
              sx={{ mt: 2 }}
            >
              {title}
            </Typography>
            <Typography variant="subtitle2">{author}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", padding: 1 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<DeleteOutline />}
            onClick={() => onDelete(id, imageUrl)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default BookCard;
