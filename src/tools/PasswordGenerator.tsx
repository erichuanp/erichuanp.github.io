import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' });

  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  const generatePassword = () => {
    let charset = '';
    
    if (options.includeUppercase) charset += characterSets.uppercase;
    if (options.includeLowercase) charset += characterSets.lowercase;
    if (options.includeNumbers) charset += characterSets.numbers;
    if (options.includeSymbols) charset += characterSets.symbols;

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characterSets.similar.includes(char)).join('');
    }

    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !characterSets.ambiguous.includes(char)).join('');
    }

    if (charset === '') {
      setPassword('请至少选择一种字符类型');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < options.length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    let feedback = [];

    // 长度检查
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // 字符类型检查
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // 复杂度检查
    if (pwd.length >= 10 && /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(pwd)) {
      score += 1;
    }

    let strengthText = '';
    let strengthColor = '';

    if (score <= 2) {
      strengthText = '弱';
      strengthColor = 'text-red-600';
    } else if (score <= 4) {
      strengthText = '中等';
      strengthColor = 'text-yellow-600';
    } else if (score <= 6) {
      strengthText = '强';
      strengthColor = 'text-green-600';
    } else {
      strengthText = '非常强';
      strengthColor = 'text-green-700';
    }

    setStrength({ score, text: strengthText, color: strengthColor });
  };

  useEffect(() => {
    generatePassword();
  }, [options]);

  useEffect(() => {
    if (password && !password.includes('请至少选择')) {
      calculateStrength(password);
    }
  }, [password]);

  const copyToClipboard = async () => {
    if (!password || password.includes('请至少选择')) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleOptionChange = (option: string, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };

  const presets = [
    {
      name: '简单密码',
      options: { length: 8, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: false, excludeSimilar: false, excludeAmbiguous: false }
    },
    {
      name: '标准密码',
      options: { length: 12, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, excludeSimilar: false, excludeAmbiguous: false }
    },
    {
      name: '强密码',
      options: { length: 16, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, excludeSimilar: true, excludeAmbiguous: false }
    },
    {
      name: '超强密码',
      options: { length: 24, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, excludeSimilar: true, excludeAmbiguous: true }
    }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">密码生成器</h1>
            <p className="text-xl text-gray-600">
              根据自定义规则生成安全密码
            </p>
          </div>

          {/* 生成的密码 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">生成的密码</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPassword ? '隐藏' : '显示'}
                </button>
                <button
                  onClick={generatePassword}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <RefreshCw size={16} />
                  重新生成
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!password || password.includes('请至少选择')}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="font-mono text-xl text-center break-all">
                {showPassword ? password : '•'.repeat(password.length)}
              </div>
            </div>

            {password && !password.includes('请至少选择') && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} className={strength.color} />
                  <span className={`font-medium ${strength.color}`}>
                    密码强度: {strength.text}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  长度: {password.length} 字符
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 密码选项 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">密码选项</h2>

              <div className="space-y-6">
                {/* 密码长度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    密码长度: {options.length}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* 字符类型 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">包含字符类型</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.includeUppercase}
                        onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">大写字母 (A-Z)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.includeLowercase}
                        onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">小写字母 (a-z)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.includeNumbers}
                        onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">数字 (0-9)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.includeSymbols}
                        onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">特殊符号 (!@#$%^&*)</span>
                    </label>
                  </div>
                </div>

                {/* 排除选项 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">排除选项</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.excludeSimilar}
                        onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">排除相似字符 (il1Lo0O)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.excludeAmbiguous}
                        onChange={(e) => handleOptionChange('excludeAmbiguous', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-sm">排除歧义字符 ({}[]())</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 预设模板 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">预设模板</h2>

              <div className="space-y-3">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setOptions(preset.options)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      长度: {preset.options.length} | 
                      {preset.options.includeUppercase && ' 大写'} 
                      {preset.options.includeLowercase && ' 小写'} 
                      {preset.options.includeNumbers && ' 数字'} 
                      {preset.options.includeSymbols && ' 符号'}
                    </div>
                  </button>
                ))}
              </div>

              {/* 密码强度指南 */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">密码强度指南</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>弱: 少于8位或字符类型单一</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>中等: 8-11位，包含多种字符类型</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>强: 12位以上，包含所有字符类型</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                    <span>非常强: 16位以上，复杂组合</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">密码安全建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">密码要求</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 至少12位字符长度</li>
                  <li>• 包含大小写字母、数字和符号</li>
                  <li>• 避免使用个人信息</li>
                  <li>• 不要使用常见密码</li>
                  <li>• 每个账户使用不同密码</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">安全提示</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 使用密码管理器存储密码</li>
                  <li>• 启用双因素认证</li>
                  <li>• 定期更换重要账户密码</li>
                  <li>• 不要在公共场所输入密码</li>
                  <li>• 警惕钓鱼网站和邮件</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PasswordGenerator;