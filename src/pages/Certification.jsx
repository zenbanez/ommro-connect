import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, FileText, Upload, Shield, ChevronRight, AlertTriangle, Download } from 'lucide-react';

const stages = [
  { id: 1, title: 'Application Submitted', status: 'completed', date: 'Oct 12, 2024' },
  { id: 2, title: 'Document Verification', status: 'completed', date: 'Oct 15, 2024' },
  { id: 3, title: 'Farm Inspection', status: 'in-progress', date: 'Pending' },
  { id: 4, title: 'Initial Certification', status: 'upcoming', date: 'TBD' },
  { id: 5, title: 'Full OMMRO Accredited', status: 'upcoming', date: 'TBD' },
];

const Certification = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-sans font-bold text-slate-900">Certification Hub</h1>
          <p className="text-slate-600 mt-1">Track your progress towards becoming OMMRO Certified</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold font-sans text-slate-900 mb-8">Progress Timeline</h2>
              <div className="space-y-0 relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100" />
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="relative pl-16 pb-10 last:pb-0">
                    <div className={`absolute left-0 h-12 w-12 rounded-2xl flex items-center justify-center z-10 border-4 border-white ${
                      stage.status === 'completed' ? 'bg-ommro-green-100 text-ommro-green-600 shadow-sm shadow-ommro-green-100' :
                      stage.status === 'in-progress' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {stage.status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> :
                       stage.status === 'in-progress' ? <Clock className="h-6 w-6" /> :
                       <Circle className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold font-sans ${stage.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>
                          {stage.title}
                        </h3>
                        <span className="text-xs font-medium text-slate-400">{stage.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {stage.status === 'completed' ? 'This step has been successfully verified by our team.' :
                         stage.status === 'in-progress' ? 'We are currently reviewing your inspections reports.' :
                         'This stage will become available once previous steps are complete.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
              <Shield className="h-10 w-10 text-ommro-green-400 mb-4" />
              <h3 className="text-xl font-bold font-sans mb-2">Accreditation Level</h3>
              <p className="text-slate-400 text-sm mb-6">You are currently transitioning from Conventional to Organic Practitioner.</p>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Current Status</p>
                  <p className="font-medium text-ommro-green-400">In Conversion (Year 1)</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Next Milestone</p>
                  <p className="font-medium">Farm Inspection Complete</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-ommro-green-600" />
                Required Documents
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Farm Records 2024', status: 'verified' },
                  { name: 'Soil Test Results', status: 'verified' },
                  { name: 'Inspection Receipt', status: 'pending' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 group hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="text-sm text-slate-700 font-medium">{doc.name}</span>
                    {doc.status === 'verified' ? 
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                      <Upload className="h-4 w-4 text-slate-400 group-hover:text-ommro-green-600" />}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Upload New Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
