import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Globe, Wifi, Copy, Check } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface IpInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  lat?: number;
  lon?: number;
  type: 'IPv4' | 'IPv6';
}

const IpLookup: React.FC = () => {
  const [inputIp, setInputIp] = useState('');
  const [currentIp, setCurrentIp] = useState('');
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  // 获取用户当前IP
  useEffect(() => {
    getCurrentIp();
  }, []);

  const getCurrentIp = async () => {
    try {
      // 模拟获取当前IP（在实际应用中，你需要使用真实的IP查询服务）
      const mockCurrentIp = '8.8.8.8'; // Google DNS 作为示例
      setCurrentIp(mockCurrentIp);
      setInputIp(mockCurrentIp);
    } catch (error) {
      console.error('获取当前IP失败:', error);
    }
  };

  // 验证IP地址格式
  const validateIp = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  // 模拟IP查询（在实际应用中，你需要使用真实的IP查询API）
  const mockIpLookup = (ip: string): Promise<IpInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟不同IP的查询结果
        const mockData: { [key: string]: IpInfo } = {
          '8.8.8.8': {
            ip: '8.8.8.8',
            country: 'United States',
            region: 'California',
            city: 'Mountain View',
            timezone: 'America/Los_Angeles',
            isp: 'Google LLC',
            org: 'Google Public DNS',
            as: 'AS15169 Google LLC',
            lat: 37.4056,
            lon: -122.0775,
            type: 'IPv4'
          },
          '1.1.1.1': {
            ip: '1.1.1.1',
            country: 'United States',
            region: 'California',
            city: 'San Francisco',
            timezone: 'America/Los_Angeles',
            isp: 'Cloudflare, Inc.',
            org: 'APNIC and Cloudflare DNS Resolver project',
            as: 'AS13335 Cloudflare, Inc.',
            lat: 37.7621,
            lon: -122.3971,
            type: 'IPv4'
          }
        };

        // 如果有预设数据就返回，否则返回通用模拟数据
        if (mockData[ip]) {
          resolve(mockData[ip]);
        } else {
          resolve({
            ip,
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            timezone: 'Unknown',
            isp: 'Unknown ISP',
            org: 'Unknown Organization',
            as: 'Unknown AS',
            type: ip.includes(':') ? 'IPv6' : 'IPv4'
          });
        }
      }, 1000);
    });
  };

  const lookupIp = async () => {
    if (!inputIp.trim()) {
      setError('请输入IP地址');
      return;
    }

    if (!validateIp(inputIp.trim())) {
      setError('请输入有效的IP地址');
      return;
    }

    setLoading(true);
    setError('');
    setIpInfo(null);

    try {
      const info = await mockIpLookup(inputIp.trim());
      setIpInfo(info);
    } catch (err) {
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
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
    setInputIp('');
    setIpInfo(null);
    setError('');
  };

  const loadExamples = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'OpenDNS', ip: '208.67.222.222' },
    { name: '本机IP', ip: currentIp }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">IP 地址查询</h1>
            <p className="text-xl text-gray-600">
              查询 IP 地址的地理位置和网络信息
            </p>
          </div>

          {/* 查询输入 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">IP 地址查询</h2>
            
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                placeholder="输入 IP 地址 (例如: 8.8.8.8)"
                className="flex-1 p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && lookupIp()}
              />
              <button
                onClick={lookupIp}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search size={16} />
                )}
                {loading ? '查询中...' : '查询'}
              </button>
            </div>

            {/* 快速示例 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">快速示例</label>
              <div className="flex flex-wrap gap-2">
                {loadExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputIp(example.ip)}
                    disabled={!example.ip}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={getCurrentIp}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                获取我的IP
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                清空
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </motion.div>

          {/* 查询结果 */}
          {ipInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">查询结果</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ipInfo.type === 'IPv4' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {ipInfo.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Globe size={20} />
                    基本信息
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">IP 地址</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-gray-900">{ipInfo.ip}</code>
                        <button
                          onClick={() => copyToClipboard(ipInfo.ip, 'ip')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copied === 'ip' ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-500" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">类型</span>
                      <span className="text-sm text-gray-900">{ipInfo.type}</span>
                    </div>
                  </div>
                </div>

                {/* 地理位置 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin size={20} />
                    地理位置
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">国家</span>
                      <span className="text-sm text-gray-900">{ipInfo.country}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">地区</span>
                      <span className="text-sm text-gray-900">{ipInfo.region}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">城市</span>
                      <span className="text-sm text-gray-900">{ipInfo.city}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">时区</span>
                      <span className="text-sm text-gray-900">{ipInfo.timezone}</span>
                    </div>

                    {ipInfo.lat && ipInfo.lon && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">坐标</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-gray-900">
                            {ipInfo.lat.toFixed(4)}, {ipInfo.lon.toFixed(4)}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`${ipInfo.lat}, ${ipInfo.lon}`, 'coords')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copied === 'coords' ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-500" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 网络信息 */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Wifi size={20} />
                    网络信息
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">ISP</span>
                      <span className="text-sm text-gray-900 text-right">{ipInfo.isp}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">组织</span>
                      <span className="text-sm text-gray-900 text-right">{ipInfo.org}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <span className="text-sm font-medium text-gray-700">AS 信息</span>
                      <span className="text-sm text-gray-900 text-right">{ipInfo.as}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持的格式</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>IPv4:</strong> 192.168.1.1</li>
                  <li>• <strong>IPv6:</strong> 2001:db8::1</li>
                  <li>• 支持公网和内网IP查询</li>
                  <li>• 自动识别IP地址类型</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">查询信息</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 地理位置（国家、地区、城市）</li>
                  <li>• 网络服务提供商（ISP）</li>
                  <li>• 自治系统（AS）信息</li>
                  <li>• 时区和坐标信息</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> 这是一个演示版本，使用模拟数据。在生产环境中，需要集成真实的IP地理位置查询API服务。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default IpLookup;