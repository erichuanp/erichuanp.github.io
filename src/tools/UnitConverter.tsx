import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Calculator } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface ConversionUnit {
  name: string;
  symbol: string;
  factor: number; // 相对于基础单位的转换因子
}

interface UnitCategory {
  name: string;
  baseUnit: string;
  units: ConversionUnit[];
}

const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  const categories: { [key: string]: UnitCategory } = {
    length: {
      name: '长度',
      baseUnit: 'meter',
      units: [
        { name: '毫米', symbol: 'mm', factor: 0.001 },
        { name: '厘米', symbol: 'cm', factor: 0.01 },
        { name: '分米', symbol: 'dm', factor: 0.1 },
        { name: '米', symbol: 'm', factor: 1 },
        { name: '千米', symbol: 'km', factor: 1000 },
        { name: '英寸', symbol: 'in', factor: 0.0254 },
        { name: '英尺', symbol: 'ft', factor: 0.3048 },
        { name: '码', symbol: 'yd', factor: 0.9144 },
        { name: '英里', symbol: 'mi', factor: 1609.344 }
      ]
    },
    weight: {
      name: '重量',
      baseUnit: 'gram',
      units: [
        { name: '毫克', symbol: 'mg', factor: 0.001 },
        { name: '克', symbol: 'g', factor: 1 },
        { name: '千克', symbol: 'kg', factor: 1000 },
        { name: '吨', symbol: 't', factor: 1000000 },
        { name: '盎司', symbol: 'oz', factor: 28.3495 },
        { name: '磅', symbol: 'lb', factor: 453.592 },
        { name: '石', symbol: 'st', factor: 6350.29 }
      ]
    },
    temperature: {
      name: '温度',
      baseUnit: 'celsius',
      units: [
        { name: '摄氏度', symbol: '°C', factor: 1 },
        { name: '华氏度', symbol: '°F', factor: 1 },
        { name: '开尔文', symbol: 'K', factor: 1 }
      ]
    },
    area: {
      name: '面积',
      baseUnit: 'square_meter',
      units: [
        { name: '平方毫米', symbol: 'mm²', factor: 0.000001 },
        { name: '平方厘米', symbol: 'cm²', factor: 0.0001 },
        { name: '平方米', symbol: 'm²', factor: 1 },
        { name: '公顷', symbol: 'ha', factor: 10000 },
        { name: '平方千米', symbol: 'km²', factor: 1000000 },
        { name: '平方英寸', symbol: 'in²', factor: 0.00064516 },
        { name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
        { name: '英亩', symbol: 'acre', factor: 4046.86 }
      ]
    },
    volume: {
      name: '体积',
      baseUnit: 'liter',
      units: [
        { name: '毫升', symbol: 'ml', factor: 0.001 },
        { name: '升', symbol: 'L', factor: 1 },
        { name: '立方米', symbol: 'm³', factor: 1000 },
        { name: '液体盎司', symbol: 'fl oz', factor: 0.0295735 },
        { name: '杯', symbol: 'cup', factor: 0.236588 },
        { name: '品脱', symbol: 'pt', factor: 0.473176 },
        { name: '夸脱', symbol: 'qt', factor: 0.946353 },
        { name: '加仑', symbol: 'gal', factor: 3.78541 }
      ]
    },
    speed: {
      name: '速度',
      baseUnit: 'meter_per_second',
      units: [
        { name: '米/秒', symbol: 'm/s', factor: 1 },
        { name: '千米/小时', symbol: 'km/h', factor: 0.277778 },
        { name: '英里/小时', symbol: 'mph', factor: 0.44704 },
        { name: '节', symbol: 'knot', factor: 0.514444 },
        { name: '英尺/秒', symbol: 'ft/s', factor: 0.3048 }
      ]
    }
  };

  useEffect(() => {
    const category = categories[selectedCategory];
    if (category && category.units.length > 0) {
      setFromUnit(category.units[0].symbol);
      setToUnit(category.units[1]?.symbol || category.units[0].symbol);
    }
  }, [selectedCategory]);

  useEffect(() => {
    convertValue();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const convertValue = () => {
    if (!inputValue || !fromUnit || !toUnit) {
      setOutputValue('');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setOutputValue('');
      return;
    }

    const category = categories[selectedCategory];
    const fromUnitData = category.units.find(u => u.symbol === fromUnit);
    const toUnitData = category.units.find(u => u.symbol === toUnit);

    if (!fromUnitData || !toUnitData) {
      setOutputValue('');
      return;
    }

    let result: number;

    // 特殊处理温度转换
    if (selectedCategory === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      // 先转换为基础单位，再转换为目标单位
      const baseValue = value * fromUnitData.factor;
      result = baseValue / toUnitData.factor;
    }

    setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''));
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // 先转换为摄氏度
    let celsius: number;
    switch (from) {
      case '°C':
        celsius = value;
        break;
      case '°F':
        celsius = (value - 32) * 5/9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // 再从摄氏度转换为目标单位
    switch (to) {
      case '°C':
        return celsius;
      case '°F':
        return celsius * 9/5 + 32;
      case 'K':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    const tempValue = inputValue;
    setInputValue(outputValue);
    setOutputValue(tempValue);
  };

  const clearAll = () => {
    setInputValue('');
    setOutputValue('');
  };

  const loadExample = () => {
    setInputValue('100');
  };

  const currentCategory = categories[selectedCategory];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">单位转换器</h1>
            <p className="text-xl text-gray-600">
              长度、重量、温度、面积等单位换算
            </p>
          </div>

          {/* 类别选择 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">选择转换类别</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 rounded-lg border-2 transition-colors text-center ${
                    selectedCategory === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 转换器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentCategory.name}转换</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
              {/* 输入值 */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">输入值</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入数值..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {currentCategory.units.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 交换按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={swapUnits}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="交换单位"
                >
                  <ArrowLeftRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* 输出值 */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">转换结果</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outputValue}
                    readOnly
                    placeholder="转换结果..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {currentCategory.units.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
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
            </div>
          </motion.div>

          {/* 常用转换表 */}
          {inputValue && outputValue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {inputValue} {fromUnit} 转换为其他单位
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentCategory.units
                  .filter(unit => unit.symbol !== fromUnit)
                  .map(unit => {
                    const value = parseFloat(inputValue);
                    let result: number;
                    
                    if (selectedCategory === 'temperature') {
                      result = convertTemperature(value, fromUnit, unit.symbol);
                    } else {
                      const fromUnitData = currentCategory.units.find(u => u.symbol === fromUnit);
                      if (fromUnitData) {
                        const baseValue = value * fromUnitData.factor;
                        result = baseValue / unit.factor;
                      } else {
                        result = 0;
                      }
                    }
                    
                    return (
                      <div key={unit.symbol} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">{unit.name}</div>
                        <div className="font-mono text-lg text-gray-900">
                          {result.toFixed(6).replace(/\.?0+$/, '')} {unit.symbol}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* 空状态 */}
          {!inputValue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <Calculator size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">输入数值开始转换</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持的单位类别</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>长度:</strong> 毫米、厘米、米、千米、英寸、英尺等</li>
                  <li>• <strong>重量:</strong> 毫克、克、千克、吨、盎司、磅等</li>
                  <li>• <strong>温度:</strong> 摄氏度、华氏度、开尔文</li>
                  <li>• <strong>面积:</strong> 平方米、公顷、英亩等</li>
                  <li>• <strong>体积:</strong> 毫升、升、立方米、加仑等</li>
                  <li>• <strong>速度:</strong> 米/秒、千米/小时、英里/小时等</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">使用技巧</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 支持小数和负数输入</li>
                  <li>• 点击交换按钮快速切换单位</li>
                  <li>• 实时显示转换结果</li>
                  <li>• 显示所有相关单位的转换结果</li>
                  <li>• 温度转换使用精确的转换公式</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UnitConverter;