// Rakesh Gowda H N - High Performance Responsive Portfolio Application
const { useState, useEffect, useRef, createElement: h } = React;

// Particle Canvas Background Engine
function CanvasBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isMobile = width <= 768;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width <= 768;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const particles = [];
    const particleCount = isMobile ? 22 : 50;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6);
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6);
        this.radius = Math.random() * (isMobile ? 1.5 : 2) + 1;
        this.color = theme === 'light'
          ? (Math.random() > 0.5 ? '#0284c7' : '#7c3aed')
          : (Math.random() > 0.5 ? '#00f2fe' : '#8b5cf6');
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        if (!isMobile) {
          ctx.shadowBlur = theme === 'light' ? 4 : 8;
          ctx.shadowColor = this.color;
        }
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let isTabActive = true;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabActive) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const maxDist = isMobile ? 90 : 120;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme === 'light'
              ? `rgba(2, 132, 199, ${(1 - dist / maxDist) * 0.25})`
              : `rgba(0, 242, 254, ${(1 - dist / maxDist) * 0.75})`;
            ctx.lineWidth = theme === 'light' ? 0.6 : 0.5;
            ctx.stroke();
          }
        }

        if (!isMobile && mouse.x && mouse.y) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = theme === 'light'
              ? `rgba(124, 58, 237, ${(1 - mdist / 150) * 0.35})`
              : `rgba(139, 92, 246, ${(1 - mdist / 150) * 0.8})`;
            ctx.lineWidth = theme === 'light' ? 0.9 : 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return h('canvas', { id: 'bg-canvas', ref: canvasRef });
}

