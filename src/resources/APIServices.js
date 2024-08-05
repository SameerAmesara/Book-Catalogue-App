import axios from 'axios';
import {
  ADD_BOOK,
  DELETE_BOOK,
  GET_USER_BOOKS,
  GET_USER_DETAILS,
  UPDATE_BOOK_INFO,
  UPDATE_USER_INFO,
  UPLOAD_BOOK_IMAGE,
  UPLOAD_USER_IMAGE,
} from './APIUrls';

/**
 * Uploads a user image to the server and returns the URL of the uploaded image.
 * @param {string} fileName - The name of the file to upload.
 * @param {string} fileContent - Base64 encoded content of the file.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadUserImage = async (fileName, fileContent) => {
  try {
    const response = await axios.post(UPLOAD_USER_IMAGE, {
      fileName,
      fileContent,
    });
    const url = JSON.parse(response.data.body).url;
    return url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Updates user details on the server.
 * @param {Object} userDetails - Object containing user details to be updated.
 * @returns {Promise<string>} Message indicating the outcome of the update operation.
 */
export const updateUserDetails = async (userDetails) => {
  try {
    const response = await axios.post(UPDATE_USER_INFO, {
      user_id: userDetails.user_id,
      image: userDetails.avatar,
      phone: userDetails.phone,
      address: userDetails.address,
    });
    const message = JSON.parse(response.data.body).message;
    return message;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Fetches details for a specific user from the server.
 * @param {string} userId - The ID of the user whose details are to be fetched.
 * @returns {Promise<Object>} The details of the user fetched from the server.
 */
export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(GET_USER_DETAILS + `${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; // Re-throwing the error to be handled by the caller
  }
};

/**
 * Uploads a book image to the server and returns the URL of the uploaded image.
 * @param {string} fileName - The name of the file to upload.
 * @param {string} fileContent - Base64 encoded content of the file.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadBookImage = async (fileName, fileContent) => {
  try {
    const response = await axios.post(UPLOAD_BOOK_IMAGE, {
      fileName: fileName,
      fileContent: fileContent,
    });
    const data = JSON.parse(response.data.body);
    return data.url;
  } catch (error) {
    console.error('Error uploading book image:', error);
    throw error;
  }
};

/**
 * Submits book details to the server.
 * @param {Object} bookDetails - The details of the book to add.
 * @returns {Promise<Object>} The response data from the server.
 */
export const addBookDetails = async (bookDetails) => {
  try {
    const response = await axios.post(ADD_BOOK, bookDetails);
    return response.data;
  } catch (error) {
    console.error('Failed to add book:', error);
    throw error;
  }
};

/**
 * Updates the details of a book on the server.
 * @param {Object} bookDetails - The updated details of the book.
 * @returns {Promise<string>} The success message from the server response.
 */
export const updateBookDetails = async (bookDetails) => {
  try {
    const response = await axios.post(UPDATE_BOOK_INFO, bookDetails);
    const message = JSON.parse(response.data.body).message;
    return message;
  } catch (error) {
    console.error('Failed to update book:', error);
    throw error;
  }
};

/**
 * Fetches books for a specific user from the server.
 * @param {string} userId - The user ID for whom to fetch books.
 * @returns {Promise<Object>} The books associated with the user.
 */
export const fetchBooksForUser = async (userId) => {
  try {
    const response = await axios.get(GET_USER_BOOKS + `${userId}`);
    if (response.status === 200) {
      return response.data.books;
    } else {
      throw new Error('Failed to fetch books');
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Deletes a book based on the provided book ID and cover image.
 * @param {Object} bookDetails - The details of the book to delete, including book_id and coverImage.
 * @returns {Promise<string>} A message from the server about the deletion status.
 */
export const deleteBook = async (bookDetails) => {
  const config = {
    data: bookDetails,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.delete(DELETE_BOOK, config);
    console.log('Response:', response);
    if (response.status === 200) {
      return JSON.parse(response.data.body).message;
    } else {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
