import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Sparkles, CheckCircle2, Play, BookOpen, Layers } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge } from '../../components/ui';

export const ConceptGalaxyPage: React.FC = () => {
  const navigate = useNavigate();
  const { conceptNodes } = useStudentStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(conceptNodes[0]?.id || '');

  const selectedNode = conceptNodes.find((n) => n.id === selectedNodeId) || conceptNodes[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Concept Galaxy
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Visual curriculum knowledge graph showing concept prerequisite relationships and validated mastery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas (2 cols) */}
        <Card className="lg:col-span-2 p-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden bg-brand-surfaceCard border-brand-borderSubtle">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
              Curriculum Prerequisite Nodes
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Demonstrated
              </span>
              <span className="flex items-center gap-1 text-brand-cyan">
                <span className="w-2 h-2 rounded-full bg-brand-cyan" /> Developing
              </span>
              <span className="flex items-center gap-1 text-brand-dim">
                <span className="w-2 h-2 rounded-full bg-brand-dim" /> Not Started
              </span>
            </div>
          </div>

          {/* Simulated Node Grid */}
          <div className="grid grid-cols-3 gap-4 my-auto py-8 z-10">
            {conceptNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isDemo = node.mastery === 'demonstrated';
              const isDev = node.mastery === 'developing';
              const isPract = node.mastery === 'practising';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? 'bg-brand-blue/25 border-brand-cyan shadow-glow-cyan/30 scale-105'
                      : isDemo
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500'
                      : isDev
                      ? 'bg-brand-cyan/10 border-brand-cyan/20 hover:border-brand-cyan'
                      : 'bg-white/2 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-dim font-bold block">{node.subject}</span>
                    <span className="text-xs font-bold text-brand-white block line-clamp-1">
                      {node.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                    <span className="text-[11px] font-bold text-brand-cyan">{node.score}%</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDemo ? 'bg-emerald-400' : isDev ? 'bg-brand-cyan' : isPract ? 'bg-amber-400' : 'bg-brand-dim'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-brand-dim z-10 text-center">
            Click any concept node to explore prerequisites, misconceptions, and start practice.
          </div>
        </Card>

        {/* Selected Concept Deep-Dive Panel */}
        <div>
          {selectedNode && (
            <Card className="p-6 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard sticky top-24">
              <div className="space-y-1 pb-3 border-b border-white/10">
                <Badge variant="cyan" size="sm">{selectedNode.subject}</Badge>
                <h3 className="text-lg font-bold text-brand-white font-heading mt-1">
                  {selectedNode.label}
                </h3>
                <span className="text-xs text-brand-dim">{selectedNode.chapter}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Demonstrated Mastery:</span>
                  <span className="text-brand-cyan font-bold text-sm">{selectedNode.score}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Learning Status:</span>
                  <Badge
                    variant={
                      selectedNode.mastery === 'demonstrated'
                        ? 'green'
                        : selectedNode.mastery === 'developing'
                        ? 'cyan'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {selectedNode.mastery.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-xs text-brand-dim space-y-1">
                  <span className="font-bold text-brand-white block">Curriculum Connection:</span>
                  <p>Connected to {selectedNode.connections.length} other topics in Class 7 curriculum.</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-borderSubtle">
                <Button
                  variant="cyan"
                  size="sm"
                  className="w-full text-xs"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/student/ai-tutor?topic=${encodeURIComponent(selectedNode.label)}`)}
                >
                  Explain Concept with AI
                </Button>
                <Button
                  variant="surface"
                  size="sm"
                  className="w-full text-xs"
                  icon={<Play className="w-3.5 h-3.5 text-brand-cyan" />}
                  onClick={() => navigate(`/student/quizzes?topic=${encodeURIComponent(selectedNode.label)}`)}
                >
                  Start Practice Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/student/notes')}
                >
                  View Related Notes
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
