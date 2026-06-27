import { useState, useCallback, useMemo } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';

function SkillNode({ data }: { data: any }) {
  const xpPercent = (data.xp / data.xpToNext) * 100;
  return (
    <div
      className="px-4 py-3 rounded-xl border-2 min-w-[140px] text-center"
      style={{
        background: `linear-gradient(135deg, ${data.color}15, ${data.color}08)`,
        borderColor: `${data.color}40`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyber-border !border-cyber-border" />
      <div className="text-2xl mb-1">{data.icon}</div>
      <p className="text-sm font-semibold">{data.name}</p>
      <p className="text-xs text-cyber-muted">Lv. {data.level}/{data.maxLevel}</p>
      <div className="w-full bg-cyber-border rounded-full h-1.5 mt-2">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${xpPercent}%`, backgroundColor: data.color }}
        />
      </div>
      <p className="text-xs text-cyber-muted mt-1">{data.xp}/{data.xpToNext} XP</p>
      <Handle type="source" position={Position.Bottom} className="!bg-cyber-border !border-cyber-border" />
    </div>
  );
}

const nodeTypes = { skillNode: SkillNode };

export default function SkillTreePage() {
  const { skills, addSkill } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🎯', color: '#8b5cf6', description: '' });

  const nodes: Node[] = useMemo(() => {
    const cols: Record<number, string[]> = {};
    const roots = skills.filter((s) => s.connections.length === 0 || !skills.some((sk) => sk.connections.includes(s.id)));
    const positioned: Set<string> = new Set();

    function positionNode(id: string, col: number) {
      if (positioned.has(id)) return;
      positioned.add(id);
      if (!cols[col]) cols[col] = [];
      cols[col].push(id);
      const sk = skills.find((s) => s.id === id);
      if (sk) {
        sk.connections.forEach((cId) => positionNode(cId, col + 1));
      }
    }

    roots.forEach((r, i) => positionNode(r.id, 0));
    skills.filter((s) => !positioned.has(s.id)).forEach((s, i) => positionNode(s.id, 0));

    return skills.map((s) => {
      const col = Object.entries(cols).find(([, ids]) => ids.includes(s.id));
      const colIdx = col ? Number(col[0]) : 0;
      const rowIdx = col ? col[1].indexOf(s.id) : 0;
      const totalInCol = col ? col[1].length : 1;
      return {
        id: s.id,
        type: 'skillNode',
        position: {
          x: colIdx * 220 + 50,
          y: rowIdx * 140 + (totalInCol > 1 ? 30 : 60),
        },
        data: { ...s },
      };
    });
  }, [skills]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    skills.forEach((s) => {
      s.connections.forEach((cId) => {
        result.push({
          id: `${s.id}-${cId}`,
          source: s.id,
          target: cId,
          animated: true,
          style: { stroke: s.color || '#8b5cf6', strokeWidth: 2 },
        });
      });
    });
    return result;
  }, [skills]);

  const createSkill = () => {
    if (!form.name.trim()) return;
    addSkill({
      id: uuid(),
      name: form.name,
      description: form.description,
      icon: form.icon,
      level: 1,
      xp: 0,
      xpToNext: 200,
      maxLevel: 10,
      connections: [],
      prerequisites: [],
      color: form.color,
    });
    setForm({ name: '', icon: '🎯', color: '#8b5cf6', description: '' });
    setShowForm(false);
  };

  const icons = ['🎯', '⚛️', '📘', '🎨', '💪', '🧠', '🌐', '🔧', '📸', '🎵', '✍️', '💡'];

  return (
    <div className="page-container flex flex-col">
      <div className="mb-4 shrink-0">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Skill Tree</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>
        <p className="text-cyber-muted text-sm mt-1">Visualize and track your skill progression</p>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass rounded-xl p-4 border border-cyber-accent/30 mb-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">New Skill</h3>
            <button onClick={() => setShowForm(false)} className="text-cyber-muted hover:text-cyber-text"><X size={16} /></button>
          </div>
          <div className="flex gap-3 items-end">
            <div>
              <label className="text-xs text-cyber-muted block mb-1">Icon</label>
              <div className="flex gap-1">
                {icons.map((ic) => (
                  <button key={ic} onClick={() => setForm({ ...form, icon: ic })} className={`w-8 h-8 rounded flex items-center justify-center border text-lg ${form.icon === ic ? 'border-cyber-accent bg-cyber-accent/20' : 'border-cyber-border'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-cyber-muted block mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Skill name" className="w-full px-3 py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-cyber-muted block mb-1">Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
            </div>
            <button onClick={createSkill} className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white text-sm hover:bg-cyber-accent/80">Add</button>
          </div>
        </motion.div>
      )}

      <div className="flex-1 rounded-xl overflow-hidden border border-cyber-border" style={{ minHeight: 400 }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
          <Background color="#1e293b" />
          <Controls />
          <MiniMap
            nodeColor="#8b5cf6"
            maskColor="rgba(0,0,0,0.7)"
            style={{ background: '#111827' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
