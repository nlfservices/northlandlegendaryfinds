/**
 * Star Wars Checklist Page - Shows boxes 1-100 for each product
 */

import { useParams, Link } from "wouter";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const productNames: Record<string, string> = {
  "starwars-entry-vault": "Star Wars Entry Vault",
  "starwars-core-vault": "Star Wars Core Vault",
  "starwars-prime-vault": "Star Wars Prime Vault",
  "starwars-premium-vault": "Star Wars Premium Vault",
  "starwars-legendary-vault": "Star Wars Legendary Vault",
};

export default function StarWarsChecklist() {
  const params = useParams();
  const productId = params.productId as string;
  const productName = productNames[productId] || "Star Wars Product";

  // Generate boxes 1-100
  const boxes = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/starwars">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Star Wars Collection
            </Button>
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-4 glow-teal">
                {productName}
              </h1>
              <p className="text-xl text-muted-foreground">
                Checklist: Boxes 1-100
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This list will be updated as boxes are opened and contents are revealed
              </p>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Master List
            </Button>
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {boxes.map((boxNum) => (
              <div
                key={boxNum}
                className="aspect-square bg-sidebar/30 rounded-lg border-2 border-border hover:border-accent transition-all flex items-center justify-center cursor-pointer group"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent group-hover:glow-teal transition-all">
                    #{boxNum}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    TBA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4">About This Checklist</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This checklist shows all 100 boxes in this {productName} run. Each box is numbered
              and will be filled with the actual card contents once the boxes are opened.
            </p>
            <p>
              <strong>Current Status:</strong> Pre-release - Contents to be revealed
            </p>
            <p>
              <strong>Run Size:</strong> 100 boxes total
            </p>
            <p>
              <strong>Transparency Guarantee:</strong> Every box's contents will be publicly listed
              here after opening, ensuring complete transparency in our repack process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
