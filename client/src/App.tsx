import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientRegistry from "./pages/PatientRegistry";
import PatientDetails from "./pages/PatientDetails";
import ImagingViewer from "./pages/ImagingViewer";
import Segmentation from "./pages/Segmentation";
import Reconstruction from "./pages/Reconstruction";
import SurgicalPlanning from "./pages/SurgicalPlanning";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/overview" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/patients" component={PatientRegistry} />
      <Route path="/patients/:id" component={PatientDetails} />
      <Route path="/imaging" component={ImagingViewer} />
      <Route path="/imaging/:id" component={ImagingViewer} />
      <Route path="/segmentation" component={Segmentation} />
      <Route path="/segmentation/:id" component={Segmentation} />
      <Route path="/reconstruction" component={Reconstruction} />
      <Route path="/reconstruction/:id" component={Reconstruction} />
      <Route path="/planning" component={SurgicalPlanning} />
      <Route path="/planning/:id" component={SurgicalPlanning} />
      <Route path="/reports" component={Reports} />
      <Route path="/reports/:id" component={Reports} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
