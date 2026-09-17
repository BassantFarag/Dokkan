import React from 'react'
import { RouterProvider } from 'react-router-dom';
import { routes } from './Router/routes';
import RootLayout from './Layout/RootLayout'
// import Loading from './components/loading';
const App = () => {

 return (
    <>
    {/* <Loading  /> */}
    <RouterProvider router={routes} />
    </>
);
}

export default App