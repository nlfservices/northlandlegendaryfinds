/**
 * ExcelUploader - Import checklist cards from Excel (.xlsx) spreadsheets
 * 
 * Supports the NLF pack checklist format:
 *   Pack #, Tier ($), Card Description, Character, Set, Grade / Type, Estimated Value ($), Pulled (Yes/No)
 * 
 * Also auto-detects generic column headers for flexibility.
 */
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  FileSpreadsheet, Upload, CheckCircle2, AlertTriangle,
  Loader2, X, ArrowRight, Eye, Download
} from "lucide-react";
import * as XLSX from "xlsx";

// ==================== TYPES ====================

interface ParsedRow {
  packNumber?: string;
  tier?: string;
  cardDescription?: string;
  character?: string;
  set?: string;
  gradeType?: string;
  estimatedValue?: string;
  pulled?: string;
}

interface ColumnMapping {
  packNumber: number | null;
  tier: number | null;
  cardDescription: number | null;
  character: number | null;
  set: number | null;
  gradeType: number | null;
  estimatedValue: number | null;
  pulled: number | null;
}

interface MappedCard {
  cardName: string;
  cardSet: string;
  cardNumber: string;
  parallel: string;
  tier: "chase" | "hit" | "base" | "bonus";
  estimatedValue: string;
  cardCondition: string;
  sortOrder: number;
}

interface ExcelUploaderProps {
  onImport: (cards: MappedCard[]) => void;
  isImporting?: boolean;
}

// ==================== TIER MAPPING ====================

const TIER_MAP: Record<string, "chase" | "hit" | "base" | "bonus"> = {
  "a": "chase",
  "b": "hit",
  "c": "base",
  "d": "base",
  "e": "base",
  "chase": "chase",
  "hit": "hit",
  "base": "base",
  "bonus": "bonus",
  "grail": "chase",
  "top": "chase",
  "mid": "hit",
  "middle": "hit",
  "low": "base",
  "common": "base",
};

function mapTier(tierStr: string): "chase" | "hit" | "base" | "bonus" {
  if (!tierStr) return "base";
  const lower = tierStr.toLowerCase().trim();
  // Check exact match first
  if (TIER_MAP[lower]) return TIER_MAP[lower];
  // Check if starts with a letter tier (e.g., "A - $325")
  const letterMatch = lower.match(/^([a-e])\s*[-–—]/);
  if (letterMatch) return TIER_MAP[letterMatch[1]] || "base";
  // Check for keywords
  for (const [key, value] of Object.entries(TIER_MAP)) {
    if (lower.includes(key)) return value;
  }
  return "base";
}

// ==================== COLUMN AUTO-DETECT ====================

const COLUMN_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
  packNumber: [/pack\s*#/i, /pack\s*num/i, /^#$/i, /number/i],
  tier: [/tier/i, /level/i, /rarity/i],
  cardDescription: [/card\s*desc/i, /description/i],
  character: [/character/i, /card\s*name/i, /name/i, /player/i],
  set: [/^set$/i, /card\s*set/i, /product/i, /series/i],
  gradeType: [/grade/i, /type/i, /condition/i],
  estimatedValue: [/value/i, /price/i, /est/i, /\$/i],
  pulled: [/pulled/i, /status/i, /opened/i],
};

function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    packNumber: null,
    tier: null,
    cardDescription: null,
    character: null,
    set: null,
    gradeType: null,
    estimatedValue: null,
    pulled: null,
  };

  // Track which column indices are already assigned
  const usedColumns = new Set<number>();

  // Process fields in priority order to avoid conflicts
  const fieldOrder: (keyof ColumnMapping)[] = [
    "tier", "estimatedValue", "character", "set",
    "gradeType", "cardDescription", "packNumber", "pulled"
  ];

  for (const field of fieldOrder) {
    const patterns = COLUMN_PATTERNS[field];
    for (let i = 0; i < headers.length; i++) {
      if (usedColumns.has(i)) continue; // Skip already-assigned columns
      const header = headers[i] || "";
      for (const pattern of patterns) {
        if (pattern.test(header)) {
          mapping[field] = i;
          usedColumns.add(i);
          break;
        }
      }
      if (mapping[field] !== null) break;
    }
  }

  return mapping;
}

