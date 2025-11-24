import React, { useState, useEffect, useMemo } from 'react';
import { Regex, AlertCircle } from 'lucide-react';

export const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('([A-Z])\\w+');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('Welcome to DevToolBox. The Quick Brown Fox Jumps Over The Lazy Dog.');
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);

  const allFlags = [
    { char: 'g', label: 'Global' },
    { char: 'i', label: 'Case Insensitive' },
    { char: 'm', label: 'Multiline' },
    { char: 's', label: 'Dot All' },
    { char: 'u', label: 'Unicode' },
  ];

  const toggleFlag = (char: string) => {
    if (flags.includes(char)) {
      setFlags(flags.replace(char, ''));
    } else {
      setFlags(flags + char);
    }
  };

  useEffect(() => {
    setError(null);
    setMatches([]);
    if (!pattern) return;
    try {
      const regex = new RegExp(pattern, flags);
      const newMatches: RegExpExecArray[] = [];
      if (flags.includes('g')) {
        let match;
        let safety = 0;
        while ((match = regex.exec(text)) !== null && safety < 1000) {
          newMatches.push(match);
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          safety++;
        }
      } else {
        const match = regex.exec(text);
        if (match) newMatches.push(match);
      }
      setMatches(newMatches);
    } catch (err: any) {
      setError(err.message);
    }
  }, [pattern, flags, text]);

  const renderHighlightedText = useMemo(() => {
    if (error || !pattern || matches.length === 0) return text;
    let lastIndex = 0;
    const parts = [];
    matches.forEach((match, i) => {
      if (match.index > lastIndex) {
        parts.push(<span key={`pre-${i}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      parts.push(
        <span key={`match-${i}`} className="bg-primary-subtle text-primary-emphasis fw-bold border-bottom border-primary px-1 rounded-1" title={`Match ${i + 1}`}>
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    });
    if (lastIndex < text.length) {
      parts.push(<span key="last">{text.substring(lastIndex)}</span>);
    }
    return parts;
  }, [text, matches, error, pattern]);

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center gap-3">
           <div className="p-2 bg-danger-subtle text-danger rounded">
             <Regex size={24} />
           </div>
           <h2 className="h3 fw-bold text-dark mb-0">Regex Tester</h2>
      </div>

      {/* Controls Card */}
      <div className="card shadow-sm p-3 border-0">
        <div className="row g-3">
            <div className="col-lg-8 position-relative">
                <div className="input-group">
                    <span className="input-group-text font-monospace text-muted">/</span>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className={`form-control font-monospace fs-5 ${error ? 'is-invalid' : ''}`}
                        placeholder="Regex pattern..."
                    />
                    <span className="input-group-text font-monospace text-muted">/</span>
                </div>
            </div>
            
            <div className="col-lg-4 d-flex flex-wrap gap-2">
                {allFlags.map(f => (
                    <button
                        key={f.char}
                        onClick={() => toggleFlag(f.char)}
                        className={`btn btn-sm fw-bold font-monospace ${
                            flags.includes(f.char)
                            ? 'btn-primary' 
                            : 'btn-outline-secondary'
                        }`}
                        title={f.label}
                    >
                        {f.char}
                    </button>
                ))}
            </div>
        </div>
        {error && (
            <div className="text-danger small mt-2 d-flex align-items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}
      </div>

      <div className="row g-4 flex-grow-1 min-height-0">
        
        {/* Test String Card */}
        <div className="col-lg-6 d-flex flex-column h-100">
             <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                    <label className="form-label small fw-bold text-muted text-uppercase">Test String</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="form-control flex-grow-1 bg-light font-monospace"
                        placeholder="Enter text to test regex against..."
                        spellCheck={false}
                        style={{resize: 'none'}}
                    />
                </div>
             </div>
        </div>

        {/* Matches & Groups Column */}
        <div className="col-lg-6 d-flex flex-column h-100 gap-4">
            
            {/* Visual Highlight Card */}
            <div className="card shadow-sm border-0 flex-grow-1" style={{minHeight: '200px'}}>
                 <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label small fw-bold text-muted text-uppercase mb-0">Matches Found</label>
                        <span className="badge bg-primary rounded-pill">{matches.length}</span>
                    </div>
                    <div className="flex-grow-1 p-3 rounded bg-light border overflow-auto font-monospace text-break">
                        {renderHighlightedText}
                    </div>
                 </div>
            </div>

            {/* Match Details (Groups) Card */}
            <div className="card shadow-sm border-0" style={{height: '40%'}}>
                 <div className="card-body d-flex flex-column p-0">
                    <div className="p-3 pb-0">
                        <label className="form-label small fw-bold text-muted text-uppercase">Captured Groups</label>
                    </div>
                    <div className="flex-grow-1 overflow-auto p-3">
                        {matches.length === 0 ? (
                            <div className="text-muted small fst-italic text-center mt-3">No matches found</div>
                        ) : (
                            <table className="table table-sm table-hover table-bordered small mb-0">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th style={{width: '40px'}}>#</th>
                                        <th>Match</th>
                                        <th>Groups</th>
                                        <th className="text-end">Idx</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map((m, idx) => (
                                        <tr key={idx}>
                                            <td className="text-muted">{idx + 1}</td>
                                            <td className="fw-medium font-monospace text-truncate" style={{maxWidth: '100px'}} title={m[0]}>{m[0]}</td>
                                            <td>
                                                {m.length > 1 ? (
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        {Array.from(m).slice(1).map((g, gi) => (
                                                            <span key={gi} className="badge bg-light text-dark border fw-normal" title={`Group ${gi + 1}`}>
                                                                {g || <span className="text-muted fst-italic">null</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-muted">-</span>}
                                            </td>
                                            <td className="text-end text-muted font-monospace">{m.index}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};