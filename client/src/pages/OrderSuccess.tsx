/**
 * OrderSuccess - Displayed after successful Stripe checkout
 * Shows order confirmation details
 */

import { Link, useSearch } from "wouter";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");

  const { data: order, isLoading } = trpc.checkout.getOrderBySession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="container max-w-lg">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            ORDER <span className="text-primary">CONFIRMED!</span>
          </h1>

          <p className="text-muted-foreground mb-8">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>

          {/* Order Details */}
          {isLoading ? (
            <div className="bg-muted rounded-xl p-6 mb-8">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ) : order ? (
            <div className="bg-muted rounded-xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order Status</span>
                <span className="text-sm font-bold text-green-400 uppercase">{order.status}</span>
              </div>
              {order.customerName && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{order.customerName}</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{order.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-bold text-primary">
                  ${(order.amountCents / 100).toFixed(2)} {order.currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="text-sm font-medium">{order.quantity} pack{order.quantity > 1 ? "s" : ""}</span>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground">
                Your order is being processed. You'll receive a confirmation email shortly.
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              What Happens Next
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                You'll receive an email confirmation with your order details
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                Your pack will be hand-prepared and quality checked
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                We'll ship within 24 hours and send you tracking info
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                Check our checklists to see what cards are in your pack!
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/checklists" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">
                View Checklists
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
