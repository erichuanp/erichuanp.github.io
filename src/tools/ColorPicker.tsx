import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Palette } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState('');

  // 预设颜色
  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
  ];

  useEffect(() => {
    updateFromHex(color);
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / (1/12)) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255)
    };
  };

  const updateFromHex = (hexValue: string) => {
    const newRgb = hexToRgb(hexValue);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setColor(hexValue);
    setRgb(newRgb);
    setHsl(newHsl);
  };

  const updateFromRgb = (newRgb: { r: number, g: number, b: number }) => {
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setColor(newHex);
    setRgb(newRgb);
    setHsl(newHsl);
  };

  const updateFromHsl = (newHsl: { h: number, s: number, l: number }) => {
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(newHex);
    setRgb(newRgb);
    setHsl(newHsl);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">颜色选择器</h1>
            <p className="text-xl text-gray-600">
              RGB、HEX、HSL 等颜色格式转换和调色板
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 颜色选择器 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">颜色选择</h2>
              
              {/* 颜色预览 */}
              <div className="mb-6">
                <div 
                  className="w-full h-32 rounded-lg border-2 border-gray-200 mb-4"
                  style={{ backgroundColor: color }}
                ></div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>

              {/* 预设颜色 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">预设颜色</h3>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((presetColor, index) => (
                    <button
                      key={index}
                      onClick={() => updateFromHex(presetColor)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: presetColor }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 颜色值 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">颜色值</h2>

              {/* HEX */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">HEX</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => copyToClipboard(color, 'hex')}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {copied === 'hex' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* RGB */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">RGB</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="R"
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="G"
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="B"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {copied === 'rgb' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* HSL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">HSL</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="H"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="S"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="L"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {copied === 'hsl' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">颜色格式说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">HEX 格式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 十六进制颜色表示法</li>
                  <li>• 格式：#RRGGBB</li>
                  <li>• 最常用的网页颜色格式</li>
                  <li>• 例如：#3b82f6</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">RGB 格式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 红绿蓝三原色混合</li>
                  <li>• 每个值范围：0-255</li>
                  <li>• CSS 中常用格式</li>
                  <li>• 例如：rgb(59, 130, 246)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">HSL 格式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 色相、饱和度、亮度</li>
                  <li>• H: 0-360°, S: 0-100%, L: 0-100%</li>
                  <li>• 更直观的颜色调整</li>
                  <li>• 例如：hsl(217, 91%, 60%)</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ColorPicker;