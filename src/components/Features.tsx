import { motion } from 'framer-motion';
import { 
  Check, 
  File, 
  FileText, 
  AlertCircle, 
  Clock, 
  Tag, 
  Search, 
  History,
  Brain,
  Edit3,
  Volume2,
  Layers,
  Filter,
  BookOpen,
  User
} from 'lucide-react';

const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const coreFeatures = [
    {
      title: "Smart Clause Detection",
      description: "Our AI identifies and analyzes key clauses in contracts, highlighting potential issues and suggesting improvements.",
      icon: AlertCircle,
      benefits: [
        "Identifies problematic language",
        "Suggests alternative phrasing",
        "Ensures regulatory compliance"
      ]
    },
    {
      title: "Automated Contract Generation",
      description: "Create legally sound contracts in minutes using our AI-powered generation tools, customized to your specific needs.",
      icon: FileText,
      benefits: [
        "Customizable templates",
        "Industry-specific language",
        "Multi-jurisdiction support"
      ]
    },
    {
      title: "Risk Analysis & Scoring",
      description: "Receive comprehensive risk assessments for every contract, with clear scoring and actionable insights.",
      icon: AlertCircle,
      benefits: [
        "Quantitative risk scoring",
        "Liability assessment",
        "Obligation tracking"
      ]
    },
    {
      title: "Document Organization",
      description: "Keep all your contracts organized and searchable with our intelligent document management system.",
      icon: File,
      benefits: [
        "Smart categorization",
        "Full-text search capabilities",
        "Version control and history"
      ]
    }
  ];

  const advancedFeatures = [
    {
      title: "Intelligent Auto-Fill",
      description: "Pulls information from past interactions, user profiles, or public sources to pre-fill forms automatically.",
      icon: Brain,
      benefits: [
        "Reduces repetitive data entry",
        "Minimizes human errors",
        "Learns from past interactions"
      ]
    },
    {
      title: "In-Document Error Correction",
      description: "Real-time editing and correction without needing to re-send the entire document with complete audit trails.",
      icon: Edit3,
      benefits: [
        "Real-time collaborative editing",
        "Version control and audit trail",
        "Instant error detection and fixes"
      ]
    },
    {
      title: "Integrated Voice & Text Guidance",
      description: "Embedded AI voice agent explains terms, conditions, and fields in plain language with contextual help.",
      icon: Volume2,
      benefits: [
        "Plain language explanations",
        "Contextual help and tooltips",
        "Voice-guided assistance"
      ]
    },
    {
      title: "Dynamic, Adaptive Templates",
      description: "Templates that adjust content and questions based on the signer's profile, context, and conditional logic.",
      icon: Layers,
      benefits: [
        "Context-aware content adjustment",
        "Conditional logic implementation",
        "Profile-based customization"
      ]
    },
    {
      title: "No Redundant Questions",
      description: "Recognizes and eliminates duplicate questions by leveraging previous answers and available data intelligently.",
      icon: Filter,
      benefits: [
        "Eliminates duplicate questions",
        "Leverages previous answers",
        "Streamlined user experience"
      ]
    },
    {
      title: "Contextual Summaries & Explanations",
      description: "Generates easy-to-understand summaries tailored to each user with personalized explanations for complex clauses.",
      icon: BookOpen,
      benefits: [
        "User-specific explanations",
        "Complex clause simplification",
        "Tailored content summaries"
      ]
    },
    {
      title: "Personalized User Experience",
      description: "Customizes document flow and guidance based on user history, preferences, and document type for optimal efficiency.",
      icon: User,
      benefits: [
        "Customized document workflows",
        "History-based preferences",
        "Adaptive user interface"
      ]
    }
  ];
  
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <span className="text-sm font-medium">Why Choose Contract IQ</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Powerful Features
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform offers a comprehensive suite of tools designed to streamline your contract 
            management process with cutting-edge AI technology
          </motion.p>
        </div>

        {/* Core Features Section */}
        <div className="mb-20">
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-8 text-center gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Core Features
          </motion.h3>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {coreFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={item} 
                className="feature-card group"
              >
                <div className="feature-icon">
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-contractBlue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 mb-5">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-contractBlue-400 mr-2 shrink-0" />
                      <span className="text-white/80 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Advanced AI Features Section */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full border border-contractBlue-500/30 bg-contractBlue-500/10 backdrop-blur-sm">
              <Brain className="mr-2 h-4 w-4 text-contractBlue-400" />
              <span className="text-sm font-medium text-contractBlue-400">Advanced AI Intelligence</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
              Next-Generation Features
            </h3>
            
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Experience the future of contract management with our advanced AI-powered features 
              designed for maximum efficiency and user satisfaction
            </p>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {advancedFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={item} 
                className="feature-card group relative overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-contractBlue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="feature-icon mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3 group-hover:text-contractBlue-400 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  
                  <p className="text-white/70 mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-contractBlue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-white/80 text-xs">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-contractBlue-500/10 to-blue-500/10 rounded-2xl border border-contractBlue-500/20 p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
              Ready to Transform Your Contract Management?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Experience all these powerful features and more with Contract IQ. 
              Start your free trial today and see the difference AI can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-blue rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all interactive-button">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-white/10 rounded-lg font-medium hover:bg-white/5 transition-all interactive-button">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;