import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { addBook, uploadImage } from "../resources/apiServices";

const AddBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  // const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // State to store the image URL after upload

  const [base64, setBase64] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase64(reader.result);
      setError("");
    };
    reader.onerror = (error) => {
      setError("Error reading file: ", error.message);
    };
  };

  const isValidFile = (file) => {
    // Check for file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("File type must be .png or .jpg");
      console.log(error);
      return false;
    }

    // Check for file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be under 100MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      convertToBase64(file);
      setFileName(file.name);
      setFileUploaded(false);
    }
  };

  const uploadFileToS3 = async (e) => {
    if (!fileName) {
      alert("Please select a file first!");
      return;
    }
    const data = await uploadImage({ imageData: base64, fileName });
    if (data.url) {
      setImageUrl(data.url);
      setFileUploaded(true);
      alert("File uploaded successfully!");
    } else {
      alert("Failed to upload file.");
    }
  };

  const saveBookDetails = async () => {
    if (!title || !author || !description || !imageUrl) {
      alert("Please fill all fields and upload the image first!");
      return;
    }

    const data = await addBook({
      title: title,
      author: author,
      description: description,
      imageUrl: imageUrl,
    });
    // Call to your backend to save the data in DynamoDB
    if (data.message) {
      alert("Book saved successfully!");
    } else {
      alert("Failed to save the book.");
    }
    props.updateTab("library");
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", mt: 5, boxShadow: 3 }}>
      <CardContent sx={{ position: "relative", padding: 3 }}>
        <IconButton
          onClick={() => props.updateTab("gallery")}
          sx={{ position: "absolute", top: 10, left: 10 }}
          color="primary"
          aria-label="go back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Add Book
        </Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { my: 1 },
            "& .MuiButton-root": { mt: 2 },
          }}
        >
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Author"
            variant="outlined"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter book description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            id="fileInput"
          />
          <TextField
            type="file"
            variant="outlined"
            fullWidth
            onChange={handleFileChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              onClick={uploadFileToS3}
              sx={{ flexGrow: 1, mr: 1 }}
            >
              Upload File
            </Button>
            <Button
              variant="contained"
              onClick={saveBookDetails}
              disabled={!fileUploaded}
              sx={{ flexGrow: 1, ml: 1 }}
            >
              Save Book
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddBook;
