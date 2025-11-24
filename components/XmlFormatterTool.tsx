import React, { useState } from 'react';
import { FileCode, Check, Copy, Trash2 } from 'lucide-react';

export const XmlFormatterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatXML = () => {
    setError(null);
    if (!input.trim()) {
        setOutput('');
        return;
    }

    try {
        if (!input.trim().startsWith('<')) {
            throw new Error("Invalid XML: Must start with <");
        }

        let formatted = '';
        const reg = /(>)(<)(\/*)/g;
        const xmlClean = input.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        
        const lines = xmlClean.split('\r\n');
        
        lines.forEach((node) => {
          let indent = 0;
          if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
          } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) {
              pad -= 1;
            }
          } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
          } else {
            indent = 0;
          }
    
          let padding = '';
          for (let i = 0; i < pad; i++) {
            padding += '  ';
          }
    
          formatted += padding + node + '\r\n';
          pad += indent;
        });
    
        setOutput(formatted.trim());
    } catch (e: any) {
        setError(e.message);
        setOutput('');
    }
  };

  const minifyXML = () => {
      setError(null);
      if(!input.trim()) return;

      try {
           setOutput(input.replace(/>\s+</g, '><').trim());
      } catch (e: any) {
          setError(e.message);
      }
  }

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
  }

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
           <div className="p-2 bg-warning-subtle text-warning rounded">
             <FileCode size={24} />
           </div>
           <h2 className="h3 fw-bold text-dark mb-0">XML Formatter</h2>
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
                onClick={minifyXML}
                className="btn btn-light"
            >
                Minify
            </button>
             <button 
                onClick={formatXML}
                className="btn btn-warning text-white"
            >
                Prettify
            </button>
        </div>
      </div>

      <div className="row g-4 flex-grow-1 min-height-0">
        <div className="col-lg-6 d-flex flex-column h-100">
            <label className="form-label small fw-bold text-muted text-uppercase">Input XML</label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your XML here..."
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
                    className="btn btn-sm btn-warning-subtle text-warning-emphasis d-flex align-items-center gap-1 py-0 px-2"
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