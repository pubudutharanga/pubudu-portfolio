export const SITE = {
    name: "Pubudu Tharanga",
    title: "Full Stack Developer & Undergraduate",
    tagline: "Building digital experiences with modern technologies",
    location: "Sri Lanka",
    email: "pubudutharange@gmail.com",
    phone: "+94 76 633 0916",
    linkedin: "https://www.linkedin.com/in/pubudutharanga/",
    github: "https://github.com/pubudutharanga",
    facebook: "https://www.facebook.com/share/1ai3Wtn4jc/",
    resume: "/resume.html"
}

export const SKILLS = {
    technical: [
        "Frontend Development", "Backend Development", "Responsive Design",
        "API Development", "Database Design", "System Architecture"
    ],
    tools: [
        "React", "Node.js", "Python", "MongoDB", "Express.js", "Tailwind CSS",
        "Git", "VS Code", "Postman", "Figma", "Angular", "TypeScript"
    ],
    soft: [
        "Problem Solving", "Team Leadership", "Communication",
        "Project Management", "Agile Methodology", "Client Relations"
    ]
}

export const BLOG_CATEGORIES = ['All', 'Tutorials', 'Case Studies', 'Industry Insights', 'Tips & Resources']

export const EDUCATION = [
    {
        degree: "BSc Hons in Information Systems",
        institution: "Sabaragamuwa University Of Sri Lanka",
        period: "2022 - Present",
        status: "Currently Enrolled",
        description: "Focus on software development, database systems, and information technology management."
    }
]

