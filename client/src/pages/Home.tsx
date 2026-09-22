import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowRight,
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  ChevronDown,
  Clipboard,
  Code2,
  Database,
  Eye,
  FileCode2,
  FileText,
  GitBranch,
  Layers3,
  Menu,
  Moon,
  MonitorCog,
  Orbit,
  PanelLeft,
  Play,
  Search,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type IconType = typeof Sparkles;

const navItems = [
  { id: "overview", label: "Overview", index: "01" },
  { id: "workflow", label: "Workflow", index: "02" },
  { id: "dashboard", label: "Prototype dashboard", index: "03" },
  { id: "system", label: "System architecture", index: "04" },
  { id: "surfaces", label: "Product surfaces", index: "05" },
  { id: "quality", label: "Quality gates", index: "06" },
  { id: "scope", label: "Scope & safety", index: "07" },
];

const dashboardTabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "imaging", label: "Imaging viewer", icon: ScanLine },
  { id: "segmentation", label: "Segmentation", icon: Activity },
  { id: "reconstruction", label: "3D reconstruction", icon: Box },
  { id: "planning", label: "Planning", icon: Clipboard },
];

const workflowSteps = [
  { id: "01", label: "CT / DICOM", title: "Imaging input", detail: "Bring the study into a focused review workspace with axial, coronal, and sagittal context.", color: "cyan" },
  { id: "02", label: "AI model", title: "Bone segmentation", detail: "Surface the simulated 3D U-Net state, masks, confidence, Dice, ASSD, and HD95 metrics.", color: "lime" },
  { id: "03", label: "Marching Cubes", title: "3D reconstruction", detail: "Transform the segmentation result into a selectable, patient-specific anatomical model.", color: "orange" },
  { id: "04", label: "Landmarks", title: "Anatomical review", detail: "Inspect axes, joint line, tibial slope, and dimensions inside a workstation-style viewer.", color: "purple" },
  { id: "05", label: "ROSA-assisted TKA", title: "Planning support", detail: "Preview alignment, resection, and balance parameters without implying robotic control.", color: "pink" },
  { id: "06", label: "Clinician review", title: "Case sign-off", detail: "Bring the complete case together in a report preview with a prototype review state.", color: "blue" },
];

const architectureCards: { icon: IconType; eyebrow: string; title: string; body: string; accent: string }[] = [
  { icon: Code2, eyebrow: "Frontend", title: "A deliberate React surface", body: "React, TypeScript, Vite, Tailwind, Router, and reusable UI primitives keep every screen composable and testable.", accent: "cyan" },
  { icon: Database, eyebrow: "Mock boundary", title: "A clean service seam", body: "Centralized mock services keep the interface ready for a future FastAPI backend without coupling the UI to hardcoded data.", accent: "lime" },
  { icon: Orbit, eyebrow: "Spatial layer", title: "A model-ready 3D core", body: "Three.js and React Three Fiber support procedural bone geometry now and GLTF, GLB, STL, or OBJ assets later.", accent: "orange" },
];

const productSurfaces: { icon: IconType; label: string; title: string; detail: string; metric: string; visual: string }[] = [
  { icon: BarChart3, label: "01 / Monitor", title: "Dashboard", detail: "Case volume, pending segmentation, reconstruction status, review queue, activity, and performance at a glance.", metric: "04 status cards", visual: "bars" },
  { icon: PanelLeft, label: "02 / Review", title: "Imaging + segmentation", detail: "A CT slice viewer paired with mask overlays, study context, model status, and metric comparison.", metric: "3 planes", visual: "scan" },
  { icon: Box, label: "03 / Explore", title: "3D reconstruction", detail: "A large interactive viewer with selectable bones, camera presets, opacity, wireframe, and landmarks.", metric: "70% viewer", visual: "model" },
  { icon: Clipboard, label: "04 / Decide", title: "Planning + report", detail: "Planning parameters, review states, printable report preview, analytics, and transparent prototype boundaries.", metric: "03 states", visual: "plan" },
];

