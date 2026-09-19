import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OrderDetailsPage from './Pages/OrderDetails';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* المسار الأساسي لصفحة تفاصيل الطلب مع الـ ID الديناميكي */}
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        
        {/* مسار احتياطي لفتح الصفحة بشكل مباشر على الرابط الحالي لديك */}
        <Route path="*" element={<OrderDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;