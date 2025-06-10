import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Trash2, Lock, Unlock } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface ResizedImage {
  original: File;
  resized: Blob;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  originalUrl: string;
  resizedUrl: string;
  originalSize: number;
  resizedSize: number;
}

const ImageResizer: React.FC = () => {
  const [images, setImages] = useState<ResizedImage[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<'exact' | 'fit' | 'fill'>('fit');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<ResizedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        let newWidth = width;
        let newHeight = height;

        // 根据调整模式计算新尺寸
        if (resizeMode === 'fit') {
          // 等比缩放，适应指定尺寸
          const ratio = Math.min(width / originalWidth, height / originalHeight);
          newWidth = Math.round(originalWidth * ratio);
          newHeight = Math.round(originalHeight * ratio);
        } else if (resizeMode === 'fill') {
          // 等比缩放，填满指定尺寸
          const ratio = Math.max(width / originalWidth, height / originalHeight);
          newWidth = Math.round(originalWidth * ratio);
          newHeight = Math.round(originalHeight * ratio);
        }
        // exact 模式直接使用指定尺寸

        canvas.width = resizeMode === 'exact' ? width : newWidth;
        canvas.height = resizeMode === 'exact' ? height : newHeight;

        // 绘制调整后的图片
        if (resizeMode === 'fill' && (newWidth > width || newHeight > height)) {
          // 居中裁剪
          const offsetX = (newWidth - width) / 2;
          const offsetY = (newHeight - height) / 2;
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, -offsetX, -offsetY, newWidth, newHeight);
        } else {
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        // 转换为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalUrl = URL.createObjectURL(file);
              const resizedUrl = URL.createObjectURL(blob);

              resolve({
                original: file,
                resized: blob,
                originalWidth,
                originalHeight,
                newWidth: canvas.width,
                newHeight: canvas.height,
                originalUrl,
                resizedUrl,
                originalSize: file.size,
                resizedSize: blob.size
              });
            } else {
              reject(new Error('调整大小失败'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsProcessing(true);
    const newImages: ResizedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const resizedImage = await resizeImage(file);
        newImages.push(resizedImage);
      } catch (error) {
        console.error('调整图片大小失败:', error);
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

  const downloadImage = (image: ResizedImage) => {
    const link = document.createElement('a');
    link.href = image.resizedUrl;
    link.download = `resized_${image.original.name}`;
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
    URL.revokeObjectURL(image.resizedUrl);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.resizedUrl);
    });
    setImages([]);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && images.length > 0) {
      const firstImage = images[0];
      const ratio = firstImage.originalHeight / firstImage.originalWidth;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && images.length > 0) {
      const firstImage = images[0];
      const ratio = firstImage.originalWidth / firstImage.originalHeight;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const presetSizes = [
    { name: '社交媒体头像', width: 400, height: 400 },
    { name: 'Instagram 正方形', width: 1080, height: 1080 },
    { name: 'Facebook 封面', width: 1200, height: 630 },
    { name: '网页横幅', width: 1920, height: 600 },
    { name: '移动端壁纸', width: 1080, height: 1920 },
    { name: '桌面壁纸', width: 1920, height: 1080 }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">图片尺寸调整</h1>
            <p className="text-xl text-gray-600">
              批量调整图片的宽度和高度
            </p>
          </div>

          {/* 设置面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">调整设置</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 尺寸设置 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">宽度 (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">高度 (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    className={`p-2 rounded-lg transition-colors ${
                      maintainAspectRatio ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {maintainAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <span className="text-sm text-gray-600">
                    {maintainAspectRatio ? '锁定' : '解锁'}宽高比
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">调整模式</label>
                  <select
                    value={resizeMode}
                    onChange={(e) => setResizeMode(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="exact">精确尺寸 (可能变形)</option>
                    <option value="fit">适应尺寸 (保持比例)</option>
                    <option value="fill">填满尺寸 (裁剪多余部分)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片质量: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 预设尺寸 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">常用尺寸</label>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {presetSizes.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setWidth(preset.width);
                        setHeight(preset.height);
                      }}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{preset.name}</div>
                      <div className="text-sm text-gray-600">{preset.width} × {preset.height}</div>
                    </button>
                  ))}
                </div>
              </div>
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
                  <span className="text-blue-600">正在调整图片尺寸...</span>
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 原始图片 */}
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 mb-2">原始图片</h4>
                      <img
                        src={image.originalUrl}
                        alt="Original"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{image.originalWidth} × {image.originalHeight}</p>
                        <p>{formatFileSize(image.originalSize)}</p>
                        <p className="text-xs truncate">{image.original.name}</p>
                      </div>
                    </div>

                    {/* 调整信息 */}
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-primary-600 mb-2">→</div>
                        <div className="text-sm text-gray-600">尺寸调整</div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <div className="text-lg font-semibold text-gray-900">
                          {image.originalWidth} × {image.originalHeight}
                        </div>
                        <div className="text-sm text-gray-500">↓</div>
                        <div className="text-lg font-semibold text-primary-600">
                          {image.newWidth} × {image.newHeight}
                        </div>
                        <div className="text-sm text-gray-600">
                          大小变化: {image.resizedSize > image.originalSize ? '+' : ''}
                          {formatFileSize(Math.abs(image.resizedSize - image.originalSize))}
                        </div>
                      </div>
                    </div>

                    {/* 调整后图片 */}
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 mb-2">调整后</h4>
                      <img
                        src={image.resizedUrl}
                        alt="Resized"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{image.newWidth} × {image.newHeight}</p>
                        <p>{formatFileSize(image.resizedSize)}</p>
                      </div>
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
              <p className="text-gray-600">上传图片开始调整尺寸</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">调整模式说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">精确尺寸</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 强制调整到指定尺寸</li>
                  <li>• 可能导致图片变形</li>
                  <li>• 适合需要精确尺寸的场景</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">适应尺寸</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 保持原始宽高比</li>
                  <li>• 图片完全显示在指定尺寸内</li>
                  <li>• 可能有空白区域</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">填满尺寸</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 保持原始宽高比</li>
                  <li>• 完全填满指定尺寸</li>
                  <li>• 可能裁剪部分内容</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>提示:</strong> 所有处理都在浏览器本地完成，不会上传到服务器。建议在调整前备份原始图片。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ImageResizer;