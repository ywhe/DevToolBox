import React, { useState } from 'react';
import { FileJson, Check, Copy, Trash2 } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError("Invalid JSON: " + e.message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError("Invalid JSON: " + e.message);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
           <div className="p-2 bg-success-subtle text-success rounded">
             <FileJson size={24} />
           </div>
           <h2 className="h3 fw-bold text-dark mb-0">JSON Formatter</h2>
        </div>
        
        <div className="d-flex align-items-center gap-2">
            <button 
                onClick={handleClear}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
                <Trash2 size={16} />
                <span>Clear</span>
            </button>
            <button 
                onClick={minifyJSON}
                className="btn btn-light"
            >
                Minify
            </button>
             <button 
                onClick={formatJSON}
                className="btn btn-success text-white"
            >
                Prettify
            </button>
        </div>
      </div>

      <div className="row g-4 flex-grow-1 min-height-0">
        <div className="col-lg-6 d-flex flex-column h-100">
            <label className="form-label small fw-bold text-muted text-uppercase">Input JSON</label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="form-control flex-grow-1 shadow-sm"
                style={{ resize: 'none' }}
                spellCheck={false}
            />
        </div>

        <div className="col-lg-6 d-flex flex-column h-100 position-relative">
             <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="form-label small fw-bold text-muted text-uppercase mb-0">Formatted Output</label>
                {output && (
                <button 
                    onClick={handleCopy}
                    className="btn btn-sm btn-success-subtle text-success d-flex align-items-center gap-1 py-0 px-2"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                )}
            </div>
            <div className={`flex-grow-1 position-relative border rounded overflow-hidden ${error ? 'border-danger bg-danger-subtle' : 'bg-light'}`}>
                 {error ? (
                    <div className="position-absolute top-0 start-0 p-3 text-danger fw-medium font-monospace small whitespace-pre-wrap">
                        {error}
                    </div>
                    ) : (
                    <textarea
                        readOnly
                        value={output}
                        className="form-control h-100 bg-transparent border-0 shadow-none"
                        style={{ resize: 'none' }}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};