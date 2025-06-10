import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Hash } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const BaseConverter: React.FC = () => {
  const [values, setValues] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  });
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const bases = [
    { key: 'binary', name: '二进制', base: 2, prefix: '0b', pattern: /^[01]+$/ },
    { key: 'octal', name: '八进制', base: 8, prefix: '0o', pattern: /^[0-7]+$/ },
    { key: 'decimal', name: '十进制', base: 10, prefix: '', pattern: /^[0-9]+$/ },
    { key: 'hexadecimal', name: '十六进制', base: 16, prefix: '0x', pattern: /^[0-9a-fA-F]+$/ }
  ];

  const convertFromDecimal = (decimal: number) => {
    if (isNaN(decimal) || decimal < 0) {
      return {
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: ''
      };
    }

    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase()
    };
  };

  const handleValueChange = (baseKey: string, value: string) => {
    setError('');
    
    if (!value.trim()) {
      setValues({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: ''
      });
      return;
    }

    const baseInfo = bases.find(b => b.key === baseKey);
    if (!baseInfo) return;

    // 验证输入格式
    if (!baseInfo.pattern.test(value)) {
      setError(`${baseInfo.name}格式错误`);
      setValues(prev => ({ ...prev, [baseKey]: value }));
      return;
    }

    try {
      // 转换为十进制
      const decimal = parseInt(value, baseInfo.base);
      
      if (isNaN(decimal)) {
        setError('转换失败');
        return;
      }

      // 从十进制转换为其他进制
      const newValues = convertFromDecimal(decimal);
      setValues(newValues);
    } catch (err) {
      setError('转换失败: ' + (err as Error).message);
    }
  };

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

  const clearAll = () => {
    setValues({
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: ''
    });
    setError('');
  };

  const loadExample = () => {
    handleValueChange('decimal', '255');
  };

  // 计算一些有用的信息
  const getAdditionalInfo = () => {
    const decimal = parseInt(values.decimal);
    if (isNaN(decimal)) return null;

    return {
      bits: decimal.toString(2).length,
      bytes: Math.ceil(decimal.toString(2).length / 8),
      signed8bit: decimal > 127 ? decimal -256 : decimal,
      unsigned8bit: decimal & 0xFF,
      signed16bit: decimal > 32767 ? decimal - 65536 : decimal,
      unsigned16bit: decimal & 0xFFFF
    };
  };

  const additionalInfo = getAdditionalInfo();

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">进制转换器</h1>
            <p className="text-xl text-gray-600">
              二进制、八进制、十进制、十六进制互转
            </p>
          </div>

          {/* 进制转换 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {bases.map((base, index) => (
              <motion.div
                key={base.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {base.name} ({base.base}进制)
                  </h2>
                  <button
                    onClick={() => copyToClipboard(values[base.key as keyof typeof values], base.key)}
                    disabled={!values[base.key as keyof typeof values]}
                    className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {copied === base.key ? <Check size={14} /> : <Copy size={14} />}
                    {copied === base.key ? '已复制' : '复制'}
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={values[base.key as keyof typeof values]}
                    onChange={(e) => handleValueChange(base.key, e.target.value)}
                    placeholder={`输入${base.name}数值...`}
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  
                  {values[base.key as keyof typeof values] && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">带前缀: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {base.prefix}{values[base.key as keyof typeof values]}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 错误信息 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 font-medium">错误信息:</p>
              <p className="text-red-600 mt-1">{error}</p>
            </motion.div>
          )}

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center gap-4 mb-8"
          >
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              加载示例 (255)
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              清空
            </button>
          </motion.div>

          {/* 附加信息 */}
          {additionalInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">数值信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">位数</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.bits} bits</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">字节数</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.bytes} bytes</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">8位有符号</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.signed8bit}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">8位无符号</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.unsigned8bit}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">16位有符号</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.signed16bit}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">16位无符号</div>
                  <div className="text-lg font-mono text-gray-900">{additionalInfo.unsigned16bit}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 空状态 */}
          {!values.decimal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <Hash size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">在任意进制输入框中输入数值开始转换</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">进制说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">进制系统</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>
                    <strong>二进制 (Base 2):</strong> 只使用 0 和 1
                    <br />
                    <span className="text-xs text-gray-500">计算机内部使用的数制</span>
                  </li>
                  <li>
                    <strong>八进制 (Base 8):</strong> 使用 0-7
                    <br />
                    <span className="text-xs text-gray-500">Unix 文件权限常用</span>
                  </li>
                  <li>
                    <strong>十进制 (Base 10):</strong> 使用 0-9
                    <br />
                    <span className="text-xs text-gray-500">日常生活中使用的数制</span>
                  </li>
                  <li>
                    <strong>十六进制 (Base 16):</strong> 使用 0-9, A-F
                    <br />
                    <span className="text-xs text-gray-500">颜色代码、内存地址常用</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见用途</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>二进制:</strong> 计算机科学、数字电路</li>
                  <li>• <strong>八进制:</strong> Unix/Linux 文件权限</li>
                  <li>• <strong>十进制:</strong> 日常计算、数学</li>
                  <li>• <strong>十六进制:</strong> 颜色代码、内存地址、哈希值</li>
                  <li>• 网络编程中的数据表示</li>
                  <li>• 嵌入式系统开发</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>提示:</strong> 在任意一个输入框中输入数值，其他进制的等价值会自动计算并显示。支持的最大值受 JavaScript 数值精度限制。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BaseConverter;