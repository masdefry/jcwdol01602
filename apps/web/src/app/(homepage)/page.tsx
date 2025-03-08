import React from 'react';
import Navbar from '../../components/navbar';
import PlaceHolder from '../../components/placeholder';
import AuthProvider from '@/provider/authProvider';
import Footer from '@/components/footer';
const HomePage = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <h1>Home Page</h1>
        <PlaceHolder />
        <Footer />
      </AuthProvider>
    </div>
  );
};
export default HomePage;
