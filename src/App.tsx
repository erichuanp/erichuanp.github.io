import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import BlogsPage from './pages/BlogsPage';
import BlogCategoryPage from './pages/BlogCategoryPage';
import ToolsPage from './pages/ToolsPage';
import ContactsPage from './pages/ContactsPage';
import NotFoundPage from './pages/NotFoundPage';

// Tools
import JsonFormatter from './tools/JsonFormatter';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:category" element={<BlogCategoryPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="tools/json-formatter" element={<JsonFormatter />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;