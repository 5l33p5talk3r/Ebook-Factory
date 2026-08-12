import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  DollarSign, 
  Zap, 
  Key, 
  ShieldAlert,
  Loader2,
  BookOpen,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { NicheReport } from '../types/factory';
import { generateDetailedNicheReport } from '../services/gemini';
import { toast } from 'sonner';

interface NicheIntelligenceProps {
  onTurnNicheIntoProject: (nicheData: { title: string; subtitle: string; niche: string; audience: string; targetPrice: number }) => void;
}

export const NicheIntelligence: React.FC<NicheIntelligenceProps> = ({ onTurnNicheIntoProject }) => {
  const [searchTopic, setSearchTopic] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<NicheReport | null>({
    topic: "AI Marketing Agencies",
    opportunityScore: 92,
    demandLevel: "High",
    demandScore: 94,
    competitionLevel: "Medium",
    profitPotential: "$2,800 - $6,500/mo",
    trendDirection: "Explosive",
    searchVolume: "64,000 searches/mo",
    keywordClusters: [
      { keyword: "how to start ai marketing agency", volume: "18,200", difficulty: "Medium", intent: "Commercial" },
      { keyword: "ai agency client acquisition blueprint", volume: "9,400", difficulty: "Low", intent: "Transactional" },
      { keyword: "ai prompt workflows for agencies", volume: "14,100", difficulty: "Low", intent: "Informational" },
      { keyword: "best ai tools for marketing retainers", volume: "22,300", difficulty: "Medium", intent: "Commercial" }
    ],
    targetAudience: {
      personaName: "Digital Marketing Entrepreneur & Freelancer",
      ageRange: "24-42",
      painPoints: [
        "High manual labor costs in traditional copywriting and ad design",
        "Client churn due to slow turnaround times",
        "Uncertainty around how to package and price AI agent services"
      ],
      buyingTriggers: [
        "Wants ready-to-use client pitch templates and agent prompts",
        "Wants to charge $2k-$5k monthly retainers",
        "Seeks a verified 30-day agency launch roadmap"
      ]
    },
    competitorNotes: {
      marketGap: "Most existing ebooks focus on basic ChatGPT prompts instead of end-to-end client onboarding and retainer pricing models.",
      weaknesses: ["Outdated 2023 prompt lists", "No contract or proposal templates", "Overly technical jargon"],
      pricePointRange: "$14.99 - $39.99"
    },
    suggestedAngles: [
      {
        title: "The AI Agency Playbook 2026",
        subtitle: "How to Build a 6-Figure Automated Agency with Agentic Workflows",
        hook: "Land 3 high-paying retainer clients in 30 days without hiring staff.",
        targetPrice: 24.99
      },
      {
        title: "Agentic Marketing Engineering",
        subtitle: "Replacing Traditional Marketing Ops with Autonomous AI Workflows",
        hook: "The technical blueprint for 10x agency leverage.",
        targetPrice: 29.99
      },
      {
        title: "Prompt to Profit: AI Services Handbook",
        subtitle: "Packaging High-Margin AI Solutions for Local Businesses",
        hook: "A beginner-friendly guide to $5k/mo recurring agency revenue.",
        targetPrice: 19.99
      }
    ],
    validationChecklist: [
      { item: "High Search Volume Demand (>20k monthly searches)", passed: true, note: "Validated via search trends" },
      { item: "Monetizable Commercial Intent", passed: true, note: "High willingness to pay among agency founders" },
      { item: "Low-to-Moderate Competition Gap", passed: true, note: "Competitors offer shallow general advice" },
      { item: "Evergreen + High-Growth Category", passed: true, note: "AI adoption expanding rapidly through 2026+" },
      { item: "High Royalty Margin Potential ($15+ per sale)", passed: true, note: "Target price allows premium positioning" }
    ]
  });

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTopic.trim()) {
      toast.error("Please enter a topic or niche to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await generateDetailedNicheReport(searchTopic.trim());
      setReport(data);
      toast.success(`Niche analysis complete for "${searchTopic}"!`);
    } catch (err: any) {
      console.error("Failed to analyze niche:", err);
      toast.error("Failed to run niche analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleNiches = [
    "Biohacking Sleep & Longevity",
    "No-Code Micro-SaaS",
    "ADHD Productivity Systems",
    "Real Estate Crowdfunding",
    "Cyberpunk Sci-Fi Fiction",
    "Keto Air Fryer Recipes"
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#232738] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#E5C158] text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#F0D078]" />
              NicheMaster Intelligence Engine
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">AI Market Niche Research & Validation</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Discover high-converting, low-competition ebook opportunities backed by real search intent and buyer personas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Grounding Engine:</span>
            <span className="px-3 py-1 rounded-full bg-[#181C2B] border border-[#30364F] text-xs font-semibold text-[#F0D078] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E5C158]" />
              Gemini 3.5 + Search
            </span>
          </div>
        </div>

        {/* Search Bar & Preset Pills */}
        <div className="bg-[#131622] border border-[#25293B] rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter any topic, keyword, or book idea (e.g., 'Solar Powered Home Automation')..."
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0B0D12] border border-[#2D3246] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E5C158]"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B58A28] text-black font-semibold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  Run Niche Intelligence
                </>
              )}
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 whitespace-nowrap">Trending Ideas:</span>
            {sampleNiches.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSearchTopic(n);
                }}
                className="px-3 py-1 rounded-lg bg-[#1B1F2E] border border-[#2D3349] text-slate-300 hover:text-[#F0D078] hover:border-[#584B28] transition-all whitespace-nowrap cursor-pointer"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Report Display */}
        {isAnalyzing && (
          <div className="p-16 text-center bg-[#131622] border border-[#25293B] rounded-2xl space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#E5C158] mx-auto" />
            <p className="text-base font-serif font-semibold text-white">Scanning Global Search Demand & Ebook Competitor Gaps...</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Evaluating buyer purchase triggers, keyword clusters, and high-converting book angles with Gemini grounding.</p>
          </div>
        )}

        {report && !isAnalyzing && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Opportunity Score Banner */}
            <div className="bg-[#141724] border border-[#2A2E42] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full"></div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#201D13] border border-[#584B28] text-[#E5C158] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-[#F0D078]" />
                  Validated Niche Report
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">{report.topic}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>Demand: <strong className="text-white">{report.demandLevel} ({report.demandScore}/100)</strong></span>
                  <span>•</span>
                  <span>Competition: <strong className="text-white">{report.competitionLevel}</strong></span>
                  <span>•</span>
                  <span>Search Volume: <strong className="text-[#F0D078]">{report.searchVolume}</strong></span>
                  <span>•</span>
                  <span>Monthly Royalty Est: <strong className="text-[#E5C158]">{report.profitPotential}</strong></span>
                </div>
              </div>

              {/* Score Gauge */}
              <div className="flex items-center gap-4 bg-[#0D0F17] p-4 rounded-xl border border-[#282D42]">
                <div className="text-center">
                  <p className="text-4xl font-serif font-extrabold text-[#F0D078]">{report.opportunityScore}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold mt-0.5">Opportunity Index</p>
                </div>
                <div className="w-px h-10 bg-[#282D42]"></div>
                <div className="text-xs">
                  <p className="text-slate-400">Trend Status</p>
                  <p className="font-bold text-[#E5C158] flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-[#E5C158]" />
                    {report.trendDirection}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid 1: Keyword Clusters & Target Persona */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Keywords */}
              <div className="bg-[#131622] border border-[#232738] rounded-2xl p-6">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-[#E5C158]" />
                  High-Intent Keyword Clusters
                </h3>
                <div className="space-y-3">
                  {report.keywordClusters.map((kw, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#1E2233] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">{kw.keyword}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Intent: {kw.intent}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-[#F0D078]">{kw.volume}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#181B28] text-slate-400 border border-slate-700">
                          Diff: {kw.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience Persona */}
              <div className="bg-[#131622] border border-[#232738] rounded-2xl p-6">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#E5C158]" />
                  Target Buyer Persona
                </h3>
                <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1E2233] space-y-4 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Persona Identifier</span>
                    <p className="font-bold text-white text-sm mt-0.5">{report.targetAudience.personaName} ({report.targetAudience.ageRange})</p>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Primary Pain Points</span>
                    <ul className="mt-1.5 space-y-1 text-slate-300">
                      {report.targetAudience.painPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]"></span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Buying Triggers</span>
                    <ul className="mt-1.5 space-y-1 text-slate-300">
                      {report.targetAudience.buyingTriggers.map((tr, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C158]" />
                          {tr}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Suggested Ebook Angles & One-Click Creation */}
            <div className="bg-[#131622] border border-[#232738] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#E5C158]" />
                    High-Converting Ebook Angles
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Select any angle below to immediately convert this niche report into an active Ebook project!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.suggestedAngles.map((angle, idx) => (
                  <div key={idx} className="bg-[#0B0D12] border border-[#232738] hover:border-[#584B28] rounded-xl p-5 flex flex-col justify-between transition-all group">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">Concept #{idx + 1}</span>
                        <span className="font-serif font-bold text-white text-sm">${angle.targetPrice.toFixed(2)}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-white group-hover:text-[#F0D078] transition-colors">{angle.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{angle.subtitle}</p>
                      <p className="text-xs text-slate-300 italic mt-3 p-2.5 rounded bg-[#131622] border border-[#1E2233]">
                        "{angle.hook}"
                      </p>
                    </div>

                    <button
                      onClick={() => onTurnNicheIntoProject({
                        title: angle.title,
                        subtitle: angle.subtitle,
                        niche: report.topic,
                        audience: report.targetAudience.personaName,
                        targetPrice: angle.targetPrice
                      })}
                      className="mt-6 w-full py-2.5 rounded-lg bg-[#201D13] border border-[#584B28] text-[#E5C158] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Turn into Ebook Project
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Checklist & Competitor Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#131622] border border-[#232738] rounded-2xl p-6">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-[#E5C158]" />
                  Competitor Market Gaps
                </h3>
                <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1E2233] space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Market Gap Opportunity</span>
                    <p className="text-slate-200 mt-1">{report.competitorNotes.marketGap}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Competitor Weaknesses</span>
                    <ul className="mt-1 space-y-1 text-slate-300">
                      {report.competitorNotes.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-red-400">✕</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Suggested Retail Price Range</span>
                    <p className="text-[#F0D078] font-bold mt-0.5">{report.competitorNotes.pricePointRange}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#131622] border border-[#232738] rounded-2xl p-6">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#E5C158]" />
                  5-Point Validation Checklist
                </h3>
                <div className="space-y-2.5 text-xs">
                  {report.validationChecklist.map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0B0D12] border border-[#1E2233] flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">{v.item}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{v.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
