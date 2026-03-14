/**
 * Contact Page - Contact form and information
 */

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center space-bg overflow-hidden">
        <div className="container relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 glow-green">
            CONTACT US
          </h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg glow-purple">
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Whether you have questions about our products, need help with an order, 
                  or just want to chat about trading cards, we're here for you!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <a 
                      href="mailto:info@nlfservices.com" 
                      className="text-primary hover:underline"
                    >
                      info@nlfservices.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <a 
                      href="tel:+15551234567" 
                      className="text-secondary hover:underline"
                    >
                      (555) 123-4567
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mon-Fri, 9am-5pm CST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Northland, USA
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Serving collectors nationwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg glow-teal">
                <h3 className="font-bold text-xl mb-3">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-bold text-foreground">9am - 5pm CST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-bold text-foreground">10am - 2pm CST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-bold text-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-primary">
                How long does shipping take?
              </h3>
              <p className="text-muted-foreground">
                Orders ship within 24 hours of purchase. Delivery typically takes 3-5 business days 
                within the continental US. Free shipping on orders over $199!
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-primary">
                Are all cards authentic?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! Every card we sell is 100% authentic from official Topps releases. 
                We never sell counterfeits or unauthorized reproductions.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-primary">
                What's your return policy?
              </h3>
              <p className="text-muted-foreground">
                We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, 
                contact us for a full refund or exchange.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2 text-primary">
                Do you offer wholesale pricing?
              </h3>
              <p className="text-muted-foreground">
                Yes! We work with card shops and resellers. Contact us at wholesale@nlfservices.com 
                for bulk pricing information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
