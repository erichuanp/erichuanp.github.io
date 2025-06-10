import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Check, Search, AlertCircle } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface Match {
  match: string;
  index: number;
  groups?: string[];
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    try {
      if (!pattern.trim() || !testString.trim()) {
        setMatches([]);
        setError('');
        return;
      }

      const regex = new RegExp(pattern, flags);
      const foundMatches: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) break;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (err) {
      setError('正则表达式语法错误: ' + (err as Error).message);
      setMatches([]);
    }
  };

  const copyMatches = async () => {
    const matchText = matches.map(m => m.match).join('\n');
    if (matchText) {
      try {
        await navigator.clipboard.writeText(matchText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setError('');
  };

  const loadExample = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    setTestString('联系我们：admin@example.com 或 support@test.org\n技术支持：tech.support@company.co.uk');
    setFlags('gi');
  };

  const highlightMatches = (text: string) => {
    if (matches.length === 0) return text;

    let result = text;
    let offset = 0;

    matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlighted = `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`;
      result = result.slice(0, start) + highlighted + result.slice(end);
      offset += highlighted.length - match.match.length;
    });

    return result;
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">正则表达式测试器</h1>
            <p className="text-xl text-gray-600">
              测试和验证正则表达式的匹配结果
            </p>
          </div>

          <div className="space-y-6">
            {/* 正则表达式输入 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">正则表达式</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="输入正则表达式..."
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="标志 (g,i,m...)"
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
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
            </motion.div>

            {/* 测试文本 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">测试文本</h2>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="在此输入要测试的文本..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </motion.div>

            {/* 匹配结果 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  匹配结果 {matches.length > 0 && `(${matches.length} 个匹配)`}
                </h2>
                <button
                  onClick={copyMatches}
                  disabled={matches.length === 0}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '已复制' : '复制匹配'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">错误信息:</p>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {testString && !error && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">高亮显示</h3>
                  <div 
                    className="p-4 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap border"
                    dangerouslySetInnerHTML={{ __html: highlightMatches(testString) }}
                  />
                </div>
              )}

              {matches.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">详细匹配信息</h3>
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">匹配 {index + 1}:</span>
                          <span className="ml-2 font-mono bg-yellow-100 px-2 py-1 rounded">
                            {match.match}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">位置:</span>
                          <span className="ml-2">{match.index}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">长度:</span>
                          <span className="ml-2">{match.match.length}</span>
                        </div>
                      </div>
                      {match.groups && match.groups.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700">捕获组:</span>
                          <div className="ml-2 space-x-2">
                            {match.groups.map((group, groupIndex) => (
                              <span key={groupIndex} className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
                                ${groupIndex + 1}: {group}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !error && testString && pattern && (
                  <div className="text-center py-8 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p>没有找到匹配项</p>
                  </div>
                )
              )}
            </motion.div>

            {/* 常用正则表达式 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">常用正则表达式</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">基础模式</h4>
                  <div className="space-y-1 text-sm">
                    <div><code className="bg-gray-100 px-2 py-1 rounded">\\d+</code> - 数字</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">\\w+</code> - 单词字符</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">\\s+</code> - 空白字符</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">实用模式</h4>
                  <div className="space-y-1 text-sm">
                    <div><code className="bg-gray-100 px-2 py-1 rounded">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$</code> - 邮箱</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">^1[3-9]\\d{9}$</code> - 手机号</div>
                    <div><code className="bg-gray-100 px-2 py-1 rounded">^https?://</code> - URL</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegexTester;