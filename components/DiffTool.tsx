import React, { useState, useMemo } from 'react';
import { Eraser, Type, FileText, AlignLeft } from 'lucide-react';

type DiffMode = 'chars' | 'words' | 'lines';
type DiffType = 'equal' | 'insert' | 'delete';

interface DiffPart {
  type: DiffType;
  value: string;
}

export const DiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [mode, setMode] = useState<DiffMode>('words');

  const diffParts = useMemo(() => {
    if (!text1 && !text2) return [];
    
    let tokens1: string[];
    let tokens2: string[];
    
    if (mode === 'chars') {
      tokens1 = text1.split('');
      tokens2 = text2.split('');
    } else if (mode === 'words') {
      tokens1 = text1.split(/(\s+)/);
      tokens2 = text2.split(/(\s+)/);
    } else {
      tokens1 = text1.split('\n');
      tokens2 = text2.split('\n');
    }

    const m = tokens1.length;
    const n = tokens2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (tokens1[i - 1] === tokens2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = m;
    let j = n;
    const parts: DiffPart[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && tokens1[i - 1] === tokens2[j - 1]) {
        parts.unshift({ type: 'equal', value: tokens1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        parts.unshift({ type: 'insert', value: tokens2[j - 1] });
        j--;
      } else {
        parts.unshift({ type: 'delete', value: tokens1[i - 1] });
        i--;
      }
    }

    return parts;
  }, [text1, text2, mode]);

  const handleClear = () => {
    setText1('');
    setText2('');
  };

  const renderDiff = () => {
    if (!text1 && !text2) {
      return <div className="text-muted fst-italic text-center p-5">Enter text in both fields to see differences.</div>;
    }

    return (
      <div className="font-monospace small text-break whitespace-pre-wrap">
        {diffParts.map((part, idx) => {
          if (part.type === 'equal') {
            return <span key={idx} className="text-secondary">{part.value}{mode === 'lines' && '\n'}</span>;
          } else if (part.type === 'insert') {
            return (
              <span key={idx} className="bg-success-subtle text-success-emphasis text-decoration-none border-bottom border-success">
                {part.value}{mode === 'lines' && '\n'}
              </span>
            );
          } else {
            return (
              <span key={idx} className="bg-danger-subtle text-danger-emphasis text-decoration-line-through opacity-75">
                {part.value}{mode === 'lines' && '\n'}
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h3 fw-bold text-dark mb-0">Diff Viewer</h2>
        <div className="d-flex align-items-center gap-2">
            <button 
                onClick={handleClear}
                className="btn btn-outline-danger"
                title="Clear All"
            >
                <Eraser size={18} />
            </button>
            <div className="btn-group" role="group">
                <button
                    type="button"
                    onClick={() => setMode('chars')}
                    className={`btn btn-sm d-flex align-items-center gap-1 ${mode === 'chars' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                    <Type size={14} />
                    <span>Chars</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMode('words')}
                    className={`btn btn-sm d-flex align-items-center gap-1 ${mode === 'words' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                    <FileText size={14} />
                    <span>Words</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMode('lines')}
                    className={`btn btn-sm d-flex align-items-center gap-1 ${mode === 'lines' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                    <AlignLeft size={14} />
                    <span>Lines</span>
                </button>
            </div>
        </div>
      </div>

      <div className="row g-3" style={{height: '33%'}}>
        <div className="col-lg-6 d-flex flex-column h-100">
          <label className="form-label small fw-bold text-muted text-uppercase">Original Text</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste original text..."
            className="form-control flex-grow-1 shadow-sm"
            style={{ resize: 'none' }}
            spellCheck={false}
          />
        </div>
        <div className="col-lg-6 d-flex flex-column h-100">
          <label className="form-label small fw-bold text-muted text-uppercase">Modified Text</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste modified text..."
            className="form-control flex-grow-1 shadow-sm"
            style={{ resize: 'none' }}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1 min-height-0">
        <div className="d-flex align-items-center gap-3 mb-2">
            <label className="form-label small fw-bold text-muted text-uppercase mb-0">Comparison Result</label>
            <div className="d-flex align-items-center gap-3 small">
                <div className="d-flex align-items-center gap-1">
                    <span className="rounded bg-success-subtle border border-success-subtle" style={{width: '12px', height: '12px'}}></span>
                    <span className="text-secondary">Added</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                    <span className="rounded bg-danger-subtle border border-danger-subtle" style={{width: '12px', height: '12px'}}></span>
                    <span className="text-secondary">Removed</span>
                </div>
            </div>
        </div>
        <div className="flex-grow-1 border rounded bg-white p-3 overflow-auto shadow-sm">
            {renderDiff()}
        </div>
      </div>
    </div>
  );
};