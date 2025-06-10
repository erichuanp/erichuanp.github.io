import React from 'react';
import SearchBar from '../components/common/SearchBar';
import BlogCard from '../components/blogs/BlogCard';
import PageTransition from '../components/common/PageTransition';

const BlogsPage: React.FC = () => {
  const blogs = [
    {
      id: 1,
      title: '开发工具',
      description: '探索能够提升生产力、简化工作流程的必备开发工具。',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Development Tools'
    },
    {
      id: 2,
      title: '前端开发',
      description: '了解前端开发的最新趋势和最佳实践。探索现代框架、响应式设计技术和性能优化策略。',
      image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Frontend Development'
    },
    {
      id: 3,
      title: '后端开发',
      description: '通过全面的后端开发指南，深入了解服务器端编程。',
      image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Backend Development'
    },
    {
      id: 4,
      title: '数据库',
      description: '探索不同的数据库系统，并学习如何为项目选择合适的系统。',
      image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Databases'
    }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4">开发博客</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            各种工具和技术栈的使用经验
          </p>
        </div>
        
        <SearchBar placeholder="Search blogs..." />
        
        <div className="grid grid-cols-1 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              category={blog.category}
              delay={index}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogsPage