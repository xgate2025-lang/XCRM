import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Settings, Trash2, 
  Zap, Filter, Gift, Mail, Clock, Webhook, 
  Split, AlertTriangle, Code2, PlayCircle, MoreHorizontal,
  ChevronRight, GripVertical, Check, Info, Tag, X, CheckCircle2
} from 'lucide-react';
import { NavItemId } from '../types';
import { useCampaign } from '../context/CampaignContext';
import CampaignSimulationModal from '../components/campaign/CampaignSimulationModal';

interface CampaignAdvancedProps {
  onNavigate: (id: NavItemId) => void;
}

// --- Node Types ---
type NodeType = 'trigger' | 'condition' | 'action' | 'delay' | 'split' | 'communication';

interface FlowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string; // Tailwind color class prefix (e.g. 'blue')
  data: any;
  children?: FlowNode[]; // True/Yes path
  elseChildren?: FlowNode[]; // False/No path (only for conditions/splits)
}

// --- Mock Initial Workflow ---
const INITIAL_WORKFLOW: FlowNode[] = [
  {
    id: 'trigger_1',
    type: 'trigger',
    title: 'Order Completed',
    subtitle: 'When any purchase is finalized',
    icon: Zap,
    color: 'slate',
    data: {}
  },
  {
    id: 'condition_1',
    type: 'condition',
    title: 'High Value Cart',
    subtitle: 'Total Spend > $500',
    icon: Filter,
    color: 'blue',
    data: { operator: 'greater_than', value: 500 },
    children: [
        {
            id: 'action_1',
            type: 'action',
            title: 'Add VIP Tag',
            subtitle: 'Tag: "Potential VIP"',
            icon: Tag,
            color: 'green',
            data: {}
        },
        {
            id: 'comm_1',
            type: 'communication',
            title: 'Send SMS',
            subtitle: 'Thank you for your large order!',
            icon: Mail,
            color: 'purple',
            data: {}
        }
    ]
  }
];

// --- Draggable Items Definition ---
const TOOLBOX_ITEMS = [
  { type: 'condition', label: 'Check Condition', icon: Filter, color: 'blue' },
  { type: 'action', label: 'Update Member', icon: Settings, color: 'green' },
  { type: 'action', label: 'Issue Points', icon: Gift, color: 'green' },
  { type: 'communication', label: 'Send Email/SMS', icon: Mail, color: 'purple' },
  { type: 'delay', label: 'Wait / Delay', icon: Clock, color: 'orange' },
  { type: 'action', label: 'Webhook', icon: Webhook, color: 'slate' },
];

