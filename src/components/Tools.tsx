import { useState } from 'react';
import { motion } from 'framer-motion';
import { File, FileText, Upload, Send, ChevronDown, Download, AlertCircle, CheckCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

const Tools = () => {
  const [selectedDocument, setSelectedDocument] = useState('non-disclosure');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [contractRequirements, setContractRequirements] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Jurisdiction data
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'in', label: 'India' },
    { value: 'sg', label: 'Singapore' },
  ];

  const statesByCountry = {
    us: [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' },
      { value: 'fl', label: 'Florida' },
      { value: 'il', label: 'Illinois' },
      { value: 'wa', label: 'Washington' },
      { value: 'ma', label: 'Massachusetts' },
      { value: 'nj', label: 'New Jersey' },
    ],
    ca: [
      { value: 'on', label: 'Ontario' },
      { value: 'qc', label: 'Quebec' },
      { value: 'bc', label: 'British Columbia' },
      { value: 'ab', label: 'Alberta' },
      { value: 'mb', label: 'Manitoba' },
      { value: 'sk', label: 'Saskatchewan' },
    ],
    uk: [
      { value: 'england', label: 'England' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
      { value: 'ni', label: 'Northern Ireland' },
    ],
    au: [
      { value: 'nsw', label: 'New South Wales' },
      { value: 'vic', label: 'Victoria' },
      { value: 'qld', label: 'Queensland' },
      { value: 'wa', label: 'Western Australia' },
      { value: 'sa', label: 'South Australia' },
      { value: 'tas', label: 'Tasmania' },
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Please upload a file smaller than 10MB"
        });
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload a PDF, DOC, or DOCX file"
        });
        return;
      }
      
      setUploadedFile(file);
      toast.success("File uploaded successfully", {
        description: file.name
      });
    }
  };

  const handleAskQuestion = async () => {
    if (question.trim() === '') {
      toast.error("Please enter a question");
      return;
    }
    
    if (!uploadedFile) {
      toast.error("Please upload a document first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('question', question);
      formData.append('analysis_type', 'general');
      
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data.analysis);
        toast.success("Document analyzed successfully", {
          description: `Analysis completed using ${data.provider}`
        });
      } else {
        throw new Error(data.detail || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsAnalyzing(false);
      setQuestion('');
    }
  };

  const generateContractWithGemini = async (prompt: string) => {
    const GEMINI_API_KEY = 'AIzaSyCIOef1EKeFUxZh83z4p_1ETntXi8nEsfU';
    // Updated to use the correct Gemini API endpoint
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Invalid Gemini API response:', data);
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  const handleGenerateContract = async () => {
    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Build jurisdiction string
      let jurisdiction = countries.find(c => c.value === selectedCountry)?.label || '';
      if (selectedState && statesByCountry[selectedCountry as keyof typeof statesByCountry]) {
        const stateName = statesByCountry[selectedCountry as keyof typeof statesByCountry]?.find(s => s.value === selectedState)?.label;
        if (stateName) {
          jurisdiction = `${stateName}, ${jurisdiction}`;
        }
      }
      if (projectLocation.trim()) {
        jurisdiction = `${projectLocation}, ${jurisdiction}`;
      }

      // Get document type label for better prompting
      const documentTypeLabel = {
        'non-disclosure': 'Non-Disclosure Agreement',
        'employment': 'Employment Contract',
        'service': 'Service Agreement',
        'partnership': 'Partnership Agreement',
        'legal-agreement': 'Legal Agreement',
        'sale-deed': 'Sale Deed'
      }[selectedDocument] || 'Legal Document';

      // Create a comprehensive prompt for Gemini
      const prompt = `Generate a professional ${documentTypeLabel} for the jurisdiction of ${jurisdiction}.

The document should be formatted as a proper legal contract with appropriate sections, clauses, and legal language suitable for ${jurisdiction}.

Additional requirements for this contract:
${contractRequirements || 'Standard terms and conditions appropriate for this type of agreement.'}

The contract should include:
1. Proper legal headings and structure
2. Numbered sections and subsections
3. Clear definitions section
4. Appropriate clauses for ${documentTypeLabel}
5. Signature blocks at the end
6. Current date: ${new Date().toLocaleDateString()}
7. Compliance with laws of ${jurisdiction}

Format the contract professionally with proper legal language and structure. Make it comprehensive and legally sound.

Please provide the complete contract text formatted properly for legal use.`;

      const contractText = await generateContractWithGemini(prompt);
      
      setGeneratedContract(contractText);
      toast.success("Contract generated successfully", {
        description: `Your ${documentTypeLabel} is ready for download`
      });
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Contract generation failed", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!generatedContract) return;
    
    try {
      // Create a simple HTML structure for PDF conversion
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Contract Document</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              margin: 40px; 
              color: #000;
              background: #fff;
            }
            h1 { 
              text-align: center; 
              margin-bottom: 30px; 
              font-size: 24px;
              font-weight: bold;
            }
            .contract-content { 
              white-space: pre-wrap; 
              font-size: 12px;
              line-height: 1.5;
            }
            @media print {
              body { margin: 20px; }
              .contract-content { font-size: 11px; }
            }
          </style>
        </head>
        <body>
          <div class="contract-content">${generatedContract.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getDocumentLabel(selectedDocument)}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Contract downloaded as HTML", {
        description: "You can convert this to PDF using your browser's print function (Ctrl+P → Save as PDF)"
      });
    } catch (error) {
      toast.error("Download failed", {
        description: "Please try again"
      });
    }
  };

  const downloadAsDOCX = async () => {
    if (!generatedContract) return;
    
    try {
      // Create a simple RTF format that can be opened by Word
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${generatedContract.replace(/\n/g, '\\par ')}}`;
      
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getDocumentLabel(selectedDocument)}-${new Date().toISOString().split('T')[0]}.rtf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Contract downloaded as RTF", {
        description: "This file can be opened in Microsoft Word"
      });
    } catch (error) {
      toast.error("Download failed", {
        description: "Please try again"
      });
    }
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
    if (generatedContract) {
      return (
        <div className="text-sm text-white/80 max-h-56 overflow-y-auto whitespace-pre-wrap">
          {generatedContract.substring(0, 500)}...
        </div>
      );
    }
    
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
                    <p className="text-white/50 text-sm mt-3">PDF, DOC, or DOCX files up to 10MB</p>
                  )}
                </div>
              </div>
            </div>
            
            {analysisResult && (
              <div className="bg-muted/30 rounded-lg p-4 mb-5">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-medium">Analysis Result</h4>
                </div>
                <div className="text-white/80 text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </div>
            )}
            
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
                disabled={isAnalyzing}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-contractBlue-400 hover:text-contractBlue-300 disabled:opacity-50"
                onClick={handleAskQuestion}
                disabled={isAnalyzing || !uploadedFile || !question.trim()}
              >
                {isAnalyzing ? (
                  <div className="animate-spin h-4 w-4 border-2 border-contractBlue-400 border-t-transparent rounded-full" />
                ) : (
                  <Send size={18} />
                )}
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
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Agreement Type
                </label>
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
                    <SelectItem value="sale-deed">Sale Deed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Jurisdiction Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Jurisdiction
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Country *</label>
                    <Select
                      value={selectedCountry}
                      onValueChange={(value) => {
                        setSelectedCountry(value);
                        setSelectedState(''); // Reset state when country changes
                      }}
                    >
                      <SelectTrigger className="w-full bg-muted/30 border border-white/10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCountry && statesByCountry[selectedCountry as keyof typeof statesByCountry] && (
                    <div>
                      <label className="block text-xs text-white/60 mb-1">State/Province</label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger className="w-full bg-muted/30 border border-white/10">
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesByCountry[selectedCountry as keyof typeof statesByCountry]?.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-white/60 mb-1">Project Location (Optional)</label>
                    <Input
                      type="text"
                      placeholder="e.g., San Francisco, Downtown, etc."
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="bg-muted/30 border border-white/10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Additional Requirements
                </label>
                <Textarea
                  placeholder="Describe your specific requirements..."
                  rows={3}
                  className="form-input resize-none h-32 w-full"
                  value={contractRequirements}
                  onChange={(e) => setContractRequirements(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 py-5 mb-4"
                onClick={handleGenerateContract}
                disabled={isGenerating || !selectedCountry}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating Contract...
                  </span>
                ) : (
                  'Generate Contract'
                )}
              </Button>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-3">
              <h4 className="text-center text-lg font-medium mb-2">Contract Preview</h4>
              {renderContractPreview()}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 border-white/10 flex items-center justify-center"
                onClick={downloadAsPDF}
                disabled={!generatedContract}
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-white/10 flex items-center justify-center"
                onClick={downloadAsDOCX}
                disabled={!generatedContract}
              >
                <Download className="h-4 w-4 mr-2" />
                Download RTF
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tools;