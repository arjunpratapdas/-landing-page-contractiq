
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Please provide a rating",
        description: "Your rating helps us improve our service.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting feedback to Supabase:', { name, email, feedback, rating });
      
      // Insert the feedback data into Supabase
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { 
            name, 
            email, 
            feedback, 
            rating,
            created_at: new Date().toISOString() 
          }
        ]);
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Feedback submission successful:', data);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });
      
      // Reset form
      setRating(0);
      setName('');
      setEmail('');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Failed to submit feedback",
        description: "There was an error submitting your feedback. Please ensure the 'feedback' table exists in your Supabase database.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-xl border border-white/5 p-8 relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">
              Your Feedback Matters
            </h2>
            
            <p className="text-white/70">
              Help us improve Contract IQ by sharing your experience
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-center mb-3">How would you rate your experience?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="form-input"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-white/80 mb-1">
                Your Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                className="form-input resize-none"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </form>
          
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-contractBlue-500/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-contractBlue-500/10 rounded-full blur-3xl opacity-50"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