const qualityChecks = [
  "`npm run build` succeeds",
  "All routes load without broken links",
  "Patient search and filters work",
  "CT and 3D viewers load reliably",
  "Bone selection and visibility work",
  "Segmentation simulation advances states",
  "Planning status updates persist in-session",
  "Safety notices are visible on relevant screens",
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);
  const [dashboardTab, setDashboardTab] = useState("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("clinical-atlas-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("clinical-atlas-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const filteredNav = useMemo(
    () => navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    scrollToId(id);
    setMenuOpen(false);
  };

  const copyBriefLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    toast.success("Specification link copied", { description: "Share the Clinical Atlas brief with your team." });
  };

  return (
    <main className={`atlas-site ${theme === "light" ? "atlas-light" : ""}`}>
      <div className="atlas-grid-overlay" aria-hidden="true" />
      <header className="atlas-header">
        <div className="atlas-header-inner">
          <button className="atlas-brand" onClick={() => handleNavigate("overview")} aria-label="Clinical Atlas home">
            <span className="brand-mark"><span /><span /><span /></span>
            <span>
              <strong>Clinical Atlas</strong>
              <small>Prototype specification</small>
            </span>
          </button>
          <nav className="atlas-topnav" aria-label="Primary navigation">
            <button onClick={() => handleNavigate("workflow")}>Workflow</button>
            <button onClick={() => handleNavigate("system")}>Architecture</button>
            <button onClick={() => handleNavigate("scope")}>Safety boundary</button>
          </nav>
          <div className="atlas-header-actions">
            <Link href="/dashboard">
              <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                Launch Platform <ArrowRight size={13} />
              </span>
            </Link>
            <span className="version-pill"><span className="pulse-dot" /> Prototype v1.0</span>
            <button className="theme-toggle" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button className="icon-button menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-nav">
            {navItems.map((item) => <button key={item.id} onClick={() => handleNavigate(item.id)}>{item.index} <span>{item.label}</span><ArrowRight size={15} /></button>)}
          </div>
        )}
      </header>

      <section className="atlas-hero" id="overview">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> Academic frontend prototype <span className="eyebrow-code">CA / 2026</span></div>
          <h1>From scan to <em>specific</em> surgical insight.</h1>
          <p className="hero-lede">A formal product brief for an interactive clinical workstation that connects CT/DICOM imaging, AI bone segmentation, patient-specific 3D reconstruction, and ROSA-assisted TKA planning support.</p>
          <div className="hero-actions">
            <Link href="/dashboard">
              <span className="primary-button bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md">
                Launch Clinical Platform <ArrowRight size={17} />
              </span>
            </Link>
            <button className="primary-button" onClick={() => handleNavigate("workflow")}>Explore the workflow <ArrowDownRight size={17} /></button>
            <button className="text-button" onClick={copyBriefLink}><Clipboard size={16} /> Copy brief link</button>
          </div>
          <div className="hero-metrics">
            <div><strong>06</strong><span>workflow stages</span></div>
            <div><strong>11</strong><span>product surfaces</span></div>
            <div><strong>100%</strong><span>mock-safe data</span></div>
          </div>
        </div>
        <div className="hero-monitor" aria-label="Clinical Atlas visual system preview">
          <div className="monitor-topline"><span>CASE / PT-001</span><span className="monitor-status"><span className="pulse-dot" /> System nominal</span></div>
          <div className="monitor-stage">
            <div className="scan-lines" />
            <div className="scan-corner corner-tl" /><div className="scan-corner corner-tr" /><div className="scan-corner corner-bl" /><div className="scan-corner corner-br" />
            <div className="knee-orbit"><div className="knee-bone knee-femur" /><div className="knee-bone knee-tibia" /><div className="knee-patella" /><div className="orbit-ring ring-a" /><div className="orbit-ring ring-b" /></div>
            <div className="axis-line axis-one" /><div className="axis-line axis-two" />
            <span className="model-label label-femur">FEMUR <i>0.984</i></span>
            <span className="model-label label-tibia">TIBIA <i>0.979</i></span>
            <span className="model-label label-axis">MECHANICAL AXIS</span>
            <div className="slice-readout"><strong>SLICE 142</strong><span>/ 320</span><div className="slice-bar"><i /></div></div>
          </div>
          <div className="monitor-bottomline"><span>3D RECONSTRUCTION</span><span>RIGHT KNEE</span><span>CT-2026-001</span></div>
        </div>
      </section>

      <div className="prototype-ribbon"><ShieldCheck size={16} /><span>Research and visualization prototype</span><i /> <span>Not for diagnosis, treatment decisions, or autonomous robotic control.</span></div>

      <div className="atlas-body">
        <aside className="atlas-sidebar">
          <div className="sidebar-label">In this brief</div>
          <div className="sidebar-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter sections" aria-label="Filter sections" /></div>
          <div className="sidebar-nav">
            {filteredNav.map((item) => <button key={item.id} className={activeSection === item.id ? "active" : ""} onClick={() => handleNavigate(item.id)}><span>{item.index}</span>{item.label}<ArrowRight size={14} /></button>)}
          </div>
          <div className="sidebar-note"><Sparkles size={15} /><div><strong>Design principle</strong><p>Clear, calm, clinical, and ready for future integration.</p></div></div>
        </aside>

        <div className="atlas-content">
          <section className="content-section overview-section" aria-labelledby="overview-heading">
            <div className="section-intro"><div className="section-kicker">01 / Overview</div><h2 id="overview-heading">A working story, not a static screen.</h2><p>Clinical Atlas is designed as a complete narrative: a clinician selects a fictional case, follows the study from image to model, inspects measurable anatomy, and records a transparent prototype review.</p></div>
            <div className="overview-grid">
              <div className="quote-card"><div className="quote-mark">“</div><p>CT / DICOM imaging <span>→</span> AI bone segmentation <span>→</span> 3D reconstruction <span>→</span> patient-specific planning support</p><div className="quote-foot"><span className="tiny-mark" /> Core product narrative</div></div>
              <div className="principles-card"><div className="card-topline"><span>Product intent</span><BadgeCheck size={17} /></div><div className="principle-row"><strong>01</strong><span>Readable at a glance</span><small>Clinical information density without noise.</small></div><div className="principle-row"><strong>02</strong><span>Interactive by default</span><small>Every important state has a visible response.</small></div><div className="principle-row"><strong>03</strong><span>Future-ready seams</span><small>Mock behavior today, real services tomorrow.</small></div></div>
            </div>
          </section>

          <section className="content-section workflow-section" id="workflow" aria-labelledby="workflow-heading">
            <div className="section-heading-row"><div><div className="section-kicker light">02 / Workflow</div><h2 id="workflow-heading">One case. Six connected moments.</h2></div><span className="section-code">FLOW / 006</span></div>
            <p className="section-lede light-lede">The brief is structured around a single clinical-review journey. Select a stage to inspect the experience it needs to support.</p>
            <div className="workflow-layout">
              <div className="workflow-rail">
                {workflowSteps.map((step, index) => <button key={step.id} className={`workflow-node ${selectedWorkflow === index ? "selected" : ""}`} onClick={() => setSelectedWorkflow(index)}><span className={`workflow-dot ${step.color}`}>{step.id}</span><span><small>{step.label}</small><strong>{step.title}</strong></span><ChevronDown size={16} className="node-chevron" /></button>)}
              </div>
              <div className="workflow-detail">
                <div className="detail-grid-mark"><span /><span /><span /><span /></div>
                <div className="detail-index">STAGE {workflowSteps[selectedWorkflow].id} / 06</div>
                <h3>{workflowSteps[selectedWorkflow].title}</h3>
                <p>{workflowSteps[selectedWorkflow].detail}</p>
                <div className="detail-footer"><span className={`detail-chip ${workflowSteps[selectedWorkflow].color}`}>{workflowSteps[selectedWorkflow].label}</span><ArrowRight size={17} /></div>
              </div>
            </div>
          </section>

          <section className="content-section dashboard-section" id="dashboard" aria-labelledby="dashboard-heading">
            <div className="section-heading-row"><div><div className="section-kicker">03 / Prototype dashboard</div><h2 id="dashboard-heading">See the workflow in motion.</h2></div><span className="section-code">LIVE / MOCK</span></div>
            <p className="section-lede">A compact interactive preview of the planned clinical workstation. Use the tabs to move from the case overview into imaging, segmentation, reconstruction, and planning states.</p>
            <div className="dashboard-shell">
              <div className="dashboard-topbar"><div className="dashboard-brand"><span className="brand-mark"><span /><span /><span /></span><span>Clinical Atlas <small>Workspace</small></span></div><div className="dashboard-patient"><span className="status-dot" /> Current patient <strong>PT-001 · Demo Patient</strong></div><div className="dashboard-actions"><span className="dashboard-search"><Search size={13} /> Search</span><span className="avatar">DR</span></div></div>
              <div className="dashboard-layout">
                <aside className="dashboard-sidebar"><div className="dash-sidebar-title">Case navigation</div>{dashboardTabs.map(({ id, label, icon: Icon }) => <button key={id} className={dashboardTab === id ? "selected" : ""} onClick={() => setDashboardTab(id)}><Icon size={14} /><span>{label}</span>{dashboardTab === id && <ArrowRight size={12} />}</button>)}<div className="dash-sidebar-bottom"><span className="status-dot" /> All systems nominal</div></aside>
                <div className="dashboard-main">
                  <div className="dashboard-breadcrumb"><span>Workspace</span><ChevronRight size={13} /><strong>{dashboardTabs.find((tab) => tab.id === dashboardTab)?.label}</strong><span className="dashboard-demo-tag">DEMO DATA</span></div>
                  {dashboardTab === "dashboard" && <DashboardOverview onSelect={setDashboardTab} />}
                  {dashboardTab === "imaging" && <ImagingPreview />}
                  {dashboardTab === "segmentation" && <SegmentationPreview />}
                  {dashboardTab === "reconstruction" && <ReconstructionPreview />}
                  {dashboardTab === "planning" && <PlanningPreview />}
                </div>
              </div>
            </div>
            <div className="dashboard-caption"><span><span className="legend-dot cyan" /> Interactive surface</span><span><span className="legend-dot orange" /> Simulated data</span><span><Eye size={13} /> Click the left rail to explore</span></div>
          </section>

          <section className="content-section system-section" id="system" aria-labelledby="system-heading">
            <div className="section-heading-row"><div><div className="section-kicker">03 / System architecture</div><h2 id="system-heading">A prototype with clean edges.</h2></div><span className="section-code">ARCH / 003</span></div>
            <p className="section-lede">The implementation is intentionally frontend-first. Its service boundary, model interfaces, and 3D component map keep future infrastructure possible without pretending it exists today.</p>
            <div className="architecture-grid">{architectureCards.map(({ icon: Icon, eyebrow, title, body, accent }) => <article className={`architecture-card accent-${accent}`} key={title}><div className="architecture-icon"><Icon size={19} /></div><div className="card-eyebrow">{eyebrow}</div><h3>{title}</h3><p>{body}</p><ArrowUpRightIcon /></article>)}</div>
            <div className="system-lower-grid"><div className="file-tree-card"><div className="code-window-top"><span /><span /><span /><label>src / boundary map</label></div><div className="file-tree"><span className="tree-folder"><ChevronDown size={13} /> src</span><span className="tree-line indent-one"><Layers3 size={13} /> components / 3d</span><span className="tree-line indent-one"><PanelLeft size={13} /> components / imaging</span><span className="tree-line indent-one"><FileCode2 size={13} /> services / api.ts</span><span className="tree-line indent-one"><GitBranch size={13} /> store / index.ts</span><span className="tree-line indent-one"><FileText size={13} /> types / domain.ts</span><span className="tree-line indent-one"><Database size={13} /> data / mock.ts</span></div></div><div className="interfaces-card"><div className="card-topline"><span>Typed domain model</span><Terminal size={16} /></div><div className="type-pills">{["Patient", "ImagingStudy", "SegmentationResult", "Bone", "Reconstruction", "SurgicalPlan"].map((type) => <span key={type}>{type}</span>)}</div><div className="interface-note"><Check size={15} /> No hardcoded datasets inside UI components</div></div></div>
          </section>

          <section className="content-section surfaces-section" id="surfaces" aria-labelledby="surfaces-heading">
            <div className="section-heading-row"><div><div className="section-kicker">04 / Product surfaces</div><h2 id="surfaces-heading">The brief, rendered as a workstation.</h2></div><span className="section-code">UI / 011</span></div>
            <p className="section-lede">Every surface has a job: orient the reviewer, expose the anatomy, show the evidence, or make the prototype’s boundaries legible.</p>
            <div className="surface-grid">{productSurfaces.map(({ icon: Icon, label, title, detail, metric, visual }) => <article className="surface-card" key={title}><div className="surface-card-head"><span className="surface-icon"><Icon size={17} /></span><span>{label}</span><strong>{metric}</strong></div><h3>{title}</h3><p>{detail}</p><div className={`surface-visual ${visual}`} aria-hidden="true">{visual === "bars" && <><span style={{ height: "52%" }} /><span style={{ height: "78%" }} /><span style={{ height: "38%" }} /><span style={{ height: "92%" }} /><span style={{ height: "66%" }} /></>}{visual === "scan" && <><i /><i /><i /><b /></>}{visual === "model" && <><div className="mini-femur" /><div className="mini-tibia" /><div className="mini-axis" /></>}{visual === "plan" && <><span className="plan-row active"><i />Alignment <b>98.4°</b></span><span className="plan-row"><i />Tibial slope <b>5.2°</b></span><span className="plan-row"><i />Status <b>Draft</b></span></>}</div><button className="surface-link" onClick={() => toast.info(`${title} is included in the prototype brief`)}>View requirements <ArrowRight size={15} /></button></article>)}</div>
          </section>

          <section className="content-section quality-section" id="quality" aria-labelledby="quality-heading">
            <div className="quality-panel"><div className="quality-copy"><div className="section-kicker light">05 / Quality gates</div><h2 id="quality-heading">Ship the complete story.</h2><p>The goal is not a dashboard mockup. It is a navigable prototype that can be reviewed route by route, interaction by interaction, and state by state.</p><button className="outline-light-button" onClick={() => toast.success("Build checklist ready", { description: "Use these gates before sharing the prototype." })}>Run the checklist <Play size={15} /></button></div><div className="quality-list">{qualityChecks.map((check, index) => <div className="quality-check" key={check}><span>0{index + 1}</span><Check size={15} /><p>{check}</p></div>)}</div></div>
          </section>

          <section className="content-section scope-section" id="scope" aria-labelledby="scope-heading">
            <div className="section-heading-row"><div><div className="section-kicker">06 / Scope & safety</div><h2 id="scope-heading">Ambition with a visible boundary.</h2></div><span className="section-code">SAFE / 002</span></div>
            <p className="section-lede">Clinical Atlas should feel technically credible without making claims the prototype cannot support. The boundary is part of the product experience.</p>
            <div className="scope-grid"><div className="scope-card include"><div className="scope-card-top"><span className="scope-badge"><Check size={14} /></span><span>Build now</span></div><h3>Demonstrate the workflow</h3><ul><li>Complete responsive UI and routing</li><li>Mock CT viewer and segmentation states</li><li>Interactive 3D reconstruction and landmarks</li><li>Planning, reports, analytics, and settings</li><li>Centralized mock services and Zustand state</li></ul></div><div className="scope-card exclude"><div className="scope-card-top"><span className="scope-badge"><ShieldCheck size={14} /></span><span>Future phase</span></div><h3>Keep out of scope</h3><ul><li>Real U-Net inference or training</li><li>Real DICOM server, PACS, or patient database</li><li>ROSA hardware communication or robot control</li><li>Clinical authentication or regulatory certification</li><li>Cloud deployment and production operations</li></ul></div></div>
            <div className="safety-callout"><div className="safety-icon"><ShieldCheck size={22} /></div><div><div className="card-eyebrow">Non-negotiable language</div><h3>Prototype for research and visualization.</h3><p>Not for clinical diagnosis, treatment decisions, or autonomous robotic control.</p></div><div className="safety-lines"><span /><span /><span /></div></div>
          </section>

          <footer className="atlas-footer"><div className="footer-brand"><span className="brand-mark"><span /><span /><span /></span><div><strong>Clinical Atlas</strong><small>Automatic knee bone segmentation + 3D reconstruction</small></div></div><div className="footer-meta"><span>Prototype v1.0</span><span>Research and visualization only</span><button onClick={() => handleNavigate("overview")}>Back to top <ArrowRight size={14} /></button></div></footer>
        </div>
      </div>
      <div className="atlas-scroll-progress" aria-hidden="true" />
    </main>
  );
}

