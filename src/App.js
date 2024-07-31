import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import NavPages from './pages/NavPages';
import BooksPage from './pages/BooksPage';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import BookDetails from './pages/BookDetails';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/" element={<NavPages />}>
            <Route path="home" element={<BooksPage />} />
            <Route path="addBook" element={<AddBook />} />
            <Route path="updateBook/:title" element={<UpdateBook />} />
            <Route path="bookDetails/:title" element={<BookDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
