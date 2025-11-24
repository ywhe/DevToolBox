import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Copy, Check } from 'lucide-react';
import { TimeZone } from '../types';

const PREDEFINED_ZONES: TimeZone[] = [
  { label: 'UTC', region: 'Universal Time', id: 'UTC' },
  
  // Americas
  { label: 'New York', region: 'Americas', id: 'America/New_York' },
  { label: 'Los Angeles', region: 'Americas', id: 'America/Los_Angeles' },
  { label: 'Chicago', region: 'Americas', id: 'America/Chicago' },
  { label: 'Toronto', region: 'Americas', id: 'America/Toronto' },
  { label: 'Vancouver', region: 'Americas', id: 'America/Vancouver' },
  { label: 'Mexico City', region: 'Americas', id: 'America/Mexico_City' },
  { label: 'São Paulo', region: 'Americas', id: 'America/Sao_Paulo' },
  
  // Europe
  { label: 'London', region: 'Europe', id: 'Europe/London' },
  { label: 'Paris', region: 'Europe', id: 'Europe/Paris' },
  { label: 'Berlin', region: 'Europe', id: 'Europe/Berlin' },
  { label: 'Rome', region: 'Europe', id: 'Europe/Rome' },
  { label: 'Madrid', region: 'Europe', id: 'Europe/Madrid' },
  { label: 'Amsterdam', region: 'Europe', id: 'Europe/Amsterdam' },
  { label: 'Zurich', region: 'Europe', id: 'Europe/Zurich' },
  { label: 'Moscow', region: 'Europe', id: 'Europe/Moscow' },
  
  // Asia
  { label: 'Beijing', region: 'Asia', id: 'Asia/Shanghai' },
  { label: 'Tokyo', region: 'Asia', id: 'Asia/Tokyo' },
  { label: 'Singapore', region: 'Asia', id: 'Asia/Singapore' },
  { label: 'Hong Kong', region: 'Asia', id: 'Asia/Hong_Kong' },
  { label: 'Seoul', region: 'Asia', id: 'Asia/Seoul' },
  { label: 'Mumbai', region: 'Asia', id: 'Asia/Kolkata' },
  { label: 'Bangkok', region: 'Asia', id: 'Asia/Bangkok' },
  { label: 'Dubai', region: 'Middle East', id: 'Asia/Dubai' },
  
  // Pacific
  { label: 'Sydney', region: 'Australia', id: 'Australia/Sydney' },
  { label: 'Melbourne', region: 'Australia', id: 'Australia/Melbourne' },
  { label: 'Auckland', region: 'Pacific', id: 'Pacific/Auckland' },
];

