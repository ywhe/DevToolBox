import React, { useState, useEffect } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';

interface JwtPart {
  raw: string;
  decoded: any;
  error?: string;
}

export const JwtTool: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<JwtPart | null>(null);
  const [payload, setPayload] = useState<JwtPart | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decodePart = (part: string): any => {
    try {
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Invalid Base64 or JSON');
    }
  };

  useEffect(() => {
    if (!token) {
      setHeader(null);
      setPayload(null);
      setSignature(null);
      return;
    }

    const parts = token.split('.');
    
    // Header
    if (parts[0]) {
      try {
        setHeader({ raw: parts[0], decoded: decodePart(parts[0]) });
      } catch (e) {
        setHeader({ raw: parts[0], decoded: null, error: 'Invalid Header' });
      }
    }

    // Payload
    if (parts[1]) {
      try {
        setPayload({ raw: parts[1], decoded: decodePart(parts[1]) });
      } catch (e) {
        setPayload({ raw: parts[1], decoded: null, error: 'Invalid Payload' });
      }
    } else {
        setPayload(null);
    }

    // Signature
    if (parts[2]) {
      setSignature(parts[2]);
    } else {
      setSignature(null);
    }

  }, [token]);

  const renderJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const handleCopy = (text: string, section: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center gap-3">
        <h2 className="h3 fw-bold text-dark mb-0">JWT Debugger</h2>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
          Parse only, no verification
        </span>
      </div>

      <div className="d-flex flex-column gap-2">
        <label className="form-label small fw-bold text-muted text-uppercase">
          Encoded Token
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT (eyJ...)"
          className="form-control shadow-sm"
          style={{ height: '100px', resize: 'none' }}
          spellCheck={false}
        />
      </div>

      <div className="row g-4 flex-grow-1 overflow-auto pb-3">
        
        {/* Header Column */}
        <div className="col-md-6 col-lg-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between text-danger mb-2">
            <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-danger" style={{width: '8px', height: '8px'}}></span>
                <span className="small fw-bold text-uppercase">Header</span>
            </div>
            {header?.decoded && (
                <button 
                    onClick={() => handleCopy(renderJson(header.decoded), 'header')}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 py-0 px-2"
                >
                    {copiedSection === 'header' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSection === 'header' ? 'Copied' : 'Copy'}</span>
                </button>
            )}
          </div>
          <div className="flex-grow-1 card card-body bg-light border p-3 font-monospace small overflow-auto">
            {header?.error ? (
              <div className="text-danger d-flex align-items-center gap-2">
                <AlertCircle size={16} /> <span>Invalid Header</span>
              </div>
            ) : header?.decoded ? (
               <pre className="mb-0 text-body whitespace-pre-wrap">{renderJson(header.decoded)}</pre>
            ) : (
              <span className="text-muted fst-italic">Waiting for input...</span>
            )}
          </div>
        </div>

        {/* Payload Column */}
        <div className="col-md-6 col-lg-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-2" style={{color: '#6f42c1'}}>
            <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle" style={{width: '8px', height: '8px', backgroundColor: '#6f42c1'}}></span>
                <span className="small fw-bold text-uppercase">Payload</span>
            </div>
            {payload?.decoded && (
                <button 
                    onClick={() => handleCopy(renderJson(payload.decoded), 'payload')}
                    className="btn btn-sm d-flex align-items-center gap-1 py-0 px-2"
                    style={{color: '#6f42c1', borderColor: '#6f42c1'}}
                >
                    {copiedSection === 'payload' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSection === 'payload' ? 'Copied' : 'Copy'}</span>
                </button>
            )}
          </div>
          <div className="flex-grow-1 card card-body bg-light border p-3 font-monospace small overflow-auto">
            {payload?.error ? (
               <div className="text-danger d-flex align-items-center gap-2">
                <AlertCircle size={16} /> <span>Invalid Payload</span>
              </div>
            ) : payload?.decoded ? (
               <pre className="mb-0 text-body whitespace-pre-wrap">{renderJson(payload.decoded)}</pre>
            ) : (
              <span className="text-muted fst-italic">Waiting for input...</span>
            )}
          </div>
        </div>

        {/* Signature Column */}
        <div className="col-md-12 col-lg-4 d-flex flex-column">
           <div className="d-flex align-items-center justify-content-between text-info mb-2">
            <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-info" style={{width: '8px', height: '8px'}}></span>
                <span className="small fw-bold text-uppercase">Signature</span>
            </div>
             {signature && (
                <button 
                    onClick={() => handleCopy(signature, 'signature')}
                    className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 py-0 px-2"
                >
                    {copiedSection === 'signature' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSection === 'signature' ? 'Copied' : 'Copy'}</span>
                </button>
            )}
          </div>
          <div className="flex-grow-1 card card-body bg-light border p-3 font-monospace small overflow-auto text-break text-muted">
             {signature ? (
               <span>{signature}</span>
             ) : (
               <span className="fst-italic">Waiting for input...</span>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};