// ==================== COMPONENT ====================

export default function ExcelUploader({ onImport, isImporting }: ExcelUploaderProps) {
  const [step, setStep] = useState<"upload" | "preview" | "mapping">("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    packNumber: null, tier: null, cardDescription: null,
    character: null, set: null, gradeType: null,
    estimatedValue: null, pulled: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSheet = useCallback((wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) return;

    const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (data.length < 2) {
      toast.error("Sheet appears empty or has no data rows");
      return;
    }

    const headerRow = data[0].map(h => String(h).trim());
    const dataRows = data.slice(1).filter(row =>
      row.some(cell => String(cell).trim() !== "")
    );

    // Filter out summary/total rows
    const filteredRows = dataRows.filter(row => {
      const firstCell = String(row[0] || "").toLowerCase();
      return !firstCell.includes("total") && !firstCell.includes("sum");
    });

    setHeaders(headerRow);
    setRawRows(filteredRows.map(row => row.map(cell => String(cell))));

    // Auto-detect column mapping
    const detected = autoDetectColumns(headerRow);
    setMapping(detected);
    setStep("preview");
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Please upload an Excel file (.xlsx, .xls) or CSV");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);

        if (wb.SheetNames.length === 1) {
          setSelectedSheet(wb.SheetNames[0]);
          processSheet(wb, wb.SheetNames[0]);
        } else {
          setSelectedSheet(wb.SheetNames[0]);
          processSheet(wb, wb.SheetNames[0]);
        }
      } catch (err) {
        toast.error("Failed to parse file. Make sure it's a valid Excel file.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [processSheet]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) processSheet(workbook, sheetName);
  };

  const getColumnValue = (row: string[], colIndex: number | null): string => {
    if (colIndex === null || colIndex < 0 || colIndex >= row.length) return "";
    return String(row[colIndex]).trim();
  };

  const getMappedCards = (): MappedCard[] => {
    return rawRows.map((row, index) => {
      const tierStr = getColumnValue(row, mapping.tier);
      const character = getColumnValue(row, mapping.character);
      const description = getColumnValue(row, mapping.cardDescription);
      const set = getColumnValue(row, mapping.set);
      const grade = getColumnValue(row, mapping.gradeType);
      const valueStr = getColumnValue(row, mapping.estimatedValue);
      const packNum = getColumnValue(row, mapping.packNumber);

      // Build card name: prefer character, fall back to description
      const cardName = character || description || `Pack ${packNum || index + 1}`;

      // Parse value - handle "$325", "325.0", "325", etc.
      const cleanValue = valueStr.replace(/[$,]/g, "").trim();
      const numValue = parseFloat(cleanValue);
      const estimatedValue = !isNaN(numValue) ? numValue.toFixed(0) : "";

      return {
        cardName,
        cardSet: set,
        cardNumber: packNum ? `#${Math.round(parseFloat(packNum))}` : "",
        parallel: description && character ? description : "",
        tier: mapTier(tierStr),
        estimatedValue,
        cardCondition: grade || "Raw",
        sortOrder: index,
      };
    }).filter(card => card.cardName && card.cardName !== "Pack NaN");
  };

  const mappedCards = step === "preview" ? getMappedCards() : [];
  const tierCounts = mappedCards.reduce((acc, c) => {
    acc[c.tier] = (acc[c.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleImport = () => {
    const cards = getMappedCards();
    if (cards.length === 0) {
      toast.error("No cards to import. Check your column mapping.");
      return;
    }
    onImport(cards);
  };

  const reset = () => {
    setStep("upload");
    setFileName("");
    setHeaders([]);
    setRawRows([]);
    setSheetNames([]);
    setSelectedSheet("");
    setWorkbook(null);
    setMapping({
      packNumber: null, tier: null, cardDescription: null,
      character: null, set: null, gradeType: null,
      estimatedValue: null, pulled: null,
    });
  };

  // ==================== UPLOAD STEP ====================

  if (step === "upload") {
    return (
      <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-colors">
        <CardContent className="py-12">
          <div
            className={`flex flex-col items-center justify-center text-center cursor-pointer transition-colors rounded-lg p-8 ${
              isDragging ? "bg-primary/5 border-primary" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Import Excel Checklist</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Upload your NLF pack checklist spreadsheet (.xlsx, .xls, or .csv).
              Columns like Pack #, Tier, Character, Set, Grade, and Value will be auto-detected.
            </p>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" /> Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==================== PREVIEW STEP ====================

  return (
    <div className="space-y-4">
      {/* File Info Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <div>
                <span className="font-medium text-sm">{fileName}</span>
                <span className="text-muted-foreground text-xs ml-2">
                  {rawRows.length} rows · {headers.length} columns
                </span>
              </div>
              {sheetNames.length > 1 && (
                <Select value={selectedSheet} onValueChange={handleSheetChange}>
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sheetNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Column Mapping */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" /> Column Mapping
            <span className="text-xs text-muted-foreground font-normal ml-2">
              Auto-detected from headers. Adjust if needed.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { key: "character", label: "Card Name / Character" },
              { key: "set", label: "Set" },
              { key: "tier", label: "Tier" },
              { key: "estimatedValue", label: "Estimated Value" },
              { key: "cardDescription", label: "Description / Parallel" },
              { key: "gradeType", label: "Grade / Condition" },
              { key: "packNumber", label: "Pack / Card #" },
              { key: "pulled", label: "Pulled Status" },
            ] as { key: keyof ColumnMapping; label: string }[]).map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <Select
                  value={mapping[key] !== null ? String(mapping[key]) : "none"}
                  onValueChange={(v) => setMapping(prev => ({
                    ...prev,
                    [key]: v === "none" ? null : parseInt(v),
                  }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Not mapped" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Not mapped —</SelectItem>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {h || `Column ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium">Import Summary:</span>
        <Badge variant="outline" className="text-xs">
          {mappedCards.length} cards total
        </Badge>
        {tierCounts.chase && (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
            {tierCounts.chase} Chase
          </Badge>
        )}
        {tierCounts.hit && (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            {tierCounts.hit} Hit
          </Badge>
        )}
        {tierCounts.base && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            {tierCounts.base} Base
          </Badge>
        )}
        {tierCounts.bonus && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            {tierCounts.bonus} Bonus
          </Badge>
        )}
      </div>

      {/* Preview Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <ScrollArea className="max-h-[400px]">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-10 text-center">#</TableHead>
                <TableHead>Card Name</TableHead>
                <TableHead>Set</TableHead>
                <TableHead className="w-16">Card #</TableHead>
                <TableHead>Parallel</TableHead>
                <TableHead className="w-20">Tier</TableHead>
                <TableHead className="w-20">Value</TableHead>
                <TableHead className="w-20">Condition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappedCards.slice(0, 50).map((card, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{card.cardName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{card.cardSet || "—"}</TableCell>
                  <TableCell className="text-sm">{card.cardNumber || "—"}</TableCell>
                  <TableCell className="text-sm text-primary">{card.parallel || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${
                      card.tier === "chase" ? "border-amber-500/50 text-amber-400" :
                      card.tier === "hit" ? "border-purple-500/50 text-purple-400" :
                      card.tier === "bonus" ? "border-green-500/50 text-green-400" :
                      "border-blue-500/50 text-blue-400"
                    }`}>
                      {card.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {card.estimatedValue ? `$${Number(card.estimatedValue).toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{card.cardCondition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {mappedCards.length > 50 && (
          <div className="text-center py-2 text-xs text-muted-foreground border-t border-border">
            Showing first 50 of {mappedCards.length} cards
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={reset} disabled={isImporting}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={isImporting || mappedCards.length === 0}
          className="bg-green-600 hover:bg-green-700 gap-2"
        >
          {isImporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Import {mappedCards.length} Cards to Checklist
        </Button>
      </div>
    </div>
  );
}
