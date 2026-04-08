/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, History, ArrowRight, Trash2, Quote, Loader2, Plus, ExternalLink, X } from 'lucide-react';
import { generateBiblicalTruth, BiblicalTruth, Verse } from './services/gemini';

interface ArrowLog {
  id: string;
  lie: string;
  truth: string;
  verses: Verse[];
  timestamp: number;
}

function ScripturePopout({ verse, onClose }: { verse: Verse; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute z-50 bottom-full mb-4 left-0 w-[320px] bg-[#151515] backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-muted/30"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold-muted font-bold">
            {verse.reference}
          </span>
          <span className="text-[10px] text-paper/40 font-medium">•</span>
          <span className="text-[10px] uppercase tracking-widest text-paper/40 font-medium">
            {verse.translation}
          </span>
        </div>
        <button onClick={onClose} className="text-paper/20 hover:text-paper transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="serif text-lg text-paper italic leading-relaxed mb-6">
        "{verse.text}"
      </p>
      
      <div className="pt-4 border-t border-white/5">
        <a 
          href={verse.bibleUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold-muted hover:text-gold-muted/80 transition-colors font-bold"
        >
          Read Full Chapter <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [lie, setLie] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTruth, setCurrentTruth] = useState<BiblicalTruth | null>(null);
  const [logs, setLogs] = useState<ArrowLog[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activePopout, setActivePopout] = useState<string | null>(null);

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('formation_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old logs if necessary
        const migrated = parsed.map((log: any) => ({
          ...log,
          verses: log.verses || (log.references ? log.references.map((ref: string) => ({ reference: ref, text: '', translation: 'ESV', bibleUrl: '#' })) : [])
        }));
        setLogs(migrated);
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    }
  }, []);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem('formation_logs', JSON.stringify(logs));
  }, [logs]);

  const handleGenerate = async () => {
    if (!lie.trim()) return;
    setIsGenerating(true);
    setCurrentTruth(null);
    setActivePopout(null);
    
    try {
      const result = await generateBiblicalTruth(lie);
      setCurrentTruth(result);
    } catch (error) {
      console.error("Error generating truth:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLog = () => {
    if (!currentTruth || !lie) return;
    
    const newLog: ArrowLog = {
      id: crypto.randomUUID(),
      lie,
      truth: currentTruth.truth,
      verses: currentTruth.verses,
      timestamp: Date.now(),
    };
    
    setLogs([newLog, ...logs]);
    setLie('');
    setCurrentTruth(null);
    setActivePopout(null);
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="min-h-screen atmosphere flex flex-col items-center px-4 py-12 md:py-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold-muted font-medium mb-4 block">
          Formation Tool
        </span>
        <h1 className="serif text-4xl md:text-6xl font-light tracking-tight text-paper italic">
          Catch the lie. Answer with truth.
        </h1>
      </motion.div>

      <main className="w-full max-w-5xl flex flex-col gap-12">
        {/* Active Reflection Area */}
        <section className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Left Side: The Lie */}
            <div className="p-8 md:p-12 flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                <label className="text-[10px] uppercase tracking-[0.3em] text-gold-muted/50 font-bold">
                  The Lie I'm Believing
                </label>
              </div>
              
              <textarea
                value={lie}
                onChange={(e) => setLie(e.target.value)}
                placeholder="I am not enough..."
                className="w-full bg-transparent serif text-2xl md:text-4xl text-paper/80 placeholder:text-paper/10 resize-none border-none focus:ring-0 min-h-[200px] leading-tight italic"
              />
              
              <div className="mt-auto pt-8 flex justify-between items-center">
                <p className="text-[10px] text-paper/20 uppercase tracking-widest">
                  {lie.length > 0 ? `${lie.length} characters` : 'Begin typing...'}
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !lie.trim()}
                  className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gold-muted/10 hover:bg-gold-muted/20 border border-gold-muted/30 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gold-muted" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-gold-muted group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="text-[11px] uppercase tracking-[0.2em] font-black text-gold-muted">
                    {isGenerating ? 'Reflecting' : 'Seek Truth'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side: The Truth */}
            <div className="p-8 md:p-12 flex flex-col gap-6 relative min-h-[300px]">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
                <label className="text-[10px] uppercase tracking-[0.3em] text-gold-muted/50 font-bold">
                  What God Has Said
                </label>
              </div>

              <AnimatePresence mode="wait">
                {!currentTruth && !isGenerating ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center px-8"
                  >
                    <Quote className="w-12 h-12 text-white/[0.03] mb-4" />
                    <p className="serif text-xl text-paper/10 italic">
                      The truth will be revealed here...
                    </p>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-gold-muted/20 animate-spin" />
                      <Sparkles className="w-6 h-6 text-gold-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold-muted/40 animate-pulse">
                      Consulting Scripture
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="truth"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <p className="serif text-2xl md:text-4xl text-paper leading-tight italic mb-6">
                      {currentTruth?.truth}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-auto relative">
                      {currentTruth?.verses.map((v, i) => (
                        <div key={i} className="relative">
                          <button 
                            onClick={() => setActivePopout(activePopout === `current-${i}` ? null : `current-${i}`)}
                            className="px-4 py-2 rounded-full bg-gold-muted/5 text-[10px] uppercase tracking-widest text-gold-muted/80 border border-gold-muted/20 hover:bg-gold-muted/10 transition-all font-bold flex items-center gap-2"
                          >
                            {v.reference}
                            <ExternalLink className="w-3 h-3 opacity-40" />
                          </button>
                          <AnimatePresence>
                            {activePopout === `current-${i}` && (
                              <ScripturePopout verse={v} onClose={() => setActivePopout(null)} />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/5">
                      <button
                        onClick={() => setCurrentTruth(null)}
                        className="text-[10px] uppercase tracking-widest text-paper/30 hover:text-paper transition-colors"
                      >
                        Discard
                      </button>
                      <button
                        onClick={saveLog}
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-gold-muted text-bg-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[11px] uppercase tracking-widest font-black">
                          Add to Log
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* History Toggle */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold-muted/60 hover:text-gold-muted transition-colors"
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Hide Arrow Log' : 'View Arrow Log'}
          </button>
        </div>

        {/* History List */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4">
                {logs.length === 0 ? (
                  <p className="text-center text-paper/30 serif italic py-12">
                    Your log is empty. Start by capturing a lie.
                  </p>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      key={log.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass rounded-2xl p-8 group relative"
                    >
                      <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.2em] text-paper/30 font-bold mb-2 block">The Lie</label>
                          <p className="serif text-xl text-paper/60 italic leading-relaxed">{log.lie}</p>
                        </div>
                        <div className="flex items-start gap-6">
                          <ArrowRight className="w-5 h-5 text-gold-muted/30 shrink-0 mt-6 hidden md:block" />
                          <div className="flex-1">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-gold-muted/40 font-bold mb-2 block">The Truth</label>
                            <p className="serif text-xl text-paper italic leading-relaxed mb-4">{log.truth}</p>
                            <div className="flex flex-wrap gap-2 relative">
                              {log.verses.map((v, i) => (
                                <div key={i} className="relative">
                                  <button 
                                    onClick={() => setActivePopout(activePopout === `${log.id}-${i}` ? null : `${log.id}-${i}`)}
                                    className="text-[9px] uppercase tracking-widest text-gold-muted/60 hover:text-gold-muted transition-colors font-bold border-b border-gold-muted/20 pb-0.5"
                                  >
                                    {v.reference}
                                  </button>
                                  <AnimatePresence>
                                    {activePopout === `${log.id}-${i}` && (
                                      <ScripturePopout verse={v} onClose={() => setActivePopout(null)} />
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2 text-paper/20 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-paper/20">
          Part of the Community Rhythm
        </p>
      </footer>
    </div>
  );
}
