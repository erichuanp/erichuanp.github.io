import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed left-4 top-24 w-64 bg-white rounded-lg shadow-lg p-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
                >
                  <a
                    href={`#${heading.id}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableOfContents;