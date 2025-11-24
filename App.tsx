import React, { useState } from 'react';
import { NavItem, ToolType } from './types';
import { 
  Binary, 
  ShieldCheck, 
  FileJson, 
  FileCode,
  Globe, 
  Menu,
  X,
  Link as LinkIcon,
  Fingerprint,
  GitCompare,
  ArrowRightLeft,
  Regex,
  Clock
} from 'lucide-react';

import { Base64Tool } from './components/Base64Tool';
import { JwtTool } from './components/JwtTool';
import { JsonFormatterTool } from './components/JsonFormatterTool';
import { XmlFormatterTool } from './components/XmlFormatterTool';
import { WorldTimeTool } from './components/WorldTimeTool';
import { UrlTool } from './components/UrlTool';
import { UuidTool } from './components/UuidTool';
import { DiffTool } from './components/DiffTool';
import { DataConverterTool } from './components/DataConverterTool';
import { HashTool } from './components/HashTool';
import { RegexTool } from './components/RegexTool';
import { TimestampTool } from './components/TimestampTool';

const NAV_ITEMS: NavItem[] = [
  { 
    id: ToolType.WORLD_TIME, 
    label: 'World Clock', 
    icon: <Globe size={20} />,
    description: 'Timezone converter'
  },
  { 
    id: ToolType.TIMESTAMP, 
    label: 'Timestamp Converter', 
    icon: <Clock size={20} />,
    description: 'Unix, Ticks & Dates'
  },
  { 
    id: ToolType.BASE64, 
    label: 'Base64 Converter', 
    icon: <Binary size={20} />,
    description: 'Encode and decode strings'
  },
  { 
    id: ToolType.URL, 
    label: 'URL Encoder', 
    icon: <LinkIcon size={20} />,
    description: 'Escape URI strings'
  },
  { 
    id: ToolType.JWT, 
    label: 'JWT Parser', 
    icon: <ShieldCheck size={20} />,
    description: 'Debug access tokens'
  },
  { 
    id: ToolType.JSON_FORMATTER, 
    label: 'JSON Formatter', 
    icon: <FileJson size={20} />,
    description: 'Prettify or minify JSON'
  },
  { 
    id: ToolType.XML_FORMATTER, 
    label: 'XML Formatter', 
    icon: <FileCode size={20} />,
    description: 'Prettify or minify XML'
  },
  { 
    id: ToolType.DATA_CONVERTER, 
    label: 'Data Converter', 
    icon: <ArrowRightLeft size={20} />,
    description: 'JSON / YAML / XML / CSV'
  },
  { 
    id: ToolType.DIFF, 
    label: 'Diff Viewer', 
    icon: <GitCompare size={20} />,
    description: 'Compare text differences'
  },
  { 
    id: ToolType.REGEX, 
    label: 'Regex Tester', 
    icon: <Regex size={20} />,
    description: 'Test regular expressions'
  },
  { 
    id: ToolType.UUID, 
    label: 'UUID Generator', 
    icon: <Fingerprint size={20} />,
    description: 'Generate unique IDs'
  },
];

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.WORLD_TIME);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.BASE64: return <Base64Tool />;
      case ToolType.URL: return <UrlTool />;
      case ToolType.JWT: return <JwtTool />;
      case ToolType.JSON_FORMATTER: return <JsonFormatterTool />;
      case ToolType.XML_FORMATTER: return <XmlFormatterTool />;
      case ToolType.DATA_CONVERTER: return <DataConverterTool />;
      case ToolType.UUID: return <UuidTool />;
      case ToolType.DIFF: return <DiffTool />;
      case ToolType.WORLD_TIME: return <WorldTimeTool />;
      case ToolType.REGEX: return <RegexTool />;
      case ToolType.TIMESTAMP: return <TimestampTool />;
      default: return <WorldTimeTool />;
    }
  };

  return (
    <div className="d-flex h-100 w-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 z-2 d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar bg-white border-end d-flex flex-column
        position-fixed h-100 z-3
        ${sidebarOpen ? 'start-0' : 'start-0'}
        ${!sidebarOpen ? 'd-none d-lg-flex' : 'd-flex'}
      `}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px'}}>
              DT
            </div>
            <span className="h5 mb-0 fw-bold text-dark">
              DevToolBox
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="btn btn-link text-secondary d-lg-none p-0"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow-1 overflow-y-auto p-2">
          <div className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTool(item.id);
                  setSidebarOpen(false);
                }}
                className={`btn btn-link nav-link text-start text-decoration-none d-flex align-items-center gap-3 p-2 rounded ${
                  activeTool === item.id ? 'active' : ''
                }`}
              >
                <div className={activeTool === item.id ? 'text-primary' : 'text-secondary'}>
                  {item.icon}
                </div>
                <div>
                  <div className="fw-semibold small">{item.label}</div>
                  <div className="small text-muted" style={{fontSize: '0.75rem'}}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>
        
        <div className="p-3 border-top">
           <div className="text-center text-muted small">
              &copy; {new Date().getFullYear()} DevToolBox
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column min-width-0 bg-body-tertiary" style={{ marginLeft: '0', paddingLeft: '0' }}>
        <div className="d-flex d-lg-block flex-grow-1 h-100" style={{ marginLeft: window.innerWidth >= 992 ? '280px' : '0' }}>
            
            {/* Mobile Header */}
            <div className="d-lg-none bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top z-1">
            <div className="d-flex align-items-center gap-2">
                <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-bold small" style={{width: '32px', height: '32px'}}>
                    DT
                </div>
                <span className="fw-bold text-dark">DevToolBox</span>
                </div>
                <button 
                onClick={() => setSidebarOpen(true)}
                className="btn btn-light text-secondary"
                >
                <Menu size={24} />
                </button>
            </div>

            {/* Content Area */}
            <div className="h-100 overflow-hidden p-3 p-lg-4">
                <div className="h-100 w-100 bg-white rounded-4 shadow-sm border p-4 overflow-y-auto">
                    {renderTool()}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;