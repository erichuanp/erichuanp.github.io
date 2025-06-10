import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Upload, RotateCcw, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JSON 数据');
        setOutput('');
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('JSON 格式错误: ' + (err as Error).message);
      setOutput('');
    }
  };

  const compressJson = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JSON 数据');
        setOutput('');
        return;
      }

      const parsed = JSON.parse(input);
      const compressed = JSON.stringify(parsed);
      setOutput(compressed);
      setError('');
    } catch (err) {
      setError('JSON 格式错误: ' + (err as Error).message);
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JSON 数据');
        return;
      }

      JSON.parse(input);
      setError('');
      alert('JSON 格式正确！');
    } catch (err) {
      setError('JSON 格式错误: ' + (err as Error).message);
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

  const downloadJson = () => {
    if (output) {
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadExample = () => {
    const example = {
      "name": "张三",
      "age": 30,
      "city": "北京",
      "skills": ["JavaScript", "React", "Node.js"],
      "contact": {
        "email": "zhangsan@example.com",
        "phone": "13800138000"
      },
      "active": true
    };
    setInput(JSON.stringify(example));
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">JSON 格式化器</h1>
            <p className="text-xl text-gray-600">
              美化、压缩和验证 JSON 数据的在线工具
            </p>
          </div>

          {/* Main Content - Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Section - 5 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">输入 JSON</h2>
                <div className="flex gap-2">
                  <label className="px-3 py-1 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                    <Upload size={14} />
                    上传文件
                    <input
                      type="file"
                      accept=".json,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此粘贴或输入 JSON 数据..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </motion.div>

            {/* Control Buttons - 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <div className="space-y-3">
                <button
                  onClick={formatJson}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowRight size={16} />
                  格式化
                </button>
                <button
                  onClick={compressJson}
                  className="w-full px-4 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowRight size={16} />
                  压缩
                </button>
                <button
                  onClick={validateJson}
                  className="w-full px-4 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  验证
                </button>
                <div className="border-t border-gray-200 pt-3">
                  <button
                    onClick={loadExample}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
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

            {/* Output Section - 5 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">输出结果</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                  <button
                    onClick={downloadJson}
                    disabled={!output}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    <Download size={14} />
                    下载
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="格式化后的 JSON 将显示在这里..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50"
              />
            </motion.div>
          </div>

          {/* Error Display */}
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

          {/* Usage Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">功能介绍</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>格式化:</strong> 美化 JSON，增加缩进和换行</li>
                  <li>• <strong>压缩:</strong> 移除空格和换行，减小文件大小</li>
                  <li>• <strong>验证:</strong> 检查 JSON 语法是否正确</li>
                  <li>• <strong>文件上传:</strong> 支持上传 .json 和 .txt 文件</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">快捷操作</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>复制结果:</strong> 一键复制格式化后的 JSON</li>
                  <li>• <strong>下载文件:</strong> 将结果保存为 .json 文件</li>
                  <li>• <strong>加载示例:</strong> 快速加载示例数据进行测试</li>
                  <li>• <strong>清空内容:</strong> 重置输入和输出区域</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default JsonFormatter;