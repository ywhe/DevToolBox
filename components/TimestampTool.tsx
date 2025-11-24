import React, { useState, useEffect } from 'react';
import { Clock, RefreshCcw, Copy, Check } from 'lucide-react';

export const TimestampTool: React.FC = () => {
  const EPOCH_OFFSET_TICKS = 621355968000000000n;
  const TICKS_PER_MS = 10000n;
  const TICKS_PER_SEC = 10000000n;

  const [currentTicks, setCurrentTicks] = useState<bigint>(0n);
  const [isoInput, setIsoInput] = useState('');
  const [unixSecInput, setUnixSecInput] = useState('');
  const [unixMsInput, setUnixMsInput] = useState('');
  const [csharpTicksInput, setCsharpTicksInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setNow();
  }, []);

  const setNow = () => {
    const now = new Date();
    const ms = BigInt(now.getTime());
    const ticks = ms * TICKS_PER_MS + EPOCH_OFFSET_TICKS;
    updateFromTicks(ticks);
  };

  const updateFromTicks = (ticks: bigint) => {
    setCurrentTicks(ticks);
    setCsharpTicksInput(ticks.toString());
    const unixMs = (ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS;
    setUnixMsInput(unixMs.toString());
    const unixSec = (ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_SEC;
    setUnixSecInput(unixSec.toString());
    try {
        const date = new Date(Number(unixMs));
        setIsoInput(date.toISOString());
    } catch (e) {
        setIsoInput("Invalid Date Range");
    }
  };

  const handleIsoChange = (val: string) => {
      setIsoInput(val);
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
          const ms = BigInt(date.getTime());
          const ticks = ms * TICKS_PER_MS + EPOCH_OFFSET_TICKS;
          setCurrentTicks(ticks);
          setCsharpTicksInput(ticks.toString());
          setUnixMsInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS).toString());
          setUnixSecInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_SEC).toString());
      }
  };

  const handleUnixSecChange = (val: string) => {
      setUnixSecInput(val);
      try {
          if (!val || val === '-') return;
          const sec = BigInt(val);
          const ticks = sec * TICKS_PER_SEC + EPOCH_OFFSET_TICKS;
          setCurrentTicks(ticks);
          setCsharpTicksInput(ticks.toString());
          setUnixMsInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS).toString());
          const date = new Date(Number((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS));
          setIsoInput(date.toISOString());
      } catch (e) {}
  };

  const handleUnixMsChange = (val: string) => {
      setUnixMsInput(val);
      try {
          if (!val || val === '-') return;
          const ms = BigInt(val);
          const ticks = ms * TICKS_PER_MS + EPOCH_OFFSET_TICKS;
          setCurrentTicks(ticks);
          setCsharpTicksInput(ticks.toString());
          setUnixSecInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_SEC).toString());
          const date = new Date(Number(ms));
          setIsoInput(date.toISOString());
      } catch (e) {}
  };

  const handleTicksChange = (val: string) => {
      setCsharpTicksInput(val);
      try {
          if (!val || val === '-') return;
          const ticks = BigInt(val);
          setCurrentTicks(ticks);
          setUnixMsInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS).toString());
          setUnixSecInput(((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_SEC).toString());
          const date = new Date(Number((ticks - EPOCH_OFFSET_TICKS) / TICKS_PER_MS));
          setIsoInput(date.toISOString());
      } catch (e) {}
  };

  const handleCopy = (text: string, field: string) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
           <div className="p-2 bg-info-subtle text-info-emphasis rounded">
             <Clock size={24} />
           </div>
           <h2 className="h3 fw-bold text-dark mb-0">Timestamp Converter</h2>
        </div>
        <button 
            onClick={setNow}
            className="btn btn-light d-flex align-items-center gap-2"
        >
            <RefreshCcw size={16} />
            <span>Set to Now</span>
        </button>
      </div>

      <div className="d-flex flex-column gap-3" style={{maxWidth: '800px'}}>
        
        {/* ISO Date */}
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">ISO 8601 Date</label>
                    <button onClick={() => handleCopy(isoInput, 'iso')} className="btn btn-sm btn-link text-secondary p-0">
                        {copiedField === 'iso' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                </div>
                <input 
                    type="text" 
                    value={isoInput}
                    onChange={(e) => handleIsoChange(e.target.value)}
                    className="form-control font-monospace fs-5 bg-light"
                    placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                />
                <div className="form-text small">Standard Format (e.g., 2023-10-27T10:00:00.000Z)</div>
            </div>
        </div>

        {/* Unix Seconds */}
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">Unix Timestamp (Seconds)</label>
                    <button onClick={() => handleCopy(unixSecInput, 'sec')} className="btn btn-sm btn-link text-secondary p-0">
                        {copiedField === 'sec' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                </div>
                <input 
                    type="text" 
                    value={unixSecInput}
                    onChange={(e) => handleUnixSecChange(e.target.value)}
                    className="form-control font-monospace fs-5 bg-light"
                    placeholder="e.g. 1698400800"
                />
                <div className="form-text small">Seconds since Unix Epoch (1970-01-01)</div>
            </div>
        </div>

        {/* Unix Millis */}
        <div className="card shadow-sm border-0">
            <div className="card-body">
                 <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">Unix Timestamp (Milliseconds)</label>
                     <button onClick={() => handleCopy(unixMsInput, 'ms')} className="btn btn-sm btn-link text-secondary p-0">
                        {copiedField === 'ms' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                </div>
                <input 
                    type="text" 
                    value={unixMsInput}
                    onChange={(e) => handleUnixMsChange(e.target.value)}
                    className="form-control font-monospace fs-5 bg-light"
                    placeholder="e.g. 1698400800000"
                />
                <div className="form-text small">Java / JavaScript Time. Milliseconds since Unix Epoch.</div>
            </div>
        </div>

        {/* C# Ticks */}
        <div className="card shadow-sm border-0">
            <div className="card-body">
                 <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">C# Ticks (.NET)</label>
                    <button onClick={() => handleCopy(csharpTicksInput, 'ticks')} className="btn btn-sm btn-link text-secondary p-0">
                        {copiedField === 'ticks' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                </div>
                <input 
                    type="text" 
                    value={csharpTicksInput}
                    onChange={(e) => handleTicksChange(e.target.value)}
                    className="form-control font-monospace fs-5 bg-light"
                    placeholder="e.g. 638340080000000000"
                />
                <div className="form-text small">100-nanosecond intervals since 0001-01-01 00:00:00 UTC.</div>
            </div>
        </div>

      </div>
    </div>
  );
};