function DashboardOverview({ onSelect }: { onSelect: (tab: string) => void }) {
  return <div className="dashboard-view dashboard-overview-view"><div className="dashboard-welcome"><div><span className="dashboard-eyebrow">Case overview / 09:42</span><h3>Good morning, Dr. Rao.</h3><p>Review patient imaging, segmentation results, and reconstructed knee anatomy.</p></div><button onClick={() => onSelect("imaging")} className="dash-primary-button">Open imaging <ArrowRight size={14} /></button></div><div className="stat-grid"><div><span>Total patients</span><strong>24</strong><small>+4 this month</small></div><div><span>Pending segmentation</span><strong>06</strong><small className="orange-text">Needs attention</small></div><div><span>Reconstructions</span><strong>18</strong><small>75% complete</small></div><div><span>Pending reviews</span><strong>03</strong><small className="orange-text">Review queue</small></div></div><div className="dashboard-lower"><div className="recent-cases"><div className="dash-section-title"><span>Recent cases</span><button onClick={() => onSelect("imaging")}>View all <ArrowRight size={12} /></button></div><div className="case-row case-head"><span>Patient</span><span>Side</span><span>Segmentation</span><span>Review</span></div>{[["PT-001", "Demo Patient", "Right", "Completed", "Reviewed"], ["PT-014", "Research Case", "Left", "Processing", "Requires review"], ["PT-021", "Demo Record", "Right", "Completed", "Pending"]].map(([id, name, side, segmentation, review]) => <div className="case-row" key={id}><span><strong>{id}</strong><small>{name}</small></span><span>{side}</span><span><i className={`case-status ${segmentation === "Completed" ? "good" : "working"}`} />{segmentation}</span><span className={review === "Reviewed" ? "reviewed" : "review-pending"}>{review}</span></div>)}</div><div className="performance-card"><div className="dash-section-title"><span>Segmentation performance</span><span className="mini-period">Last 30 days</span></div><div className="mini-chart"><div className="chart-y"><span>1.0</span><span>.5</span><span>0</span></div><div className="chart-graph"><i style={{ height: "74%" }} /><i style={{ height: "82%" }} /><i style={{ height: "68%" }} /><i style={{ height: "91%" }} /><i style={{ height: "77%" }} /><i style={{ height: "95%" }} /><span className="chart-line" /></div></div><div className="chart-legend"><span><i className="legend-dot cyan" /> Dice score</span><strong>0.984 avg.</strong></div></div></div></div>;
}

