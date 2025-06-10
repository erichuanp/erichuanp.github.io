import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import PageTransition from '../components/common/PageTransition';
import TableOfContents from '../components/blog/TableOfContents';

interface BlogPost {
  title: string;
  description: string;
  content: string;
  filename: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

const BlogCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // 移除滚动监听逻辑，桌面端始终显示导航栏

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const formattedCategory = category?.toLowerCase();
        
        if (!formattedCategory) {
          setLoading(false);
          return;
        }

        // 首先尝试获取索引文件
        try {
          const indexResponse = await fetch(`/posts/${formattedCategory}/index.json`);
          
          if (indexResponse.ok) {
            // 如果索引文件存在，使用它来获取文件列表
            const files: string[] = await indexResponse.json();
            
            const postPromises = files.map(async (filename) => {
              try {
                const response = await fetch(`/posts/${formattedCategory}/${filename}`);
                if (!response.ok) {
                  console.warn(`Failed to fetch ${filename}`);
                  return null;
                }
                const content = await response.text();
                const lines = content.split('\n').filter(line => line.trim() !== '');
                
                // 从文件名生成标题（移除.md后缀，下划线替换为空格）
                const title = filename.replace('.md', '').replace(/_/g, ' ');
                
                // 从内容的第二行获取描述
                let description = '';
                if (lines.length > 1) {
                  // 跳过第一行（标题）找到第一个非空的非标题行
                  for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line && !line.startsWith('#') && !line.startsWith('```')) {
                      description = line;
                      break;
                    }
                  }
                }
                
                return {
                  title,
                  description: description || 'No description available',
                  content,
                  filename
                };
              } catch (error) {
                console.warn(`Error fetching ${filename}:`, error);
                return null;
              }
            });

            const results = await Promise.all(postPromises);
            const validPosts = results.filter((post): post is BlogPost => post !== null);
            setPosts(validPosts);
          } else {
            // 如果索引文件不存在，回退到旧的硬编码方式
            console.warn(`Index file not found for ${formattedCategory}, using fallback method`);
            await fetchPostsFallback(formattedCategory);
          }
        } catch (error) {
          console.warn(`Error fetching index file for ${formattedCategory}:`, error);
          await fetchPostsFallback(formattedCategory);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // 回退方法：使用硬编码的文件列表
    const fetchPostsFallback = async (formattedCategory: string) => {
      let files: string[] = [];
      
      switch (formattedCategory) {
        case 'development_tools':
          files = ['Conda_Tutorial.md'];
          break;
        case 'frontend_development':
          files = ['React_Basics.md'];
          break;
        case 'backend_development':
          files = ['Node_Express_Guide.md'];
          break;
        case 'databases':
          files = ['MongoDB_Tutorial.md'];
          break;
        default:
          files = [];
      }

      const postPromises = files.map(async (filename) => {
        try {
          const response = await fetch(`/posts/${formattedCategory}/${filename}`);
          if (!response.ok) {
            return null;
          }
          const content = await response.text();
          const lines = content.split('\n');
          const title = lines[0].replace('# ', '');
          const description = lines[1] || 'No description available';
          
          return {
            title,
            description,
            content,
            filename
          };
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(postPromises);
      const validPosts = results.filter((post): post is BlogPost => post !== null);
      setPosts(validPosts);
    };

    if (category) {
      fetchPosts();
    }
  }, [category]);

  useEffect(() => {
    if (selectedPost) {
      const extractHeadings = () => {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const matches = [...selectedPost.content.matchAll(headingRegex)];
        
        return matches.map((match) => ({
          level: match[1].length,
          text: match[2],
          id: match[2]
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中文字符、英文字符、数字、空格和连字符
            .replace(/\s+/g, '-') // 空格替换为连字符
            .replace(/-+/g, '-') // 多个连字符合并为一个
            .replace(/^-|-$/g, '') // 移除开头和结尾的连字符
        }));
      };

      setHeadings(extractHeadings());
    }
  }, [selectedPost]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  // 自定义 ReactMarkdown 组件，为标题添加正确的 ID
  const MarkdownComponents = {
    h1: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h3 id={id} {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h4 id={id} {...props}>{children}</h4>;
    },
    h5: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h5 id={id} {...props}>{children}</h5>;
    },
    h6: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return <h6 id={id} {...props}>{children}</h6>;
    },
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="container py-16">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container py-16">
        {selectedPost ? (
          <div className="relative">
            <TableOfContents
              headings={headings}
              isVisible={true} // 桌面端始终显示，移动端通过组件内部逻辑控制
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
            <div className="max-w-3xl mx-auto prose prose-lg">
              <button
                onClick={() => setSelectedPost(null)}
                className="mb-8 text-primary-600 hover:text-primary-800 transition-colors"
              >
                ← Back to Posts
              </button>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
                className="markdown-content"
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="mb-4 text-center">{category?.replace(/_/g, ' ')}</h1>
            <div className="grid gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.filename}
                  className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handlePostClick(post)}
                >
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-600">{post.description}</p>
                </motion.div>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No articles found in this category.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default BlogCategoryPage;