import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Trash2, RotateCcw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface FilteredImage {
  original: File;
  filtered: Blob;
  originalUrl: string;
  filteredUrl: string;
  filters: FilterSettings;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

const ImageFilter: React.FC = () => {
  const [images, setImages] = useState<FilteredImage[]>([]);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyFilters = (file: File, filterSettings: FilterSettings): Promise<FilteredImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (!ctx) {
          reject(new Error('无法获取 Canvas 上下文'));
          return;
        }

        // 应用滤镜
        const filterString = [
          `brightness(${filterSettings.brightness}%)`,
          `contrast(${filterSettings.contrast}%)`,
          `saturate(${filterSettings.saturation}%)`,
          `hue-rotate(${filterSettings.hue}deg)`,
          `blur(${filterSettings.blur}px)`,
          `grayscale(${filterSettings.grayscale}%)`,
          `sepia(${filterSettings.sepia}%)`,
          `invert(${filterSettings.invert}%)`
        ].join(' ');

        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalUrl = URL.createObjectURL(file);
              const filteredUrl = URL.createObjectURL(blob);

              resolve({
                original: file,
                filtered: blob,
                originalUrl,
                filteredUrl,
                filters: { ...filterSettings }
              });
            } else {
              reject(new Error('应用滤镜失败'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsProcessing(true);
    const newImages: FilteredImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const filteredImage = await applyFilters(file, filters);
        newImages.push(filteredImage);
      } catch (error) {
        console.error('应用滤镜失败:', error);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateFilters = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    const updatedImages: FilteredImage[] = [];

    for (const image of images) {
      try {
        // 清理旧的 URL
        URL.revokeObjectURL(image.filteredUrl);
        
        // 重新应用滤镜
        const filteredImage = await applyFilters(image.original, filters);
        updatedImages.push(filteredImage);
      } catch (error) {
        console.error('更新滤镜失败:', error);
        // 保留原来的图片
        updatedImages.push(image);
      }
    }

    setImages(updatedImages);
    setIsProcessing(false);
  };

  const downloadImage = (image: FilteredImage) => {
    const link = document.createElement('a');
    link.href = image.filteredUrl;
    link.download = `filtered_${image.original.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const removeImage = (index: number) => {
    const image = images[index];
    URL.revokeObjectURL(image.originalUrl);
    URL.revokeObjectURL(image.filteredUrl);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.filteredUrl);
    });
    setImages([]);
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0
    });
  };

  const presetFilters = [
    {
      name: '原始',
      filters: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 }
    },
    {
      name: '黑白',
      filters: { brightness: 100, contrast: 110, saturation: 0, hue: 0, blur: 0, grayscale: 100, sepia: 0, invert: 0 }
    },
    {
      name: '复古',
      filters: { brightness: 110, contrast: 90, saturation: 80, hue: 10, blur: 0, grayscale: 0, sepia: 60, invert: 0 }
    },
    {
      name: '鲜艳',
      filters: { brightness: 110, contrast: 120, saturation: 150, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 }
    },
    {
      name: '冷色调',
      filters: { brightness: 95, contrast: 105, saturation: 110, hue: 200, blur: 0, grayscale: 0, sepia: 0, invert: 0 }
    },
    {
      name: '暖色调',
      filters: { brightness: 105, contrast: 95, saturation: 120, hue: 30, blur: 0, grayscale: 0, sepia: 20, invert: 0 }
    }
  ];

  const filterControls = [
    { key: 'brightness', label: '亮度', min: 0, max: 200, unit: '%' },
    { key: 'contrast', label: '对比度', min: 0, max: 200, unit: '%' },
    { key: 'saturation', label: '饱和度', min: 0, max: 200, unit: '%' },
    { key: 'hue', label: '色相', min: 0, max: 360, unit: '°' },
    { key: 'blur', label: '模糊', min: 0, max: 10, unit: 'px' },
    { key: 'grayscale', label: '灰度', min: 0, max: 100, unit: '%' },
    { key: 'sepia', label: '褐色', min: 0, max: 100, unit: '%' },
    { key: 'invert', label: '反色', min: 0, max: 100, unit: '%' }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">图片滤镜</h1>
            <p className="text-xl text-gray-600">
              为图片添加各种视觉效果和滤镜
            </p>
          </div>

          {/* 滤镜控制面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">滤镜设置</h2>
              <div className="flex gap-2">
                <button
                  onClick={updateFilters}
                  disabled={images.length === 0 || isProcessing}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  应用滤镜
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <RotateCcw size={16} />
                  重置
                </button>
              </div>
            </div>

            {/* 预设滤镜 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">预设滤镜</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {presetFilters.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setFilters(preset.filters)}
                    className="p-2 text-sm border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 滤镜控制器 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filterControls.map((control) => (
                <div key={control.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {control.label}: {filters[control.key as keyof FilterSettings]}{control.unit}
                  </label>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={filters[control.key as keyof FilterSettings]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [control.key]: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* 上传区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 mb-2">拖拽图片到这里或点击选择</p>
              <p className="text-sm text-gray-500">支持 JPG, PNG, GIF, WebP 等格式</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {isProcessing && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-600">正在应用滤镜...</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* 操作按钮 */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center gap-4 mb-8"
            >
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                下载全部 ({images.length})
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                清空全部
              </button>
            </motion.div>
          )}

          {/* 图片列表 */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {images.map((image, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 原始图片 */}
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 mb-2">原始图片</h4>
                      <img
                        src={image.originalUrl}
                        alt="Original"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <p className="text-xs text-gray-500 truncate">{image.original.name}</p>
                    </div>

                    {/* 滤镜后图片 */}
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 mb-2">应用滤镜后</h4>
                      <img
                        src={image.filteredUrl}
                        alt="Filtered"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <div className="flex gap-2 mt-2 justify-center">
                        <button
                          onClick={() => downloadImage(image)}
                          className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Download size={14} />
                          下载
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Trash2 size={14} />
                          删除
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 滤镜参数显示 */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">当前滤镜参数:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                      <span>亮度: {image.filters.brightness}%</span>
                      <span>对比度: {image.filters.contrast}%</span>
                      <span>饱和度: {image.filters.saturation}%</span>
                      <span>色相: {image.filters.hue}°</span>
                      <span>模糊: {image.filters.blur}px</span>
                      <span>灰度: {image.filters.grayscale}%</span>
                      <span>褐色: {image.filters.sepia}%</span>
                      <span>反色: {image.filters.invert}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 空状态 */}
          {images.length === 0 && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">上传图片开始应用滤镜</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">滤镜效果说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">基础调整</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>亮度:</strong> 调整图片的明暗程度</li>
                  <li>• <strong>对比度:</strong> 调整明暗对比强度</li>
                  <li>• <strong>饱和度:</strong> 调整颜色的鲜艳程度</li>
                  <li>• <strong>色相:</strong> 改变整体色调</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">特效滤镜</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>模糊:</strong> 添加模糊效果</li>
                  <li>• <strong>灰度:</strong> 转换为黑白图片</li>
                  <li>• <strong>褐色:</strong> 添加复古褐色效果</li>
                  <li>• <strong>反色:</strong> 反转图片颜色</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>提示:</strong> 可以组合使用多种滤镜效果。调整参数后点击"应用滤镜"按钮更新所有图片。所有处理都在浏览器本地完成。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ImageFilter;