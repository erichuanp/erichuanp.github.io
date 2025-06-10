import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const CssGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shadow' | 'gradient' | 'border'>('shadow');
  const [copied, setCopied] = useState(false);

  // 阴影设置
  const [shadow, setShadow] = useState({
    x: 0,
    y: 4,
    blur: 6,
    spread: 0,
    color: '#000000',
    opacity: 25,
    inset: false
  });

  // 渐变设置
  const [gradient, setGradient] = useState({
    type: 'linear',
    angle: 45,
    colors: [
      { color: '#3b82f6', stop: 0 },
      { color: '#8b5cf6', stop: 100 }
    ]
  });

  // 边框设置
  const [border, setBorder] = useState({
    width: 2,
    style: 'solid',
    color: '#3b82f6',
    radius: 8
  });

  const generateShadowCSS = () => {
    const { x, y, blur, spread, color, opacity, inset } = shadow;
    const shadowColor = `${color}${Math.round(opacity * 2.55).toString(16).padStart(2, '0')}`;
    return `box-shadow: ${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${shadowColor};`;
  };

  const generateGradientCSS = () => {
    const { type, angle, colors } = gradient;
    const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ');
    
    if (type === 'linear') {
      return `background: linear-gradient(${angle}deg, ${colorStops});`;
    } else {
      return `background: radial-gradient(circle, ${colorStops});`;
    }
  };

  const generateBorderCSS = () => {
    const { width, style, color, radius } = border;
    return `border: ${width}px ${style} ${color};\nborder-radius: ${radius}px;`;
  };

  const getCurrentCSS = () => {
    switch (activeTab) {
      case 'shadow': return generateShadowCSS();
      case 'gradient': return generateGradientCSS();
      case 'border': return generateBorderCSS();
      default: return '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCSS());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const addGradientColor = () => {
    setGradient(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '#ffffff', stop: 50 }]
    }));
  };

  const removeGradientColor = (index: number) => {
    if (gradient.colors.length > 2) {
      setGradient(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const updateGradientColor = (index: number, field: 'color' | 'stop', value: string | number) => {
    setGradient(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">CSS 生成器</h1>
            <p className="text-xl text-gray-600">
              生成阴影、渐变、边框等 CSS 代码
            </p>
          </div>

          {/* 标签切换 */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1 max-w-md mx-auto">
              {[
                { key: 'shadow', label: '阴影' },
                { key: 'gradient', label: '渐变' },
                { key: 'border', label: '边框' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 控制面板 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">设置</h2>

              {/* 阴影设置 */}
              {activeTab === 'shadow' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X 偏移</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.x}
                        onChange={(e) => setShadow(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{shadow.x}px</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Y 偏移</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.y}
                        onChange={(e) => setShadow(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{shadow.y}px</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">模糊</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={shadow.blur}
                        onChange={(e) => setShadow(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{shadow.blur}px</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">扩散</label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shadow.spread}
                        onChange={(e) => setShadow(prev => ({ ...prev, spread: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{shadow.spread}px</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => setShadow(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full h-10 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">透明度</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadow.opacity}
                        onChange={(e) => setShadow(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{shadow.opacity}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={shadow.inset}
                        onChange={(e) => setShadow(prev => ({ ...prev, inset: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">内阴影</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 渐变设置 */}
              {activeTab === 'gradient' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">渐变类型</label>
                    <select
                      value={gradient.type}
                      onChange={(e) => setGradient(prev => ({ ...prev, type: e.target.value as 'linear' | 'radial' }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="linear">线性渐变</option>
                      <option value="radial">径向渐变</option>
                    </select>
                  </div>

                  {gradient.type === 'linear' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">角度</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradient.angle}
                        onChange={(e) => setGradient(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{gradient.angle}°</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">颜色</label>
                      <button
                        onClick={addGradientColor}
                        className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
                      >
                        添加颜色
                      </button>
                    </div>
                    <div className="space-y-2">
                      {gradient.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color.color}
                            onChange={(e) => updateGradientColor(index, 'color', e.target.value)}
                            className="w-12 h-8 rounded border border-gray-300"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={color.stop}
                            onChange={(e) => updateGradientColor(index, 'stop', parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-12">{color.stop}%</span>
                          {gradient.colors.length > 2 && (
                            <button
                              onClick={() => removeGradientColor(index)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 边框设置 */}
              {activeTab === 'border' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">宽度</label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={border.width}
                        onChange={(e) => setBorder(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{border.width}px</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">圆角</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={border.radius}
                        onChange={(e) => setBorder(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{border.radius}px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">样式</label>
                    <select
                      value={border.style}
                      onChange={(e) => setBorder(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="solid">实线</option>
                      <option value="dashed">虚线</option>
                      <option value="dotted">点线</option>
                      <option value="double">双线</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                    <input
                      type="color"
                      value={border.color}
                      onChange={(e) => setBorder(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* 预览和代码 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">预览</h2>

              {/* 预览区域 */}
              <div className="mb-6 p-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <div
                  className="w-32 h-32 bg-white flex items-center justify-center text-gray-600"
                  style={{
                    ...(activeTab === 'shadow' && { boxShadow: generateShadowCSS().replace('box-shadow: ', '').replace(';', '') }),
                    ...(activeTab === 'gradient' && { background: generateGradientCSS().replace('background: ', '').replace(';', '') }),
                    ...(activeTab === 'border' && {
                      border: `${border.width}px ${border.style} ${border.color}`,
                      borderRadius: `${border.radius}px`
                    })
                  }}
                >
                  预览
                </div>
              </div>

              {/* CSS 代码 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">CSS 代码</label>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <textarea
                  value={getCurrentCSS()}
                  readOnly
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                />
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">阴影效果</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 调整 X/Y 偏移控制阴影位置</li>
                  <li>• 模糊值控制阴影柔和度</li>
                  <li>• 扩散值控制阴影大小</li>
                  <li>• 支持内阴影效果</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">渐变背景</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 支持线性和径向渐变</li>
                  <li>• 可添加多个颜色节点</li>
                  <li>• 调整颜色位置和角度</li>
                  <li>• 实时预览渐变效果</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">边框样式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 设置边框宽度和颜色</li>
                  <li>• 多种边框样式选择</li>
                  <li>• 调整圆角半径</li>
                  <li>• 一键复制 CSS 代码</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CssGenerator;