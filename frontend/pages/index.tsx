// This file exports the main landing page component of the frontend application.
import '../axiosSetup'; 
import React from 'react';
import HomePage from '../pages/HomePage';
import PrivateRoute from '../components/PrivateRoute';

const IndexPage: React.FC = () => (
  <PrivateRoute>
    <HomePage />
  </PrivateRoute>
);

export default IndexPage;