function ImagingPreview() {
  return <div className="dashboard-view"><div className="subview-header"><div><span className="dashboard-eyebrow">Imaging viewer / CT-2026-001</span><h3>Right knee · CT study</h3></div><span className="subview-status"><span className="status-dot" /> Mask overlay on</span></div><div className="imaging-view"><div className="study-column"><span className="study-label">Study series</span><div className="study-card selected"><span>CT</span><strong>Right knee</strong><small>320 slices · 0.6 mm</small></div><div className="study-card"><span>SEG</span><strong>Bone mask</strong><small>3D U-Net · completed</small></div><div className="study-card muted"><span>REPORT</span><strong>Planning preview</strong><small>Available after review</small></div></div><div className="ct-canvas"><div className="ct-grid" /><div className="ct-rings" /><div className="ct-bone" /><div className="ct-mask mask-a" /><div className="ct-mask mask-b" /><span className="ct-label top-left">AXIAL / SLICE 142</span><span className="ct-label bottom-right">W/L 350 / 40</span><span className="ct-label mid-left">FEMUR · 0.984</span></div><div className="imaging-controls"><span className="study-label">View controls</span><div className="plane-tabs"><button className="active">Axial</button><button>Coronal</button><button>Sagittal</button></div><label>Slice <strong>142 / 320</strong></label><div className="fake-slider"><i /></div><div className="control-switch"><span>AI mask overlay</span><b className="switch-on" /></div><div className="control-switch"><span>Bone visibility</span><b className="switch-on" /></div><div className="control-switch"><span>Probability map</span><b /></div></div></div><div className="subview-footer"><span><span className="legend-dot cyan" /> Femur mask</span><span><span className="legend-dot orange" /> Tibia mask</span><span>Zoom 100%</span></div></div>;
}

