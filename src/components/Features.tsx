
import { motion } from 'framer-motion';
import { 
  Check, 
  File, 
  FileText, 
  AlertCircle, 
  Clock, 
  Tag, 
  Search, 
  History 
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

  const featuresList = [
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
            management process
          </motion.p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {featuresList.map((feature, index) => (
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
    </div>
  );
};

export default Features;
