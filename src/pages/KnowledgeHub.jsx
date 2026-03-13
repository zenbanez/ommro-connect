import { useState } from 'react';
import { Search, BookOpen, FileText, Video, PlayCircle, Download, ExternalLink, Filter, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Resources', icon: BookOpen },
  { id: 'farming', name: 'Organic Farming', icon: FileText },
  { id: 'certification', name: 'Certification', icon: FileText },
  { id: 'livestock', name: 'Livestock', icon: FileText },
  { id: 'tutorials', name: 'Video Tutorials', icon: Video },
];

const resources = [
  {
    id: 1,
    title: 'Philippine National Standards for Organic Agriculture',
    category: 'certification',
    type: 'PDF Guide',
    description: 'The official guidelines and standards for organic crop and livestock production in the Philippines.',
    author: 'Bureau of Agriculture and Fisheries Standards',
    tags: ['Standard', 'Legal', 'Certification'],
    icon: FileText,
  },
  {
    id: 2,
    title: 'Introduction to Natural Farming Systems',
    category: 'farming',
    type: 'Technical Paper',
    description: 'Learn about indigenous microorganisms (IMO) and natural liquid fertilizers for sustainable crop growth.',
    author: 'OMMRO Education Committee',
    tags: ['Natural Farming', 'Fertilizer', 'Soil'],
    icon: FileText,
  },
  {
    id: 3,
    title: 'Composting Masterclass: Vermiculture',
    category: 'tutorials',
    type: 'Video Tutorial',
    description: 'Step-by-step guide on setting up a vermicomposting bin for high-quality organic fertilizer.',
    author: 'Ka Benjie, Master Farmer',
    tags: ['Composting', 'Vermiculture', 'Video'],
    icon: PlayCircle,
  },
  {
    id: 4,
    title: 'Organic Feed Formulation for Native Chickens',
    category: 'livestock',
    type: 'Technical Guide',
    description: 'Nutritional requirements and local ingredients for preparing chemical-free feeds for free-range poultry.',
    author: 'DA Region 8',
    tags: ['Poultry', 'Livestock', 'Feed'],
    icon: FileText,
  },
  {
    id: 5,
    title: 'Market Trends: Organic Pineapples in Visayas',
    category: 'all',
    type: 'Market Report',
    description: 'Quarterly analysis of demand and pricing for organic pineapples across major ports in Region 8.',
    author: 'OMMRO Economic Committee',
    tags: ['Market', 'Pineapple', 'Trends'],
    icon: FileText,
  },
  {
    id: 6,
    title: 'Soil Sampling and Analysis Tutorial',
    category: 'tutorials',
    type: 'Video Tutorial',
    description: 'How to properly collect soil samples for precise nutrient level analysis.',
    author: 'Region 8 Soils Laboratory',
    tags: ['Soil', 'Testing', 'Video'],
    icon: PlayCircle,
  },
];

const KnowledgeHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || res.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-sans font-bold text-slate-900">Knowledge Hub</h1>
          <p className="text-slate-600 mt-1">Access technical guides, standards, and tutorials for sustainable organic practices.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources, standards, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ommro-green-500 shadow-sm transition-all"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <cat.icon className="h-5 w-5" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map(res => (
            <div key={res.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all group flex flex-col">
              <div className="p-8 pb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  res.category === 'tutorials' ? 'bg-red-50 text-red-600' : 'bg-ommro-green-50 text-ommro-green-600'
                }`}>
                  <res.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-sans group-hover:text-ommro-green-700 transition-colors leading-tight">
                  {res.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {res.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {res.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto p-8 pt-4 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">{res.author}</span>
                  <span className="font-medium text-slate-400">{res.type}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all font-bold text-sm text-slate-700">
                  {res.category === 'tutorials' ? (
                    <>
                      <PlayCircle className="h-4 w-4" /> Watch Now
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-400 font-sans">No resources found</h3>
            <p className="text-slate-400 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-20 bg-gradient-to-br from-ommro-green-900 to-slate-900 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-ommro-green-400 uppercase tracking-widest mb-6">
              Featured Course
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-sans mb-6 leading-tight">
              Organic Transition for Conventional Farms
            </h2>
            <p className="text-ommro-green-100 text-lg mb-10 leading-relaxed opacity-80">
              A comprehensive 4-week program designed for Region 8 farmers transitioning to certified organic production.
            </p>
            <button className="bg-ommro-green-500 hover:bg-ommro-green-400 text-white px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-black/20 group">
              Start Learning <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-ommro-green-600/10 to-transparent hidden lg:block" />
          <div className="absolute -right-20 -bottom-20 h-96 w-96 bg-ommro-green-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