const CampaignAdvanced: React.FC<CampaignAdvancedProps> = ({ onNavigate }) => {
  const { draftCampaign, clearDraft } = useCampaign();
  const [workflow, setWorkflow] = useState<FlowNode[]>(INITIAL_WORKFLOW);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isToolboxOpen, setIsToolboxOpen] = useState(true);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // --- Handlers ---
  const handleNodeClick = (node: FlowNode) => {
    setSelectedNodeId(node.id);
  };

  const handleDeleteNode = (nodeId: string) => {
    // Recursive delete function would be needed for a real tree
    // For now, simpler implementation:
    const deleteFromList = (list: FlowNode[]): FlowNode[] => {
        return list.filter(n => n.id !== nodeId).map(n => ({
            ...n,
            children: n.children ? deleteFromList(n.children) : undefined,
            elseChildren: n.elseChildren ? deleteFromList(n.elseChildren) : undefined
        }));
    };
    setWorkflow(deleteFromList(workflow));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleAddNode = (parentId: string | null, type: string) => {
      // Mock addition logic
      console.log(`Adding ${type} to ${parentId || 'root'}`);
  };

  const handlePublishClick = () => {
    setShowSimulation(true);
  };

  const handleConfirmPublish = () => {
    setShowSimulation(false);
    setShowToast("Workflow Published Successfully!");
    setTimeout(() => {
        clearDraft();
        onNavigate('campaign');
    }, 1500);
  };

  // --- Recursive Node Renderer ---
  const renderNode = (node: FlowNode, index: number, list: FlowNode[], depth = 0) => {
    const isSelected = selectedNodeId === node.id;
    const isTrigger = node.type === 'trigger';
    const isCondition = node.type === 'condition' || node.type === 'split';
    
    // Style Mapping
    const colorStyles = {
        slate: 'bg-slate-100 text-slate-600 border-slate-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        red: 'bg-red-50 text-red-600 border-red-200',
    }[node.color] || 'bg-white text-slate-900 border-slate-200';

    const Icon = node.icon;

    return (
      <div key={node.id} className="flex flex-col items-center">
        
        {/* Connection Line Input */}
        {index > 0 && <div className="h-6 w-0.5 bg-slate-300"></div>}
        
        {/* The Node Card */}
        <div 
            onClick={() => handleNodeClick(node)}
            className={`
                relative w-80 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                ${isSelected ? 'border-slate-900 ring-4 ring-slate-100 shadow-lg z-10' : 'border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5'}
                ${!isSelected && 'border-slate-200 bg-white'}
                ${isSelected && 'bg-white'}
            `}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorStyles}`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{node.type}</span>
                        {isSelected && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    <h4 className="font-bold text-slate-900 truncate text-sm">{node.title}</h4>
                </div>
            </div>
            
            {/* Body */}
            {node.subtitle && (
                <p className="text-xs text-slate-500 pl-[2.75rem]">{node.subtitle}</p>
            )}

            {/* Condition Branches Visualization */}
            {isCondition && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 shadow-sm">True</div>
                    {/* Only show False if we were rendering the Else path, simplifed for now */}
                </div>
            )}
        </div>

        {/* Children (Nested Flow) */}
        {node.children && node.children.length > 0 && (
            <div className="flex flex-col items-center relative mt-3">
                {/* Branch Line */}
                <div className="h-4 w-0.5 bg-slate-300"></div>
                
                {/* Render Children Recursively */}
                <div className="flex flex-col items-center">
                    {node.children.map((child, i) => renderNode(child, i, node.children!))}
                </div>
            </div>
        )}

        {/* Add Button Slot (After this node, if leaf or linear) */}
        {!isCondition && (
            <div className="h-8 flex items-center justify-center relative group/add">
                <div className="h-full w-0.5 bg-slate-300 group-hover/add:bg-slate-400 transition-colors"></div>
                <button 
                    className="absolute bg-white border border-slate-300 text-slate-400 rounded-full p-1 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all z-10"
                    onClick={() => handleAddNode(node.id, 'action')}
                >
                    <Plus size={14} />
                </button>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] -mt-4 -mx-8 bg-slate-50 overflow-hidden relative">
        
        {/* Simulation Modal */}
        <CampaignSimulationModal 
            isOpen={showSimulation} 
            onClose={() => setShowSimulation(false)}
            onConfirm={handleConfirmPublish}
            campaignName={draftCampaign?.name || 'Advanced Workflow'}
        />

        {/* Toast Notification */}
        {showToast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-in slide-in-from-top-4 fade-in">
                <CheckCircle2 size={18} className="text-green-400" />
                <span className="text-sm font-bold">{showToast}</span>
            </div>
        )}

        {/* Header (Top Bar) */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => onNavigate('campaign-editor')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        {draftCampaign?.name || 'Untitled Campaign'} 
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full border border-yellow-200 uppercase tracking-wider">Advanced Mode</span>
                    </h1>
                    <div className="text-xs text-slate-400 font-mono">ID: CMP-ADV-001</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    Save Draft
                </button>
                <button 
                    onClick={handlePublishClick}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                    <PlayCircle size={16} /> Publish Workflow
                </button>
            </div>
        </div>

        {/* Builder Area */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* LEFT SIDEBAR: TOOLBOX */}
            <div className={`w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 absolute left-0 top-0 bottom-0 z-10 ${isToolboxOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logic Toolbox</h3>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto">
                    {TOOLBOX_ITEMS.map((item, idx) => (
                        <div 
                            key={idx}
                            draggable
                            className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-grab hover:border-slate-300 hover:shadow-sm transition-all group"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${item.color}-50 text-${item.color}-600`}>
                                <item.icon size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            <GripVertical size={14} className="ml-auto text-slate-300 group-hover:text-slate-400" />
                        </div>
                    ))}
                </div>
                <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-100">
                        <Info size={16} className="shrink-0" />
                        Drag blocks onto the plus buttons in the canvas.
                    </div>
                </div>
            </div>

            {/* Toggle Toolbox Button */}
            <button 
                onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                className={`absolute top-4 z-20 bg-white border border-slate-200 p-1.5 rounded-r-lg shadow-sm text-slate-400 hover:text-slate-600 transition-all ${isToolboxOpen ? 'left-64' : 'left-0'}`}
            >
                <ChevronRight size={16} className={`transition-transform ${isToolboxOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* CENTER: CANVAS */}
            <div className={`flex-1 bg-slate-50 overflow-auto flex justify-center p-10 transition-all duration-300 ${isToolboxOpen ? 'ml-64' : 'ml-0'} ${selectedNodeId ? 'mr-80' : 'mr-0'}`}>
                <div className="flex flex-col items-center min-w-[320px] pb-20">
                    {/* Start Node (Fixed) */}
                    <div className="mb-4 flex flex-col items-center">
                        <div className="px-4 py-1.5 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">Start</div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <div className="h-4 w-0.5 bg-slate-300"></div>
                    </div>

                    {/* Dynamic Nodes */}
                    {workflow.map((node, i) => renderNode(node, i, workflow))}

                    {/* End Node (Fixed) */}
                    <div className="mt-0 flex flex-col items-center">
                        <div className="h-8 w-0.5 bg-slate-300"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full mb-2"></div>
                        <div className="px-4 py-1.5 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">End</div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR: INSPECTOR */}
            {selectedNodeId && (
                <div className="w-80 bg-white border-l border-slate-200 absolute right-0 top-0 bottom-0 z-20 flex flex-col shadow-xl animate-in slide-in-from-right duration-200">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Configuration</h3>
                        <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {(() => {
                            const node = workflow.find(n => n.id === selectedNodeId) || workflow[0].children?.[0]; // Mock lookup logic
                            if (!node) return null;

                            return (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Step Title</label>
                                        <input 
                                            type="text" 
                                            defaultValue={node.title} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                                        />
                                    </div>

                                    {/* Dynamic Fields based on Node Type */}
                                    {node.type === 'trigger' && (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100 flex gap-2">
                                                <Info size={14} className="shrink-0" />
                                                This trigger runs automatically when the event occurs in the POS/E-com system.
                                            </div>
                                        </div>
                                    )}

                                    {node.type === 'condition' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Variable</label>
                                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-400">
                                                    <option>Total Spend</option>
                                                    <option>Item Count</option>
                                                    <option>Customer Tier</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Operator</label>
                                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700">
                                                        <option>Greater Than</option>
                                                        <option>Less Than</option>
                                                        <option>Equals</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Value</label>
                                                    <input type="number" defaultValue={500} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {node.type === 'communication' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Channel</label>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">SMS</button>
                                                    <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">Email</button>
                                                    <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">Push</button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message</label>
                                                <textarea 
                                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-700 resize-none focus:outline-none focus:border-slate-400"
                                                    defaultValue="Thank you for your purchase! Here is 500 bonus points."
                                                ></textarea>
                                                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded cursor-pointer hover:bg-slate-200">{'{{ first_name }}'}</span>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded cursor-pointer hover:bg-slate-200">{'{{ points_bal }}'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Advanced Settings */}
                                    <div className="pt-6 border-t border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Advanced Settings</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <span className="text-sm text-slate-600 font-medium">Log Execution</span>
                                                <input type="checkbox" className="toggle" defaultChecked />
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <span className="text-sm text-slate-600 font-medium">Stop on Error</span>
                                                <input type="checkbox" className="toggle" defaultChecked />
                                            </label>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                            Apply Changes
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default CampaignAdvanced;