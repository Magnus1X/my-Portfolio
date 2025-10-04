const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      name: 'Saurav Kumar',
      tagline: 'Full Stack Developer & AI Engineer',
      location: 'India',
      summary: 'Passionate developer creating innovative solutions with modern technologies. Specializing in React, Node.js, and AI/ML applications.',
      linkedin: 'https://linkedin.com/in/sauravkumar',
      github: 'https://github.com/sauravkumar',
      twitter: 'https://twitter.com/sauravkumar',
      instagram: 'https://instagram.com/sauravkumar'
    }
  });

  // Create default skills
  const skills = [
    {
      name: 'React',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12.765c.688 0 1.25-.562 1.25-1.25s-.562-1.25-1.25-1.25-1.25.562-1.25 1.25.562 1.25 1.25 1.25zm0-6.5c3.516 0 6.25 2.734 6.25 6.25s-2.734 6.25-6.25 6.25-6.25-2.734-6.25-6.25 2.734-6.25 6.25-6.25zm0-1.25c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5z"/></svg>',
      category: 'Frontend',
      order: 1
    },
    {
      name: 'Node.js',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      category: 'Backend',
      order: 2
    },
    {
      name: 'JavaScript',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      category: 'Programming',
      order: 3
    },
    {
      name: 'TypeScript',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
      category: 'Programming',
      order: 4
    },
    {
      name: 'Python',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      category: 'Programming',
      order: 5
    },
    {
      name: 'MySQL',
      svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      category: 'Database',
      order: 6
    }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill
    });
  }

  // Create sample projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application built with React, Node.js, and MySQL. Features include user authentication, product management, shopping cart, and payment integration.',
      techStack: 'React, Node.js, Express, MySQL, Stripe API',
      liveUrl: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/sauravkumar/ecommerce',
      featured: true,
      order: 1
    },
    {
      title: 'AI Chat Application',
      description: 'Real-time chat application with AI integration using OpenAI API. Built with React for frontend and Node.js for backend with WebSocket support.',
      techStack: 'React, Node.js, Socket.io, OpenAI API, MongoDB',
      liveUrl: 'https://ai-chat-demo.com',
      githubUrl: 'https://github.com/sauravkumar/ai-chat',
      featured: true,
      order: 2
    },
    {
      title: 'Portfolio Website',
      description: 'Responsive portfolio website with modern animations and smooth scrolling. Built with React, GSAP, and Three.js for interactive 3D elements.',
      techStack: 'React, GSAP, Three.js, TailwindCSS, Vite',
      liveUrl: 'https://sauravkumar.dev',
      githubUrl: 'https://github.com/sauravkumar/portfolio',
      featured: false,
      order: 3
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { title: project.title },
      update: {},
      create: project
    });
  }

  // Create sample certificates
  const certificates = [
    {
      title: 'Full Stack Web Development',
      issuer: 'FreeCodeCamp',
      issueDate: new Date('2023-06-15'),
      credentialId: 'FCC-FSWD-2023',
      credentialUrl: 'https://freecodecamp.org/certification/sauravkumar/full-stack-web-development',
      order: 1
    },
    {
      title: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      issueDate: new Date('2023-09-20'),
      credentialId: 'AWS-DEV-123456',
      credentialUrl: 'https://aws.amazon.com/verification',
      order: 2
    },
    {
      title: 'React Developer Certification',
      issuer: 'Meta',
      issueDate: new Date('2023-03-10'),
      credentialId: 'META-REACT-789',
      credentialUrl: 'https://coursera.org/verify/react-cert',
      order: 3
    }
  ];

  for (const certificate of certificates) {
    await prisma.certificate.upsert({
      where: { title: certificate.title },
      update: {},
      create: certificate
    });
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
