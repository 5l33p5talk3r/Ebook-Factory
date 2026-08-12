import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  BookOpen, 
  Sparkles, 
  Sun, 
  Heart, 
  Utensils, 
  TrendingUp, 
  Map, 
  User as UserIcon, 
  GraduationCap 
} from 'lucide-react';

export const IconMap: Record<string, any> = {
  BookOpen,
  Sparkles,
  Sun,
  Heart,
  Utensils,
  TrendingUp,
  Map,
  User: UserIcon, 
  GraduationCap
};

export const GlobalLoadingBar = ({ isVisible, progress, status }: { isVisible: boolean, progress?: number, status?: string }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-0 left-0 right-0 z-[200] pointer-events-none"
        >
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              initial={{ width: "30%", left: "-30%" }}
              animate={progress !== undefined ? { width: `${progress}%`, left: 0 } : { left: ["-30%", "100%"] }}
              transition={progress !== undefined ? { duration: 0.5 } : { repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          {status && (
            <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 inline-flex items-center gap-2 rounded-br-xl shadow-lg border-r border-b border-indigo-400/30">
              <Sparkles className="w-3 h-3 animate-pulse" />
              {status}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export const Button = ({ className, children, ...props }: any) => (
  <button 
    className={cn(
      "px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