// Main Application Component
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio_theme') || 'dark');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // QA Lab State
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('GET_PROJECTS');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Dynamic Typing Hero Effect
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = [
    'Software Engineer',
    'Full-Stack Web Developer',
    'API & Software Testing Specialist',
    'Hosting & Domain Administrator'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const targetTitle = titles[typingIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(targetTitle.substring(0, currentText.length - 1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(targetTitle.substring(0, currentText.length + 1));
      }, 80);
    }

    if (!isDeleting && currentText === targetTitle) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % titles.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, typingIndex]);

  // Lock body scroll when mobile menu or modals are active
  useEffect(() => {
    if (isMobileMenuOpen || selectedProject || showResumeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen, selectedProject, showResumeModal]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setSelectedProject(null);
        setShowResumeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Skills Data
  const skillsData = [
    { name: 'HTML5', category: 'Frontend', level: 95, icon: 'fab fa-html5' },
    { name: 'CSS3 / Modern CSS', category: 'Frontend', level: 92, icon: 'fab fa-css3-alt' },
    { name: 'JavaScript (ES6+)', category: 'Frontend', level: 90, icon: 'fab fa-js-square' },
    { name: 'React.js', category: 'Frontend', level: 88, icon: 'fab fa-react' },
    { name: 'Python', category: 'Backend', level: 82, icon: 'fab fa-python' },
    { name: 'REST API', category: 'Backend', level: 90, icon: 'fas fa-network-wired' },
    { name: 'MySQL', category: 'Database & Tools', level: 85, icon: 'fas fa-database' },
    { name: 'Git & GitHub', category: 'Database & Tools', level: 92, icon: 'fab fa-github' },
    { name: 'Postman', category: 'Software Testing', level: 95, icon: 'fas fa-paper-plane' },
    { name: 'Selenium', category: 'Software Testing', level: 80, icon: 'fas fa-vial' },
    { name: 'Manual Testing', category: 'Software Testing', level: 95, icon: 'fas fa-clipboard-check' },
    { name: 'Automation Testing', category: 'Software Testing', level: 85, icon: 'fas fa-robot' },
    { name: 'SDLC & STLC', category: 'Software Testing', level: 92, icon: 'fas fa-diagram-project' },
    { name: 'API Testing', category: 'Software Testing', level: 94, icon: 'fas fa-cogs' },
    { name: 'Hostinger & GoDaddy', category: 'Hosting & Deployment', level: 90, icon: 'fas fa-server' },
    { name: 'DNS & HTTP/HTTPS', category: 'Hosting & Deployment', level: 88, icon: 'fas fa-globe' },
  ];

  const filteredSkills =
    activeTab === 'All' ? skillsData : skillsData.filter((s) => s.category === activeTab);

  // Projects Data
  const projectsData = [
    {
      id: 'madhuram',
      title: 'Dr. Madhuram Chowdry',
      subtitle: 'Modern Healthcare & Patient Care Platform',
      tech: ['HTML', 'CSS', 'JavaScript', 'React.js'],
      role: 'Web Design & Development',
      image: './assets/madhuram_chowdry.png',
      summary:
        "A modern and responsive healthcare website designed to showcase the doctor's expertise, services, facilities, and patient care.",
      details: [
        'Designed & developed intuitive healthcare user experience for patients.',
        'Structured online doctor profile, medical services overview, and diagnostic care.',
        'Integrated responsive appointment booking UI with time slot selections.',
        'Optimized page performance and cross-browser responsiveness.'
      ]
    },
    {
      id: 'srinivasa',
      title: 'Srinivasa Dental Clinic',
      subtitle: 'Modern Dental Clinic Portal',
      tech: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Hostinger'],
      role: 'Web Design • Development • Deployment',
      image: './assets/srinivas clinic.png',
      summary:
        'A modern and responsive dental clinic website designed to showcase dental services, treatments, facilities, and patient care.',
      details: [
        'End-to-end Web Design, Development, and Domain Deployment.',
        'Highlighted specialized dental treatments, smile gallery, and patient care facilities.',
        'Managed domain configuration, DNS records setup, and SSL security on Hostinger.',
        'Implemented fast load times and clean UI design system.'
      ]
    },
    {
      id: 'tokensboy',
      title: 'TokensBoy App',
      subtitle: 'Digital Queue & Clinic Management System',
      tech: ['React Native', 'JavaScript', 'Node.js', 'REST APIs', 'Azure', 'GitHub', 'HTML', 'CSS'],
      role: 'Software Tester | Manual Testing | API Testing',
      image: './assets/tokensboy.png',
      summary:
        'Digital Queue & Clinic Management System featuring end-to-end testing across Doctor and Patient workflows, Node.js REST APIs, real-time sync, Azure servers, and Play Store release validation.',
      details: [
        'Performed functional and integration testing for Doctor and Patient applications, validating token generation, queue management, and appointment workflows.',
        'Tested real-time token and queue synchronization between Doctor and Patient applications and identified UI/data inconsistencies.',
        'Conducted API testing for Node.js REST APIs, validating request/response data, status codes, and error handling.',
        'Performed cross-platform and compatibility testing across mobile application workflows.',
        'Verified backend functionality and data flow between the mobile applications and server deployed on Microsoft Azure.',
        'Reported, tracked, and retested bugs and defects to ensure issues were resolved before deployment.',
        'Performed regression testing after feature updates and bug fixes to ensure existing functionality remained stable.',
        'Validated application builds and supported the Google Play Store release process.'
      ]
    }
  ];

  // QA Simulator Endpoints
  const apiEndpoints = {
    GET_PROJECTS: {
      url: 'https://api.rakeshgowda.dev/v1/projects',
      method: 'GET',
      status: 200,
      time: '185 ms',
      response: {
        status: 'success',
        totalCount: 3,
        projects: [
          { id: 'p1', name: 'Dr. Madhuram Chowdry', category: 'Healthcare', status: 'Deployed' },
          { id: 'p2', name: 'Srinivasa Dental Clinic', category: 'Dental Care', status: 'Deployed' },
          { id: 'p3', name: 'TokensBoy Queue System', category: 'Clinic Management', status: 'Software Testing Verified' }
        ]
      },
      tests: [
        '✓ Status code is 200 OK',
        '✓ Response time is below 300ms',
        '✓ Content-Type is application/json',
        '✓ Response body contains 3 deployed projects'
      ]
    },
    GET_QUEUE_STATUS: {
      url: 'https://api.tokensboy.com/v1/queue/live-tokens?clinicId=C-892',
      method: 'GET',
      status: 200,
      time: '210 ms',
      response: {
        clinic: 'Medicare Plus Clinic',
        activeDoctor: 'Dr. Arya Sharma',
        servingToken: 'B-028',
        nextToken: 'B-029',
        waitingCount: 18,
        syncStatus: 'Realtime Azure Websocket Connected'
      },
      tests: [
        '✓ Status code is 200 OK',
        '✓ Real-time socket sync state active',
        '✓ Queue array payload non-null',
        '✓ Verified token format string regex matching B-\\d{3}'
      ]
    },
    POST_CONTACT: {
      url: 'https://api.rakeshgowda.dev/v1/contact/send',
      method: 'POST',
      status: 201,
      time: '240 ms',
      response: {
        status: 'created',
        message: 'Message received successfully. Rakesh will respond within 24 hours.',
        ticketId: 'REQ-2026-8941'
      },
      tests: [
        '✓ Status code is 201 Created',
        '✓ Verified rate limiter header: 10 req/min',
        '✓ Input validation passed for email & message body',
        '✓ Auto-responder trigger payload dispatched'
      ]
    }
  };

  const handleSendApiRequest = (key) => {
    setSelectedApiEndpoint(key);
    setIsSendingRequest(true);
    setTimeout(() => {
      setApiResponse(apiEndpoints[key]);
      setIsSendingRequest(false);
    }, 420);
  };

  useEffect(() => {
    setApiResponse(apiEndpoints['GET_PROJECTS']);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCopyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText('rakeshgowda63368@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return h(
    'div',
    null,
    h(CanvasBackground, { theme }),
    h('div', { className: 'glow-spot-1' }),
    h('div', { className: 'glow-spot-2' }),

    // Navigation Bar
    h(
      'nav',
      { className: `navbar ${scrolled ? 'scrolled' : ''}` },
      h(
        'a',
        { href: '#home', className: 'nav-brand', onClick: closeMobileMenu },
        h('img', {
          src: './assets/rg logo.png',
          alt: 'RG Logo',
          className: 'nav-logo-img',
          width: '40',
          height: '40',
          loading: 'eager',
          decoding: 'async'
        }),
        h(
          'div',
          { className: 'nav-brand-info' },
          h('div', { className: 'nav-brand-text' }, 'Rakesh Gowda'),
          h('div', { className: 'nav-brand-sub' }, 'Software Engineer')
        )
      ),

      // Desktop Nav Menu
      h(
        'ul',
        { className: 'nav-menu' },
        h('li', null, h('a', { href: '#about', className: 'nav-link' }, 'About')),
        h('li', null, h('a', { href: '#experience', className: 'nav-link' }, 'Experience')),
        h('li', null, h('a', { href: '#skills', className: 'nav-link' }, 'Skills')),
        h('li', null, h('a', { href: '#projects', className: 'nav-link' }, 'Projects')),
        h('li', null, h('a', { href: '#qa-lab', className: 'nav-link' }, 'Testing Lab')),
        h('li', null, h('a', { href: '#contact', className: 'nav-link' }, 'Contact'))
      ),

      // Desktop Header Action Buttons
      h(
        'div',
        { className: 'nav-header-ctas' },
        h(
          'button',
          {
            onClick: toggleTheme,
            className: 'theme-toggle-btn',
            'aria-label': `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
            title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`
          },
          h('i', { className: theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon' }),
          h('span', { className: 'theme-btn-label' }, theme === 'dark' ? 'Light' : 'Dark')
        ),
        h(
          'a',
          {
            href: './assets/Rakesh Gowda H N - Resume.pdf',
            download: 'Rakesh Gowda H N - Resume.pdf',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'btn-outline',
            style: { padding: '0.55rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }
          },
          h('i', { className: 'fas fa-file-pdf', style: { color: 'var(--accent-cyan)' } }),
          ' Resume'
        ),
        h(
          'a',
          {
            href: '#contact',
            className: 'btn-primary',
            style: { padding: '0.55rem 1.1rem', fontSize: '0.85rem' }
          },
          'Get In Touch'
        )
      ),

      // Mobile Menu Actions (Theme Toggle + Hamburger)
      h(
        'div',
        { className: 'mobile-nav-actions' },
        h(
          'button',
          {
            onClick: toggleTheme,
            className: 'theme-toggle-btn mobile-theme-btn',
            'aria-label': `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
            title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`
          },
          h('i', { className: theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon' })
        ),
        h(
          'button',
          {
            className: `mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`,
            onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
            'aria-label': 'Toggle Navigation Menu'
          },
          h('span', { className: 'hamburger-line' }),
          h('span', { className: 'hamburger-line' }),
          h('span', { className: 'hamburger-line' })
        )
      )
    ),

    // Mobile Navigation Drawer Overlay & Content
    h('div', {
      className: `mobile-drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`,
      onClick: closeMobileMenu
    }),
    h(
      'div',
      { className: `mobile-drawer ${isMobileMenuOpen ? 'open' : ''}` },
      h(
        'div',
        { className: 'mobile-drawer-header' },
        h('span', { className: 'mobile-drawer-title' }, 'Navigation Menu'),
        h(
          'button',
          {
            className: 'modal-close-btn',
            onClick: closeMobileMenu,
            style: { position: 'static', width: '32px', height: '32px' }
          },
          h('i', { className: 'fas fa-times' })
        )
      ),
      h(
        'div',
        {
          className: 'mobile-drawer-theme-bar',
          onClick: toggleTheme
        },
        h(
          'div',
          { className: 'mobile-theme-info' },
          h('i', { className: theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun', style: { color: 'var(--accent-cyan)' } }),
          h('span', null, theme === 'dark' ? 'Dark Mode' : 'Light Mode')
        ),
        h('span', { className: 'mobile-theme-badge' }, theme === 'dark' ? 'Switch to Light ☀️' : 'Switch to Dark 🌙')
      ),
      h(
        'ul',
        { className: 'mobile-nav-list' },
        h('li', null, h('a', { href: '#about', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-user-astronaut' }), 'About Me')),
        h('li', null, h('a', { href: '#experience', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-briefcase' }), 'Experience')),
        h('li', null, h('a', { href: '#skills', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-layer-group' }), 'Technical Skills')),
        h('li', null, h('a', { href: '#projects', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-folder-open' }), 'Projects Showcase')),
        h('li', null, h('a', { href: '#qa-lab', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-vial' }), 'API Testing Lab')),
        h('li', null, h('a', { href: '#contact', className: 'mobile-nav-link', onClick: closeMobileMenu }, h('i', { className: 'fas fa-envelope' }), 'Get In Touch'))
      ),
      h(
        'div',
        { className: 'mobile-drawer-ctas' },
        h(
          'a',
          {
            href: './assets/Rakesh Gowda H N - Resume.pdf',
            download: 'Rakesh Gowda H N - Resume.pdf',
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: closeMobileMenu,
            className: 'btn-outline',
            style: { width: '100%', padding: '0.8rem', textDecoration: 'none' }
          },
          h('i', { className: 'fas fa-file-pdf', style: { color: 'var(--accent-cyan)' } }),
          ' Download Resume (PDF)'
        ),
        h(
          'button',
          {
            onClick: () => {
              closeMobileMenu();
              setShowResumeModal(true);
            },
            className: 'btn-outline',
            style: { width: '100%', padding: '0.8rem' }
          },
          h('i', { className: 'fas fa-eye' }),
          ' View Resume Summary'
        ),
        h(
          'a',
          {
            href: '#contact',
            onClick: closeMobileMenu,
            className: 'btn-primary',
            style: { width: '100%', padding: '0.8rem' }
          },
          h('i', { className: 'fas fa-paper-plane' }),
          ' Contact Rakesh'
        )
      )
    ),

    // Hero Section
    h(
      'section',
      { id: 'home', className: 'hero' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'hero-grid' },
          h(
            'div',
            null,
            h(
              'div',
              { className: 'hero-greeting' },
              h('div', { className: 'hero-status-dot' }),
              h('span', { className: 'hero-greeting-text' }, 'AVAILABLE FOR NEW OPPORTUNITIES & PROJECTS')
            ),
            h(
              'h1',
              { className: 'hero-name' },
              "Hi, I'm ",
              h('span', { className: 'gradient-text' }, 'Rakesh Gowda H N')
            ),
            h(
              'div',
              { className: 'hero-title-wrapper' },
              h('span', null, 'I build as a '),
              h('span', { className: 'hero-typing-text' }, currentText)
            ),
            h(
              'p',
              { className: 'hero-description' },
              'Passionate Software Engineer focused on crafting modern, responsive websites and software applications. Experienced across front-end engineering, database architecture, API integration, and comprehensive software testing.'
            ),
            h(
              'div',
              { className: 'hero-ctas' },
              h(
                'a',
                { href: '#projects', className: 'btn-primary' },
                h('i', { className: 'fas fa-rocket' }),
                ' Explore Work'
              ),
              h(
                'a',
                { href: '#qa-lab', className: 'btn-emerald' },
                h('i', { className: 'fas fa-terminal' }),
                ' Launch Testing Lab'
              ),
              h(
                'a',
                {
                  href: './assets/Rakesh Gowda H N - Resume.pdf',
                  download: 'Rakesh Gowda H N - Resume.pdf',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'btn-outline'
                },
                h('i', { className: 'fas fa-file-pdf', style: { color: 'var(--accent-cyan)' } }),
                ' Download Resume'
              ),
              h(
                'button',
                { onClick: () => setShowResumeModal(true), className: 'btn-outline', title: 'Quick Resume Summary' },
                h('i', { className: 'fas fa-eye' }),
                ' Preview'
              )
            ),
            h(
              'div',
              { className: 'hero-social-links' },
              h(
                'a',
                {
                  href: 'https://github.com/rakeshgowda63368-del',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'hero-social-btn btn-gh',
                  'aria-label': 'GitHub Profile'
                },
                h('i', { className: 'fab fa-github' }),
                h('span', null, 'GitHub')
              ),
              h(
                'a',
                {
                  href: 'https://www.linkedin.com/in/rakesh-gowda-h-n-5572b4349/',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'hero-social-btn btn-in',
                  'aria-label': 'LinkedIn Profile'
                },
                h('i', { className: 'fab fa-linkedin-in' }),
                h('span', null, 'LinkedIn')
              ),
              h(
                'a',
                {
                  href: 'mailto:rakeshgowda63368@gmail.com',
                  className: 'hero-social-btn',
                  'aria-label': 'Send Email'
                },
                h('i', { className: 'fas fa-envelope', style: { color: 'var(--accent-cyan)' } }),
                h('span', null, 'Email')
              )
            ),
            h(
              'div',
              { className: 'hero-stats' },
              h('div', { className: 'stat-item' }, h('h3', null, '5+'), h('p', null, 'Websites Deployed')),
              h('div', { className: 'stat-item' }, h('h3', null, '3+'), h('p', null, 'Software Applications')),
              h('div', { className: 'stat-item' }, h('h3', null, '100%'), h('p', null, 'Testing & Defect Tracked'))
            )
          ),

          // Avatar & Badges
          h(
            'div',
            { className: 'hero-avatar-container' },
            h('div', { className: 'avatar-ring' }),
            h('div', { className: 'avatar-ring-2' }),
            h(
              'div',
              { className: 'avatar-img-wrapper' },
              h('img', {
                src: './assets/rakesh.jpg',
                alt: 'Rakesh Gowda H N',
                className: 'avatar-img',
                width: '260',
                height: '260',
                loading: 'eager',
                decoding: 'async'
              })
            ),
            h(
              'div',
              { className: 'hero-floating-badge badge-pos-1' },
              h('div', { className: 'badge-icon' }, h('i', { className: 'fas fa-building' })),
              h(
                'div',
                null,
                h('div', { className: 'badge-text-title' }, 'Navabharath Technologies'),
                h('div', { className: 'badge-text-sub' }, 'Software Engineer (Nov 2025 - Present)')
              )
            ),
            h(
              'div',
              { className: 'hero-floating-badge badge-pos-2' },
              h(
                'div',
                { className: 'badge-icon', style: { background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' } },
                h('i', { className: 'fas fa-check-circle' })
              ),
              h(
                'div',
                null,
                h('div', { className: 'badge-text-title' }, 'Web Dev & Testing'),
                h('div', { className: 'badge-text-sub' }, 'API, Manual & Automation')
              )
            )
          )
        )
      )
    ),

    // About Section
    h(
      'section',
      { id: 'about' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'section-badge' },
          h('i', { className: 'fas fa-user-astronaut' }),
          ' About Me'
        ),
        h(
          'h2',
          { className: 'section-title' },
          'Engineering Modern Digital ',
          h('span', { className: 'gradient-text' }, 'Solutions')
        ),
        h(
          'p',
          { className: 'section-subtitle' },
          'Dedicated to developing performant web applications, robust APIs, and ensuring flawless user experiences through rigorous testing standards.'
        ),
        h(
          'div',
          { className: 'about-grid' },
          h(
            'div',
            { className: 'glass-card about-card-large' },
            h(
              'div',
              null,
              h(
                'p',
                { className: 'about-text-lead' },
                "Hi, I'm ",
                h('strong', { style: { color: 'var(--accent-cyan)' } }, 'Rakesh Gowda H N'),
                ', a passionate Web Developer and Software Engineer interested in building modern, responsive, and user-friendly digital solutions.'
              ),
              h(
                'p',
                { className: 'about-text-body' },
                'I enjoy developing websites and software applications and solving real-world problems through technology. I have hands-on experience working with web development frameworks, relational databases, REST APIs, domain deployment infrastructures, and end-to-end software quality assurance.'
              ),
              h(
                'p',
                { className: 'about-text-body' },
                'I am continuously expanding my skill set and exploring cutting-edge tools to engineer more efficient, resilient, and scalable applications.'
              )
            ),
            h(
              'div',
              { style: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' } },
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' } },
                h('i', { className: 'fas fa-map-marker-alt', style: { color: 'var(--accent-cyan)' } }),
                ' Hirisave, Karnataka, India'
              ),
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' } },
                h('i', { className: 'fas fa-briefcase', style: { color: 'var(--accent-emerald)' } }),
                ' Navabharath Technologies'
              )
            ),
            h(
              'div',
              { style: { marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' } },
              h(
                'a',
                {
                  href: './assets/Rakesh Gowda H N - Resume.pdf',
                  download: 'Rakesh Gowda H N - Resume.pdf',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'btn-outline',
                  style: { fontSize: '0.85rem', padding: '0.55rem 1.1rem', textDecoration: 'none' }
                },
                h('i', { className: 'fas fa-file-pdf', style: { color: 'var(--accent-cyan)' } }),
                ' Download Official Resume (PDF)'
              ),
              h(
                'button',
                {
                  onClick: () => setShowResumeModal(true),
                  className: 'btn-outline',
                  style: { fontSize: '0.85rem', padding: '0.55rem 1.1rem' }
                },
                h('i', { className: 'fas fa-eye' }),
                ' Quick Summary'
              )
            )
          ),

          h(
            'div',
            { className: 'what-i-do-grid' },
            h(
              'div',
              { className: 'service-card' },
              h('div', { className: 'service-icon' }, h('i', { className: 'fas fa-code' })),
              h('h3', { className: 'service-title' }, 'Web Development'),
              h('p', { className: 'service-desc' }, 'Crafting responsive, high-performance websites using HTML, CSS, JavaScript & React.js.')
            ),
            h(
              'div',
              { className: 'service-card' },
              h(
                'div',
                { className: 'service-icon', style: { background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' } },
                h('i', { className: 'fas fa-laptop-code' })
              ),
              h('h3', { className: 'service-title' }, 'Software Development'),
              h('p', { className: 'service-desc' }, 'Building scalable web applications, business logic, and modular software architectures.')
            ),
            h(
              'div',
              { className: 'service-card' },
              h(
                'div',
                { className: 'service-icon', style: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } },
                h('i', { className: 'fas fa-network-wired' })
              ),
              h('h3', { className: 'service-title' }, 'API Integration & DB'),
              h('p', { className: 'service-desc' }, 'Designing REST API workflows and managing structured MySQL relational databases.')
            ),
            h(
              'div',
              { className: 'service-card' },
              h(
                'div',
                { className: 'service-icon', style: { background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' } },
                h('i', { className: 'fas fa-vial' })
              ),
              h('h3', { className: 'service-title' }, 'Software Testing'),
              h('p', { className: 'service-desc' }, 'Executing Functional, Regression, UI, and API testing using Postman & Selenium.')
            ),
            h(
              'div',
              { className: 'service-card', style: { gridColumn: 'span 2' } },
              h(
                'div',
                { className: 'service-icon', style: { background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)' } },
                h('i', { className: 'fas fa-server' })
              ),
              h('h3', { className: 'service-title' }, 'Hosting & DNS Management'),
              h(
                'p',
                { className: 'service-desc' },
                'Configuring web hosting environments (Hostinger, GoDaddy, GitHub Pages), DNS record routing, and SSL configurations.'
              )
            )
          )
        )
      )
    ),

    // Experience Section
    h(
      'section',
      { id: 'experience' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'section-badge' },
          h('i', { className: 'fas fa-briefcase' }),
          ' Career Journey'
        ),
        h(
          'h2',
          { className: 'section-title' },
          'Professional ',
          h('span', { className: 'gradient-text' }, 'Experience')
        ),
        h(
          'p',
          { className: 'section-subtitle' },
          'Demonstrated track record of delivering web applications, website deployments, and comprehensive software testing.'
        ),
        h(
          'div',
          { className: 'timeline' },
          h(
            'div',
            { className: 'timeline-item' },
            h('div', { className: 'timeline-dot' }),
            h(
              'div',
              { className: 'glass-card timeline-content' },
              h(
                'div',
                { className: 'timeline-header' },
                h(
                  'div',
                  null,
                  h('h3', { className: 'timeline-role' }, 'Software Engineer'),
                  h('div', { className: 'timeline-company' }, 'Navabharath Technologies')
                ),
                h(
                  'span',
                  { className: 'timeline-date' },
                  h('i', { className: 'far fa-calendar-alt' }),
                  ' Nov 2025 - Present'
                )
              ),
              h(
                'ul',
                { className: 'timeline-list' },
                h('li', null, 'Actively involved in full-stack web development and software application engineering.'),
                h('li', null, 'Designed, developed, and successfully deployed ', h('strong', null, '5+ modern responsive websites'), ' for healthcare & client portals.'),
                h('li', null, 'Contributed core modules to ', h('strong', null, '3+ software applications'), ' utilizing web technologies and RESTful architecture.'),
                h('li', null, 'Managing end-to-end website hosting, domain configurations, DNS records setup, and HTTP/HTTPS security for live client deployments.'),
                h('li', null, 'Conducting extensive quality assurance, performing Functional, Regression, UI, and API testing.'),
                h('li', null, 'Utilizing industry-standard tools including Postman, Selenium, Git, GitHub, and Antigravity.')
              ),
              h(
                'div',
                { className: 'tech-tags' },
                ['HTML5 / CSS3', 'JavaScript / React.js', 'Python', 'REST API', 'MySQL', 'Postman', 'Selenium', 'Git / GitHub', 'DNS & Hostinger'].map((t, idx) =>
                  h('span', { key: idx, className: 'tech-tag' }, t)
                )
              )
            )
          ),

          h(
            'div',
            { className: 'timeline-item' },
            h('div', { className: 'timeline-dot', style: { borderColor: '#ef4444', boxShadow: '0 0 15px #ef4444' } }),
            h(
              'div',
              { className: 'glass-card timeline-content' },
              h(
                'div',
                { className: 'timeline-header' },
                h(
                  'div',
                  null,
                  h('h3', { className: 'timeline-role' }, 'Software Testing & Automation Trainee'),
                  h('div', { className: 'timeline-company', style: { color: '#f87171' } }, 'Fireflink at QSpiders (Intern)')
                ),
                h(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' } },
                  h(
                    'span',
                    { className: 'timeline-date' },
                    h('i', { className: 'far fa-calendar-alt' }),
                    ' Jun 2025 - Oct 2025'
                  ),
                  h(
                    'span',
                    { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } },
                    h('i', { className: 'fas fa-map-marker-alt', style: { color: 'var(--accent-cyan)' } }),
                    ' Bangalore'
                  )
                )
              ),
              h(
                'ul',
                { className: 'timeline-list' },
                h('li', null, 'Designed and executed manual and automated test cases using Selenium WebDriver in Agile environments.'),
                h('li', null, 'Gained hands-on experience with AI-driven test automation tools, assisting in real-time execution and defect tracking.')
              ),
              h(
                'div',
                { className: 'tech-tags' },
                ['Selenium WebDriver', 'Manual Testing', 'Automated Testing', 'Agile', 'Defect Tracking', 'AI Test Automation'].map((t, idx) =>
                  h('span', { key: idx, className: 'tech-tag' }, t)
                )
              )
            )
          )
        )
      )
    ),

    // Skills Matrix Section
    h(
      'section',
      { id: 'skills' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'section-badge' },
          h('i', { className: 'fas fa-layer-group' }),
          ' Technical Expertise'
        ),
        h(
          'h2',
          { className: 'section-title' },
          'Skills & ',
          h('span', { className: 'gradient-text' }, 'Technologies')
        ),
        h(
          'p',
          { className: 'section-subtitle' },
          'Comprehensive proficiency across frontend design, backend systems, database management, software testing, and cloud hosting.'
        ),
        h(
          'div',
          { className: 'skills-filter' },
          ['All', 'Frontend', 'Backend', 'Database & Tools', 'Software Testing', 'Hosting & Deployment'].map((category) =>
            h(
              'button',
              {
                key: category,
                className: `filter-btn ${activeTab === category ? 'active' : ''}`,
                onClick: () => setActiveTab(category)
              },
              category
            )
          )
        ),
        h(
          'div',
          { className: 'skills-grid' },
          filteredSkills.map((skill, idx) =>
            h(
              'div',
              { key: idx, className: 'glass-card skill-card' },
              h('div', { className: 'skill-icon-box' }, h('i', { className: skill.icon })),
              h(
                'div',
                { className: 'skill-info' },
                h('div', { className: 'skill-name' }, skill.name),
                h('div', { className: 'skill-category' }, skill.category),
                h(
                  'div',
                  { className: 'skill-bar' },
                  h('div', { className: 'skill-progress', style: { width: `${skill.level}%` } })
                )
              )
            )
          )
        )
      )
    ),

    // Projects Showcase Section
    h(
      'section',
      { id: 'projects' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'section-badge' },
          h('i', { className: 'fas fa-folder-open' }),
          ' Portfolio Showcase'
        ),
        h(
          'h2',
          { className: 'section-title' },
          'Featured ',
          h('span', { className: 'gradient-text' }, 'Projects & Work')
        ),
        h(
          'p',
          { className: 'section-subtitle' },
          'A selection of websites designed, developed, and deployed, alongside key software testing achievements.'
        ),
        h(
          'div',
          { className: 'projects-grid' },
          projectsData.map((project) =>
            h(
              'div',
              { key: project.id, className: 'glass-card project-card' },
              h(
                'div',
                { className: 'project-img-wrapper' },
                h('img', {
                  src: project.image,
                  alt: project.title,
                  className: 'project-img',
                  width: '400',
                  height: '220',
                  loading: 'lazy',
                  decoding: 'async'
                }),
                h(
                  'div',
                  { className: 'project-overlay' },
                  h('span', { className: 'project-role-badge' }, project.role)
                )
              ),
              h(
                'div',
                { className: 'project-body' },
                h(
                  'div',
                  null,
                  h('h3', { className: 'project-title' }, project.title),
                  h('p', { className: 'project-desc' }, project.summary),
                  h(
                    'div',
                    { className: 'tech-tags', style: { marginBottom: '1rem' } },
                    project.tech.map((t, i) => h('span', { key: i, className: 'tech-tag' }, t))
                  )
                ),
                h(
                  'div',
                  { className: 'project-footer' },
                  h(
                    'button',
                    { onClick: () => setSelectedProject(project), className: 'project-link-btn' },
                    'View Full Details ',
                    h('i', { className: 'fas fa-arrow-right' })
                  )
                )
              )
            )
          )
        )
      )
    ),

    // QA & API Testing Playground Section
    h(
      'section',
      { id: 'qa-lab' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          {
            className: 'section-badge',
            style: { background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }
          },
          h('i', { className: 'fas fa-vial' }),
          ' Interactive Testing Playground'
        ),
        h(
          'h2',
          { className: 'section-title' },
          "Rakesh's ",
          h('span', { className: 'gradient-emerald-text' }, 'API & Testing Lab')
        ),
        h(
          'p',
          { className: 'section-subtitle' },
          'Demonstrating API testing, JSON response validation, status code checks, and automated assertion passes using an interactive Postman console simulator.'
        ),
        h(
          'div',
          { className: 'qa-lab-wrapper' },
          h(
            'div',
            { className: 'postman-header' },
            h(
              'div',
              { className: 'postman-window-dots' },
              h('span', { className: 'dot dot-red' }),
              h('span', { className: 'dot dot-yellow' }),
              h('span', { className: 'dot dot-green' })
            ),
            h(
              'div',
              { className: 'postman-title' },
              h('i', { className: 'fas fa-paper-plane', style: { color: '#ff6c37', marginRight: '6px' } }),
              ' POSTMAN API TESTER CONSOLE v2.4 (Simulated Sandbox)'
            ),
            h(
              'div',
              null,
              h(
                'span',
                { className: 'tech-tag', style: { color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' } },
                '● ENVIRONMENT: STAGING_SERVER'
              )
            )
          ),
          h(
            'div',
            { className: 'postman-body' },
            h(
              'div',
              { className: 'endpoint-selector-bar' },
              h('span', { className: 'method-select' }, apiEndpoints[selectedApiEndpoint].method),
              h('div', { className: 'url-input-display' }, apiEndpoints[selectedApiEndpoint].url),
              h(
                'button',
                {
                  onClick: () => handleSendApiRequest(selectedApiEndpoint),
                  className: 'btn-emerald',
                  disabled: isSendingRequest
                },
                isSendingRequest ? h('i', { className: 'fas fa-spinner fa-spin' }) : h('i', { className: 'fas fa-paper-plane' }),
                isSendingRequest ? ' Executing...' : ' Send Request'
              )
            ),
            h(
              'div',
              { style: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' } },
              h(
                'button',
                {
                  className: `btn-outline ${selectedApiEndpoint === 'GET_PROJECTS' ? 'active' : ''}`,
                  onClick: () => handleSendApiRequest('GET_PROJECTS'),
                  style: { padding: '0.4rem 0.9rem', fontSize: '0.85rem' }
                },
                'GET /projects'
              ),
              h(
                'button',
                {
                  className: `btn-outline ${selectedApiEndpoint === 'GET_QUEUE_STATUS' ? 'active' : ''}`,
                  onClick: () => handleSendApiRequest('GET_QUEUE_STATUS'),
                  style: { padding: '0.4rem 0.9rem', fontSize: '0.85rem' }
                },
                'GET /tokensboy/live-tokens'
              ),
              h(
                'button',
                {
                  className: `btn-outline ${selectedApiEndpoint === 'POST_CONTACT' ? 'active' : ''}`,
                  onClick: () => handleSendApiRequest('POST_CONTACT'),
                  style: { padding: '0.4rem 0.9rem', fontSize: '0.85rem' }
                },
                'POST /contact/send'
              )
            ),
            apiResponse &&
              h(
                'div',
                { className: 'qa-grid' },
                h(
                  'div',
                  { className: 'qa-panel' },
                  h(
                    'div',
                    { className: 'qa-panel-title' },
                    h('span', null, 'Response Payload (JSON)'),
                    h('span', { style: { color: '#10b981', fontFamily: 'Fira Code' } }, `STATUS: ${apiResponse.status} OK • ${apiResponse.time}`)
                  ),
                  h('pre', { className: 'qa-code-block' }, JSON.stringify(apiResponse.response, null, 2))
                ),
                h(
                  'div',
                  { className: 'qa-panel' },
                  h(
                    'div',
                    { className: 'qa-panel-title' },
                    h('span', null, `Automated Test Assertions (${apiResponse.tests.length}/${apiResponse.tests.length} PASSED)`),
                    h('span', { style: { color: '#00f2fe' } }, '100% SUITE PASS')
                  ),
                  h(
                    'div',
                    null,
                    apiResponse.tests.map((test, idx) =>
                      h(
                        'div',
                        { key: idx, className: 'test-assertion' },
                        h('i', { className: 'fas fa-check-circle', style: { color: '#10b981' } }),
                        h('span', null, test)
                      )
                    )
                  )
                )
              )
          )
        )
      )
    ),

    // Contact Section (Ultra Modern Interactive LET'S CONNECT Hub)
    h(
      'section',
      { id: 'contact', className: 'connect-section-wrapper' },
      h(
        'div',
        { className: 'container' },
        h(
          'div',
          { className: 'connect-hero-card' },
          // Decorative background ambient light spots
          h('div', { className: 'connect-ambient-glow-1' }),
          h('div', { className: 'connect-ambient-glow-2' }),

          // Header Top Bar with Live Status & Response Time Badges
          h(
            'div',
            { className: 'connect-status-bar' },
            h(
              'div',
              { className: 'connect-status-badge' },
              h('span', { className: 'status-pulse-dot' }),
              h('span', null, 'AVAILABLE FOR OPPORTUNITIES & PROJECTS')
            ),
            h(
              'div',
              { className: 'connect-response-badge' },
              h('i', { className: 'fas fa-bolt', style: { color: 'var(--accent-cyan)' } }),
              h('span', null, 'Quick Response • < 24 Hours')
            )
          ),

          // Central Typography & Intro
          h(
            'div',
            { className: 'connect-main-intro' },
            h(
              'div',
              { className: 'section-badge', style: { marginBottom: '0.85rem' } },
              h('i', { className: 'fas fa-paper-plane' }),
              ' DIRECT CONTACT & COLLABORATION'
            ),
            h(
              'h2',
              { className: 'connect-large-title' },
              "LET'S CONNECT"
            ),
            h(
              'p',
              { className: 'connect-subtitle' },
              "Have an exciting software project, web development role, job opening, or technical inquiry? Let's discuss how we can build high-impact digital solutions together."
            ),

            // Primary Quick Action Buttons Bar
            h(
              'div',
              { className: 'connect-action-buttons' },
              h(
                'a',
                {
                  href: 'mailto:rakeshgowda63368@gmail.com',
                  className: 'connect-btn-primary'
                },
                h('i', { className: 'fas fa-envelope-open-text' }),
                ' Send Direct Email'
              ),
              h(
                'button',
                {
                  onClick: handleCopyEmail,
                  className: `connect-btn-secondary ${copiedEmail ? 'copied' : ''}`
                },
                h('i', { className: copiedEmail ? 'fas fa-check-circle' : 'fas fa-copy' }),
                copiedEmail ? ' Email Copied to Clipboard!' : ' Copy Email Address'
              ),
              h(
                'a',
                {
                  href: './assets/Rakesh Gowda H N - Resume.pdf',
                  download: 'Rakesh Gowda H N - Resume.pdf',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'connect-btn-resume'
                },
                h('i', { className: 'fas fa-file-pdf' }),
                ' Download Resume'
              )
            )
          ),

          // 4 Feature Grid Cards
          h(
            'div',
            { className: 'connect-cards-grid' },
            // Card 1: Email
            h(
              'a',
              {
                href: 'mailto:rakeshgowda63368@gmail.com',
                className: 'connect-feature-card email-card'
              },
              h(
                'div',
                { className: 'feature-card-header' },
                h(
                  'div',
                  { className: 'feature-icon-box icon-cyan' },
                  h('i', { className: 'fas fa-envelope' })
                ),
                h('span', { className: 'feature-action-link' }, 'Send Mail ', h('i', { className: 'fas fa-arrow-right' }))
              ),
              h('div', { className: 'feature-label' }, 'Direct Email Inbox'),
              h('div', { className: 'feature-value' }, 'rakeshgowda63368@gmail.com'),
              h('div', { className: 'feature-sub' }, 'Primary inbox for opportunities & collaborations')
            ),

            // Card 2: LinkedIn
            h(
              'a',
              {
                href: 'https://www.linkedin.com/in/rakesh-gowda-h-n-5572b4349/',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'connect-feature-card linkedin-card'
              },
              h(
                'div',
                { className: 'feature-card-header' },
                h(
                  'div',
                  { className: 'feature-icon-box icon-blue' },
                  h('i', { className: 'fab fa-linkedin-in' })
                ),
                h('span', { className: 'feature-action-link' }, 'Connect ', h('i', { className: 'fas fa-arrow-right' }))
              ),
              h('div', { className: 'feature-label' }, 'LinkedIn Profile'),
              h('div', { className: 'feature-value' }, 'Rakesh Gowda H N'),
              h('div', { className: 'feature-sub' }, 'Software Engineer • Navabharath Technologies')
            ),

            // Card 3: GitHub
            h(
              'a',
              {
                href: 'https://github.com/rakeshgowda63368-del',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'connect-feature-card github-card'
              },
              h(
                'div',
                { className: 'feature-card-header' },
                h(
                  'div',
                  { className: 'feature-icon-box icon-purple' },
                  h('i', { className: 'fab fa-github' })
                ),
                h('span', { className: 'feature-action-link' }, 'View Repos ', h('i', { className: 'fas fa-arrow-right' }))
              ),
              h('div', { className: 'feature-label' }, 'GitHub Profile'),
              h('div', { className: 'feature-value' }, 'rakeshgowda63368-del'),
              h('div', { className: 'feature-sub' }, 'Explore web app source codes & automated test scripts')
            ),

            // Card 4: Location & Work Mode
            h(
              'div',
              { className: 'connect-feature-card location-card' },
              h(
                'div',
                { className: 'feature-card-header' },
                h(
                  'div',
                  { className: 'feature-icon-box icon-emerald' },
                  h('i', { className: 'fas fa-map-marker-alt' })
                ),
                h(
                  'span',
                  { className: 'status-pill-emerald' },
                  h('span', { className: 'mini-pulse-dot' }),
                  'Open for Remote & Onsite'
                )
              ),
              h('div', { className: 'feature-label' }, 'Current Base Location'),
              h('div', { className: 'feature-value' }, 'Hirisave, Karnataka, India'),
              h('div', { className: 'feature-sub' }, 'Timezone: IST (UTC+5:30) • Ready for global roles')
            )
          )
        )
      )
    ),

    // Footer
    h(
      'footer',
      null,
      h(
        'div',
        { className: 'container footer-content' },
        h(
          'div',
          { className: 'nav-brand' },
          h('img', {
            src: './assets/rg logo.png',
            alt: 'RG Logo',
            className: 'nav-logo-img',
            width: '36',
            height: '36',
            loading: 'lazy',
            decoding: 'async'
          }),
          h('span', { className: 'nav-brand-text' }, 'Rakesh Gowda H N')
        ),
        h(
          'div',
          { className: 'footer-social-links' },
          h(
            'a',
            {
              href: 'https://github.com/rakeshgowda63368-del',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'footer-social-link',
              'aria-label': 'GitHub'
            },
            h('i', { className: 'fab fa-github' }),
            ' GitHub'
          ),
          h(
            'a',
            {
              href: 'https://www.linkedin.com/in/rakesh-gowda-h-n-5572b4349/',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'footer-social-link',
              'aria-label': 'LinkedIn'
            },
            h('i', { className: 'fab fa-linkedin-in', style: { color: '#0077b5' } }),
            ' LinkedIn'
          ),
          h(
            'a',
            {
              href: 'mailto:rakeshgowda63368@gmail.com',
              className: 'footer-social-link',
              'aria-label': 'Email'
            },
            h('i', { className: 'fas fa-envelope', style: { color: 'var(--accent-cyan)' } }),
            ' Email'
          )
        ),
        h('p', null, '© 2026 Rakesh Gowda H N. All rights reserved. Crafted with React, HTML5 & Custom CSS.')
      )
    ),

    // Project Detail Modal
    selectedProject &&
      h(
        'div',
        { className: 'modal-backdrop', onClick: () => setSelectedProject(null) },
        h(
          'div',
          { className: 'modal-content', onClick: (e) => e.stopPropagation() },
          h(
            'button',
            { className: 'modal-close-btn', onClick: () => setSelectedProject(null) },
            h('i', { className: 'fas fa-times' })
          ),
          h('img', {
            src: selectedProject.image,
            alt: selectedProject.title,
            style: { width: '100%', borderRadius: '1rem', marginBottom: '1.5rem', height: '220px', objectFit: 'cover' },
            loading: 'lazy',
            decoding: 'async'
          }),
          h('span', { className: 'project-role-badge' }, selectedProject.role),
          h('h2', { className: 'project-title', style: { fontSize: '1.8rem', marginTop: '0.5rem', marginBottom: '0.5rem' } }, selectedProject.title),
          h('p', { style: { color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 } }, selectedProject.subtitle),
          h('p', { className: 'project-desc' }, selectedProject.summary),
          h('h4', { style: { color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.75rem' } }, 'Key Contributions & Responsibilities:'),
          h(
            'ul',
            { className: 'timeline-list' },
            selectedProject.details.map((detail, idx) => h('li', { key: idx }, detail))
          ),
          h('h4', { style: { color: 'var(--text-main)', marginTop: '1.25rem', marginBottom: '0.75rem' } }, 'Technologies Used:'),
          h(
            'div',
            { className: 'tech-tags' },
            selectedProject.tech.map((t, i) => h('span', { key: i, className: 'tech-tag' }, t))
          )
        )
      ),

    // Resume Modal
    showResumeModal &&
      h(
        'div',
        { className: 'modal-backdrop', onClick: () => setShowResumeModal(false) },
        h(
          'div',
          { className: 'modal-content', onClick: (e) => e.stopPropagation() },
          h(
            'button',
            { className: 'modal-close-btn', onClick: () => setShowResumeModal(false) },
            h('i', { className: 'fas fa-times' })
          ),
          h(
            'h2',
            { className: 'section-title', style: { fontSize: '1.6rem', marginBottom: '0.5rem' } },
            'Rakesh Gowda H N ',
            h('span', { className: 'gradient-text' }, 'Resume Overview')
          ),
          h(
            'p',
            { style: { color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '1.25rem' } },
            'Software Engineer | Navabharath Technologies'
          ),
          h(
            'div',
            {
              style: {
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '1.25rem',
                borderRadius: '1rem',
                border: '1px solid var(--border-light)',
                fontFamily: 'Fira Code',
                fontSize: '0.85rem',
                color: '#94a3b8',
                maxHeight: '340px',
                overflowY: 'auto'
              }
            },
            h('p', null, h('strong', { style: { color: '#00f2fe' } }, '// SUMMARY')),
            h('p', null, 'Passionate Web Developer and Software Engineer interested in building modern, responsive, and user-friendly digital solutions with experience in web development, databases, APIs, and digital technologies.'),
            h('br', null),
            h('p', null, h('strong', { style: { color: '#00f2fe' } }, '// EXPERIENCE')),
            h('p', null, h('strong', null, 'Software Engineer - Navabharath Technologies (Nov 2025 - Present)')),
            h('p', null, '- Designed, developed, and deployed 5+ websites.'),
            h('p', null, '- Contributed to 3+ software applications.'),
            h('p', null, '- Managed website hosting, domain configuration, and DNS setup.'),
            h('p', null, '- Performed functional, regression, UI, and API testing using Postman, Selenium, Git & GitHub.'),
            h('br', null),
            h('p', null, h('strong', null, 'Software Testing & Automation Trainee - Fireflink at QSpiders (Intern) (Jun 2025 - Oct 2025)')),
            h('p', null, '- Designed and executed manual and automated test cases using Selenium WebDriver in Agile environments.'),
            h('p', null, '- Gained hands-on experience with AI-driven test automation tools, real-time execution, and defect tracking.'),
            h('br', null),
            h('p', null, h('strong', { style: { color: '#00f2fe' } }, '// SKILLS')),
            h('p', null, 'Frontend: HTML, CSS, JavaScript, React.js'),
            h('p', null, 'Backend: Python, REST API'),
            h('p', null, 'Database & Tools: MySQL, Git & GitHub, Postman, Antigravity, VS Code'),
            h('p', null, 'Software Testing: Manual, Automation, SDLC & STLC, API Testing'),
            h('p', null, 'Hosting: GoDaddy, Hostinger, GitHub Pages, DNS Management, HTTP/HTTPS')
          ),
          h(
            'div',
            { style: { display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' } },
            h(
              'a',
              {
                href: './assets/Rakesh Gowda H N - Resume.pdf',
                download: 'Rakesh Gowda H N - Resume.pdf',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'btn-primary',
                style: { textDecoration: 'none' }
              },
              h('i', { className: 'fas fa-file-pdf' }),
              ' Download PDF Resume'
            ),
            h(
              'a',
              {
                href: './assets/Rakesh Gowda H N - Resume.pdf',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'btn-outline',
                style: { textDecoration: 'none' }
              },
              h('i', { className: 'fas fa-external-link-alt' }),
              ' Open PDF'
            ),
            h(
              'button',
              {
                onClick: () => {
                  navigator.clipboard.writeText(
                    `Hi, I'm Rakesh Gowda H N\nSoftware Engineer at Navabharath Technologies\nEmail: rakeshgowda63368@gmail.com\nLinkedIn: https://www.linkedin.com/in/rakesh-gowda-h-n-5572b4349/\nLocation: Hirisave, Karnataka, India\nSkills: React.js, JavaScript, HTML, CSS, Python, REST API, MySQL, Postman, Selenium, Hosting & DNS`
                  );
                  alert('Resume summary copied to clipboard!');
                },
                className: 'btn-outline'
              },
              h('i', { className: 'fas fa-copy' }),
              ' Copy Text'
            ),
            h(
              'button',
              { onClick: () => setShowResumeModal(false), className: 'btn-outline' },
              'Close'
            )
          )
        )
      )
  );
}

// Render Application
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