function SegmentationPreview() {
  return <div className="dashboard-view"><div className="subview-header"><div><span className="dashboard-eyebrow">AI bone segmentation / 3D U-Net</span><h3>Segmentation results</h3></div><span className="completed-badge"><Check size={12} /> Completed</span></div><div className="segmentation-view"><div className="seg-compare"><div className="seg-panel"><span>Original CT</span><div className="seg-image original"><div className="ct-bone" /></div></div><div className="seg-divider"><ArrowRight size={14} /></div><div className="seg-panel"><span>CT + segmentation overlay</span><div className="seg-image overlay"><div className="ct-bone" /><div className="ct-mask mask-a" /><div className="ct-mask mask-b" /></div></div></div><div className="metric-list"><div className="metric-list-head"><span>Bone class</span><span>Dice</span><span>ASSD</span><span>HD95</span></div>{[["Femur", "0.984", "0.312 mm", "0.845 mm"], ["Tibia", "0.979", "0.284 mm", "0.792 mm"], ["Patella", "0.967", "0.401 mm", "1.02 mm"]].map(([bone, dice, assd, hd]) => <div className="metric-row" key={bone}><span><i className={`bone-dot ${bone.toLowerCase()}`} />{bone}</span><strong>{dice}</strong><span>{assd}</span><span>{hd}</span></div>)}</div></div></div>;
}

