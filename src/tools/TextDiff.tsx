import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Check, GitCompare } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

const TextDiff: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [copied, setCopied] = useState(false);

  const diffResult = useMemo(() => {
    if (!text1.trim() && !text2.trim()) return [];

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: DiffLine[] = [];

    // 简单的行级差异算法
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined) {
        // 只在文本2中存在
        result.push({
          type: 'added',
          content: line2,
          lineNumber: i + 1
        });
      } else if (line2 === undefined) {
        // 只在文本1中存在
        result.push({
          type: 'removed',
          content: line1,
          lineNumber: i + 1
        });
      } else if (line1 === line2) {
        // 两个文本中都存在且相同
        result.push({
          type: 'unchanged',
          content: line1,
          lineNumber: i + 1
        });
      } else {
        // 两个文本中都存在但不同
        result.push({
          type: 'removed',
          content: line1,
          lineNumber: i + 1
        });
        result.push({
          type: 'added',
          content: line2,
          lineNumber: i + 1
        });
      }
    }

    return result;
  }, [text1, text2]);

  const copyDiff = async () => {
    const diffText = diffResult
      .map(line => {
        const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
        return prefix + line.content;
      })
      .join('\n');

    if (diffText) {
      try {
        await navigator.clipboard.writeText(diffText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  const loadExample = () => {
    setText1(`function hello() {
  console.log("Hello World");
  return true;
}

const name = "张三";
const age = 25;`);

    setText2(`function hello() {
  console.log("Hello, World!");
  console.log("欢迎使用文本对比工具");
  return true;
}

const name = "李四";
const age = 30;
const city = "北京";`);
  };

  const stats = useMemo(() => {
    const added = diffResult.filter(line => line.type === 'added').length;
    const removed = diffResult.filter(line => line.type === 'removed').length;
    const unchanged = diffResult.filter(line => line.type === 'unchanged').length;
    return { added, removed, unchanged };
  }, [diffResult]);

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">文本差异对比</h1>
            <p className="text-xl text-gray-600">
              比较两段文本的差异并高亮显示
            </p>
          </div>

          <div className="space-y-6">
            {/* 输入区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-900">原始文本</h2>
                <textarea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="在此输入原始文本..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-900">对比文本</h2>
                <textarea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="在此输入要对比的文本..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </motion.div>
            </div>

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center gap-4"
            >
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
            </motion.div>

            {/* 统计信息 */}
            {(text1.trim() || text2.trim()) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">差异统计</h3>
                  <button
                    onClick={copyDiff}
                    disabled={diffResult.length === 0}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制差异'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                    <div className="text-sm text-green-700">新增行</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                    <div className="text-sm text-red-700">删除行</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
                    <div className="text-sm text-gray-700">未变更行</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{diffResult.length}</div>
                    <div className="text-sm text-blue-700">总行数</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 差异显示 */}
            {diffResult.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">差异详情</h3>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        line.type === 'added'
                          ? 'bg-green-900 text-green-100'
                          : line.type === 'removed'
                          ? 'bg-red-900 text-red-100'
                          : 'text-gray-300'
                      } px-2 py-1 rounded mb-1`}
                    >
                      <span className="w-8 text-gray-500 text-right mr-4 flex-shrink-0">
                        {line.lineNumber}
                      </span>
                      <span className="w-4 flex-shrink-0">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap break-all">
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 使用说明 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">颜色说明</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-200 rounded"></span>
                      <span>绿色 - 新增的行</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-red-200 rounded"></span>
                      <span>红色 - 删除的行</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-gray-200 rounded"></span>
                      <span>灰色 - 未变更的行</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">功能特点</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 逐行对比文本差异</li>
                    <li>• 高亮显示变更内容</li>
                    <li>• 统计变更数量</li>
                    <li>• 支持复制差异结果</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TextDiff;