export const STATS = [
    { value: "2+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "Undergraduate", label: "Current Status" }
]

export const PROJECTS = [
    {
        id: 'p1',
        title: 'Weather Dashboard',
        category: 'Frontend',
        description: 'A beautiful weather dashboard with location-based forecasts...',
        technologies: ['React', 'Chart.js', 'Weather API', 'Geolocation API', 'CSS3'],
        features: ['Location Detection', '7-Day Forecast', 'Interactive Charts', 'Favorite Locations', 'Weather Alerts', 'Responsive Design'],
        results: 'Elegant weather intelligence powered by immersive data visualization.',
        live: 'https://example-weather.com',
        github: 'https://github.com/pubudutharanga/weather-dashboard',
        image: './pro1.jpg',
        status: 'planned' // Use: 'planned', 'in progress', or 'completed'
    },
]

export const SERVICES = [
    {
        title: 'Web Development',
        icon: '💻',
        description: 'Custom web applications built with modern technologies like React, Node.js, and MongoDB. I create fast, scalable, and maintainable solutions that drive business growth.',
        features: [
            'Responsive Web Design',
            'Full-Stack Development',
            'Performance Optimization',
            'SEO Implementation',
            'Cross-browser Compatibility',
            'API Integration',
            'Database Design',
            'Progressive Web Apps'
        ]
    },
    {
        title: 'UI/UX Design',
        icon: '🎨',
        description: 'User-centered designs that combine aesthetics with functionality and great user experience. I create intuitive interfaces that users love to interact with.',
        features: [
            'User Research & Analysis',
            'Wireframing & Prototyping',
            'Visual Design Systems',
            'Interaction Design',
            'Usability Testing',
            'Design Handoff',
            'Accessibility Compliance',
            'Design System Creation'
        ]
    },
    {
        title: 'Consulting',
        icon: '🚀',
        description: 'Technical consultation to help you make informed decisions about your technology stack and architecture. Strategic guidance for your digital transformation.',
        features: [
            'Code Review & Audits',
            'Architecture Planning',
            'Performance Optimization',
            'Technical Strategy',
            'Best Practices Implementation',
            'Team Mentoring',
            'Technology Selection',
            'Project Rescue'
        ]
    }
]

export const BLOG_POSTS = [
    {
        id: 'b1',
        title: 'The Future of Web Development: 2025 Trends and Predictions',
        category: 'Industry Insights',
        excerpt: 'Explore the revolutionary changes shaping web development in 2025 - from AI co-creators and sustainable design to WebAssembly and decentralized technologies.',
        readTime: '8 min read',
        date: '2025-10-24',
        featured: './blog1.jpg',
        tags: ['Web Development', 'AI', 'Trends', 'Technology', 'Sustainability'],
        content: `
        <div class="blog-content">
            <p class="lead">The digital landscape is experiencing a transformation unlike anything we've seen before. As we navigate through 2025, web development has evolved from simply creating functional websites to crafting intelligent, sustainable, and deeply personalized digital experiences.</p>

            <p>The convergence of artificial intelligence, environmental consciousness, and cutting-edge technologies is reshaping how we build the web, and the implications are nothing short of revolutionary.</p>

            <h2>🤖 The AI Revolution: From Assistant to Co-Creator</h2>
            
            <p>Artificial intelligence has transcended its role as a helpful tool and has become an indispensable co-creator in the development process. Developers wrote <strong>256 billion lines of code in 2024</strong>, with projections reaching <strong>600 billion in 2025</strong>, and by 2026, an estimated <strong>90% of all code will be generated by AI</strong>.</p>

            <p>This isn't about replacing developers—it's about liberating them from the mundane to focus on what truly matters: creativity, innovation, and problem-solving.</p>

            <div class="highlight-box">
                <p><strong>AI Impact:</strong> AI-powered tools are now handling everything from proactive site monitoring and anomaly detection to predictive user journey mapping and generative content creation.</p>
            </div>

            <p>Imagine building a complex web application where AI suggests optimizations before performance issues arise, or where adaptive chatbots learn from every interaction to provide increasingly personalized user experiences. This is the reality developers are working with today.</p>

            <h2>☁️ The Rise of Serverless and Headless Architectures</h2>

            <p>The infrastructure that powers modern web applications is undergoing a fundamental shift. The serverless architecture market is projected to reach <strong>$17.78 billion in 2025</strong>, and for good reason.</p>

            <ul>
                <li><strong>Auto-scaling:</strong> Cloud platforms provide capabilities that improve performance during traffic surges without manual intervention</li>
                <li><strong>Focus on innovation:</strong> Developers can concentrate on creating exceptional user experiences rather than infrastructure</li>
                <li><strong>Headless flexibility:</strong> Content flows seamlessly across websites, mobile apps, IoT devices, and virtual assistants</li>
            </ul>

            <h2>⚡ WebAssembly and the Blurring Lines Between Web and Native</h2>

            <p>The web browser is becoming a powerhouse of computational capability, thanks to WebAssembly's continued maturation.</p>

            <pre><code class="language-javascript">// WebAssembly enables near-native performance
const module = await WebAssembly.instantiateStreaming(
    fetch('compute-intensive-task.wasm')
);
const result = module.instance.exports.heavyComputation();</code></pre>

            <p><strong>Key benefits:</strong></p>
            <ul>
                <li>Applications run entirely in browser with native-like performance</li>
                <li>Dramatically reduced load times with binary format</li>
                <li>Support for multiple languages (Rust, C++, Go)</li>
                <li>Democratizing access to powerful applications</li>
            </ul>

            <h2>📱 Progressive Web Apps: The Best of Both Worlds</h2>

            <p>Progressive Web Apps have become the default choice for businesses looking to deliver app-like experiences on the web, now offering:</p>

            <div class="features-grid">
                <div class="feature-item">Offline functionality</div>
                <div class="feature-item">Push notifications</div>
                <div class="feature-item">Bluetooth access</div>
                <div class="feature-item">File system integration</div>
                <div class="feature-item">AR/VR experiences</div>
            </div>

            <blockquote>
                <p>"The distinction between 'web app' and 'native app' is becoming increasingly meaningless."</p>
            </blockquote>

            <h2>🔗 Web3 and the Decentralized Future</h2>

            <p>While the hype around Web3 has cooled, its practical applications are maturing. Frontend developers are now building interfaces for:</p>

            <ul>
                <li>Decentralized applications on blockchain networks</li>
                <li>Smart contracts and NFT platforms</li>
                <li>Decentralized finance (DeFi) interfaces</li>
                <li>User-controlled authentication systems</li>
            </ul>

            <h2>🌱 Sustainable Web Design: Building for the Planet</h2>

            <p>Web sustainability has evolved beyond basic optimization to focus on creating environmentally friendly websites.</p>

            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">40%</div>
                    <div class="stat-label">Reduction in energy usage with optimized sites</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">2.5x</div>
                    <div class="stat-label">Faster loading on sustainable websites</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">60%</div>
                    <div class="stat-label">Less data transfer with efficient coding</div>
                </div>
            </div>

            <h2>🚀 The Performance Imperative</h2>

            <p>In an age of diminishing attention spans, performance isn't just important—it's existential.</p>

            <div class="highlight-box">
                <p><strong>Critical Stat:</strong> Websites that load in under 2.5 seconds experience an average <strong>15% boost in conversion rates</strong>.</p>
            </div>

            <p>Jamstack architecture ensures instant loading through pre-rendered pages, with the separation of front-end and back-end enhancing both user experience and security.</p>

            <h2>♿ Accessibility and Inclusion: Not Optional</h2>

            <p>Accessibility is no longer an afterthought in frontend development. Tools like Axe and Lighthouse are being integrated into CI/CD pipelines to catch accessibility issues early.</p>

            <ul>
                <li>ARIA roles and semantic HTML creating more accessible interfaces</li>
                <li>High contrast ratios improving readability for everyone</li>
                <li>Keyboard navigation benefiting all users</li>
                <li>Compliance with European Accessibility Act (2025)</li>
            </ul>

            <h2>🎨 The Evolution of User Interfaces</h2>

            <p>Experimental navigation is engaging users through unique interactions, unexpected layouts, and novel experiences.</p>

            <p><strong>Key trends:</strong></p>
            <ul>
                <li>Immersive scrolling and engaging animations</li>
                <li>3D transitions and spatial interfaces</li>
                <li>Micro-interactions creating emotional connections</li>
                <li>Three-dimensional interactive elements</li>
            </ul>

            <h2>🛠️ The Low-Code Movement Matures</h2>

            <p>Low-code and no-code platforms are balancing speed and sophistication, empowering users while maintaining scalability and flexibility.</p>

            <blockquote>
                <p>"This democratization of web development isn't threatening professional developers—it's freeing them to focus on complex, creative challenges."</p>
            </blockquote>

            <h2>🎤 Voice Search and Conversational Interfaces</h2>

            <p>With <strong>75% of US households expected to have voice-activated smart speakers by 2025</strong>, web development practices must evolve.</p>

            <p>This requires rethinking how we structure content and design interactions for natural language processing and voice search optimization.</p>

            <h2>🔮 Looking Forward</h2>

            <p>The web development landscape of 2025 is defined by intelligent automation, environmental responsibility, and human-centered design. These trends emphasize a future where adaptability and creativity will drive success in web development.</p>

            <div class="conclusion">
                <p><strong>The future of web development isn't just about technology—it's about using technology to solve real human problems, to create connections, to make information and services accessible to everyone, and to do so in a way that respects our planet's limited resources.</strong></p>
                <p>That's a future worth building toward, one line of code at a time.</p>
            </div>
        </div>
        `
    }
]