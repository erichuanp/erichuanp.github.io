import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
}

const ImageCompressor: React.FC = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算新的尺寸
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx?.drawImage(img, 0, 0, width, height);

        // 转换为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalUrl = URL.createObjectURL(file);
              const compressedUrl = URL.createObjectURL(blob);
              const compressionRatio = ((file.size - blob.size) / file.size * 100);

              resolve({
                original: file,
                compressed: blob,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio,
                originalUrl,
                compressedUrl
              });
            } else {
              reject(new Error('压缩失败'));
            }
          },
          format === 'png' ? 'image/png' : 'image/jpeg',
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
    const newImages: CompressedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        continue;
      }

      try {
        const compressedImage = await compressImage(file);
        newImages.push(compressedImage);
      } catch (error) {
        console.error('压缩图片失败:', error);
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

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.original.name.replace(/\.[^/.]+$/, '')}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  };

  const removeImage = (index: number) => {
    const image = images[index];
    URL.revokeObjectURL(image.originalUrl);
    URL.revokeObjectURL(image.compressedUrl);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.compressedUrl);
    });
    setImages([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;
  const totalSavingsPercent = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize * 100) : 0;

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">图片压缩器</h1>
            <p className="text-xl text-gray-600">
              在浏览器中压缩图片文件大小
            </p>
          </div>

          {/* 设置面板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">压缩设置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  质量: {Math.round(quality * 100)}%
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最大宽度</label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最大高度</label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1080)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
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
              <p className="text-sm text-gray-500">支持 JPG, PNG, GIF, WebP 格式</p>
              
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
                  <span className="text-blue-600">正在压缩图片...</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* 统计信息 */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">压缩统计</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadAll}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    下载全部
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                    清空
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{images.length}</div>
                  <div className="text-sm text-gray-600">图片数量</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatFileSize(totalOriginalSize)}</div>
                  <div className="text-sm text-blue-700">原始大小</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatFileSize(totalCompressedSize)}</div>
                  <div className="text-sm text-green-700">压缩后大小</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalSavingsPercent.toFixed(1)}%</div>
                  <div className="text-sm text-purple-700">节省空间</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 图片列表 */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
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
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <p className="text-sm text-gray-600">{formatFileSize(image.originalSize)}</p>
                      <p className="text-xs text-gray-500">{image.original.name}</p>
                    </div>

                    {/* 压缩信息 */}
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-600">
                          {image.compressionRatio.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">压缩率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatFileSize(image.originalSize - image.compressedSize)}
                        </div>
                        <div className="text-sm text-gray-600">节省空间</div>
                      </div>
                    </div>

                    {/* 压缩后图片 */}
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 mb-2">压缩后</h4>
                      <img
                        src={image.compressedUrl}
                        alt="Compressed"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2"
                      />
                      <p className="text-sm text-gray-600">{formatFileSize(image.compressedSize)}</p>
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
              <p className="text-gray-600">上传图片开始压缩</p>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">压缩设置</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>质量:</strong> 控制压缩后的图片质量，越低文件越小</li>
                  <li>• <strong>尺寸限制:</strong> 超过限制的图片会被等比缩放</li>
                  <li>• <strong>格式:</strong> JPEG 适合照片，PNG 适合图标</li>
                  <li>• <strong>批量处理:</strong> 支持同时压缩多张图片</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">注意事项</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 所有处理都在浏览器本地完成，不会上传到服务器</li>
                  <li>• 支持拖拽上传，方便快捷</li>
                  <li>• 压缩后的图片质量可能会有所下降</li>
                  <li>• 建议在压缩前备份原始图片</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ImageCompressor;