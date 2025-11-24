import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
// @ts-ignore
import { load, dump } from 'js-yaml';

type Format = 'JSON' | 'XML' | 'CSV' | 'YAML';

export const DataConverterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [inputFormat, setInputFormat] = useState<Format>('JSON');
  const [outputFormat, setOutputFormat] = useState<Format>('YAML');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const parseXmlToJson = (xml: string): any => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) throw new Error('Invalid XML Structure');

    function nodeToObj(node: Element): any {
        let obj: any = {};
        if (node.attributes.length > 0) {
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                obj[`@${attr.name}`] = attr.value;
            }
        }
        if (node.children.length === 0) {
            const text = node.textContent?.trim();
            if (Object.keys(obj).length === 0) return text || null;
            if (text) obj['#text'] = text;
        } else {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const childName = child.nodeName;
                const childObj = nodeToObj(child);
                if (obj[childName]) {
                    if (!Array.isArray(obj[childName])) {
                        obj[childName] = [obj[childName]];
                    }
                    obj[childName].push(childObj);
                } else {
                    obj[childName] = childObj;
                }
            }
        }
        return obj;
    }
    const root = doc.documentElement;
    return { [root.nodeName]: nodeToObj(root) };
  };

  const jsonToXml = (obj: any): string => {
    function toXml(o: any, name?: string): string {
        if (o === null || o === undefined) return '';
        if (typeof o !== 'object') return `<${name}>${o}</${name}>`;
        if (Array.isArray(o)) {
            return o.map(item => toXml(item, name)).join('');
        }
        let xml = '';
        const keys = Object.keys(o);
        if (!name) {
             return keys.map(key => toXml(o[key], key)).join('');
        }
        xml += `<${name}`;
        const contentKeys = keys.filter(k => !k.startsWith('@'));
        keys.filter(k => k.startsWith('@')).forEach(k => {
            xml += ` ${k.substring(1)}="${o[k]}"`;
        });
        if (contentKeys.length === 0 && !o['#text']) {
            xml += '/>';
            return xml;
        }
        xml += '>';
        if (o['#text']) {
            xml += o['#text'];
        }
        contentKeys.forEach(k => {
            if (k !== '#text') {
                xml += toXml(o[k], k);
            }
        });
        xml += `</${name}>`;
        return xml;
    }
    return toXml(obj);
  };

  const parseCSV = (text: string) => {
    const result: string[][] = [];
    let row: string[] = [];
    let inQuote = false;
    let current = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      
      if (inQuote) {
        if (char === '"' && next === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuote = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuote = true;
        } else if (char === ',') {
          row.push(current);
          current = '';
        } else if (char === '\n' || (char === '\r' && next === '\n')) {
          if (char === '\r') i++;
          row.push(current);
          result.push(row);
          row = [];
          current = '';
        } else {
          current += char;
        }
      }
    }
    if (current || row.length > 0) {
        row.push(current);
        result.push(row);
    }
    if(result.length < 2) return [];
    const headers = result[0].map(h => h.trim());
    return result.slice(1).map(r => {
        const obj: any = {};
        headers.forEach((h, idx) => {
            obj[h] = r[idx] !== undefined ? r[idx] : '';
        });
        return obj;
    });
  };

  const jsonToCsv = (items: any[]): string => {
    if (!Array.isArray(items) || items.length === 0) return '';
    const allKeys = new Set<string>();
    items.forEach(item => {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(k => allKeys.add(k));
        }
    });
    const headers = Array.from(allKeys);
    const csvRows = [
      headers.join(','),
      ...items.map(row => headers.map(fieldName => {
        const val = (row as any)[fieldName] ?? '';
        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','))
    ];
    return csvRows.join('\n');
  };

  useEffect(() => {
    setError(null);
    if (!input.trim()) {
        setOutput('');
        return;
    }
    const convert = async () => {
        try {
            let data: any;
            switch (inputFormat) {
                case 'JSON': data = JSON.parse(input); break;
                case 'YAML': data = load(input); break;
                case 'CSV': data = parseCSV(input); break;
                case 'XML': data = parseXmlToJson(input); break;
            }
            let result = '';
            switch (outputFormat) {
                case 'JSON': result = JSON.stringify(data, null, 2); break;
                case 'YAML': result = dump(data); break;
                case 'CSV':
                    if (Array.isArray(data)) {
                         result = jsonToCsv(data);
                    } else {
                         result = jsonToCsv([data]);
                    }
                    break;
                case 'XML': result = jsonToXml(data); break;
            }
            setOutput(result);
        } catch (err: any) {
            setError(err.message || 'Conversion failed');
        }
    };
    const timer = setTimeout(convert, 500);
    return () => clearTimeout(timer);
  }, [input, inputFormat, outputFormat]);

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
        <h2 className="h3 fw-bold text-dark mb-0">Data Converter</h2>
        <div className="d-flex align-items-center gap-2 small text-muted d-none d-md-flex">
            <span>JSON</span> <ArrowRightLeft size={14} /> <span>YAML</span> <ArrowRightLeft size={14} /> <span>XML</span> <ArrowRightLeft size={14} /> <span>CSV</span>
        </div>
      </div>

      <div className="row g-4 flex-grow-1 min-height-0">
        
        {/* Input Section */}
        <div className="col-lg-6 d-flex flex-column h-100">
            <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded border mb-2">
                <label className="small fw-bold text-secondary text-uppercase px-2 mb-0">Input</label>
                <select 
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as Format)}
                    className="form-select form-select-sm w-auto"
                >
                    <option value="JSON">JSON</option>
                    <option value="YAML">YAML</option>
                    <option value="XML">XML</option>
                    <option value="CSV">CSV</option>
                </select>
            </div>
            
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your ${inputFormat} here...`}
                className="form-control flex-grow-1 shadow-sm"
                style={{ resize: 'none' }}
                spellCheck={false}
            />
        </div>

        {/* Output Section */}
        <div className="col-lg-6 d-flex flex-column h-100 position-relative">
             <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded border mb-2">
                <div className="d-flex align-items-center gap-2">
                    <label className="small fw-bold text-secondary text-uppercase px-2 mb-0">Output</label>
                     <select 
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as Format)}
                        className="form-select form-select-sm w-auto"
                    >
                        <option value="JSON">JSON</option>
                        <option value="YAML">YAML</option>
                        <option value="XML">XML</option>
                        <option value="CSV">CSV</option>
                    </select>
                </div>

                {output && (
                <button 
                    onClick={handleCopy}
                    className="btn btn-sm btn-white border d-flex align-items-center gap-1"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                )}
            </div>
            
            <div className={`flex-grow-1 position-relative border rounded overflow-hidden ${error ? 'border-danger bg-danger-subtle' : 'bg-light'}`}>
                 {error ? (
                    <div className="position-absolute top-0 start-0 p-3 text-danger fw-medium small font-monospace">
                        Error: {error}
                    </div>
                    ) : (
                    <textarea
                        readOnly
                        value={output}
                        className="form-control h-100 bg-transparent border-0 shadow-none"
                        style={{ resize: 'none' }}
                        placeholder="Result will appear here..."
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};