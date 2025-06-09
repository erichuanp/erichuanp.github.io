export interface Tool {
  id: number;
  name: string;
  description: string;
}

const toolNames = [
  'Visual Studio Code',
  'Git',
  'GitHub',
  'Docker',
  'Webpack',
  'Vite',
  'Node.js',
  'npm',
  'ESLint',
  'Prettier',
  'Jest',
  'Cypress',
  'TypeScript',
  'Babel',
  'Postman',
  'GraphQL',
  'React DevTools',
  'Redux DevTools',
  'Chrome DevTools',
  'Lighthouse',
  'SASS/SCSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material UI',
  'Storybook',
  'Figma',
  'MongoDB Compass',
  'Redis CLI'
];

const toolDescriptions = [
  'A powerful code editor with built-in debugging and Git integration.',
  'A distributed version control system for tracking changes in source code.',
  'A platform for hosting and collaborating on Git repositories.',
  'A platform for developing, shipping, and running applications in containers.',
  'A static module bundler for modern JavaScript applications.',
  'A next-generation frontend build tool that significantly improves the development experience.',
  'A JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
  'A package manager for the JavaScript programming language.',
  'A static code analysis tool for identifying problematic patterns in JavaScript code.',
  'An opinionated code formatter that enforces a consistent style.',
  'A JavaScript testing framework with a focus on simplicity.',
  'An end-to-end testing framework designed for modern web applications.',
  'A strongly typed programming language that builds on JavaScript.',
  'A JavaScript compiler that converts ECMAScript 2015+ code into backward-compatible versions.',
  'An API client that makes it easy to create, share, test, and document APIs.',
  'A query language for APIs and a runtime for executing those queries.',
  'Browser extensions for debugging React applications.',
  'Tools for debugging application state changes in Redux.',
  'Built-in web development tools in the Chrome browser.',
  'An open-source tool for improving the quality of web pages.',
  'A preprocessor scripting language that is interpreted into CSS.',
  'A utility-first CSS framework for rapidly building custom user interfaces.',
  'A front-end framework for building responsive and mobile-first websites.',
  'A popular React UI framework that implements Google\'s Material Design.',
  'A tool for developing UI components in isolation for React, Vue, and Angular.',
  'A digital design and prototyping tool.',
  'A GUI for MongoDB database management.',
  'A command-line interface for Redis, an in-memory data structure store.'
];

export const generateTools = (count: number = 28): Tool[] => {
  const tools: Tool[] = [];
  
  for (let i = 0; i < count; i++) {
    tools.push({
      id: i + 1,
      name: toolNames[i % toolNames.length],
      description: toolDescriptions[i % toolDescriptions.length]
    });
  }
  
  return tools;
};