import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper for unicode support
  const b64EncodeUnicode = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      }));
  };

  const b64DecodeUnicode = (str: string) => {
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  };

  useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(b64EncodeUnicode(input));
      } else {
        setOutput(b64DecodeUnicode(input));
      }
    } catch (err) {
      setError('Invalid input for decoding.');
      setOutput('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h3 fw-bold text-dark mb-0">Base64 Converter</h2>
        <div className="btn-group" role="group">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="row g-4 flex-grow-1">
        {/* Input Section */}
        <div className="col-lg-6 d-flex flex-column">
          <label className="form-label small fw-bold text-muted text-uppercase">
            {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 string to decode...'}
            className="form-control flex-grow-1 shadow-sm"
            style={{ resize: 'none' }}
            spellCheck={false}
          />
        </div>

        {/* Output Section */}
        <div className="col-lg-6 d-flex flex-column position-relative">
          <div className="d-flex align-items-center justify-content-between mb-2">
             <label className="form-label small fw-bold text-muted text-uppercase mb-0">
              {mode === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
            </label>
            {output && (
              <button 
                onClick={handleCopy}
                className="btn btn-sm btn-light text-primary d-flex align-items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          
          <div className={`flex-grow-1 position-relative border rounded overflow-hidden ${error ? 'border-danger bg-danger-subtle' : 'bg-light'}`}>
            {error ? (
              <div className="position-absolute top-0 start-0 p-3 text-danger fw-medium">
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