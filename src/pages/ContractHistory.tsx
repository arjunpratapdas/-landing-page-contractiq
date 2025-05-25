
import { useState } from 'react';
import UserLayout from '@/components/UserLayout';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const ContractHistory = () => {
  // Mock contract data - in a real app, fetch this from your backend
  const [contracts, setContracts] = useState([
    {
      id: 'CON-2023-001',
      name: 'Service Agreement - TechCorp',
      type: 'Service Agreement',
      status: 'Active',
      date: '2023-10-15',
      riskScore: 'Low',
    },
    {
      id: 'CON-2023-002',
      name: 'NDA - Innovative Solutions',
      type: 'Non-Disclosure',
      status: 'Active',
      date: '2023-09-22',
      riskScore: 'Low',
    },
    {
      id: 'CON-2023-003',
      name: 'Employment Contract - Jane Smith',
      type: 'Employment',
      status: 'Active',
      date: '2023-08-05',
      riskScore: 'Medium',
    },
    {
      id: 'CON-2023-004',
      name: 'SaaS License - CloudTools Inc.',
      type: 'License Agreement',
      status: 'Expired',
      date: '2023-05-30',
      riskScore: 'Medium',
    },
    {
      id: 'CON-2023-005',
      name: 'Partnership Agreement - Global Partners',
      type: 'Partnership',
      status: 'Draft',
      date: '2023-11-02',
      riskScore: 'High',
    },
    {
      id: 'CON-2023-006',
      name: 'Legal Agreement - City Properties',
      type: 'Legal Agreement',
      status: 'Active',
      date: '2023-11-10',
      riskScore: 'Medium',
    },
    {
      id: 'CON-2023-007',
      name: 'Sale Deed - Residential Property',
      type: 'Sale Deed',
      status: 'Active',
      date: '2023-11-15',
      riskScore: 'Low',
    },
  ]);

  // For search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contracts based on search query
  const filteredContracts = contracts.filter(contract => 
    contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout currentTab="contract-history">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-gradient-blue">
            <FileText className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
        
        <div className="rounded-md border border-white/10 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Contract Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>{contract.name}</TableCell>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'Active' ? 'bg-green-100/10 text-green-500' :
                        contract.status === 'Expired' ? 'bg-gray-100/10 text-gray-400' :
                        'bg-blue-100/10 text-blue-400'
                      }`}>
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(contract.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.riskScore === 'Low' ? 'bg-green-100/10 text-green-500' :
                        contract.riskScore === 'Medium' ? 'bg-yellow-100/10 text-yellow-500' :
                        'bg-red-100/10 text-red-500'
                      }`}>
                        {contract.riskScore === 'Low' && <CheckCircle className="h-3 w-3" />}
                        {contract.riskScore === 'Medium' && <AlertTriangle className="h-3 w-3" />}
                        {contract.riskScore === 'High' && <AlertTriangle className="h-3 w-3" />}
                        {contract.riskScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No contracts found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </UserLayout>
  );
};

export default ContractHistory;
