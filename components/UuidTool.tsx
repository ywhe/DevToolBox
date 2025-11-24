import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCcw } from 'lucide-react';

export const UuidTool: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateBatch = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = generateUUID();
      if (!hyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  useEffect(() => {
    generateBatch();
  }, [count, hyphens, uppercase]);

  const handleCopy = () => {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h3 fw-bold text-dark mb-0">UUID Generator</h2>
        <button
            onClick={generateBatch}
            className="btn btn-primary d-flex align-items-center gap-2"
        >
            <RefreshCcw size={16} />
            <span>Regenerate</span>
        </button>
      </div>

      {/* Controls */}
      <div className="card shadow-sm border p-4 bg-light">
          <div className="row g-3 align-items-center">
             <div className="col-md-4">
                 <label className="form-label small fw-bold text-muted text-uppercase">Quantity: {count}</label>
                 <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={count} 
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="form-range"
                 />
             </div>
             
             <div className="col-md-8 d-flex align-items-center gap-4">
                  <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="hyphensSwitch" 
                        checked={hyphens} 
                        onChange={() => setHyphens(!hyphens)} 
                    />
                    <label className="form-check-label fw-medium" htmlFor="hyphensSwitch">Hyphens</label>
                  </div>

                  <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="uppercaseSwitch" 
                        checked={uppercase} 
                        onChange={() => setUppercase(!uppercase)} 
                    />
                    <label className="form-check-label fw-medium" htmlFor="uppercaseSwitch">Uppercase</label>
                  </div>
             </div>
          </div>
      </div>

      {/* Output */}
      <div className="d-flex flex-column flex-grow-1 position-relative">
          <div className="d-flex align-items-center justify-content-between mb-2">
             <label className="form-label small fw-bold text-muted text-uppercase mb-0">
              Generated UUIDs v4
            </label>
            {uuids.length > 0 && (
              <button 
                onClick={handleCopy}
                className="btn btn-sm btn-light text-primary d-flex align-items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied All' : 'Copy All'}</span>
              </button>
            )}
          </div>
          
          <div className="flex-grow-1 border rounded overflow-hidden bg-white">
              <textarea
                readOnly
                value={uuids.join('\n')}
                className="form-control h-100 border-0 shadow-none font-monospace"
                style={{ resize: 'none' }}
              />
          </div>
      </div>
    </div>
  );
};