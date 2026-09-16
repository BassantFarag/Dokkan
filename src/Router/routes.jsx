import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home";
import Carts from '../Pages/Carts';
import Whishlist from '../Pages/Whishlist';
import Myorders from '../Pages/Myorders';
import Shop from '../Pages/Shop';
import Notfound from "../Pages/Notfound";

export const routes = createBrowserRouter([{
    path:'/',
    element: <RootLayout />,
    errorElement: <Notfound />,
    children:[
        {
            index:true,
            element: <Home />,
        },
        {
            path:"shop",
            element:<Shop />
        },
        {
            path:"Myorders",
            element:<Myorders />
        },
        {
            path:"Whishlist",
            element:<Whishlist />
        },
        {
            path:"Carts",
            element:<Carts />
        },


    ]
}])

