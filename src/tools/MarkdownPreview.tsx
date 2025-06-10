import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Check, Eye, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PageTransition from '../components/common/PageTransition';

const MarkdownPreview: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const copyToClipboard = async () => {
    if (input) {
      try {
        await navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const clearAll = () => {
    setInput('');
  };

  const loadExample = () => {
    const example = `# Markdown 示例文档

## 这是一个二级标题

这是一段普通的文本，包含**粗体**和*斜体*文字。

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 列表示例

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项
  - 另一个嵌套项

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

### 链接和图片

[这是一个链接](https://example.com)

### 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |

### 引用

> 这是一个引用块
> 可以包含多行内容

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个未完成的任务

---

**注意**: 这只是 Markdown 语法的一个简单示例。`;
    setInput(example);
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Markdown 预览器</h1>
            <p className="text-xl text-gray-600">
              实时预览 Markdown 文档的渲染效果
            </p>
          </div>

          {/* 移动端标签切换 */}
          <div className="md:hidden mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'edit'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <FileText size={16} />
                编辑
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'preview'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Eye size={16} />
                预览
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 编辑区域 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`space-y-4 ${activeTab === 'edit' ? 'block' : 'hidden md:block'}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Markdown 编辑器</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!input}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入 Markdown 文本..."
                className="w-full h-96 md:h-[600px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex gap-2">
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

            {/* 预览区域 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`space-y-4 ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}
            >
              <h2 className="text-xl font-semibold text-gray-900">预览效果</h2>
              <div className="h-96 md:h-[600px] p-4 border border-gray-300 rounded-lg bg-white overflow-y-auto">
                {input ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    className="prose prose-sm max-w-none"
                  >
                    {input}
                  </ReactMarkdown>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Eye size={48} className="mx-auto mb-4 opacity-50" />
                      <p>在左侧输入 Markdown 文本以查看预览效果</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Markdown 语法说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">标题</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li># 一级标题</li>
                  <li>## 二级标题</li>
                  <li>### 三级标题</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">文本样式</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li>**粗体**</li>
                  <li>*斜体*</li>
                  <li>`代码`</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">列表</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li>- 无序列表</li>
                  <li>1. 有序列表</li>
                  <li>- [x] 任务列表</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">链接和图片</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li>[链接](url)</li>
                  <li>![图片](url)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">其他</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li>&gt; 引用</li>
                  <li>--- 分割线</li>
                  <li>```代码块```</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">表格</h4>
                <ul className="space-y-1 text-gray-600 text-sm font-mono">
                  <li>| 表头 | 表头 |</li>
                  <li>|------|------|</li>
                  <li>| 内容 | 内容 |</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MarkdownPreview;