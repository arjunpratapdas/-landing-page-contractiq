
import { motion } from 'framer-motion';
import { useState } from 'react';
import UserLayout from '@/components/UserLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Cpu, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';

const SmartAutomation = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('nda');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Mock template data
  const templates = [
    { id: 'nda', name: 'Non-Disclosure Agreement', icon: FileText },
    { id: 'employment', name: 'Employment Contract', icon: FileText },
    { id: 'sales', name: 'Sales Agreement', icon: FileText },
    { id: 'service', name: 'Service Agreement', icon: FileText },
    { id: 'partnership', name: 'Partnership Agreement', icon: FileText },
    { id: 'vendor', name: 'Vendor Agreement', icon: FileText },
  ];
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <UserLayout currentTab="smart-automation">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">AI-Powered Smart Contract Automation</h2>
          <p className="text-muted-foreground">Auto-generate legal documents, extract critical clauses, and customize templates dynamically</p>
        </div>
        
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="mb-6 bg-muted/30 border border-white/10 p-1">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Generate Contracts</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Analyze & Extract</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle>Select Template</CardTitle>
                  <CardDescription>Choose from our library of AI-powered templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-md cursor-pointer transition-all flex items-center gap-3 ${
                          selectedTemplate === template.id
                            ? 'bg-contractBlue-500/20 border border-contractBlue-500/30'
                            : 'bg-muted/30 border border-white/10 hover:border-white/30'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <template.icon className="h-5 w-5 text-contractBlue-400" />
                        <span>{template.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle>Customize Template</CardTitle>
                  <CardDescription>Modify the template to your specific needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Input placeholder="Company Name" />
                    <Input placeholder="Counterparty Name" />
                    <Input placeholder="Jurisdiction" />
                    <Input placeholder="Effective Date" type="date" />
                    <Input placeholder="Term Length (months)" type="number" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-blue">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Generate Document
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card className="bg-card border border-white/5">
              <CardHeader>
                <CardTitle>AI-Powered Features</CardTitle>
                <CardDescription>Our smart contract generation includes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg border border-white/10">
                    <FileText className="h-8 w-8 text-contractBlue-400 mb-3" />
                    <h3 className="font-medium mb-2">Dynamic Templates</h3>
                    <p className="text-sm text-muted-foreground">Customizable for specific business needs and jurisdictions</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg border border-white/10">
                    <CheckCircle className="h-8 w-8 text-contractBlue-400 mb-3" />
                    <h3 className="font-medium mb-2">Built-in Compliance</h3>
                    <p className="text-sm text-muted-foreground">Documents automatically adhere to relevant regulations</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg border border-white/10">
                    <AlertTriangle className="h-8 w-8 text-contractBlue-400 mb-3" />
                    <h3 className="font-medium mb-2">Risk Detection</h3>
                    <p className="text-sm text-muted-foreground">Identifies potential issues and suggests improvements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analyze" className="space-y-6">
            <Card className="bg-muted/30 border border-white/10">
              <CardHeader>
                <CardTitle>AI Clause Extraction</CardTitle>
                <CardDescription>Upload a contract to extract key clauses and detect missing terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
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
                      <p className="text-white/50 text-sm mt-3">PDF, DOC, or DOCX up to 10MB</p>
                    )}
                  </div>
                </div>
                
                {uploadedFile && (
                  <Button className="w-full bg-gradient-blue">
                    <Cpu className="h-4 w-4 mr-2" />
                    Analyze Document
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card border border-white/5">
              <CardHeader>
                <CardTitle>What We Extract</CardTitle>
                <CardDescription>Our AI can identify these critical components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <CheckCircle className="h-5 w-5 text-contractBlue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Key Obligations</h3>
                      <p className="text-sm text-muted-foreground">Identifies all parties' responsibilities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <CheckCircle className="h-5 w-5 text-contractBlue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Liability Clauses</h3>
                      <p className="text-sm text-muted-foreground">Highlights allocation of risk</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <CheckCircle className="h-5 w-5 text-contractBlue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Payment Terms</h3>
                      <p className="text-sm text-muted-foreground">Extracts pricing and payment schedules</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <CheckCircle className="h-5 w-5 text-contractBlue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Termination Rights</h3>
                      <p className="text-sm text-muted-foreground">Identifies how contracts can be ended</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Missing Terms</h3>
                      <p className="text-sm text-muted-foreground">Detects important omissions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-white/10">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Ambiguous Language</h3>
                      <p className="text-sm text-muted-foreground">Flags unclear or risky wording</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default SmartAutomation;
