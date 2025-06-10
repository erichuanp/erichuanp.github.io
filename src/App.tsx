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
import ColorPicker from './tools/ColorPicker';
import CssGenerator from './tools/CssGenerator';
import QrGenerator from './tools/QrGenerator';
import HashCalculator from './tools/HashCalculator';
import TimestampConverter from './tools/TimestampConverter';
import UuidGenerator from './tools/UuidGenerator';
import UnitConverter from './tools/UnitConverter';
import BaseConverter from './tools/BaseConverter';
import PasswordGenerator from './tools/PasswordGenerator';
import LoremGenerator from './tools/LoremGenerator';
import PercentageCalculator from './tools/PercentageCalculator';
import ImageCompressor from './tools/ImageCompressor';
import ImageConverter from './tools/ImageConverter';
import ImageResizer from './tools/ImageResizer';
import ImageFilter from './tools/ImageFilter';
import IpLookup from './tools/IpLookup';
import UserAgentParser from './tools/UserAgentParser';
import HttpStatus from './tools/HttpStatus';

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
          
          {/* 文本处理工具 */}
          <Route path="tools/json-formatter" element={<JsonFormatter />} />
          <Route path="tools/base64-converter" element={<Base64Converter />} />
          <Route path="tools/url-converter" element={<UrlConverter />} />
          <Route path="tools/markdown-preview" element={<MarkdownPreview />} />
          <Route path="tools/regex-tester" element={<RegexTester />} />
          <Route path="tools/text-diff" element={<TextDiff />} />
          
          {/* 开发者工具 */}
          <Route path="tools/color-picker" element={<ColorPicker />} />
          <Route path="tools/css-generator" element={<CssGenerator />} />
          <Route path="tools/qr-generator" element={<QrGenerator />} />
          <Route path="tools/hash-calculator" element={<HashCalculator />} />
          <Route path="tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="tools/uuid-generator" element={<UuidGenerator />} />
          
          {/* 计算工具 */}
          <Route path="tools/unit-converter" element={<UnitConverter />} />
          <Route path="tools/base-converter" element={<BaseConverter />} />
          <Route path="tools/password-generator" element={<PasswordGenerator />} />
          <Route path="tools/lorem-generator" element={<LoremGenerator />} />
          <Route path="tools/percentage-calculator" element={<PercentageCalculator />} />
          
          {/* 图片工具 */}
          <Route path="tools/image-compressor" element={<ImageCompressor />} />
          <Route path="tools/image-converter" element={<ImageConverter />} />
          <Route path="tools/image-resizer" element={<ImageResizer />} />
          <Route path="tools/image-filter" element={<ImageFilter />} />
          
          {/* 网络工具 */}
          <Route path="tools/ip-lookup" element={<IpLookup />} />
          <Route path="tools/user-agent-parser" element={<UserAgentParser />} />
          <Route path="tools/http-status" element={<HttpStatus />} />
          
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;