import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  isVisible,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 监听滚动，高亮当前章节
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean);

      let currentActiveId = '';
      
      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentActiveId = element.id;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 生成安全的锚点ID（支持中英文）
  const generateSafeId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中文字符、英文字符、数字、空格和连字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
  };

  // 平滑滚动到指定章节
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 考虑固定导航栏的高度
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    // 在移动端点击后关闭导航栏
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // 如果没有标题，不显示导航
  if (headings.length === 0) {
    return null;
  }

  // 统一的导航栏内容组件
  const NavigationContent = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">目录</h3>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>
      
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => {
            const safeId = generateSafeId(heading.text);
            const isActive = activeId === safeId;
            
            return (
              <li
                key={safeId}
                style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
              >
                <button
                  onClick={() => scrollToHeading(safeId)}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors text-sm ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  // 移动端：浮动箭头按钮 + 悬浮导航栏
  if (isMobile) {
    return (
      <>
        {/* 浮动箭头按钮 */}
        <motion.button
          className="fixed left-4 top-24 z-50 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight size={20} className="text-gray-700" />
        </motion.button>

        {/* 移动端悬浮导航栏 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              
              {/* 悬浮导航栏 - 与桌面端相同的风格 */}
              <motion.div
                className="fixed left-4 top-24 w-80 bg-white rounded-lg shadow-xl z-50 max-h-[calc(100vh-8rem)] overflow-y-auto"
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <NavigationContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // 桌面端：悬浮导航栏（始终显示，不受滚动影响）
  return (
    <motion.div
      className="fixed left-4 top-24 w-64 bg-white rounded-lg shadow-lg z-30 max-h-[calc(100vh-8rem)] overflow-y-auto"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <NavigationContent />
    </motion.div>
  );
};

export default TableOfContents;