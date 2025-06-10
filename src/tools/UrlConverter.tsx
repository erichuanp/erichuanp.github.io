import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const UrlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encodeUrl = () => {
    try {
      if (!input.trim()) {
        setError('请输入要编码的 URL 或文本');
        setOutput('');
        return;
      }

      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('编码失败: ' + (err as Error).message);
      setOutput('');
    }
  };

  const decodeUrl = () => {
    try {
      if (!input.trim()) {
        setError('请输入要解码的 URL 编码文本');
        setOutput('');
        return;
      }

      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('解码失败: 请检查 URL 编码格式是否正确');
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadExample = () => {
    setInput('https://example.com/search?q=Hello World&lang=zh-CN');
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">URL 编码解码器</h1>
            <p className="text-xl text-gray-600">
              处理 URL 参数的编码和解码操作
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900">输入 URL</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入要编码或解码的 URL..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <div className="space-y-3">
                <button
                  onClick={encodeUrl}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowRight size={16} />
                  编码
                </button>
                <button
                  onClick={decodeUrl}
                  className="w-full px-4 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowLeft size={16} />
                  解码
                </button>
                <div className="border-t border-gray-200 pt-3">
                  <button
                    onClick={loadExample}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    加载示例
                  </button>
                  <button
                    onClick={clearAll}
                    className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw size={14} />
                    清空
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">输出结果</h2>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="编码或解码后的 URL 将显示在这里..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50"
              />
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 font-medium">错误信息:</p>
              <p className="text-red-600 mt-1">{error}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">URL 编码</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 将特殊字符转换为 %XX 格式</li>
                  <li>• 处理空格、中文、符号等</li>
                  <li>• 确保 URL 参数安全传输</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">URL 解码</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 将 %XX 格式还原为原始字符</li>
                  <li>• 恢复可读的 URL 格式</li>
                  <li>• 支持完整 URL 和参数片段</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UrlConverter;