function ReconstructionPreview() {
  return <div className="dashboard-view"><div className="subview-header"><div><span className="dashboard-eyebrow">3D reconstruction / patient-specific model</span><h3>Right knee reconstruction</h3></div><span className="subview-status"><span className="status-dot" /> Model ready</span></div><div className="reconstruction-view"><div className="recon-stage"><div className="recon-grid" /><div className="recon-model"><div className="recon-femur" /><div className="recon-tibia" /><div className="recon-patella" /><div className="recon-axis" /></div><span className="recon-tag tag-femur">FEMUR · 0.984</span><span className="recon-tag tag-axis">MECHANICAL AXIS</span><span className="recon-tag tag-tibia">TIBIA · 0.979</span><div className="view-pill">ISOMETRIC <RotateGlyph /></div></div><div className="recon-side-panel"><span className="study-label">Visualization</span><div className="bone-toggle selected"><Eye size={13} /><span>Femur</span><b /></div><div className="bone-toggle selected"><Eye size={13} /><span>Tibia</span><b /></div><div className="bone-toggle selected"><Eye size={13} /><span>Patella</span><b /></div><div className="opacity-label"><span>Opacity</span><strong>82%</strong></div><div className="fake-slider cyan-slider"><i /></div><span className="study-label landmarks-label">Landmarks</span><div className="landmark-row"><i />Mechanical Axis</div><div className="landmark-row"><i />Joint Line</div><div className="landmark-row"><i />TEA</div></div></div></div>;
}

