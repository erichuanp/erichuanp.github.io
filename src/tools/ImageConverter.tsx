import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface ConvertedImage {
  original: File;
  converted: Blob;
  originalFormat: string;
  targetFormat: string;
  originalUrl: string;
  convertedUrl: string;
  originalSize: number;
  convertedSize: number;
}

const ImageConverter: React.FC = () => {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { value: 'jpeg', label: 'JPEG', mimeType: 'image/jpeg' },
    { value: 'png', label: 'PNG', mimeType: 'image/png' },
    { value: 'webp', label: 'WebP', mimeType: 'image/webp' }
  ];

  const convertImage = (file: File, format: string): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx?.drawImage(img, 0, 0);

        // 获取目标格式的 MIME 类型
        const targetMimeType = supportedFormats.find(f => f.value === format)?.mimeType || 'image/jpeg';

        // 转换为目标格式
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalUrl = URL.createObjectURL(file);
              const convertedUrl = URL.createObjectURL(blob);
              const originalFormat = file.type.split('/')[1] || 'unknown';

              resolve({
                original: file,
                converted: blob,
                originalFormat,
                targetFormat: format,
                originalUrl,
                convertedUrl,
                originalSize: file.size,
                convertedSize: blob.size
              });
            } else {
              reject(new Error('转换失败'));
            }
          },
          targetMimeType,
          format === 'jpeg' ? quality : undefined
        );
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsProcessing(true);
    const newImages: ConvertedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const convertedImage = await convertImage(file, targetFormat);
        newImages.push(convertedImage);
      } catch (error) {
        console.error('转换图片失败:', error);
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

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.convertedUrl;
    link.download = `${image.original.name.replace(/\.[^/.]+$/, '')}.${image.targetFormat}`;
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
    URL.revokeObjectURL(image.convertedUrl);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.convertedUrl);
    });
    setImages([]);
  };

  const reconvertAll = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    const newImages: ConvertedImage[] = [];

    for (const image of images) {
      try {
        // 清理旧的 URL
        URL.revokeObjectURL(image.convertedUrl);
        
        // 重新转换
        const convertedImage = await convertImage(image.original, targetFormat);
        newImages.push(convertedImage);
      } catch (error) {
        console.error('重新转换失败:', error);
        // 保留原来的图片
        newImages.push(image);
      }
    }

    setImages(newImages);
    setIsProcessing(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatColor = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return 'bg-blue-100 text-blue-800';
      case 'png':
        return 'bg-green-100 text-green-800';
      case 'webp':
        return 'bg-purple-100 text-purple-800';
      case 'gif':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">图片格式转换</h1>
            <p className="text-xl text-gray-600">
              JPEG、PNG、WebP 等格式互相转换
            </p>
          </div>

          {/* 设置面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">转换设置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {supportedFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {targetFormat === 'jpeg' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JPEG 质量: {Math.round(quality * 100)}%
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
              )}

              <div className="flex items-end">
                <button
                  onClick={reconvertAll}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full px-4 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  重新转换全部
                </button>
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
              <p className="text-sm text-gray-500">支持 JPG, PNG, GIF, WebP, BMP 等格式</p>
              
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
                  <span className="text-blue-600">正在转换图片...</span>
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
                      <div className="flex items-center justify-center mb-2">
                        <h4 className="font-medium text-gray-900 mr-2">原始图片</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(image.originalFormat)}`}>
                          {image.originalFormat.toUpperCase()}
                        </span>
                      </div>
                      <img
                        src={image.originalUrl}
                        alt="Original"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <p className="text-sm text-gray-600">{formatFileSize(image.originalSize)}</p>
                      <p className="text-xs text-gray-500 truncate">{image.original.name}</p>
                    </div>

                    {/* 转换信息 */}
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-primary-600 mb-2">→</div>
                        <div className="text-sm text-gray-600">格式转换</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {image.originalFormat.toUpperCase()} → {image.targetFormat.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          大小变化: {image.convertedSize > image.originalSize ? '+' : ''}
                          {formatFileSize(Math.abs(image.convertedSize - image.originalSize))}
                        </div>
                      </div>
                    </div>

                    {/* 转换后图片 */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <h4 className="font-medium text-gray-900 mr-2">转换后</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(image.targetFormat)}`}>
                          {image.targetFormat.toUpperCase()}
                        </span>
                      </div>
                      <img
                        src={image.convertedUrl}
                        alt="Converted"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <p className="text-sm text-gray-600">{formatFileSize(image.convertedSize)}</p>
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
              <p className="text-gray-600">上传图片开始格式转换</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">格式说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">JPEG</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 适合照片和复杂图像</li>
                  <li>• 有损压缩，文件较小</li>
                  <li>• 不支持透明背景</li>
                  <li>• 广泛兼容</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">PNG</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 适合图标和简单图像</li>
                  <li>• 无损压缩，质量高</li>
                  <li>• 支持透明背景</li>
                  <li>• 文件相对较大</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">WebP</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 现代格式，压缩效率高</li>
                  <li>• 支持有损和无损压缩</li>
                  <li>• 支持透明背景和动画</li>
                  <li>• 部分旧浏览器不支持</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>提示:</strong> 所有转换都在浏览器本地完成，不会上传到服务器。转换后的图片质量可能会根据目标格式有所变化。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ImageConverter;