"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent, Input } from "@/components/ui";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50 py-12">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-secondary-900">
              Message Sent!
            </h2>
            <p className="mb-6 text-secondary-600">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button
              variant="primary"
              onClick={() => setIsSubmitted(false)}
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-xl text-secondary-600">
              We're here to help. Reach out with any questions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Mail className="mb-4 h-8 w-8 text-primary-600" />
                  <h3 className="mb-2 font-bold text-secondary-900">Email</h3>
                  <p className="text-sm text-secondary-600">
                    <a
                      href="mailto:hello@jobportal.com"
                      className="text-primary-600 hover:underline"
                    >
                      hello@jobportal.com
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Phone className="mb-4 h-8 w-8 text-primary-600" />
                  <h3 className="mb-2 font-bold text-secondary-900">Phone</h3>
                  <p className="text-sm text-secondary-600">
                    <a
                      href="tel:+15551234567"
                      className="text-primary-600 hover:underline"
                    >
                      (555) 123-4567
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-secondary-500">
                    Mon-Fri, 9am-6pm EST
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <MapPin className="mb-4 h-8 w-8 text-primary-600" />
                  <h3 className="mb-2 font-bold text-secondary-900">Office</h3>
                  <p className="text-sm text-secondary-600">
                    123 Tech Street
                    <br />
                    San Francisco, CA 94105
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="mb-6 text-2xl font-bold text-secondary-900">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-secondary-700">
                          Name *
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-secondary-700">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="company" className="mb-2 block text-sm font-medium text-secondary-700">
                          Company
                        </label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-secondary-700">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-medium text-secondary-700">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium text-secondary-700">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="w-full rounded-lg border-2 border-secondary-200 p-3 focus:border-primary-600 focus:outline-none"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
