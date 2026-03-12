import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, FileText, Upload, Shield, ChevronRight, AlertTriangle, Download } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';

// Mock certification stages
const stages = [
  {
    id: 1,
    name: "Application Submitted",
    description: "Your membership and organic certification application have been submitted to OMMRO.",
    status: "completed",
    date: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Farm Assessment",
    description: "Initial farm visit and soil testing by the PGS Inspection Team.",
    status: "completed",
    date: "Feb 10, 2025",
  },
  {
    id: 3,
    name: "Conversion Period",
    description: "12-month transition period to fully organic practices. Document all inputs and practices.",
    status: "in-progress",
    date: "Started Mar 1, 2025",
    progress: 35,
  },
  {
    id: 4,
    name: "PGS Peer Review",
    description: "Participatory Guarantee System review by fellow organic practitioners in your cluster.",
    status: "pending",
    date: null,
  },
  {
    id: 5,
    name: "Third-Party Audit",
    description: "Final inspection by an accredited organic certifier (OCCP or equivalent).",
    status: "pending",
    date: null,
  },
  {
    id: 6,
    name: "Certified Organic",
    description: "Congratulations! Your farm receives its official Philippine Organic Agriculture certification.",
    status: "pending",
    date: null,
  },
];

// Mock documents
const documents = [
  { id: 1, name: "Farm Map & Layout.pdf", category: "Farm Assessment", date: "Feb 10, 2025", size: "2.4 MB", status: "approved" },
  { id: 2, name: "Soil Test Results.pdf", category: "Farm Assessment", date: "Feb 12, 2025", size: "1.1 MB", status: "approved" },
  { id: 3, name: "Input Log - March 2025.xlsx", category: "Conversion Period", date: "Mar 31, 2025", size: "340 KB", status: "under-review" },
  { id: 4, name: "Harvest Record Q1.xlsx", category: "Conversion Period", date: "Mar 31, 2025", size: "280 KB", status: "under-review" },
  { id: 5, name: "Organic Farm Plan.docx", category: "Application", date: "Jan 10, 2025", size: "1.8 MB", status: "approved" },
];

const statusColors = {
  approved: "text-green-600 bg-green-50 border-green-200",
  "under-review": "text-amber-600 bg-amber-50 border-amber-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
};

const statusLabels = {
  approved: "Approved",
  "under-review": "Under Review",
  rejected: "Needs Revision",
};

const Certification = () => {
  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-sans font-bold text-slate-900">Certification Tracker</h1>
              <p className="text-slate-600 mt-1">Track your journey to organic certification</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="h-4 w-4 mr-1.5" />
                In Conversion
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 w-fit">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'roadmap' ? 'bg-ommro-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Certification Roadmap
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'documents' ? 'bg-ommro-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Document Vault
            </button>
          </div>

          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-0">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex group">
                  {/* Timeline Line & Icon */}
                  <div className="flex flex-col items-center mr-6">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 shrink-0 z-10 ${
                      stage.status === 'completed' ? 'bg-ommro-green-600 border-ommro-green-600 text-white' :
                      stage.status === 'in-progress' ? 'bg-white border-ommro-green-500 text-ommro-green-600 ring-4 ring-ommro-green-100' :
                      'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {stage.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                       stage.status === 'in-progress' ? <Clock className="h-5 w-5 animate-pulse" /> :
                       <Circle className="h-5 w-5" />}
                    </div>
                    {index < stages.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 ${stage.status === 'completed' ? 'bg-ommro-green-400' : 'bg-slate-200'}`} />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 pb-8 ${index === stages.length - 1 ? 'pb-0' : ''}`}>
                    <div className={`p-5 rounded-2xl border transition-shadow ${
                      stage.status === 'completed' ? 'bg-white border-slate-200' :
                      stage.status === 'in-progress' ? 'bg-white border-ommro-green-200 shadow-md ring-1 ring-ommro-green-100' :
                      'bg-slate-50 border-slate-200 opacity-70'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold font-sans text-lg ${stage.status === 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>
                          {stage.name}
                        </h3>
                        {stage.date && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap ml-4">
                            {stage.date}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {stage.description}
                      </p>

                      {/* Progress bar for in-progress stage */}
                      {stage.status === 'in-progress' && stage.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                            <span>Conversion Progress</span>
                            <span>{stage.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-ommro-green-500 to-ommro-green-400 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${stage.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-2 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                            Estimated completion: March 2026
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              {/* Upload Area */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center mb-8 hover:border-ommro-green-400 transition-colors group cursor-pointer">
                <Upload className="h-10 w-10 text-slate-400 group-hover:text-ommro-green-500 mx-auto mb-3 transition-colors" />
                <p className="font-medium text-slate-700 mb-1">Drop files here or click to upload</p>
                <p className="text-sm text-slate-500">Accepted: PDF, DOCX, XLSX, JPG, PNG (max 10MB)</p>
              </div>

              {/* Documents Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold font-sans text-slate-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-slate-500" />
                    Uploaded Documents ({documents.length})
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
                          <FileText className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.category} · {doc.size} · {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[doc.status]}`}>
                          {statusLabels[doc.status]}
                        </span>
                        <button className="p-2 text-slate-400 hover:text-ommro-green-600 transition-colors rounded-lg hover:bg-slate-100">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Certification;
