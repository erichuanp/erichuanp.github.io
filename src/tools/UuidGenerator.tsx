import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, Hash } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState('4');
  const [copied, setCopied] = useState('');

  // 生成 UUID v4 (随机)
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 生成 UUID v1 (基于时间戳，简化版)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    const randomPart = Math.random().toString(16).substring(2, 14);
    
    return `${timestampHex.substring(0, 8)}-${timestampHex.substring(8, 12)}-1${randomPart.substring(0, 3)}-${randomPart.substring(3, 7)}-${randomPart.substring(7, 19)}`;
  };

  // 生成 Nil UUID
  const generateNilUUID = (): string => {
    return '00000000-0000-0000-0000-000000000000';
  };

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let uuid: string;
      
      switch (version) {
        case '1':
          uuid = generateUUIDv1();
          break;
        case '4':
          uuid = generateUUIDv4();
          break;
        case 'nil':
          uuid = generateNilUUID();
          break;
        default:
          uuid = generateUUIDv4();
      }
      
      newUuids.push(uuid);
    }
    
    setUuids(newUuids);
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

  const copyAllUUIDs = async () => {
    const allUuids = uuids.join('\n');
    await copyToClipboard(allUuids, 'all');
  };

  const clearAll = () => {
    setUuids([]);
  };

  // 格式化选项
  const formatOptions = [
    { key: 'default', name: '标准格式', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    { key: 'uppercase', name: '大写', example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' },
    { key: 'nohyphens', name: '无连字符', example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    { key: 'braces', name: '花括号', example: '{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}' }
  ];

  const [format, setFormat] = useState('default');

  const formatUUID = (uuid: string, formatType: string): string => {
    switch (formatType) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'nohyphens':
        return uuid.replace(/-/g, '');
      case 'braces':
        return `{${uuid}}`;
      default:
        return uuid;
    }
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">UUID 生成器</h1>
            <p className="text-xl text-gray-600">
              生成各种版本的唯一标识符 UUID
            </p>
          </div>

          {/* 设置面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">生成设置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UUID 版本</label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="1">Version 1 (时间戳)</option>
                  <option value="4">Version 4 (随机)</option>
                  <option value="nil">Nil UUID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {formatOptions.map(option => (
                    <option key={option.key} value={option.key}>{option.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={generateUUIDs}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  生成
                </button>
              </div>
            </div>
          </motion.div>

          {/* UUID 列表 */}
          {uuids.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  生成的 UUID ({uuids.length} 个)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyAllUUIDs}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied === 'all' ? <Check size={16} /> : <Copy size={16} />}
                    {copied === 'all' ? '已复制' : '复制全部'}
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    清空
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <code className="font-mono text-sm text-gray-800 flex-1">
                      {formatUUID(uuid, format)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(formatUUID(uuid, format), `uuid-${index}`)}
                      className="ml-3 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center gap-1 text-sm"
                    >
                      {copied === `uuid-${index}` ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 空状态 */}
          {uuids.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <Hash size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">点击"生成"按钮创建 UUID</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">UUID 版本说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">版本类型</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>
                    <strong>Version 1:</strong> 基于时间戳和 MAC 地址
                    <br />
                    <span className="text-xs text-gray-500">包含时间信息，可能泄露生成时间</span>
                  </li>
                  <li>
                    <strong>Version 4:</strong> 完全随机生成
                    <br />
                    <span className="text-xs text-gray-500">最常用，安全性高，无信息泄露</span>
                  </li>
                  <li>
                    <strong>Nil UUID:</strong> 全零 UUID
                    <br />
                    <span className="text-xs text-gray-500">特殊用途，表示空值或未初始化</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见用途</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 数据库主键</li>
                  <li>• 分布式系统中的唯一标识</li>
                  <li>• 文件名和目录名</li>
                  <li>• API 请求 ID</li>
                  <li>• 会话标识符</li>
                  <li>• 消息队列中的消息 ID</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>推荐:</strong> 在大多数情况下，建议使用 Version 4 (随机) UUID，因为它提供了良好的唯一性保证，同时不会泄露任何系统信息。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UuidGenerator;