export const WorldTimeTool: React.FC = () => {
  const [baseTime, setBaseTime] = useState<Date>(new Date());
  const [selectedZones, setSelectedZones] = useState<TimeZone[]>([
    PREDEFINED_ZONES.find(z => z.label === 'Beijing')!,
    PREDEFINED_ZONES.find(z => z.label === 'London')!,
    PREDEFINED_ZONES.find(z => z.label === 'New York')!,
    PREDEFINED_ZONES.find(z => z.label === 'Tokyo')!,
  ]);
  const [sliderValue, setSliderValue] = useState(0); 
  const [copiedZoneId, setCopiedZoneId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (sliderValue === 0) {
      interval = setInterval(() => {
        setBaseTime(new Date());
      }, 1000 * 60);
    }
    return () => clearInterval(interval);
  }, [sliderValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    setSliderValue(minutes);
    const now = new Date();
    const newTime = new Date(now.getTime() + minutes * 60000);
    setBaseTime(newTime);
  };

  const handleReset = () => {
    setSliderValue(0);
    setBaseTime(new Date());
  };

  const addZone = (zone: TimeZone) => {
    if (!selectedZones.find(z => z.id === zone.id)) {
      setSelectedZones([...selectedZones, zone]);
    }
  };

  const removeZone = (id: string) => {
    setSelectedZones(selectedZones.filter(z => z.id !== id));
  };

  const formatTime = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone,
    }).format(date);
  };

  const formatDate = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(date);
  };

  const getDayDifference = (date: Date, timeZone: string) => {
      const localString = new Intl.DateTimeFormat('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }).format(date);
      const targetString = new Intl.DateTimeFormat('en-CA', { timeZone }).format(date);
      
      if (localString === targetString) return '';
      if (targetString > localString) return '+1 Day';
      return '-1 Day';
  };

  const getOffsetDisplay = (timeZone: string) => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset'
      }).formatToParts(now);
      return parts.find(p => p.type === 'timeZoneName')?.value || '';
    } catch {
      return '';
    }
  };

  const handleCopy = (text: string, zoneId: string) => {
      navigator.clipboard.writeText(text);
      setCopiedZoneId(zoneId);
      setTimeout(() => setCopiedZoneId(null), 2000);
  };

  const regions = Array.from(new Set(PREDEFINED_ZONES.map(z => z.region))).sort();

  return (
    <div className="d-flex flex-column gap-4 h-100">
      <div className="d-flex align-items-center justify-content-between flex-shrink-0">
        <h2 className="h3 fw-bold text-dark mb-0">World Clock</h2>
        <div>
            <button 
                onClick={handleReset}
                className="btn btn-sm btn-link text-decoration-none fw-bold"
            >
                Reset to Now
            </button>
        </div>
      </div>

      {/* Time Slider */}
      <div className="card shadow-sm border-0 flex-shrink-0">
        <div className="card-body py-3">
            <div className="d-flex justify-content-between small fw-bold text-muted mb-2">
                <span>-12 Hours</span>
                <span className={sliderValue === 0 ? "text-primary fw-bold" : "text-dark"}>
                    {sliderValue === 0 ? "NOW" : `${sliderValue > 0 ? '+' : ''}${Math.round(sliderValue/60 * 10)/10}h`}
                </span>
                <span>+12 Hours</span>
            </div>
            <input
            type="range"
            min="-720"
            max="720"
            step="15"
            value={sliderValue}
            onChange={handleSliderChange}
            className="form-range"
            />
            <div className="text-center small text-muted mt-1" style={{fontSize: '0.75rem'}}>
                Drag to shift time
            </div>
        </div>
      </div>

      {/* Zone Grid */}
      <div className="flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>
        <div className="row g-3 pb-3">
            {/* Add New Card */}
            <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 border-2 border-dashed border-secondary-subtle bg-light hover-shadow position-relative d-flex align-items-center justify-content-center" style={{minHeight: '120px'}}>
                    <Plus size={24} className="text-secondary mb-1" />
                    <span className="small fw-medium text-secondary">Add City</span>
                    <select 
                        className="position-absolute w-100 h-100 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const zone = PREDEFINED_ZONES.find(z => z.label === e.target.value);
                            if(zone) {
                                addZone(zone);
                                e.target.value = ""; 
                            }
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a city</option>
                        {regions.map(region => (
                            <optgroup key={region} label={region}>
                                {PREDEFINED_ZONES.filter(z => z.region === region).map(z => (
                                    <option 
                                        key={z.label} 
                                        value={z.label} 
                                        disabled={!!selectedZones.find(s => s.id === z.id)}
                                    >
                                        {z.label} ({getOffsetDisplay(z.id)})
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            {selectedZones.map((zone) => {
                const timeStr = formatTime(baseTime, zone.id);
                const dateStr = formatDate(baseTime, zone.id);
                const dayDiff = getDayDifference(baseTime, zone.id);
                const isDay = (() => {
                    const hour = parseInt(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: zone.id }).format(baseTime));
                    return hour >= 6 && hour < 18;
                })();

                return (
                    <div key={zone.id} className="col-sm-6 col-lg-4 col-xl-3">
                        <div className="card h-100 shadow-sm border-0 position-relative hover-shadow">
                            <div className="card-body p-3 d-flex flex-column justify-content-between">
                                <button 
                                    onClick={() => removeZone(zone.id)}
                                    className="btn btn-link text-secondary p-0 position-absolute top-0 end-0 mt-1 me-2 opacity-50 hover-opacity-100"
                                    style={{zIndex: 10}}
                                >
                                    <X size={16} />
                                </button>
                                <div>
                                    <div className="d-flex align-items-center gap-1 mb-1">
                                        <span className="badge bg-secondary-subtle text-secondary-emphasis text-uppercase" style={{fontSize: '0.65rem'}}>{zone.region}</span>
                                    </div>
                                    <h3 className="h6 fw-bold text-dark mb-0 text-truncate" title={zone.label}>{zone.label}</h3>
                                </div>
                                <div className="mt-2 d-flex align-items-end justify-content-between">
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="h4 mb-0 font-monospace fw-bold text-dark tracking-tight">
                                                {timeStr}
                                            </div>
                                            <button 
                                                onClick={() => handleCopy(timeStr, zone.id)}
                                                className="btn btn-link text-muted p-0"
                                                title="Copy time"
                                            >
                                                {copiedZoneId === zone.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                        <div className="text-muted fw-medium d-flex align-items-center gap-2" style={{fontSize: '0.75rem'}}>
                                            {dateStr}
                                            {dayDiff && <span className="badge bg-light text-dark border px-1" style={{fontSize: '0.65rem'}}>{dayDiff}</span>}
                                        </div>
                                    </div>
                                    <div className={`p-1 rounded-circle ${isDay ? 'bg-warning-subtle text-warning-emphasis' : 'bg-indigo-subtle text-indigo'}`} style={{backgroundColor: isDay ? '#fff3cd' : '#e0cffc', color: isDay ? '#664d03' : '#3d0a91'}}>
                                        <Clock size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};