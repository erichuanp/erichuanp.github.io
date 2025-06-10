import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Percent } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'change' | 'discount' | 'tip'>('basic');

  // 基础百分比计算
  const [basicCalc, setBasicCalc] = useState({
    value: '',
    percentage: '',
    result: ''
  });

  // 百分比变化计算
  const [changeCalc, setChangeCalc] = useState({
    oldValue: '',
    newValue: '',
    change: '',
    percentage: ''
  });

  // 折扣计算
  const [discountCalc, setDiscountCalc] = useState({
    originalPrice: '',
    discountPercent: '',
    discountAmount: '',
    finalPrice: ''
  });

  // 小费计算
  const [tipCalc, setTipCalc] = useState({
    billAmount: '',
    tipPercent: '',
    tipAmount: '',
    totalAmount: '',
    splitBy: 1,
    perPerson: ''
  });

  // 基础百分比计算
  useEffect(() => {
    const value = parseFloat(basicCalc.value);
    const percentage = parseFloat(basicCalc.percentage);
    
    if (!isNaN(value) && !isNaN(percentage)) {
      const result = (value * percentage / 100).toFixed(2);
      setBasicCalc(prev => ({ ...prev, result }));
    } else {
      setBasicCalc(prev => ({ ...prev, result: '' }));
    }
  }, [basicCalc.value, basicCalc.percentage]);

  // 百分比变化计算
  useEffect(() => {
    const oldValue = parseFloat(changeCalc.oldValue);
    const newValue = parseFloat(changeCalc.newValue);
    
    if (!isNaN(oldValue) && !isNaN(newValue) && oldValue !== 0) {
      const change = (newValue - oldValue).toFixed(2);
      const percentage = (((newValue - oldValue) / oldValue) * 100).toFixed(2);
      setChangeCalc(prev => ({ ...prev, change, percentage }));
    } else {
      setChangeCalc(prev => ({ ...prev, change: '', percentage: '' }));
    }
  }, [changeCalc.oldValue, changeCalc.newValue]);

  // 折扣计算
  useEffect(() => {
    const originalPrice = parseFloat(discountCalc.originalPrice);
    const discountPercent = parseFloat(discountCalc.discountPercent);
    
    if (!isNaN(originalPrice) && !isNaN(discountPercent)) {
      const discountAmount = (originalPrice * discountPercent / 100).toFixed(2);
      const finalPrice = (originalPrice - parseFloat(discountAmount)).toFixed(2);
      setDiscountCalc(prev => ({ ...prev, discountAmount, finalPrice }));
    } else {
      setDiscountCalc(prev => ({ ...prev, discountAmount: '', finalPrice: '' }));
    }
  }, [discountCalc.originalPrice, discountCalc.discountPercent]);

  // 小费计算
  useEffect(() => {
    const billAmount = parseFloat(tipCalc.billAmount);
    const tipPercent = parseFloat(tipCalc.tipPercent);
    
    if (!isNaN(billAmount) && !isNaN(tipPercent)) {
      const tipAmount = (billAmount * tipPercent / 100).toFixed(2);
      const totalAmount = (billAmount + parseFloat(tipAmount)).toFixed(2);
      const perPerson = (parseFloat(totalAmount) / tipCalc.splitBy).toFixed(2);
      setTipCalc(prev => ({ ...prev, tipAmount, totalAmount, perPerson }));
    } else {
      setTipCalc(prev => ({ ...prev, tipAmount: '', totalAmount: '', perPerson: '' }));
    }
  }, [tipCalc.billAmount, tipCalc.tipPercent, tipCalc.splitBy]);

  const clearAll = () => {
    setBasicCalc({ value: '', percentage: '', result: '' });
    setChangeCalc({ oldValue: '', newValue: '', change: '', percentage: '' });
    setDiscountCalc({ originalPrice: '', discountPercent: '', discountAmount: '', finalPrice: '' });
    setTipCalc({ billAmount: '', tipPercent: '', tipAmount: '', totalAmount: '', splitBy: 1, perPerson: '' });
  };

  const loadExamples = () => {
    setBasicCalc({ value: '200', percentage: '15', result: '30.00' });
    setChangeCalc({ oldValue: '100', newValue: '120', change: '20.00', percentage: '20.00' });
    setDiscountCalc({ originalPrice: '100', discountPercent: '20', discountAmount: '20.00', finalPrice: '80.00' });
    setTipCalc({ billAmount: '50', tipPercent: '18', tipAmount: '9.00', totalAmount: '59.00', splitBy: 2, perPerson: '29.50' });
  };

  const tabs = [
    { key: 'basic', label: '基础计算', icon: Calculator },
    { key: 'change', label: '变化率', icon: Percent },
    { key: 'discount', label: '折扣计算', icon: Calculator },
    { key: 'tip', label: '小费计算', icon: Calculator }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">百分比计算器</h1>
            <p className="text-xl text-gray-600">
              计算百分比、增长率、折扣等
            </p>
          </div>

          {/* 标签切换 */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1 max-w-2xl mx-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 基础百分比计算 */}
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">基础百分比计算</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">数值</label>
                  <input
                    type="number"
                    value={basicCalc.value}
                    onChange={(e) => setBasicCalc(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="输入数值..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">百分比 (%)</label>
                  <input
                    type="number"
                    value={basicCalc.percentage}
                    onChange={(e) => setBasicCalc(prev => ({ ...prev, percentage: e.target.value }))}
                    placeholder="输入百分比..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">结果</label>
                  <input
                    type="text"
                    value={basicCalc.result}
                    readOnly
                    placeholder="计算结果..."
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  />
                </div>
              </div>

              {basicCalc.result && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    <strong>{basicCalc.value}</strong> 的 <strong>{basicCalc.percentage}%</strong> 等于 <strong>{basicCalc.result}</strong>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 百分比变化计算 */}
          {activeTab === 'change' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">百分比变化计算</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">原始值</label>
                    <input
                      type="number"
                      value={changeCalc.oldValue}
                      onChange={(e) => setChangeCalc(prev => ({ ...prev, oldValue: e.target.value }))}
                      placeholder="输入原始值..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">新值</label>
                    <input
                      type="number"
                      value={changeCalc.newValue}
                      onChange={(e) => setChangeCalc(prev => ({ ...prev, newValue: e.target.value }))}
                      placeholder="输入新值..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">变化量</label>
                    <input
                      type="text"
                      value={changeCalc.change}
                      readOnly
                      placeholder="变化量..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">变化率 (%)</label>
                    <input
                      type="text"
                      value={changeCalc.percentage}
                      readOnly
                      placeholder="变化率..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                    />
                  </div>
                </div>
              </div>

              {changeCalc.percentage && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800">
                    从 <strong>{changeCalc.oldValue}</strong> 到 <strong>{changeCalc.newValue}</strong> 
                    {parseFloat(changeCalc.percentage) >= 0 ? ' 增长了 ' : ' 减少了 '}
                    <strong>{Math.abs(parseFloat(changeCalc.percentage))}%</strong>
                    （变化量: {parseFloat(changeCalc.change) >= 0 ? '+' : ''}{changeCalc.change}）
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 折扣计算 */}
          {activeTab === 'discount' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">折扣计算</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">原价</label>
                    <input
                      type="number"
                      value={discountCalc.originalPrice}
                      onChange={(e) => setDiscountCalc(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="输入原价..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">折扣率 (%)</label>
                    <input
                      type="number"
                      value={discountCalc.discountPercent}
                      onChange={(e) => setDiscountCalc(prev => ({ ...prev, discountPercent: e.target.value }))}
                      placeholder="输入折扣率..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">折扣金额</label>
                    <input
                      type="text"
                      value={discountCalc.discountAmount}
                      readOnly
                      placeholder="折扣金额..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最终价格</label>
                    <input
                      type="text"
                      value={discountCalc.finalPrice}
                      readOnly
                      placeholder="最终价格..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg text-green-600"
                    />
                  </div>
                </div>
              </div>

              {discountCalc.finalPrice && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    原价 <strong>¥{discountCalc.originalPrice}</strong>，
                    打 <strong>{(100 - parseFloat(discountCalc.discountPercent)).toFixed(1)}</strong> 折，
                    节省 <strong>¥{discountCalc.discountAmount}</strong>，
                    最终价格 <strong>¥{discountCalc.finalPrice}</strong>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 小费计算 */}
          {activeTab === 'tip' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">小费计算</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">账单金额</label>
                    <input
                      type="number"
                      value={tipCalc.billAmount}
                      onChange={(e) => setTipCalc(prev => ({ ...prev, billAmount: e.target.value }))}
                      placeholder="输入账单金额..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">小费率 (%)</label>
                    <input
                      type="number"
                      value={tipCalc.tipPercent}
                      onChange={(e) => setTipCalc(prev => ({ ...prev, tipPercent: e.target.value }))}
                      placeholder="输入小费率..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="mt-2 flex gap-2">
                      {[15, 18, 20, 25].map(percent => (
                        <button
                          key={percent}
                          onClick={() => setTipCalc(prev => ({ ...prev, tipPercent: percent.toString() }))}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分摊人数</label>
                    <input
                      type="number"
                      min="1"
                      value={tipCalc.splitBy}
                      onChange={(e) => setTipCalc(prev => ({ ...prev, splitBy: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">小费金额</label>
                    <input
                      type="text"
                      value={tipCalc.tipAmount}
                      readOnly
                      placeholder="小费金额..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">总金额</label>
                    <input
                      type="text"
                      value={tipCalc.totalAmount}
                      readOnly
                      placeholder="总金额..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">每人支付</label>
                    <input
                      type="text"
                      value={tipCalc.perPerson}
                      readOnly
                      placeholder="每人支付..."
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {tipCalc.totalAmount && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-purple-800">
                    账单 <strong>¥{tipCalc.billAmount}</strong> + 
                    小费 <strong>¥{tipCalc.tipAmount}</strong> ({tipCalc.tipPercent}%) = 
                    总计 <strong>¥{tipCalc.totalAmount}</strong>
                    {tipCalc.splitBy > 1 && (
                      <span>，{tipCalc.splitBy}人分摊，每人 <strong>¥{tipCalc.perPerson}</strong></span>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex justify-center gap-4"
          >
            <button
              onClick={loadExamples}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              加载示例
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              清空所有
            </button>
          </motion.div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">计算说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">计算类型</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>基础计算:</strong> 计算某个数值的百分比</li>
                  <li>• <strong>变化率:</strong> 计算两个数值之间的百分比变化</li>
                  <li>• <strong>折扣计算:</strong> 计算打折后的价格</li>
                  <li>• <strong>小费计算:</strong> 计算小费和总金额</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常用场景</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 购物折扣计算</li>
                  <li>• 投资收益率计算</li>
                  <li>• 餐厅小费计算</li>
                  <li>• 税费计算</li>
                  <li>• 成绩和分数计算</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PercentageCalculator;