import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Type, RotateCcw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const LoremGenerator: React.FC = () => {
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    type: 'paragraphs',
    count: 3,
    startWithLorem: true,
    language: 'latin'
  });
  const [copied, setCopied] = useState(false);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
  ];

  const chineseWords = [
    '这是', '一个', '中文', '占位', '文本', '生成器', '用于', '测试', '和', '演示',
    '目的', '在', '网页', '设计', '中', '经常', '需要', '使用', '占位', '文字',
    '来', '填充', '内容', '区域', '以便', '查看', '布局', '效果', '这些', '文字',
    '通常', '没有', '实际', '意义', '只是', '为了', '展示', '文本', '的', '排版',
    '样式', '和', '视觉', '效果', '在', '正式', '发布', '时', '会', '被', '真实',
    '内容', '替换', '占位', '文本', '帮助', '设计师', '和', '开发者', '专注于',
    '页面', '结构', '而', '不', '被', '具体', '内容', '分散', '注意力'
  ];

  const generateWords = (count: number): string => {
    const words = options.language === 'latin' ? loremWords : chineseWords;
    const result = [];
    
    if (options.startWithLorem && options.language === 'latin') {
      result.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      count -= 5;
    }

    for (let i = 0; i < count; i++) {
      result.push(words[Math.floor(Math.random() * words.length)]);
    }

    return result.join(' ') + '.';
  };

  const generateSentences = (count: number): string => {
    const sentences = [];
    
    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words per sentence
      const words = options.language === 'latin' ? loremWords : chineseWords;
      const sentence = [];
      
      if (i === 0 && options.startWithLorem && options.language === 'latin') {
        sentence.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        for (let j = 5; j < sentenceLength; j++) {
          sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
      } else {
        for (let j = 0; j < sentenceLength; j++) {
          sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
      }
      
      // Capitalize first word
      sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
      sentences.push(sentence.join(' ') + '.');
    }

    return sentences.join(' ');
  };

  const generateParagraphs = (count: number): string => {
    const paragraphs = [];
    
    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences per paragraph
      paragraphs.push(generateSentences(sentenceCount));
    }

    return paragraphs.join('\n\n');
  };

  const generateText = () => {
    let result = '';
    
    switch (options.type) {
      case 'words':
        result = generateWords(options.count);
        break;
      case 'sentences':
        result = generateSentences(options.count);
        break;
      case 'paragraphs':
        result = generateParagraphs(options.count);
        break;
      default:
        result = generateParagraphs(options.count);
    }

    setOutput(result);
  };

  React.useEffect(() => {
    generateText();
  }, [options]);

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearAll = () => {
    setOutput('');
  };

  const presets = [
    { name: '短文本', type: 'words', count: 50 },
    { name: '标准段落', type: 'paragraphs', count: 3 },
    { name: '长文章', type: 'paragraphs', count: 8 },
    { name: '句子列表', type: 'sentences', count: 10 }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Lorem Ipsum 生成器</h1>
            <p className="text-xl text-gray-600">
              生成用于设计和排版的占位文本
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 设置面板 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">生成设置</h2>

              <div className="space-y-6">
                {/* 文本类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文本类型</label>
                  <select
                    value={options.type}
                    onChange={(e) => setOptions(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="words">单词</option>
                    <option value="sentences">句子</option>
                    <option value="paragraphs">段落</option>
                  </select>
                </div>

                {/* 数量 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数量: {options.count}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={options.type === 'words' ? 200 : options.type === 'sentences' ? 50 : 20}
                    value={options.count}
                    onChange={(e) => setOptions(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>{options.type === 'words' ? 200 : options.type === 'sentences' ? 50 : 20}</span>
                  </div>
                </div>

                {/* 语言 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="latin">拉丁文 (Lorem Ipsum)</option>
                    <option value="chinese">中文占位文本</option>
                  </select>
                </div>

                {/* 选项 */}
                {options.language === 'latin' && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.startWithLorem}
                        onChange={(e) => setOptions(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                        className="mr-3"
                      />
                      <span className="text-sm">以 "Lorem ipsum" 开头</span>
                    </label>
                  </div>
                )}

                {/* 预设模板 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">快速预设</label>
                  <div className="space-y-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setOptions(prev => ({ ...prev, type: preset.type, count: preset.count }))}
                        className="w-full p-2 text-left text-sm border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={generateText}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    重新生成
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 输出区域 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">生成的文本</h2>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>

              <div className="h-96 overflow-y-auto">
                {output ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {output}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Type size={48} className="mx-auto mb-4 opacity-50" />
                      <p>调整设置以生成占位文本</p>
                    </div>
                  </div>
                )}
              </div>

              {output && (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>字符数: {output.length}</span>
                    <span>单词数: {output.split(/\s+/).length}</span>
                    <span>段落数: {output.split('\n\n').length}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">关于 Lorem Ipsum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">什么是 Lorem Ipsum</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 印刷和排版行业的标准占位文本</li>
                  <li>• 起源于公元前45年西塞罗的作品</li>
                  <li>• 文字无实际意义，避免内容干扰设计</li>
                  <li>• 字母分布接近正常英文文本</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用场景</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 网页设计和原型制作</li>
                  <li>• 印刷品排版和布局</li>
                  <li>• 软件界面设计</li>
                  <li>• 内容管理系统测试</li>
                  <li>• 演示文稿和模板制作</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>提示:</strong> 在正式发布前，请记得将所有占位文本替换为真实内容。占位文本仅用于设计和开发阶段。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoremGenerator;