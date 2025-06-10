import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Copy, Check, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface ParsedUserAgent {
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    type: string;
    vendor: string;
    model: string;
  };
  engine: {
    name: string;
    version: string;
  };
}

const UserAgentParser: React.FC = () => {
  const [userAgent, setUserAgent] = useState('');
  const [currentUserAgent, setCurrentUserAgent] = useState('');
  const [parsedInfo, setParsedInfo] = useState<ParsedUserAgent | null>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // 获取当前浏览器的 User Agent
    const current = navigator.userAgent;
    setCurrentUserAgent(current);
    setUserAgent(current);
    parseUserAgent(current);
  }, []);

  // 简单的 User Agent 解析器
  const parseUserAgent = (ua: string) => {
    if (!ua.trim()) {
      setParsedInfo(null);
      return;
    }

    const parsed: ParsedUserAgent = {
      browser: { name: 'Unknown', version: 'Unknown' },
      os: { name: 'Unknown', version: 'Unknown' },
      device: { type: 'Unknown', vendor: 'Unknown', model: 'Unknown' },
      engine: { name: 'Unknown', version: 'Unknown' }
    };

    // 解析浏览器
    if (ua.includes('Chrome')) {
      const match = ua.match(/Chrome\/([0-9.]+)/);
      parsed.browser.name = 'Chrome';
      parsed.browser.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/([0-9.]+)/);
      parsed.browser.name = 'Firefox';
      parsed.browser.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/([0-9.]+)/);
      parsed.browser.name = 'Safari';
      parsed.browser.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edge')) {
      const match = ua.match(/Edge\/([0-9.]+)/);
      parsed.browser.name = 'Edge';
      parsed.browser.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Opera')) {
      const match = ua.match(/Opera\/([0-9.]+)/);
      parsed.browser.name = 'Opera';
      parsed.browser.version = match ? match[1] : 'Unknown';
    }

    // 解析操作系统
    if (ua.includes('Windows NT')) {
      const match = ua.match(/Windows NT ([0-9.]+)/);
      parsed.os.name = 'Windows';
      const version = match ? match[1] : 'Unknown';
      // 转换 Windows 版本号
      const windowsVersions: { [key: string]: string } = {
        '10.0': '10',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.1': 'XP'
      };
      parsed.os.version = windowsVersions[version] || version;
    } else if (ua.includes('Mac OS X')) {
      const match = ua.match(/Mac OS X ([0-9_]+)/);
      parsed.os.name = 'macOS';
      parsed.os.version = match ? match[1].replace(/_/g, '.') : 'Unknown';
    } else if (ua.includes('Linux')) {
      parsed.os.name = 'Linux';
      if (ua.includes('Android')) {
        const match = ua.match(/Android ([0-9.]+)/);
        parsed.os.name = 'Android';
        parsed.os.version = match ? match[1] : 'Unknown';
      }
    } else if (ua.includes('iPhone OS')) {
      const match = ua.match(/OS ([0-9_]+)/);
      parsed.os.name = 'iOS';
      parsed.os.version = match ? match[1].replace(/_/g, '.') : 'Unknown';
    }

    // 解析设备类型
    if (ua.includes('Mobile') || ua.includes('Android')) {
      parsed.device.type = 'Mobile';
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
      parsed.device.type = 'Tablet';
    } else {
      parsed.device.type = 'Desktop';
    }

    // 解析设备品牌和型号
    if (ua.includes('iPhone')) {
      parsed.device.vendor = 'Apple';
      parsed.device.model = 'iPhone';
    } else if (ua.includes('iPad')) {
      parsed.device.vendor = 'Apple';
      parsed.device.model = 'iPad';
    } else if (ua.includes('Samsung')) {
      parsed.device.vendor = 'Samsung';
    } else if (ua.includes('Huawei')) {
      parsed.device.vendor = 'Huawei';
    }

    // 解析引擎
    if (ua.includes('WebKit')) {
      parsed.engine.name = 'WebKit';
      const match = ua.match(/WebKit\/([0-9.]+)/);
      parsed.engine.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Gecko')) {
      parsed.engine.name = 'Gecko';
      const match = ua.match(/Gecko\/([0-9]+)/);
      parsed.engine.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Trident')) {
      parsed.engine.name = 'Trident';
      const match = ua.match(/Trident\/([0-9.]+)/);
      parsed.engine.version = match ? match[1] : 'Unknown';
    }

    setParsedInfo(parsed);
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

  const clearAll = () => {
    setUserAgent('');
    setParsedInfo(null);
  };

  const loadCurrent = () => {
    setUserAgent(currentUserAgent);
    parseUserAgent(currentUserAgent);
  };

  const commonUserAgents = [
    {
      name: 'Chrome (Windows)',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: 'Firefox (Windows)',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
    },
    {
      name: 'Safari (macOS)',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    },
    {
      name: 'Chrome (Android)',
      ua: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
      name: 'Safari (iPhone)',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
    },
    {
      name: 'Edge (Windows)',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    }
  ];

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={20} className="text-blue-600" />;
      case 'tablet':
        return <Monitor size={20} className="text-green-600" />;
      default:
        return <Monitor size={20} className="text-gray-600" />;
    }
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">User Agent 解析器</h1>
            <p className="text-xl text-gray-600">
              解析和分析浏览器 User Agent 字符串
            </p>
          </div>

          {/* 输入区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Agent 字符串</h2>
            
            <div className="space-y-4">
              <textarea
                value={userAgent}
                onChange={(e) => {
                  setUserAgent(e.target.value);
                  parseUserAgent(e.target.value);
                }}
                placeholder="输入 User Agent 字符串..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={loadCurrent}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <RefreshCw size={16} />
                  使用当前浏览器
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  清空
                </button>
                <button
                  onClick={() => copyToClipboard(userAgent, 'ua')}
                  disabled={!userAgent}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {copied === 'ua' ? <Check size={16} /> : <Copy size={16} />}
                  {copied === 'ua' ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* 常用 User Agent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">常用 User Agent</h2>
            
            <div className="space-y-2">
              {commonUserAgents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUserAgent(item.ua);
                    parseUserAgent(item.ua);
                  }}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600 font-mono truncate">{item.ua}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 解析结果 */}
          {parsedInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">解析结果</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 浏览器信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Monitor size={20} />
                    浏览器信息
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">浏览器</span>
                      <span className="text-sm text-gray-900">{parsedInfo.browser.name}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">版本</span>
                      <span className="text-sm text-gray-900">{parsedInfo.browser.version}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">引擎</span>
                      <span className="text-sm text-gray-900">{parsedInfo.engine.name}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">引擎版本</span>
                      <span className="text-sm text-gray-900">{parsedInfo.engine.version}</span>
                    </div>
                  </div>
                </div>

                {/* 系统信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    {getDeviceIcon(parsedInfo.device.type)}
                    系统信息
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">操作系统</span>
                      <span className="text-sm text-gray-900">{parsedInfo.os.name}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">系统版本</span>
                      <span className="text-sm text-gray-900">{parsedInfo.os.version}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">设备类型</span>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(parsedInfo.device.type)}
                        <span className="text-sm text-gray-900">{parsedInfo.device.type}</span>
                      </div>
                    </div>

                    {parsedInfo.device.vendor !== 'Unknown' && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">设备厂商</span>
                        <span className="text-sm text-gray-900">{parsedInfo.device.vendor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 完整信息摘要 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">信息摘要</h4>
                <p className="text-blue-800 text-sm">
                  {parsedInfo.browser.name} {parsedInfo.browser.version} 运行在 {parsedInfo.os.name} {parsedInfo.os.version} 
                  {parsedInfo.device.type !== 'Unknown' && ` (${parsedInfo.device.type})`}
                  {parsedInfo.device.vendor !== 'Unknown' && ` - ${parsedInfo.device.vendor}`}
                </p>
              </div>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">关于 User Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">什么是 User Agent</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 浏览器发送给服务器的标识字符串</li>
                  <li>• 包含浏览器、操作系统、设备等信息</li>
                  <li>• 用于内容适配和统计分析</li>
                  <li>• 可以被修改或伪造</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见用途</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 网站兼容性检测</li>
                  <li>• 移动端适配</li>
                  <li>• 用户行为分析</li>
                  <li>• 安全防护和反爬虫</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> User Agent 可以被轻易修改，不应作为安全验证的唯一依据。此工具提供基础解析功能，复杂的 User Agent 可能需要更专业的解析库。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserAgentParser;