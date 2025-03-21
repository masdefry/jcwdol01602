import React from 'react';
import Navbar from '../../components/navbar';
import PlaceHolder from '../../components/placeholder';
import AuthProvider from '@/provider/authProvider';
import Footer from '@/components/footer';
import Home from '@/components/homePage/home';
const HomePage = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Home />
        <Footer />
      </AuthProvider>
    </div>
  );
};
export default HomePage;
