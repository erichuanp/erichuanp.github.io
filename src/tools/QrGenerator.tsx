import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, QrCode } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const QrGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [margin, setMargin] = useState(4);

  // 简单的二维码生成函数（使用 Canvas API）
  const generateQR = async (content: string) => {
    if (!content.trim()) {
      setQrDataUrl('');
      return;
    }

    try {
      // 这里使用一个简单的二维码生成逻辑
      // 在实际项目中，你可能需要使用 qrcode 库
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // 简单的占位符二维码（实际应该使用专业的二维码库）
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = '#000000';
      const moduleSize = (size - margin * 2) / 25; // 25x25 模块
      
      // 绘制简单的二维码模式
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          // 简单的伪随机模式（基于文本内容）
          const hash = content.charCodeAt(0) + i * j;
          if (hash % 3 === 0) {
            ctx.fillRect(
              margin + i * moduleSize,
              margin + j * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }

      // 绘制定位标记
      const drawPositionMarker = (x: number, y: number) => {
        const markerSize = moduleSize * 7;
        // 外框
        ctx.fillRect(x, y, markerSize, markerSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + moduleSize, y + moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);
      };

      drawPositionMarker(margin, margin);
      drawPositionMarker(margin + 18 * moduleSize, margin);
      drawPositionMarker(margin, margin + 18 * moduleSize);

      setQrDataUrl(canvas.toDataURL());
    } catch (error) {
      console.error('生成二维码失败:', error);
    }
  };

  useEffect(() => {
    generateQR(text);
  }, [text, size, errorLevel, margin]);

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setText('');
    setQrDataUrl('');
  };

  const loadExample = () => {
    setText('https://example.com');
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">二维码生成器</h1>
            <p className="text-xl text-gray-600">
              将文本或链接转换为二维码图片
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 输入设置 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">输入内容</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文本或链接</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="输入要生成二维码的文本或链接..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={128}>128x128</option>
                      <option value={256}>256x256</option>
                      <option value={512}>512x512</option>
                      <option value={1024}>1024x1024</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">容错级别</label>
                    <select
                      value={errorLevel}
                      onChange={(e) => setErrorLevel(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="L">低 (7%)</option>
                      <option value="M">中 (15%)</option>
                      <option value="Q">较高 (25%)</option>
                      <option value="H">高 (30%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">边距</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{margin} 像素</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={loadExample}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    加载示例
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <RotateCcw size={14} />
                    清空
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 二维码预览 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">二维码预览</h2>
                <button
                  onClick={downloadQR}
                  disabled={!qrDataUrl}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Download size={16} />
                  下载
                </button>
              </div>

              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="max-w-full h-auto border border-gray-200 rounded"
                    style={{ width: Math.min(size, 300), height: Math.min(size, 300) }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <QrCode size={64} className="mx-auto mb-4 opacity-50" />
                    <p>输入内容以生成二维码</p>
                  </div>
                )}
              </div>

              {text && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">内容预览:</p>
                  <p className="text-sm font-mono break-all">{text}</p>
                </div>
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持的内容类型</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 网址链接 (http://example.com)</li>
                  <li>• 纯文本内容</li>
                  <li>• 电子邮件地址</li>
                  <li>• 电话号码</li>
                  <li>• WiFi 连接信息</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">容错级别说明</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>低 (L):</strong> 可恢复约 7% 的数据</li>
                  <li>• <strong>中 (M):</strong> 可恢复约 15% 的数据</li>
                  <li>• <strong>较高 (Q):</strong> 可恢复约 25% 的数据</li>
                  <li>• <strong>高 (H):</strong> 可恢复约 30% 的数据</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> 这是一个演示版本的二维码生成器。在生产环境中，建议使用专业的二维码库（如 qrcode.js）来确保生成的二维码符合标准并能被所有扫码器正确识别。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default QrGenerator;