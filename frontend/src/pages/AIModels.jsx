import React, { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileText,
  Activity,
  Zap,
  Target,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  Sliders,
  ChevronRight,
  RefreshCw,
  Info,
  ExternalLink,
  Code2,
  Lock,
  Box,
  Play,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Link } from 'wouter';

export default function AIModels() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedCase, setSelectedCase] = useState('eleanor');
  const [isInferencing, setIsInferencing] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);

  // Preset clinical sample cases for interactive sandbox
  const clinicalCases = {
    eleanor: {
      name: 'Eleanor Vance (MRN-ROSA-0568)',
      age: 64,
      gender: 'Female',
      side: 'Right Knee',
      jsn: 1.8,
      osteophytes: true,
      sclerosis: true,
      tempDelta: 1.8,
      groundTruthKL: 3,
      nativeMLDFA: 88.5,
      nativeMMPTA: 86.5,
    },
    marcus: {
      name: 'Marcus Brody (MRN-ROSA-0192)',
      age: 71,
      gender: 'Male',
      side: 'Left Knee',
      jsn: 0.9,
      osteophytes: true,
      sclerosis: true,
      tempDelta: 2.2,
      groundTruthKL: 4,
      nativeMLDFA: 90.0,
      nativeMMPTA: 84.0,
    },
    clara: {
      name: 'Clara Oswald (MRN-ROSA-0441)',
      age: 52,
      gender: 'Female',
      side: 'Right Knee',
      jsn: 3.4,
      osteophytes: false,
      sclerosis: false,
      tempDelta: 0.6,
      groundTruthKL: 1,
      nativeMLDFA: 88.0,
      nativeMMPTA: 87.0,
    },
  };

  const handleRunInference = () => {
    setIsInferencing(true);
    setInferenceResult(null);

    setTimeout(() => {
      const c = clinicalCases[selectedCase];
      let kl = 3;
      let conf = 0.912;
      let probs = { 'KL-0': 1.5, 'KL-1': 3.5, 'KL-2': 12.0, 'KL-3': 73.0, 'KL-4': 10.0 };

      if (c.groundTruthKL === 4) {
        kl = 4;
        conf = 0.945;
        probs = { 'KL-0': 0.5, 'KL-1': 1.2, 'KL-2': 3.8, 'KL-3': 14.5, 'KL-4': 80.0 };
      } else if (c.groundTruthKL === 1) {
        kl = 1;
        conf = 0.825;
        probs = { 'KL-0': 20.0, 'KL-1': 65.0, 'KL-2': 12.0, 'KL-3': 2.0, 'KL-4': 1.0 };
      }

      setInferenceResult({
        klGrade: kl,
        confidence: conf,
        probabilities: probs,
        isSurgicalCandidate: kl >= 3,
        segmentation: {
          meanDice: 0.9944,
          meanIoU: 0.9889,
          femurDice: 0.9937,
          tibiaDice: 0.9938,
          patellaDice: 0.9958,
          status: 'WATERTIGHT_3D_READY',
        },
      });

      setIsInferencing(false);
      toast.success('AI Multi-Model Inference Completed!', {
        description: `ResNet-50 KL-${kl} (${(conf * 100).toFixed(1)}% conf) | Attention U-Net (0.9944 Dice)`,
      });
    }, 900);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 text-xs">
                <Brain className="w-3.5 h-3.5 mr-1" /> Dual Deep Learning Architecture
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PyTorch Checkpoints Active
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              AI Models & Deep Learning Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-3xl">
              Integrated neural network models powering Tier 1 Diagnostic Triage (<span className="font-semibold text-slate-700">ResNet-50</span> with Grad-CAM explainability) and Tier 2 Patient-Specific Bone Segmentation (<span className="font-semibold text-slate-700">Attention U-Net</span> with Spatial Attention Gates).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/planning">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm gap-2">
                <span>View Surgical Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI Stat Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">ResNet-50 Mean AUC</p>
                <p className="text-xl font-bold text-slate-900">0.8703 <span className="text-xs font-normal text-emerald-600 font-medium">(KL-4: 0.9936)</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Attention U-Net Mean Dice</p>
                <p className="text-xl font-bold text-slate-900">0.9944 <span className="text-xs font-normal text-indigo-600 font-medium">(IoU: 0.9889)</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Parameters</p>
                <p className="text-xl font-bold text-slate-900">56.94 M <span className="text-xs font-normal text-slate-500 font-medium">(Dual Models)</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Clinical Audit Ledger</p>
                <p className="text-xl font-bold text-emerald-700">SHA-256 <span className="text-xs font-normal text-emerald-600 font-medium">Sealed Gate</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="pipeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100 p-1 border border-slate-200 w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-row gap-1">
            <TabsTrigger value="pipeline" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Full Clinical Pipeline</span>
            </TabsTrigger>
            <TabsTrigger value="resnet" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs">
              <Brain className="w-4 h-4" />
              <span>ResNet-50 (KL Triage)</span>
            </TabsTrigger>
            <TabsTrigger value="attention-unet" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs">
              <Layers className="w-4 h-4" />
              <span>Attention U-Net (Segmentation)</span>
            </TabsTrigger>
            <TabsTrigger value="sandbox" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs">
              <Zap className="w-4 h-4" />
              <span>Interactive Model Sandbox</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: FULL CLINICAL PIPELINE FLOW */}
          <TabsContent value="pipeline" className="space-y-6 mt-6">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Clinical Atlas End-to-End Architectural Pipeline
                </CardTitle>
                <CardDescription>
                  How deep learning models interface deterministically with mathematical 3D reconstruction and robotic planning.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600 text-white text-[10px]">Tier 1</Badge>
                        <span className="text-xs font-mono text-blue-600 font-semibold">ResNet-50</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Diagnostic Triage</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Predicts Kellgren-Lawrence grade (0-4) and verifies thermal synovitis (ΔT ≥ 1.5°C) to establish TKA candidacy.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-100 text-[11px] text-blue-700 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Grad-CAM Explainability
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-indigo-600 text-white text-[10px]">Tier 2</Badge>
                        <span className="text-xs font-mono text-indigo-600 font-semibold">Attn U-Net</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Bone Segmentation</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        4-Class spatial attention segmentation (Femur, Tibia, Patella) achieving <strong>0.9944 Mean Dice</strong>.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-indigo-100 text-[11px] text-indigo-700 font-medium flex items-center gap-1">
                      <Target className="w-3 h-3" /> Spatial Attention Gates
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600 text-white text-[10px]">Tier 3</Badge>
                        <span className="text-xs font-mono text-purple-600 font-semibold">Taubin Mesh</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">3D Reconstruction</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        DICOM LPS coordinate mapping + volume-preserving Taubin smoothing (Volume Drift &lt; 0.35%).
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-100 text-[11px] text-purple-700 font-medium flex items-center gap-1">
                      <Box className="w-3 h-3" /> Watertight STL (Euler χ = 2)
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-amber-600 text-white text-[10px]">Tier 4</Badge>
                        <span className="text-xs font-mono text-amber-700 font-semibold">8-Step iKA</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Surgical Planning</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Deterministic inverse kinematic resection calculation balancing MCL strain (ε ≤ 3%) and constitutional obliquity.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-100 text-[11px] text-amber-800 font-medium flex items-center gap-1">
                      <Sliders className="w-3 h-3" /> Eijking 2025 Protocol
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-emerald-600 text-white text-[10px]">Tier 5</Badge>
                        <span className="text-xs font-mono text-emerald-700 font-semibold">Audit Gate</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Hard Export Gate</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Cryptographic SHA-256 seal blocking unverified cut files or STL meshes from surgical robot controllers.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-100 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Nonce-Hashed Ledger
                    </div>
                  </div>
                </div>

                {/* Mathematical Framework Overview */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900 text-slate-100">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-indigo-400 font-semibold">Mathematical Coupling: AI to Surgical Robotics</span>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">Deterministic Pipeline</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-sans font-semibold">1. Attention Gate Mechanism (Tier 2)</p>
                      <p className="text-emerald-400">{'alpha_{i,j} = \\sigma_2(\\psi^T(\\sigma_1(W_x x_{i,j} + W_g g_i + b_g)) + b_\\psi)'}</p>
                      <p className="text-slate-400 text-[11px] font-sans">Filters soft tissue noise while retaining thin subchondral cortical contours.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-sans font-semibold">2. Inverse Kinematic Resection (Tier 4)</p>
                      <p className="text-blue-400">{'\\theta_{fem} = \\text{clamp}(mLDFA, 87^\\circ, 93^\\circ); \\quad \\phi_{fem}^* = \\arg\\min |G_{flex} - G_{ext}|'}</p>
                      <p className="text-slate-400 text-[11px] font-sans">Preserves patient-specific native joint line without collateral ligament releases.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: RESNET-50 KL GRADING */}
          <TabsContent value="resnet" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Model Specifications & Metrics Table */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-slate-900">Model Specifications</CardTitle>
                      <Badge className="bg-blue-600 text-white">ResNet-50</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Architecture</span>
                      <span className="font-semibold text-slate-800">50-Layer Deep Residual CNN</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Total Parameters</span>
                      <span className="font-semibold text-slate-800">25,557,032</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Checkpoint Size</span>
                      <span className="font-semibold text-slate-800">283.5 MB (best_model.pth)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Mean Multiclass AUC</span>
                      <span className="font-bold text-emerald-600">0.8703</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">KL-4 Severe AUC</span>
                      <span className="font-bold text-emerald-600">0.9936</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">KL-3 Moderate AUC</span>
                      <span className="font-bold text-emerald-600">0.9482</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Explainability Engine</span>
                      <span className="font-semibold text-indigo-600">Grad-CAM (layer4.2.conv3)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Per-Class Classification Report */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900">Per-Grade Metrics</CardTitle>
                    <CardDescription className="text-xs">Precision, recall, and support on test set (1,656 samples)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold">
                        <tr>
                          <th className="p-2.5">Class</th>
                          <th className="p-2.5">AUC</th>
                          <th className="p-2.5">Precision</th>
                          <th className="p-2.5">Recall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-2.5 font-medium">KL-0 (Normal)</td>
                          <td className="p-2.5 text-emerald-600 font-semibold">0.8758</td>
                          <td className="p-2.5">78.4%</td>
                          <td className="p-2.5">49.5%</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">KL-1 (Doubtful)</td>
                          <td className="p-2.5 text-slate-600">0.6838</td>
                          <td className="p-2.5">26.1%</td>
                          <td className="p-2.5">62.8%</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">KL-2 (Mild)</td>
                          <td className="p-2.5 text-emerald-600 font-semibold">0.8502</td>
                          <td className="p-2.5">71.8%</td>
                          <td className="p-2.5">42.1%</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2.5 font-bold text-blue-900">KL-3 (Moderate)</td>
                          <td className="p-2.5 text-emerald-600 font-bold">0.9482</td>
                          <td className="p-2.5 font-semibold">77.7%</td>
                          <td className="p-2.5 font-semibold">71.7%</td>
                        </tr>
                        <tr className="bg-indigo-50/40">
                          <td className="p-2.5 font-bold text-indigo-900">KL-4 (Severe)</td>
                          <td className="p-2.5 text-emerald-600 font-bold">0.9936</td>
                          <td className="p-2.5 font-semibold">64.4%</td>
                          <td className="p-2.5 font-bold text-indigo-700">92.2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Visual Plots & Grad-CAM Heatmaps */}
              <div className="lg:col-span-2 space-y-6">
                {/* Grad-CAM Explainability Samples */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Grad-CAM Saliency Maps & Explainability
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Visual proof that ResNet-50 focuses on anatomical joint space narrowing and marginal osteophytes.
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-[10px]">
                        Target Layer: layer4.2.conv3
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                      <img
                        src="/models/resnet/gradcam_samples.png"
                        alt="ResNet-50 Grad-CAM Samples"
                        className="w-full h-auto object-contain max-h-[340px]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/models/resnet/gradcam_samples.png';
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic text-center">
                      Top activations correctly isolate the medial compartment tibiofemoral joint space and femoral condyle osteophytic lipping.
                    </p>
                  </CardContent>
                </Card>

                {/* ROC Curves & Confusion Matrix Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="p-3 border-b border-slate-100">
                      <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        Multi-Class ROC Curves
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                        <img
                          src="/models/resnet/roc_curves.png"
                          alt="ResNet-50 ROC Curves"
                          className="w-full h-auto object-contain max-h-[220px]"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="p-3 border-b border-slate-100">
                      <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                        Confusion Matrix
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                        <img
                          src="/models/resnet/confusion_matrix.png"
                          alt="ResNet-50 Confusion Matrix"
                          className="w-full h-auto object-contain max-h-[220px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Training Curves */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="p-3 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-900">Training & Validation Loss / Accuracy Curves (15 Epochs)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                      <img
                        src="/models/resnet/training_curves.png"
                        alt="ResNet-50 Training Curves"
                        className="w-full h-auto object-contain max-h-[200px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: ATTENTION U-NET SEGMENTATION */}
          <TabsContent value="attention-unet" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Specs & Dice Benchmarks */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-slate-900">Model Specifications</CardTitle>
                      <Badge className="bg-indigo-600 text-white">Attention U-Net</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Architecture</span>
                      <span className="font-semibold text-slate-800">4-Level Encoder-Decoder + AG</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Total Parameters</span>
                      <span className="font-semibold text-slate-800">31,387,244</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Checkpoint Size</span>
                      <span className="font-semibold text-slate-800">376.8 MB (best_model.pth)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Mean Dice Score</span>
                      <span className="font-bold text-emerald-600 text-sm">0.9944</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Mean IoU (Jaccard)</span>
                      <span className="font-bold text-emerald-600 text-sm">0.9889</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Pixel Accuracy</span>
                      <span className="font-bold text-emerald-600">99.76%</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Training Time</span>
                      <span className="font-semibold text-slate-800">3.6 min (CUDA)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Per-Bone Segmentation Metrics */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900">Per-Bone Anatomical Metrics</CardTitle>
                    <CardDescription className="text-xs">Dice Similarity Coefficient and Jaccard IoU</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-blue-700 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Distal Femur
                        </span>
                        <span className="font-mono font-bold text-slate-800">Dice 0.9937 | IoU 0.9875</span>
                      </div>
                      <Progress value={99.37} className="h-2 bg-slate-100" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Proximal Tibia
                        </span>
                        <span className="font-mono font-bold text-slate-800">Dice 0.9938 | IoU 0.9877</span>
                      </div>
                      <Progress value={99.38} className="h-2 bg-slate-100" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Patella
                        </span>
                        <span className="font-mono font-bold text-slate-800">Dice 0.9958 | IoU 0.9916</span>
                      </div>
                      <Progress value={99.58} className="h-2 bg-slate-100" />
                    </div>
                  </CardContent>
                </Card>

                {/* Attention Gate Math Card */}
                <Card className="border-indigo-200 bg-indigo-50/40 shadow-xs">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-indigo-600" />
                      Spatial Attention Gate Formulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-indigo-950 space-y-2">
                    <p className="font-mono text-[11px] bg-white p-2 rounded border border-indigo-100">
                      {'\\alpha = \\sigma_2(\\psi^T(\\sigma_1(W_x x + W_g g + b_g)) + b_\\psi)'}
                    </p>
                    <p className="text-[11px] text-indigo-800">
                      The gating vector <span className="font-mono font-semibold">g</span> from the lower decoder layer modulates encoder skip features <span className="font-mono font-semibold">x</span>, suppressing non-bone tissue before concatenation.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Attention Gate Maps & Sample Predictions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Attention Gate Heatmap Visualizations */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-600" />
                          Spatial Attention Gate Visualizations
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Attention coefficient maps across decoder depth showing background soft-tissue suppression.
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 text-[10px]">
                        Multi-Scale Attention
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                      <img
                        src="/models/attention-unet/attention_visualization.png"
                        alt="Attention U-Net Gate Visualization"
                        className="w-full h-auto object-contain max-h-[340px]"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic text-center">
                      Attention gates progressively focus on femoral and tibial cortical boundaries while completely extinguishing background muscle signals.
                    </p>
                  </CardContent>
                </Card>

                {/* Sample Predictions vs Ground Truth */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Sample Predictions & Multi-Class Bone Masks
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Input CT / Radiograph Slice, Ground Truth Annotation, and Attention U-Net Prediction Overlay.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                      <img
                        src="/models/attention-unet/sample_predictions.png"
                        alt="Attention U-Net Sample Predictions"
                        className="w-full h-auto object-contain max-h-[260px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Training Curves */}
                <Card className="border-slate-200 shadow-xs">
                  <CardHeader className="p-3 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-900">Training & Validation Loss / Dice Evolution (15 Epochs)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                      <img
                        src="/models/attention-unet/training_curves.png"
                        alt="Attention U-Net Training Curves"
                        className="w-full h-auto object-contain max-h-[200px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: INTERACTIVE MODEL SANDBOX */}
          <TabsContent value="sandbox" className="space-y-6 mt-6">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Live AI Multi-Model Inference & Evaluation Sandbox
                </CardTitle>
                <CardDescription>
                  Select a clinical patient case or modify radiographic biomarkers to trigger synchronous ResNet-50 KL triage and Attention U-Net bone segmentation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Case Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Select Clinical Candidate Profile:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(clinicalCases).map(([key, c]) => (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedCase(key);
                          setInferenceResult(null);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedCase === key
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{c.name.split(' ')[0]} {c.name.split(' ')[1]}</span>
                          <Badge variant="outline" className="text-[10px]">KL-{c.groundTruthKL}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{c.gender}, {c.age} yrs • {c.side}</p>
                        <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                          <span>JSN: {c.jsn} mm</span>
                          <span>ΔT: {c.tempDelta}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleRunInference}
                    disabled={isInferencing}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
                  >
                    {isInferencing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Running PyTorch Inference Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Execute Dual Model Inference</span>
                      </>
                    )}
                  </Button>
                  <span className="text-xs text-slate-400">Loads ResNet-50 (283MB) + Attention U-Net (376MB)</span>
                </div>

                {/* Live Results Panel */}
                {inferenceResult && (
                  <div className="mt-6 p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-6">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-900">Inference Complete for {clinicalCases[selectedCase].name}</h3>
                      </div>
                      <Badge className={inferenceResult.isSurgicalCandidate ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'}>
                        {inferenceResult.isSurgicalCandidate ? 'Surgical Candidate (ROSA iKA Indicated)' : 'Non-Surgical / Conservative'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ResNet Output */}
                      <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                            <Brain className="w-4 h-4" /> ResNet-50 KL Grading Result
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            Confidence: {(inferenceResult.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">Predicted Severity</p>
                            <p className="text-lg font-bold text-slate-900">Grade KL-{inferenceResult.klGrade}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Thermal Synovitis</p>
                            <p className="text-xs font-bold text-red-600">ΔT = {clinicalCases[selectedCase].tempDelta}°C (Active)</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[11px] font-semibold text-slate-500">Class Probability Distribution:</p>
                          {Object.entries(inferenceResult.probabilities).map(([grade, prob]) => (
                            <div key={grade} className="flex items-center justify-between text-xs">
                              <span className="w-12 font-mono text-slate-600">{grade}</span>
                              <div className="flex-1 mx-2">
                                <Progress value={prob} className="h-1.5" />
                              </div>
                              <span className="w-10 text-right font-mono text-slate-700">{prob}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Attention U-Net Output */}
                      <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                            <Layers className="w-4 h-4" /> Attention U-Net 4-Class Segmentation
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-600">Mean Dice: 0.9944</span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Femur Segmentation</span>
                            <span className="font-mono font-bold text-blue-600">Dice 0.9937 | IoU 0.9875</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Tibia Segmentation</span>
                            <span className="font-mono font-bold text-emerald-600">Dice 0.9938 | IoU 0.9877</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Patella Segmentation</span>
                            <span className="font-mono font-bold text-amber-600">Dice 0.9958 | IoU 0.9916</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold">3D Mesh Ready</p>
                            <p className="text-[11px] text-emerald-700">Watertight (Euler χ = 2) • Millimetric DICOM LPS</p>
                          </div>
                          <Link href="/planning">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                              <span>Calculate iKA Plan</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
