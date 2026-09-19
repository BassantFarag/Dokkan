import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home";
import Carts from '../Pages/Carts';
import Whishlist from '../Pages/Whishlist';
import Myorders from '../Pages/Myorders';
import Profile from '../Pages/Profile';
import Shop from '../Pages/Shop';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ForgotPassword from '../Pages/ForgotPassword';
import OrderDetails from '../Pages/OrderDetails'; // استدعاء صفحة تفاصيل الطلب
import Notfound from "../Pages/Notfound";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";

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
            element:(
                <ProtectedRoute>
                    <Myorders />
                </ProtectedRoute>
            )
        },
        {
            path:"orders/:orderId", // المسار الديناميكي مستقبلاً أو للتجربة
            element:(
                <ProtectedRoute>
                    <OrderDetails />
                </ProtectedRoute>
            )
        },
        {
            path:"profile",
            element:(
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            )
        },
        {
            path:"Whishlist",
            element:(
                <ProtectedRoute>
                    <Whishlist />
                </ProtectedRoute>
            )
        },
        {
            path:"Carts",
            element:(
                <ProtectedRoute>
                    <Carts />
                </ProtectedRoute>
            )
        },
        {
            path:"login",
            element:(
                <GuestRoute>
                    <Login />
                </GuestRoute>
            )
        },
        {
            path:"register",
            element:(
                <GuestRoute>
                    <Register />
                </GuestRoute>
            )
        },
        {
            path:"forgot-password",
            element:(
                <GuestRoute>
                    <ForgotPassword />
                </GuestRoute>
            )
        },

    ]
}])