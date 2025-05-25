
import { useState } from 'react';
import { motion } from 'framer-motion';
import { File, FileText, Upload, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

const Tools = () => {
  const [selectedDocument, setSelectedDocument] = useState('non-disclosure');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [contractRequirements, setContractRequirements] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      toast.success("File uploaded successfully", {
        description: e.target.files[0].name
      });
    }
  };

  const handleAskQuestion = () => {
    if (question.trim() === '') {
      toast.error("Please enter a question");
      return;
    }
    
    if (!uploadedFile) {
      toast.error("Please upload a document first");
      return;
    }

    // Here you would typically send the question to an API
    toast.info("Processing your question...");
    setQuestion('');
  };

  const handleGenerateContract = () => {
    if (!jurisdiction.trim()) {
      toast.error("Please enter a jurisdiction");
      return;
    }

    toast.success("Generating contract...", {
      description: "Your " + getDocumentLabel(selectedDocument) + " is being generated"
    });
  };

  const getDocumentLabel = (value: string) => {
    switch (value) {
      case 'non-disclosure': return 'Non-Disclosure Agreement';
      case 'employment': return 'Employment Contract';
      case 'service': return 'Service Agreement';
      case 'partnership': return 'Partnership Agreement';
      case 'legal-agreement': return 'Legal Agreement';
      case 'sale-deed': return 'Sale Deed';
      default: return 'Document';
    }
  };
  
  const renderContractPreview = () => {
    if (selectedDocument === 'non-disclosure') {
      return (
        <div className="text-sm text-white/80 max-h-56 overflow-y-auto">
          <h3 className="font-bold mb-2 text-white">MUTUAL NON-DISCLOSURE AGREEMENT</h3>
          <p className="mb-2">This Non-Disclosure Agreement (the "Agreement") is entered into as of [Date] by and between:</p>
          <p className="mb-2">TechStart Inc, a corporation with its principal place of business at [Address] ("Company")<br />
          and<br />
          [Consultant Name], an individual with address at [Address] ("Consultant")</p>
          
          <p className="font-semibold mt-3">1. CONFIDENTIAL INFORMATION</p>
          <p className="mb-2">Confidential Information includes, but is not limited to:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Software architecture and source code</li>
            <li>Technical specifications and documentation</li>
            <li>Business plans and strategies</li>
            <li>Client data and relationships</li>
            <li>Proprietary methodologies and processes</li>
          </ul>
          
          <p className="font-semibold mt-3">2. TERM</p>
          <p className="mb-2">This Agreement shall remain in effect for a period of two (2) years from the date of execution.</p>
          
          <p className="font-semibold mt-3">3. NON-DISCLOSURE OBLIGATIONS</p>
          <p className="mb-2">The Consultant agrees to:</p>
          <ol className="list-alpha pl-5 mb-2">
            <li>Maintain strict confidentiality of the Company's Confidential Information</li>
            <li>Use the Confidential Information solely for the software project</li>
            <li>Not disclose to any third party without prior written consent</li>
            <li>[Additional terms...]</li>
          </ol>
          
          <p className="mt-4 mb-2">Signed by:</p>
          <div className="flex justify-between mt-2">
            <div>
              <p className="border-t border-white/30 pt-1">TechStart Inc</p>
              <p>Date:</p>
            </div>
            <div>
              <p className="border-t border-white/30 pt-1">Consultant</p>
              <p>Date:</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-center font-medium text-white/90">{getDocumentLabel(selectedDocument).toUpperCase()}</p>
        <p className="text-white/70 text-sm mt-2">
          This {getDocumentLabel(selectedDocument)} (the "Agreement") is entered into as of [Date] by and between:
        </p>
      </div>
    );
  };
  
  return (
    <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <span className="text-sm font-medium">Interactive Tools</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Try Our Contract Tools
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the power of AI-driven contract analysis and generation
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Document Analysis Tool */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl border border-white/5 p-6 md:p-8"
          >
            <div className="flex items-center mb-5">
              <File className="h-6 w-6 text-contractBlue-400 mr-3" />
              <h3 className="text-xl font-semibold">AI Document Analysis</h3>
            </div>
            
            <div className="mb-5">
              <div className="border border-dashed border-white/10 rounded-lg p-8 mb-4 text-center hover:border-white/20 transition-colors bg-muted/30">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-white/40 mb-3" />
                  <p className="text-white/70 mb-3">
                    {uploadedFile ? uploadedFile.name : "Drop your file here or"}
                  </p>
                  <label htmlFor="file-upload">
                    <Button className="px-5 bg-white/10 hover:bg-white/15" asChild>
                      <span>Choose File</span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {!uploadedFile && (
                    <p className="text-white/50 text-sm mt-3">PDF, DOC, or DOCX files supported</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-5">
              <p className="text-white/80 italic">
                Hello! I'm your Contract IQ assistant. I can help you analyze documents, generate
                contracts, and track compliance. How can I assist you today?
              </p>
            </div>
            
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask questions about your document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full pr-10"
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-contractBlue-400 hover:text-contractBlue-300"
                onClick={handleAskQuestion}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
          
          {/* Contract Generator Tool */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl border border-white/5 p-6 md:p-8"
          >
            <div className="flex items-center mb-5">
              <FileText className="h-6 w-6 text-contractBlue-400 mr-3" />
              <h3 className="text-xl font-semibold">Contract Generator</h3>
            </div>
            
            <div className="mb-5">
              <div className="mb-4">
                <Select
                  value={selectedDocument}
                  onValueChange={setSelectedDocument}
                >
                  <SelectTrigger className="w-full bg-muted/30 border border-white/10">
                    <SelectValue placeholder="Select agreement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-disclosure">Non-Disclosure Agreement</SelectItem>
                    <SelectItem value="employment">Employment Contract</SelectItem>
                    <SelectItem value="service">Service Agreement</SelectItem>
                    <SelectItem value="partnership">Partnership Agreement</SelectItem>
                    <SelectItem value="legal-agreement">Legal Agreement</SelectItem>
                    <SelectItem value="sale-deed" className="pl-6">└ Sale Deed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <textarea
                  placeholder="Describe your requirements..."
                  rows={3}
                  className="form-input resize-none h-32 w-full"
                  value={contractRequirements}
                  onChange={(e) => setContractRequirements(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Jurisdiction"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 py-5 mb-4"
                onClick={handleGenerateContract}
              >
                Generate Contract
              </Button>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-3">
              <h4 className="text-center text-lg font-medium mb-2">Contract Preview</h4>
              {renderContractPreview()}
            </div>
            
            <Button variant="outline" className="w-full border-white/10 flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              Download
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