function PlanningPreview() {
  return <div className="dashboard-view"><div className="subview-header"><div><span className="dashboard-eyebrow">ROSA-assisted TKA / planning support</span><h3>Pre-operative planning preview</h3></div><span className="draft-badge">Draft</span></div><div className="planning-view"><div className="planning-model"><div className="recon-model"><div className="recon-femur" /><div className="recon-tibia" /><div className="recon-patella" /><div className="recon-axis" /></div><span>Patient-specific 3D model</span></div><div className="planning-panel"><div className="plan-group"><span>Alignment</span><label>Mechanical axis <strong>2.4°</strong></label><label>Femoral alignment <strong>0.8°</strong></label><label>Tibial alignment <strong>1.6°</strong></label></div><div className="plan-group"><span>Resection parameters</span><label>Distal femoral <strong>9.0 mm</strong></label><label>Posterior femoral <strong>5.0 mm</strong></label><label>Tibial slope <strong>5.2°</strong></label></div><button className="dash-primary-button">Mark as reviewed <Check size={14} /></button></div></div><div className="planning-disclaimer"><ShieldCheck size={14} /> Visualization and planning support only. Does not control the ROSA robotic system.</div></div>;
}

function RotateGlyph() {
  return <span className="rotate-glyph" />;
}

function ArrowUpRightIcon() {
  return <ArrowRight size={16} className="card-arrow" />;
}
