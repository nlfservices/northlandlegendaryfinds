/**
 * CSV Upload Component
 * Drag-and-drop file upload with CSV/XLSX parsing
 * Provides template download and preview before import
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Download, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface CsvColumn {
  key: string;
  label: string;
  required?: boolean;
}

interface CsvUploaderProps {
  columns: CsvColumn[];
  templateName: string;
  onImport: (rows: Record<string, string>[]) => Promise<{ success: boolean; count?: number; errors?: string[] }>;
  title: string;
  description: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = "";
      } else if (char === '\n' || (char === '\r' && next === '\n')) {
        row.push(current.trim());
        if (row.some(cell => cell !== "")) rows.push(row);
        row = [];
        current = "";
        if (char === '\r') i++;
      } else {
        current += char;
      }
    }
  }
  // Last row
  row.push(current.trim());
  if (row.some(cell => cell !== "")) rows.push(row);

  return rows;
}

export default function CsvUploader({ columns, templateName, onImport, title, description }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; errors?: string[] } | null>(null);
  const [parseError, setParseError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setParseError("");
    setResult(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const rawRows = parseCSV(text);

      if (rawRows.length < 2) {
        setParseError("File must have a header row and at least one data row.");
        return;
      }

      // Map headers to column keys
      const headers = rawRows[0].map(h => h.toLowerCase().trim());
      const headerMap = new Map<number, string>();

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        // Try exact match first, then partial match
        for (const col of columns) {
          if (
            header === col.key.toLowerCase() ||
            header === col.label.toLowerCase() ||
            header.includes(col.key.toLowerCase()) ||
            col.label.toLowerCase().includes(header)
          ) {
            headerMap.set(i, col.key);
            break;
          }
        }
      }

      // Also try common aliases
      const aliases: Record<string, string[]> = {
        cardName: ["card name", "card", "name", "character", "character / player", "player"],
        cardSet: ["set", "card set", "product set"],
        cardYear: ["year", "card year"],
        cardNumber: ["card #", "card number", "number", "#", "card#"],
        parallel: ["parallel", "parallel / variant", "variant"],
        tier: ["tier", "level", "rarity", "type", "card type"],
        estimatedValue: ["value", "est. value", "estimated value", "est value", "price", "current value"],
        imageUrl: ["image", "image url", "imageurl", "image_url", "card image", "photo", "picture"],
        pulled: ["pulled", "is pulled", "ispulled", "removed", "sold", "mark pulled"],
        packNumber: ["pack", "pack #", "pack number"],
        pulledBy: ["pulled by", "customer", "buyer", "winner"],
        notes: ["notes", "note", "comments"],
      };

      for (let i = 0; i < headers.length; i++) {
        if (headerMap.has(i)) continue;
        const header = headers[i];
        for (const [key, aliasList] of Object.entries(aliases)) {
          if (aliasList.some(a => header === a || header.includes(a))) {
            if (columns.some(c => c.key === key)) {
              headerMap.set(i, key);
              break;
            }
          }
        }
      }

      // Parse data rows
      const dataRows: Record<string, string>[] = [];
      for (let r = 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        const obj: Record<string, string> = {};
        let hasData = false;

        for (const [colIdx, key] of Array.from(headerMap.entries())) {
          const val = row[colIdx]?.trim() || "";
          if (val) {
            obj[key] = val;
            hasData = true;
          }
        }

        if (hasData && obj.cardName) {
          dataRows.push(obj);
        }
      }

      if (dataRows.length === 0) {
        setParseError("No valid data rows found. Make sure the first column is 'Card Name' and has data.");
        return;
      }

      setParsedRows(dataRows);
    } catch (e: any) {
      setParseError(`Failed to parse file: ${e.message}`);
    }
  }, [columns]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt'))) {
      handleFile(file);
    } else {
      setParseError("Please upload a .csv file");
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    setImporting(true);
    setResult(null);
    try {
      const res = await onImport(parsedRows);
      setResult(res);
      if (res.success) {
        setParsedRows([]);
        setFileName("");
      }
    } catch (e: any) {
      setResult({ success: false, errors: [e.message || "Import failed"] });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const header = columns.map(c => c.label).join(",");
    const exampleRow = columns.map(c => {
      const examples: Record<string, string> = {
        cardName: "Spider-Man",
        cardSet: "2024 Topps Chrome",
        cardYear: "2024",
        cardNumber: "#42",
        parallel: "Gold Refractor /50",
        tier: "Top Hits",
        estimatedValue: "$50-$100",
        imageUrl: "https://example.com/card-image.jpg",
        pulled: "NO",
        packNumber: "1",
        pulledBy: "John D.",
        notes: "Great pull!",
      };
      return examples[c.key] || "";
    }).join(",");

    const csv = `${header}\n${exampleRow}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setParsedRows([]);
    setFileName("");
    setResult(null);
    setParseError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" /> Download Template
        </Button>
      </div>

      {/* Result Banner */}
      {result && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <div>
            {result.success ? (
              <p className="text-green-400 font-medium">Successfully imported {result.count} items!</p>
            ) : (
              <div>
                <p className="text-red-400 font-medium">Import failed</p>
                {result.errors?.map((err, i) => (
                  <p key={i} className="text-sm text-red-400/80">{err}</p>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto shrink-0" onClick={() => setResult(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Drop Zone */}
      {parsedRows.length === 0 && (
        <>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-card'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              className="hidden"
              onChange={handleFileInput}
            />
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">
              {isDragging ? "Drop your CSV file here" : "Drag & drop a CSV file, or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported: .csv files. Download the template above for the correct format.
            </p>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {parseError}
            </div>
          )}
        </>
      )}

      {/* Preview */}
      {parsedRows.length > 0 && (
        <Card>
          <CardContent className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-muted-foreground">{parsedRows.length} rows ready to import</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleImport} disabled={importing}>
                  {importing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                  Import {parsedRows.length} Items
                </Button>
              </div>
            </div>

            {/* Preview Table */}
            <ScrollArea className="h-[300px] rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium text-muted-foreground">#</th>
                    {columns.filter(c => parsedRows.some(r => r[c.key])).map(col => (
                      <th key={col.key} className="text-left p-2 font-medium text-muted-foreground">
                        {col.label}
                        {col.required && <span className="text-red-400 ml-1">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30">
                      <td className="p-2 text-muted-foreground">{i + 1}</td>
                      {columns.filter(c => parsedRows.some(r => r[c.key])).map(col => (
                        <td key={col.key} className="p-2">
                          {col.key === "tier" && row[col.key] ? (
                            <Badge variant="outline" className="text-xs">
                              {row[col.key]}
                            </Badge>
                          ) : (
                            row[col.key] || <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 50 && (
                <div className="p-3 text-center text-sm text-muted-foreground border-t border-border">
                  Showing first 50 of {parsedRows.length} rows
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
