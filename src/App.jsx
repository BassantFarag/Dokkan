import React from 'react'
import { RouterProvider } from 'react-router-dom';
import { routes } from './Router/routes';
import RootLayout from './Layout/RootLayout'
const App = () => {
  
 return <RouterProvider router={routes} />;
}

export default App