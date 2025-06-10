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
import Base64Converter from './tools/Base64Converter';
import UrlConverter from './tools/UrlConverter';
import MarkdownPreview from './tools/MarkdownPreview';
import RegexTester from './tools/RegexTester';
import TextDiff from './tools/TextDiff';

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
          <Route path="tools/base64-converter" element={<Base64Converter />} />
          <Route path="tools/url-converter" element={<UrlConverter />} />
          <Route path="tools/markdown-preview" element={<MarkdownPreview />} />
          <Route path="tools/regex-tester" element={<RegexTester />} />
          <Route path="tools/text-diff" element={<TextDiff />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;