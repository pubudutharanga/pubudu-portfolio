// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaRegCommentDots,
  FaSpinner 
} from 'react-icons/fa';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hi! I'm your AI assistant. I can tell you about Pubudu's skills, projects, experience, and help answer any questions about his portfolio. How can I help you today?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = generateAIResponse(input);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  // Advanced response generation without API
  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Enhanced knowledge base with extensive variations
    const knowledgeBase = {
      // Personal Information
      personal: [
        "Pubudu Tharanga is a passionate Full Stack Developer from Sri Lanka 🌴",
        "He's currently pursuing his BSc Hons in Information Systems at Sabaragamuwa University 🎓",
        "Pubudu is 22 years old and passionate about creating innovative digital solutions 💻",
        "Based in Sri Lanka, Pubudu combines technical expertise with creative problem-solving 🚀",
        "Pubudu Tharanga is a dedicated developer who loves turning complex problems into simple, beautiful solutions ✨"
      ],
      
      // Skills with variations
      skills: [
        "Pubudu excels in Frontend technologies like React, JavaScript, TypeScript, and Angular 🛠️",
        "His backend expertise includes Node.js, Express.js, and Python development 🚀",
        "For styling, he's proficient with Tailwind CSS, HTML5, and CSS3 🎨",
        "Database skills: MongoDB with experience in database design and optimization 💾",
        "Tools he masters: Git, VS Code, Postman, Figma for complete development workflow ⚡",
        "Full Stack capabilities: End-to-end development from UI/UX to deployment 🌐",
        "Additional skills: API Development, System Architecture, Responsive Design 📱",
        "He's constantly learning new technologies and frameworks to stay updated 📚"
      ],
      
      // Projects with detailed descriptions
      projects: [
        "Weather Dashboard: A beautiful React app with Chart.js integration showing real-time weather data 🌤️",
        "Portfolio Website: This very site! Built with modern React and smooth animations 💫",
        "E-commerce Platform: Full-stack solution with React frontend and Node.js backend 🛒",
        "Task Management App: Productivity tool with drag-drop functionality and real-time updates ✅",
        "API Integration Projects: Multiple projects demonstrating RESTful API consumption 🔌",
        "Responsive Web Applications: Various projects optimized for all devices 📱💻",
        "Open Source Contributions: Active participant in developer community projects 🤝"
      ],
      
      // Experience variations
      experience: [
        "2+ years of professional web development experience building modern applications 💼",
        "Completed 10+ projects ranging from small websites to complex web applications 📈",
        "Experience in both freelance projects and collaborative team development 👥",
        "Strong background in problem-solving and delivering user-centric solutions 🎯",
        "Worked with clients to understand requirements and deliver exceeding expectations 🌟",
        "Experience in agile development methodologies and version control with Git 🔄"
      ],
      
      // Contact information
      contact: [
        "Email: pubudutharange@gmail.com - Perfect for professional inquiries 📧",
        "Phone: +94 76 633 0916 - Available for calls and WhatsApp 💬",
        "LinkedIn: Pubudu Tharanga - Connect for professional networking 🔗",
        "GitHub: Check his code repositories and latest projects 💻",
        "He's always open to discussing new opportunities and collaborations 🤝",
        "Feel free to reach out for freelance projects or full-time positions 💼"
      ],
      
      // Education details
      education: [
        "BSc Hons in Information Systems at Sabaragamuwa University (2022-Present) 🎓",
        "Strong academic background in software engineering and information systems 📚",
        "Coursework includes: Web Development, Database Systems, Software Engineering 🖥️",
        "Active participant in university tech events and coding competitions 🏆",
        "Combining theoretical knowledge with practical development experience 🔧"
      ],
      
      // Services offered
      services: [
        "Full Stack Web Development: Complete solutions from frontend to backend 🌐",
        "UI/UX Design: Creating beautiful, user-friendly interfaces 🎨",
        "API Development: Building robust and scalable RESTful APIs 🔧",
        "Technical Consulting: Expert advice on technology stack and architecture 💡",
        "Responsive Design: Websites that work perfectly on all devices 📱",
        "Performance Optimization: Fast, efficient, and scalable applications ⚡"
      ],
      
      // Personality and approach
      personality: [
        "Pubudu is passionate about clean code and excellent user experiences ✨",
        "He believes in continuous learning and staying updated with latest technologies 📚",
        "Problem-solving mindset with attention to detail and quality 🔍",
        "Collaborative team player who also excels in independent work 👥",
        "Deadline-oriented with strong project management skills ⏰",
        "Creative thinker who loves tackling challenging problems 🧠"
      ],
      
      // Technical deep dive
      technical: [
        "Frontend Architecture: Component-based design with React and state management 🏗️",
        "Backend Development: RESTful APIs, authentication, and database integration 🔐",
        "Database Design: MongoDB schemas, queries, and performance optimization 📊",
        "Deployment: Experience with various hosting platforms and CI/CD pipelines 🚀",
        "Performance: Code optimization, lazy loading, and efficient rendering ⚡",
        "Security: Implementation of best practices for web application security 🛡️"
      ],
      
      // Future goals
      goals: [
        "Expand expertise in cloud technologies and microservices architecture ☁️",
        "Contribute more to open-source projects and developer community 🌍",
        "Work on innovative projects that solve real-world problems 💡",
        "Continue learning advanced technologies and frameworks 📚",
        "Build a strong professional network in the tech industry 🤝",
        "Create impactful digital solutions that make people's lives better ❤️"
      ]
    };

    // Advanced response patterns with contextual understanding
    const responsePatterns = [
      // Greeting patterns
      {
        pattern: /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i,
        responses: [
          "Hello there! 👋 How can I help you learn about Pubudu today?",
          "Hi! Nice to meet you! What would you like to know about Pubudu's portfolio?",
          "Hey! 👋 Ready to explore Pubudu's skills and projects?",
          "Greetings! I'm here to tell you all about Pubudu's development journey 🌟"
        ]
      },
      
      // Skills inquiries
      {
        pattern: /(skill|tech|technology|stack|framework|language|what can|expert)/i,
        responses: [
          `Pubudu's technical arsenal is impressive! ${getRandomResponse(knowledgeBase.skills)} He's particularly strong in modern JavaScript ecosystems and full-stack development.`,
          `When it comes to skills: ${getRandomResponse(knowledgeBase.skills)} His diverse skill set allows him to tackle various development challenges.`,
          `Technical capabilities: ${getRandomResponse(knowledgeBase.skills)} He's always expanding his toolkit with new technologies!`
        ]
      },
      
      // Project inquiries
      {
        pattern: /(project|work|portfolio|build|create|develop|application)/i,
        responses: [
          `Projects showcase: ${getRandomResponse(knowledgeBase.projects)} Each project demonstrates different aspects of his capabilities.`,
          `His development work includes: ${getRandomResponse(knowledgeBase.projects)} He focuses on creating solutions that are both functional and beautiful.`,
          `Notable projects: ${getRandomResponse(knowledgeBase.projects)} These reflect his growth as a developer and problem-solver.`
        ]
      },
      
      // Experience inquiries
      {
        pattern: /(experience|background|year|worked|professional|career)/i,
        responses: [
          `Professional journey: ${getRandomResponse(knowledgeBase.experience)} This experience has shaped his approach to development.`,
          `His background: ${getRandomResponse(knowledgeBase.experience)} He's grown significantly through hands-on project work.`,
          `Development experience: ${getRandomResponse(knowledgeBase.experience)} Each project has contributed to his expertise.`
        ]
      },
      
      // Contact inquiries
      {
        pattern: /(contact|email|phone|number|reach|hire|connect|linkedin|github)/i,
        responses: [
          `Contact details: ${getRandomResponse(knowledgeBase.contact)} He's very responsive and professional in communications.`,
          `Get in touch: ${getRandomResponse(knowledgeBase.contact)} Perfect timing for new collaborations!`,
          `Connect with Pubudu: ${getRandomResponse(knowledgeBase.contact)} He welcomes meaningful professional connections.`
        ]
      },
      
      // Education inquiries
      {
        pattern: /(education|study|university|degree|course|learn|student)/i,
        responses: [
          `Academic background: ${getRandomResponse(knowledgeBase.education)} His education complements practical experience perfectly.`,
          `Learning journey: ${getRandomResponse(knowledgeBase.education)} He balances academics with real-world development.`,
          `University experience: ${getRandomResponse(knowledgeBase.education)} This foundation supports his technical expertise.`
        ]
      },
      
      // Service inquiries
      {
        pattern: /(service|offer|provide|build|create|develop|freelance)/i,
        responses: [
          `Services offered: ${getRandomResponse(knowledgeBase.services)} He delivers high-quality solutions tailored to client needs.`,
          `What he offers: ${getRandomResponse(knowledgeBase.services)} Each service is backed by solid technical expertise.`,
          `Development services: ${getRandomResponse(knowledgeBase.services)} He ensures projects are delivered with excellence.`
        ]
      },
      
      // Technical deep dive
      {
        pattern: /(technical|code|programming|architecture|database|api|backend|frontend)/i,
        responses: [
          `Technical expertise: ${getRandomResponse(knowledgeBase.technical)} He follows best practices and modern development standards.`,
          `Development approach: ${getRandomResponse(knowledgeBase.technical)} His technical decisions are always well-considered.`,
          `Technical depth: ${getRandomResponse(knowledgeBase.technical)} He understands both the big picture and fine details.`
        ]
      },
      
      // Future goals
      {
        pattern: /(future|goal|aspiration|plan|next|ahead|dream)/i,
        responses: [
          `Future aspirations: ${getRandomResponse(knowledgeBase.goals)} He's excited about the possibilities ahead!`,
          `Looking forward: ${getRandomResponse(knowledgeBase.goals)} His journey in tech is just beginning to accelerate.`,
          `Career vision: ${getRandomResponse(knowledgeBase.goals)} He's committed to continuous growth and impact.`
        ]
      },
      
      // Personality questions
      {
        pattern: /(who is|about|personality|character|approach|mindset)/i,
        responses: [
          `About Pubudu: ${getRandomResponse(knowledgeBase.personal)} ${getRandomResponse(knowledgeBase.personality)}`,
          `Personal profile: ${getRandomResponse(knowledgeBase.personal)} His approach combines technical skill with creative thinking.`,
          `Who is Pubudu: ${getRandomResponse(knowledgeBase.personal)} ${getRandomResponse(knowledgeBase.personality)} He's dedicated to his craft.`
        ]
      },
      
      // Default intelligent response
      {
        pattern: /.*/,
        responses: [
          "That's an interesting question! Based on what I know about Pubudu, he's always working on expanding his skills and taking on new challenges in web development. Is there something specific about his portfolio you'd like to explore? 🚀",
          "Great question! Pubudu is passionate about creating digital solutions that make a difference. He combines technical expertise with creative problem-solving. What aspect of his work interests you most? 💡",
          "I appreciate your curiosity! Pubudu's journey in tech is all about continuous learning and building meaningful projects. Would you like to know more about his skills, projects, or experience? 📚",
          "Interesting inquiry! Pubudu focuses on delivering quality code and exceptional user experiences. He's currently deepening his expertise in full-stack development while exploring new technologies. What would you like to discuss? 🔍"
        ]
      }
    ];

    // Find matching pattern and return response
    for (const pattern of responsePatterns) {
      if (pattern.pattern.test(input)) {
        return getRandomResponse(pattern.responses);
      }
    }

    return "I'm here to help you learn about Pubudu's portfolio! Ask me about his skills, projects, experience, or how to contact him. What would you like to know? 💫";
  };

  // Helper function to get random response from array
  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What are Pubudu's technical skills?",
    "Tell me about his projects",
    "What's his development experience?",
    "How can I contact him?",
    "What is he currently studying?",
    "What services does he offer?",
    "What are his future goals?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <FaRegCommentDots size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Container */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col"
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FaRobot size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Portfolio Assistant</h3>
                    <p className="text-blue-100 text-sm">Ask me anything!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaRobot size={14} className="text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.isBot
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          : 'bg-blue-500 text-white'
                      } ${message.isError ? 'border border-red-300 dark:border-red-500' : ''}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.isBot 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-blue-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {!message.isBot && (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser size={14} className="text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaRobot size={14} className="text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested Questions */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInput(question);
                            setTimeout(() => handleSend(), 100);
                          }}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about skills, projects, experience..."
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="1"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaPaperPlane />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}