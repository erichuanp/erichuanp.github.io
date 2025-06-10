import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Clock, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date): string => {
    return date.toISOString().slice(0, 19);
  };

  const timestampToDate = (ts: string): string => {
    if (!ts) return '';
    
    try {
      const num = parseInt(ts);
      if (isNaN(num)) return '';
      
      // 判断是秒还是毫秒时间戳
      const date = num.toString().length === 10 ? new Date(num * 1000) : new Date(num);
      
      if (isNaN(date.getTime())) return '';
      
      return formatDateTime(date);
    } catch (error) {
      return '';
    }
  };

  const dateToTimestamp = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      
      return Math.floor(date.getTime() / 1000).toString();
    } catch (error) {
      return '';
    }
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    setDateTime(timestampToDate(value));
  };

  const handleDateTimeChange = (value: string) => {
    setDateTime(value);
    setTimestamp(dateToTimestamp(value));
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

  const setCurrentTimestamp = () => {
    const now = new Date();
    const ts = Math.floor(now.getTime() / 1000).toString();
    setTimestamp(ts);
    setDateTime(formatDateTime(now));
  };

  const clearAll = () => {
    setTimestamp('');
    setDateTime('');
  };

  const loadExample = () => {
    const exampleTimestamp = '1640995200'; // 2022-01-01 00:00:00 UTC
    setTimestamp(exampleTimestamp);
    setDateTime(timestampToDate(exampleTimestamp));
  };

  const formatTimestamp = (ts: number): { seconds: string; milliseconds: string } => {
    return {
      seconds: Math.floor(ts / 1000).toString(),
      milliseconds: ts.toString()
    };
  };

  const currentTimestamps = formatTimestamp(currentTime.getTime());

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">时间戳转换器</h1>
            <p className="text-xl text-gray-600">
              Unix 时间戳与标准日期格式互相转换
            </p>
          </div>

          {/* 当前时间 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock size={24} />
                当前时间
              </h2>
              <button
                onClick={setCurrentTimestamp}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw size={16} />
                使用当前时间
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">当前日期时间</p>
                <p className="font-mono text-lg text-gray-900">{currentTime.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Unix 时间戳 (秒)</p>
                <p className="font-mono text-lg text-gray-900">{currentTimestamps.seconds}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">时间戳 (毫秒)</p>
                <p className="font-mono text-lg text-gray-900">{currentTimestamps.milliseconds}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 时间戳转日期 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">时间戳转日期</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unix 时间戳 (秒或毫秒)
                  </label>
                  <input
                    type="text"
                    value={timestamp}
                    onChange={(e) => handleTimestampChange(e.target.value)}
                    placeholder="输入时间戳..."
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">转换结果</label>
                    <button
                      onClick={() => copyToClipboard(dateTime, 'datetime')}
                      disabled={!dateTime}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {copied === 'datetime' ? <Check size={14} /> : <Copy size={14} />}
                      {copied === 'datetime' ? '已复制' : '复制'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={dateTime}
                    readOnly
                    placeholder="转换后的日期时间..."
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  />
                </div>

                {dateTime && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>本地时间:</strong> {new Date(dateTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 日期转时间戳 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">日期转时间戳</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日期时间 (YYYY-MM-DD HH:mm:ss)
                  </label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Unix 时间戳 (秒)</label>
                    <button
                      onClick={() => copyToClipboard(timestamp, 'timestamp')}
                      disabled={!timestamp}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {copied === 'timestamp' ? <Check size={14} /> : <Copy size={14} />}
                      {copied === 'timestamp' ? '已复制' : '复制'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={timestamp}
                    readOnly
                    placeholder="转换后的时间戳..."
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono bg-gray-50"
                  />
                </div>

                {timestamp && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>毫秒时间戳:</strong> {parseInt(timestamp) * 1000}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
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
          </motion.div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">时间戳说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">什么是 Unix 时间戳</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 从 1970年1月1日 00:00:00 UTC 开始的秒数</li>
                  <li>• 是一个整数，不受时区影响</li>
                  <li>• 广泛用于计算机系统和数据库</li>
                  <li>• 便于时间计算和比较</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见格式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>秒级时间戳:</strong> 10位数字 (如: 1640995200)</li>
                  <li>• <strong>毫秒级时间戳:</strong> 13位数字 (如: 1640995200000)</li>
                  <li>• <strong>ISO 8601:</strong> 2022-01-01T00:00:00Z</li>
                  <li>• <strong>本地格式:</strong> 根据系统设置显示</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TimestampConverter;