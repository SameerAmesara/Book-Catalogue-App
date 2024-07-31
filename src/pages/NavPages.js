import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const NavPages = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default NavPages;
