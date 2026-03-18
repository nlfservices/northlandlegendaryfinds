/**
 * Submit Your Show - Form for promoters to submit card shows to the directory
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  Calendar, MapPin, Users, Clock, DollarSign, Globe, Mail, Phone,
  Building, FileText, ArrowLeft, Send, CheckCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" }, { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" }, { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" }, { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" }, { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" }, { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" }, { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" }, { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" }, { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" }, { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function SubmitShow() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    showName: "",
    promoterName: "",
    email: "",
    phone: "",
    website: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    startDate: "",
    endDate: "",
    hours: "",
    tableCount: "",
    admission: "",
    description: "",
    isRecurring: false,
    recurrenceNote: "",
  });

  const submitMutation = trpc.public.cardShows.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Show submitted successfully! We'll review it shortly.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit show. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.showName || !form.promoterName || !form.email || !form.city || !form.state || !form.startDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const startTs = new Date(form.startDate + "T12:00:00").getTime();
    const endTs = form.endDate
      ? new Date(form.endDate + "T12:00:00").getTime()
      : startTs;

    submitMutation.mutate({
      showName: form.showName,
      promoterName: form.promoterName,
      email: form.email,
      phone: form.phone || undefined,
      website: form.website || undefined,
      venue: form.venue || undefined,
      address: form.address || undefined,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode || undefined,
      startDate: startTs,
      endDate: endTs,
      hours: form.hours || undefined,
      tableCount: form.tableCount ? parseInt(form.tableCount) : undefined,
      admission: form.admission || undefined,
      description: form.description || undefined,
      isRecurring: form.isRecurring,
      recurrenceNote: form.recurrenceNote || undefined,
    });
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <SEO
          title="Show Submitted — Card Shows Directory"
          description="Your card show has been submitted for review."
          path="/submit-show"
        />
        <div className="container max-w-2xl py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            SHOW <span className="text-primary">SUBMITTED!</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for submitting your card show! Our team will review it and add it to the directory shortly.
            You'll receive a confirmation email once your show is approved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/card-shows">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
              </Button>
            </Link>
            <Button onClick={() => { setSubmitted(false); setForm({ showName: "", promoterName: "", email: "", phone: "", website: "", venue: "", address: "", city: "", state: "", zipCode: "", startDate: "", endDate: "", hours: "", tableCount: "", admission: "", description: "", isRecurring: false, recurrenceNote: "" }); }}>
              Submit Another Show
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Submit Your Card Show — Card Shows Directory"
        description="Submit your sports card show, trading card expo, or collectibles convention to our directory. Reach thousands of collectors looking for events near them."
        path="/submit-show"
      />

      {/* Header */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-3xl">
          <Link href="/card-shows" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Card Shows Directory
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            SUBMIT YOUR <span className="text-primary">SHOW</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Are you a show promoter or organizer? Add your card show to our directory and reach thousands
            of collectors looking for events near them. All submissions are reviewed before being published.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Show Details */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Show Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="showName">Show Name *</Label>
                  <Input
                    id="showName"
                    placeholder="e.g., Dallas Card Show"
                    value={form.showName}
                    onChange={e => updateField("showName", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={e => updateField("startDate", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date (leave blank if single-day)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={e => updateField("endDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hours">Hours of Operation</Label>
                  <Input
                    id="hours"
                    placeholder="e.g., Sat 9am-4pm; Sun 10am-3pm"
                    value={form.hours}
                    onChange={e => updateField("hours", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tableCount">Number of Tables</Label>
                    <Input
                      id="tableCount"
                      type="number"
                      placeholder="e.g., 100"
                      value={form.tableCount}
                      onChange={e => updateField("tableCount", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admission">Admission Price</Label>
                    <Input
                      id="admission"
                      placeholder="e.g., FREE, $5, $10 adults / $5 kids"
                      value={form.admission}
                      onChange={e => updateField("admission", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isRecurring"
                    checked={form.isRecurring}
                    onCheckedChange={(checked) => updateField("isRecurring", !!checked)}
                  />
                  <Label htmlFor="isRecurring" className="cursor-pointer">This is a recurring show</Label>
                </div>

                {form.isRecurring && (
                  <div>
                    <Label htmlFor="recurrenceNote">Recurrence Schedule</Label>
                    <Input
                      id="recurrenceNote"
                      placeholder="e.g., First Sunday of every month"
                      value={form.recurrenceNote}
                      onChange={e => updateField("recurrenceNote", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Location
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="venue">Venue Name</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Convention Center, VFW Hall, Elks Lodge"
                    value={form.venue}
                    onChange={e => updateField("venue", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main St"
                    value={form.address}
                    onChange={e => updateField("address", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={form.city}
                      onChange={e => updateField("city", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={form.state} onValueChange={v => updateField("state", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP"
                      value={form.zipCode}
                      onChange={e => updateField("zipCode", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="promoterName">Promoter / Organizer Name *</Label>
                  <Input
                    id="promoterName"
                    placeholder="Your name or organization"
                    value={form.promoterName}
                    onChange={e => updateField("promoterName", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => updateField("email", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="555-123-4567"
                      value={form.phone}
                      onChange={e => updateField("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Show Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourshow.com"
                    value={form.website}
                    onChange={e => updateField("website", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Additional Information
              </h2>

              <div>
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your show — special guests, featured vendors, autograph signings, Pokemon/TCG tournaments, etc."
                  value={form.description}
                  onChange={e => updateField("description", e.target.value)}
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Max 2,000 characters</p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitMutation.isPending}
                className="bg-primary hover:bg-primary/90 font-bold text-lg px-8"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Submit Show
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                All submissions are reviewed before being published. We typically review within 24-48 hours.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
