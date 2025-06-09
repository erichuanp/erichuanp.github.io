import React from 'react';
import SearchBar from '../components/common/SearchBar';
import BlogCard from '../components/blogs/BlogCard';
import PageTransition from '../components/common/PageTransition';

const BlogsPage: React.FC = () => {
  const blogs = [
    {
      id: 1,
      title: 'Development Tools',
      description: 'Discover the essential development tools that can boost your productivity and streamline your workflow. From code editors to version control systems, we cover everything you need.',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Development Tools'
    },
    {
      id: 2,
      title: 'Frontend Development',
      description: 'Learn about the latest trends and best practices in frontend development. Explore modern frameworks, responsive design techniques, and performance optimization strategies.',
      image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Frontend Development'
    },
    {
      id: 3,
      title: 'Backend Development',
      description: 'Dive into server-side programming with our comprehensive guides on backend development. From RESTful APIs to database design, we cover the fundamentals and advanced topics.',
      image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Backend Development'
    },
    {
      id: 4,
      title: 'Databases',
      description: 'Explore different database systems and learn how to choose the right one for your project. We cover relational databases, NoSQL solutions, and data modeling techniques.',
      image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'Databases'
    }
  ];

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4">Developer Blogs</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Explore our collection of in-depth articles covering various aspects of software development.
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