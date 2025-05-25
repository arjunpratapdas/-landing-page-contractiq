
import { motion } from 'framer-motion';
import { useState } from 'react';
import UserLayout from '@/components/UserLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheck, 
  Search, 
  FileSearch, 
  AlertTriangle, 
  Bell, 
  ChevronRight, 
  Check,
  FileWarning,
  FileCheck
} from 'lucide-react';

const ComplianceAudit = () => {
  // Mock compliance data
  const [complianceStats, setComplianceStats] = useState({
    overallScore: 87,
    gdprCompliance: 92,
    amlKycCompliance: 85,
    esgCompliance: 78,
    lastAudit: '2023-10-28',
    alertsCount: 3
  });
  
  // Mock compliance issues
  const [complianceIssues, setComplianceIssues] = useState([
    {
      id: 'COMP-001',
      title: 'Missing GDPR Data Processing Terms',
      severity: 'High',
      contracts: ['CON-2023-003', 'CON-2023-005'],
      regulation: 'GDPR Article 28',
      status: 'Open'
    },
    {
      id: 'COMP-002',
      title: 'Outdated AML Verification Process',
      severity: 'Medium',
      contracts: ['CON-2023-004'],
      regulation: 'AML Directive 2018/843',
      status: 'In Progress'
    },
    {
      id: 'COMP-003',
      title: 'Insufficient ESG Reporting Requirements',
      severity: 'Low',
      contracts: ['CON-2023-002'],
      regulation: 'EU Sustainability Reporting Standards',
      status: 'Open'
    }
  ]);
  
  // Mock regulatory updates
  const [regulatoryUpdates, setRegulatoryUpdates] = useState([
    {
      id: 'REG-001',
      title: 'GDPR Enforcement Update 2023',
      date: '2023-11-01',
      authority: 'European Data Protection Board',
      impact: 'Medium',
      read: false
    },
    {
      id: 'REG-002',
      title: 'New ESG Disclosure Requirements',
      date: '2023-10-15',
      authority: 'Financial Conduct Authority',
      impact: 'High',
      read: true
    },
    {
      id: 'REG-003',
      title: 'Updates to AML Verification Standards',
      date: '2023-09-22',
      authority: 'Financial Action Task Force',
      impact: 'Medium',
      read: false
    }
  ]);

  return (
    <UserLayout currentTab="compliance-audit">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 gradient-text">Intelligent Compliance & Auditing</h2>
          <p className="text-muted-foreground">Real-time regulatory updates, automated risk analysis, and always-on audit mode</p>
        </div>
        
        {/* Compliance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-muted stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                    <circle
                      className="text-contractBlue-400 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - complianceStats.overallScore / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
                    {complianceStats.overallScore}%
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Last audited: {new Date(complianceStats.lastAudit).toLocaleDateString()}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <FileSearch className="h-4 w-4 mr-2" />
                Run Full Audit
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Compliance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>GDPR Compliance</span>
                  <span>{complianceStats.gdprCompliance}%</span>
                </div>
                <Progress value={complianceStats.gdprCompliance} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AML/KYC Compliance</span>
                  <span>{complianceStats.amlKycCompliance}%</span>
                </div>
                <Progress value={complianceStats.amlKycCompliance} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ESG Compliance</span>
                  <span>{complianceStats.esgCompliance}%</span>
                </div>
                <Progress value={complianceStats.esgCompliance} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="relative mb-3">
                  <Bell className="h-12 w-12 text-contractBlue-400" />
                  {complianceStats.alertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {complianceStats.alertsCount}
                    </span>
                  )}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {complianceStats.alertsCount === 0 
                    ? "No active compliance alerts"
                    : `You have ${complianceStats.alertsCount} active compliance ${complianceStats.alertsCount === 1 ? 'alert' : 'alerts'}`
                  }
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Alerts
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="mb-6 bg-muted/30 border border-white/10 p-1">
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              <span>Compliance Issues</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Regulatory Updates</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Audit Mode</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <Card className="bg-card border border-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Active Compliance Issues</CardTitle>
                  <CardDescription>Issues that require attention</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search issues..." className="pl-10 w-[250px]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Regulation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complianceIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">{issue.id}</TableCell>
                          <TableCell>{issue.title}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.severity === 'High' ? 'bg-red-100/10 text-red-500' :
                              issue.severity === 'Medium' ? 'bg-yellow-100/10 text-yellow-500' :
                              'bg-green-100/10 text-green-500'
                            }`}>
                              {issue.severity}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{issue.regulation}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.status === 'Open' ? 'bg-blue-100/10 text-blue-500' :
                              issue.status === 'In Progress' ? 'bg-yellow-100/10 text-yellow-500' :
                              'bg-green-100/10 text-green-500'
                            }`}>
                              {issue.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="h-8 p-0 w-8">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="updates">
            <Card className="bg-card border border-white/5">
              <CardHeader>
                <CardTitle>Regulatory Updates</CardTitle>
                <CardDescription>Latest changes in compliance regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {regulatoryUpdates.map((update) => (
                  <div 
                    key={update.id} 
                    className={`p-4 rounded-lg border ${update.read 
                      ? 'bg-muted/30 border-white/10' 
                      : 'bg-blue-900/10 border-blue-500/30'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1 flex items-center">
                          {!update.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                          )}
                          {update.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {update.authority} • {new Date(update.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        update.impact === 'High' ? 'bg-red-100/10 text-red-500' :
                        update.impact === 'Medium' ? 'bg-yellow-100/10 text-yellow-500' :
                        'bg-green-100/10 text-green-500'
                      }`}>
                        {update.impact} Impact
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card className="bg-card border border-white/5">
              <CardHeader>
                <CardTitle>Always-On Audit Mode</CardTitle>
                <CardDescription>Real-time monitoring of your compliance status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 border border-white/10 rounded-lg p-6 text-center">
                  <ShieldCheck className="h-12 w-12 text-contractBlue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Continuous Compliance Monitoring</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI continuously scans your contracts and business operations for compliance issues
                    and regulatory changes that may affect your organization.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <p className="text-sm">Real-Time Scanning</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <p className="text-sm">Regulatory Updates</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <p className="text-sm">Automated Reporting</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-blue">Enable Advanced Audit Mode</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 border border-white/10 rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <FileSearch className="h-5 w-5 text-contractBlue-400" />
                      Schedule Compliance Review
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up regular compliance reviews with our legal experts
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Schedule Review
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 border border-white/10 rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Bell className="h-5 w-5 text-contractBlue-400" />
                      Compliance Alert Settings
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize how and when you receive compliance alerts
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Alerts
                    </Button>
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

export default ComplianceAudit;
