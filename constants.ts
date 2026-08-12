import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X, UserPlus, Shield, ShieldCheck, Mail, Trash2 } from 'lucide-react';
import { Project } from '../types';
import { toast } from 'sonner';

interface CollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onInvite: (email: string, role: 'editor' | 'viewer') => Promise<void>;
  onRemove: (email: string) => Promise<void>;
}

export const CollaboratorsModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onInvite, 
  onRemove 
}: CollaboratorsModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsInviting(true);
    try {
      await onInvite(email, role);
      setEmail("");
      toast.success(`Invited ${email} as ${role}`);
    } catch (err) {
      toast.error("Failed to invite collaborator");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="collaborators-title"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="collaborators-title" className="font-bold text-lg dark:text-white">Collaborators</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage who can access this project</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close Collaborators Modal"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invite New Collaborator</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      aria-label="Collaborator Role"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button 
                      type="submit"
                      disabled={isInviting || !email}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
                      aria-label="Invite collaborator"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Collaborators</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {project.collaborators && project.collaborators.length > 0 ? (
                    project.collaborators.map((collab) => (
                      <div key={collab.email} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            {collab.role === 'editor' ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium dark:text-white truncate max-w-[150px]">{collab.email}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{collab.role}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemove(collab.email)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove collaborator ${collab.email}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 space-y-2">
                      <Mail className="w-10 h-10 mx-auto opacity-20" />
                      <p className="text-sm">No collaborators yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={onClose} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Button = ({ className, children, ...props }: any) => (
  <button 
    className={cn(
      "px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
