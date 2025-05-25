
import { motion } from 'framer-motion';
import { useState } from 'react';
import UserLayout from '@/components/UserLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  Workflow, 
  PenTool, 
  CheckCircle, 
  Link as LinkIcon, 
  Clock, 
  User, 
  Send, 
  Plus,
  ArrowRight,
  FileCheck,
  Settings
} from 'lucide-react';

const WorkflowAutomation = () => {
  // Mock data for workflows
  const [workflows, setWorkflows] = useState([
    {
      id: 'WF-001',
      name: 'NDA Approval Process',
      status: 'Active',
      steps: 4,
      lastRun: '2023-11-01',
      completionRate: 98
    },
    {
      id: 'WF-002',
      name: 'Vendor Onboarding',
      status: 'Active',
      steps: 6,
      lastRun: '2023-10-25',
      completionRate: 92
    },
    {
      id: 'WF-003',
      name: 'Employment Contract Signing',
      status: 'Inactive',
      steps: 5,
      lastRun: '2023-10-15',
      completionRate: 85
    }
  ]);
  
  // Mock data for signatures
  const [signatures, setSignatures] = useState([
    {
      id: 'SIG-001',
      document: 'Service Agreement - TechCorp',
      signers: [
        { name: 'John Smith', status: 'Completed', date: '2023-10-28' },
        { name: 'Mary Johnson', status: 'Pending', date: null }
      ],
      dueDate: '2023-11-15',
      status: 'In Progress'
    },
    {
      id: 'SIG-002',
      document: 'NDA - Innovative Solutions',
      signers: [
        { name: 'Sarah Williams', status: 'Completed', date: '2023-10-22' },
        { name: 'Robert Brown', status: 'Completed', date: '2023-10-23' }
      ],
      dueDate: '2023-10-30',
      status: 'Completed'
    },
    {
      id: 'SIG-003',
      document: 'Partnership Agreement - Global Partners',
      signers: [
        { name: 'James Davis', status: 'Pending', date: null },
        { name: 'Linda Miller', status: 'Pending', date: null }
      ],
      dueDate: '2023-11-20',
      status: 'Not Started'
    }
  ]);
  
  // Mock data for integrations
  const [integrations, setIntegrations] = useState([
    {
      id: 'INT-001',
      name: 'Salesforce CRM',
      status: 'Connected',
      type: 'CRM',
      lastSync: '2023-11-02 09:15',
      icon: '🔄'
    },
    {
      id: 'INT-002',
      name: 'Workday HR',
      status: 'Connected',
      type: 'HR',
      lastSync: '2023-11-01 14:30',
      icon: '👥'
    },
    {
      id: 'INT-003',
      name: 'QuickBooks',
      status: 'Not Connected',
      type: 'Finance',
      lastSync: null,
      icon: '💰'
    }
  ]);

  return (
    <UserLayout currentTab="workflow-automation">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">Smart e-Signature & Workflow Automation</h2>
          <p className="text-muted-foreground">Integrated e-signatures, error-free execution, and cross-platform integrations</p>
        </div>
        
        <Tabs defaultValue="signature" className="w-full">
          <TabsList className="mb-6 bg-muted/30 border border-white/10 p-1">
            <TabsTrigger value="signature" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              <span>e-Signature</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signature">
            <Card className="bg-card border border-white/5 mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Signature Requests</CardTitle>
                  <CardDescription>Track and manage document signatures</CardDescription>
                </div>
                <Button className="bg-gradient-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  New Signature Request
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Signers</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signatures.map((sig) => (
                        <TableRow key={sig.id}>
                          <TableCell className="font-medium">{sig.document}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {sig.signers.map((signer, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <span className={signer.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}>
                                    {signer.status === 'Completed' ? '✓' : '⌛'} 
                                  </span>
                                  <span className="ml-2">{signer.name}</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(sig.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sig.status === 'Completed' ? 'bg-green-100/10 text-green-500' :
                              sig.status === 'In Progress' ? 'bg-yellow-100/10 text-yellow-500' :
                              'bg-blue-100/10 text-blue-400'
                            }`}>
                              {sig.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              {sig.status === 'Completed' ? 'View' : 'Manage'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">AI-Enhanced Contract Execution</CardTitle>
                  <CardDescription>Our smart signature technology ensures error-free execution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-card rounded-lg">
                    <div className="bg-contractBlue-500/20 rounded-full p-2">
                      <CheckCircle className="h-6 w-6 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Error Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        AI automatically detects and flags missing signatures, incorrect data fields, and other execution errors
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-card rounded-lg">
                    <div className="bg-contractBlue-500/20 rounded-full p-2">
                      <User className="h-6 w-6 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Signer Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Advanced identity verification ensures all signers are properly authenticated
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-card rounded-lg">
                    <div className="bg-contractBlue-500/20 rounded-full p-2">
                      <Clock className="h-6 w-6 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Automated Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Smart notification system sends reminders to pending signers at optimal times
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Signature</CardTitle>
                  <CardDescription>Send a document for signature in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Document</label>
                    <div className="border border-dashed border-white/10 rounded-lg p-4 text-center hover:border-white/20 transition-colors">
                      <div className="flex flex-col items-center">
                        <FileCheck className="h-8 w-8 text-white/40 mb-2" />
                        <p className="text-white/70 text-sm mb-2">Drop your file here or</p>
                        <Button variant="outline" size="sm">Choose File</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Signers</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Email address" />
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Input placeholder="Add a message to signers (optional)" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-blue">
                    <Send className="h-4 w-4 mr-2" />
                    Send for Signature
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow">
            <Card className="bg-card border border-white/5 mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Contract Workflows</CardTitle>
                  <CardDescription>Automated workflows for contract processes</CardDescription>
                </div>
                <Button className="bg-gradient-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Workflow
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Completion Rate</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>{workflow.steps}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              workflow.status === 'Active' ? 'bg-green-100/10 text-green-500' : 'bg-gray-100/10 text-gray-400'
                            }`}>
                              {workflow.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(workflow.lastRun).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-muted/50 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-contractBlue-500 h-2 rounded-full" 
                                  style={{ width: `${workflow.completionRate}%` }}
                                />
                              </div>
                              <span className="text-xs">{workflow.completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">Run</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30 border border-white/10">
              <CardHeader>
                <CardTitle>Featured Workflow: NDA Approval Process</CardTitle>
                <CardDescription>An automated workflow for Non-Disclosure Agreements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 inset-y-0 w-0.5 bg-muted/50" />
                  
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 p-2 rounded-full bg-contractBlue-500/20 border border-contractBlue-500/30">
                      <span className="text-xs text-contractBlue-400">1</span>
                    </div>
                    <h3 className="font-medium mb-1">Document Generation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI generates customized NDA based on provided parameters and requirements
                    </p>
                  </div>
                  
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 p-2 rounded-full bg-contractBlue-500/20 border border-contractBlue-500/30">
                      <span className="text-xs text-contractBlue-400">2</span>
                    </div>
                    <h3 className="font-medium mb-1">Internal Review</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Legal team receives document for review with AI-highlighted sections of concern
                    </p>
                  </div>
                  
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 p-2 rounded-full bg-contractBlue-500/20 border border-contractBlue-500/30">
                      <span className="text-xs text-contractBlue-400">3</span>
                    </div>
                    <h3 className="font-medium mb-1">Management Approval</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Document routed to appropriate management level based on risk assessment
                    </p>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 p-2 rounded-full bg-contractBlue-500/20 border border-contractBlue-500/30">
                      <span className="text-xs text-contractBlue-400">4</span>
                    </div>
                    <h3 className="font-medium mb-1">e-Signature</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Approved document sent to all parties for electronic signature
                    </p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-center">
                  <Button className="bg-gradient-blue">
                    <Workflow className="h-4 w-4 mr-2" />
                    Clone This Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card className="bg-card border border-white/5 mb-6">
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Sync with CRM, HR, and Finance Tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {integrations.map((integration) => (
                    <div 
                      key={integration.id} 
                      className={`p-4 rounded-lg border ${
                        integration.status === 'Connected' 
                          ? 'bg-muted/30 border-white/10' 
                          : 'bg-muted/20 border-dashed border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{integration.icon}</div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-xs text-muted-foreground">{integration.type}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          integration.status === 'Connected' 
                            ? 'bg-green-100/10 text-green-500' 
                            : 'bg-gray-100/10 text-gray-400'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      
                      {integration.status === 'Connected' ? (
                        <div className="text-xs text-muted-foreground">
                          Last synced: {integration.lastSync}
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Connect
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="p-4 rounded-lg border border-dashed border-white/10 bg-muted/20 flex flex-col items-center justify-center text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">Add New Integration</p>
                    <Button variant="outline" size="sm">Browse Integrations</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Integration Benefits</CardTitle>
                  <CardDescription>How our integrations empower your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-contractBlue-500/20 rounded-full p-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Seamless Data Sync</h3>
                      <p className="text-sm text-muted-foreground">
                        Contract data automatically syncs with your CRM, HR, and finance platforms
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-contractBlue-500/20 rounded-full p-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Automated Workflows</h3>
                      <p className="text-sm text-muted-foreground">
                        Trigger contract workflows based on events in other systems
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-contractBlue-500/20 rounded-full p-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-contractBlue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Centralized Contract Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Access all contract information from your preferred platforms
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Popular Integrations</CardTitle>
                  <CardDescription>Most frequently used platform connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">🔄</div>
                      <p className="text-sm">Salesforce</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">👥</div>
                      <p className="text-sm">Workday</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">💰</div>
                      <p className="text-sm">QuickBooks</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">📱</div>
                      <p className="text-sm">Slack</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm">Tableau</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-white/5">
                      <div className="text-2xl mb-2">📄</div>
                      <p className="text-sm">DocuSign</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Integrations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default WorkflowAutomation;
