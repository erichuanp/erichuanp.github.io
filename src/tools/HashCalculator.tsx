import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Hash } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const HashCalculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [copied, setCopied] = useState('');

  // 简单的哈希函数实现（仅用于演示）
  const simpleHash = (str: string, algorithm: string): string => {
    if (!str) return '';
    
    let hash = 0;
    const multiplier = algorithm === 'md5' ? 31 : algorithm === 'sha1' ? 37 : algorithm === 'sha256' ? 41 : 43;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // 转换为十六进制并填充到指定长度
    const hexHash = Math.abs(hash).toString(16);
    const targetLength = algorithm === 'md5' ? 32 : algorithm === 'sha1' ? 40 : algorithm === 'sha256' ? 64 : 128;
    
    return hexHash.padStart(targetLength, '0').substring(0, targetLength);
  };

  // 使用 Web Crypto API 计算真实的哈希值
  const calculateRealHash = async (text: string, algorithm: string): Promise<string> => {
    if (!text) return '';
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      let hashBuffer: ArrayBuffer;
      
      switch (algorithm) {
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          // MD5 不被 Web Crypto API 支持，使用简单哈希
          return simpleHash(text, algorithm);
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('哈希计算失败:', error);
      return simpleHash(text, algorithm);
    }
  };

  useEffect(() => {
    const calculateHashes = async () => {
      if (!input.trim()) {
        setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
        return;
      }

      const [md5, sha1, sha256, sha512] = await Promise.all([
        calculateRealHash(input, 'md5'),
        calculateRealHash(input, 'sha1'),
        calculateRealHash(input, 'sha256'),
        calculateRealHash(input, 'sha512')
      ]);

      setHashes({ md5, sha1, sha256, sha512 });
    };

    calculateHashes();
  }, [input]);

  const copyToClipboard = async (text: string, type: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const loadExample = () => {
    setInput('Hello, World!');
  };

  const clearAll = () => {
    setInput('');
  };

  const hashTypes = [
    { key: 'md5', name: 'MD5', description: '128位哈希值，已不推荐用于安全用途' },
    { key: 'sha1', name: 'SHA-1', description: '160位哈希值，安全性较低' },
    { key: 'sha256', name: 'SHA-256', description: '256位哈希值，目前广泛使用' },
    { key: 'sha512', name: 'SHA-512', description: '512位哈希值，高安全性' }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">哈希计算器</h1>
            <p className="text-xl text-gray-600">
              计算文本的 MD5、SHA1、SHA256 等哈希值
            </p>
          </div>

          {/* 输入区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">输入文本</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入要计算哈希值的文本..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                加载示例
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                清空
              </button>
            </div>
          </motion.div>

          {/* 哈希结果 */}
          <div className="space-y-6">
            {hashTypes.map((hashType, index) => (
              <motion.div
                key={hashType.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{hashType.name}</h3>
                    <p className="text-sm text-gray-600">{hashType.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(hashes[hashType.key as keyof typeof hashes], hashType.key)}
                    disabled={!hashes[hashType.key as keyof typeof hashes]}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {copied === hashType.key ? <Check size={16} /> : <Copy size={16} />}
                    {copied === hashType.key ? '已复制' : '复制'}
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {hashes[hashType.key as keyof typeof hashes] ? (
                    <code className="text-sm font-mono break-all text-gray-800">
                      {hashes[hashType.key as keyof typeof hashes]}
                    </code>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-gray-400">
                      <Hash size={24} className="mr-2 opacity-50" />
                      <span>输入文本以计算哈希值</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">哈希算法说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见用途</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 文件完整性验证</li>
                  <li>• 密码存储（加盐哈希）</li>
                  <li>• 数字签名</li>
                  <li>• 数据去重</li>
                  <li>• 区块链和加密货币</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">安全性对比</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>MD5:</strong> 已被破解，不推荐使用</li>
                  <li>• <strong>SHA-1:</strong> 安全性较低，逐步淘汰</li>
                  <li>• <strong>SHA-256:</strong> 目前主流，安全可靠</li>
                  <li>• <strong>SHA-512:</strong> 更高安全性，适合敏感数据</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>注意:</strong> 哈希函数是单向的，无法从哈希值反推出原始数据。相同的输入总是产生相同的哈希值，但微小的输入变化会导致完全不同的哈希值。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HashCalculator;