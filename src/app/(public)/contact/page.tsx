"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Send } from 'lucide-react';

/* ── Clean Green Outline Icons for Contact Page ── */
const MapPinIcon = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C16.27 4 10 10.27 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.27 31.73 4 24 4Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="18" r="5" stroke="#E03B0D" strokeWidth="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6H10C7.79 6 6 7.79 6 10C6 27.67 20.33 42 38 42C40.21 42 42 40.21 42 38V34L34 30L30 34C28 33 22 28 20 18L24 14L20 6H14Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="40" height="28" rx="4" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M4 14L24 28L44 14" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M18 18C18 14.69 20.69 12 24 12C27.31 12 30 14.69 30 18C30 21.31 27.31 22 24 24V28" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="34" r="2" fill="#E03B0D" />
  </svg>
);

const FAQS = [
  {
    question: "When does checking in for the academic year begin?",
    answer: "Official check-in opens 2 weeks before the start of the academic semester. Late check-ins can be arranged by notifying the reception desks 48 hours in advance."
  },
  {
    question: "Do you offer roommate matching services?",
    answer: "Yes. For 2-in-a-room and 3-in-a-room suites, during the onboarding profile setup, you can indicate roommate preferences (such as university, level, study habits) and we'll match you accordingly."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Momo Transfers, Bank Transfers, and Cash."
  },
  {
    question: "Can I pay in installments?",
    answer: "Yes, you can coordinate payment installments directly with the Xtracity administration team after your online application is submitted and confirmed."
  },
  {
    question: "Are utility bills included in the semester price?",
    answer: "Absolutely. High-speed fiber internet, generator fuel backup, daily campus shuttle service, water supply, and general maintenance costs are 100% covered in your semester fee. There are no hidden charges."
  },
  {
    question: "Can I leave my belongings in the room during the long vacation?",
    answer: "Yes, we offer secure luggage storage facilities for returning residents during the long break. Please contact the front desk at the end of the semester to make arrangements."
  },
  {
    question: "Are there designated study areas apart from my room?",
    answer: "Yes! We have dedicated, air-conditioned study lounges on every floor equipped with high-speed Wi-Fi and comfortable seating to support your academic work."
  },
  {
    question: "Is there currently any construction or expansion happening at the hostel?",
    answer: "Yes, we are currently expanding our facilities to serve you better and provide more amenities. While there is ongoing construction, we have structured the schedule and taken measures to minimize any disruption to your stay and daily activities."
  }
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl space-y-24">
      {/* 1. Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact Us & FAQs
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Have questions or want to schedule a physical tour of the hostel? Reach out to our front desk team.
        </p>
      </div>

      {/* 2. Form & Direct Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info list */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Get in Touch Directly</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
              Our support desk is open Monday to Friday, 8:00 AM - 5:00 PM. For emergency maintenance calls, residents can contact the warden 24/7.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#FDECE8] dark:bg-emerald-900/30 rounded-xl shrink-0">
                <MapPinIcon />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Location Address</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                  Cosway Down, Agbogba<br />
                  P.O.Box WY 2630, Dome-Kwabenya, Accra, Ghana.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#FDECE8] dark:bg-emerald-900/30 rounded-xl shrink-0">
                <PhoneIcon />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Phone Contacts</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                  General Manager: Mr. Paah Kwesi — +233 244526110 <br />
                  Asst. Manager: Mr. George Yeboah — +233 531211028 <br />
                  Asst. Manager: Mr. Bismark Amponsah — +233 207183019
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#FDECE8] dark:bg-emerald-900/30 rounded-xl shrink-0">
                <MailIcon />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Email Address</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  xtracityhostels@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form card */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Send us a Message</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              We usually respond to inquiry submissions within 4 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs p-4 rounded-xl text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <div>
                  <span className="font-bold block text-slate-900">Message Sent Successfully!</span>
                  Thank you for reaching out. A representative will email you shortly.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-800 dark:text-slate-200">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-bold text-slate-800 dark:text-slate-200">Message / Tell us about your inquiry</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    className="w-full text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E03B0D] focus:border-[#E03B0D] resize-y"
                    placeholder="I would like to inquire about..."
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl">
                     {error}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E03B0D] text-white font-bold text-sm rounded-full py-3.5 hover:bg-[#A12808] flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-[#E03B0D]/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry →</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2.5 Google Map Location Section */}
      <section className="space-y-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Find Our Location
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            We are situated on Cosway St in Agbogba, near Academic City University. Stop by for a walk-in tour!
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-2xl max-w-4xl mx-auto">
          <CardContent className="p-0 h-[400px] w-full relative">
            <iframe
              src="https://maps.google.com/maps?q=Xtracity%20Hostels%20and%20Apartments,%20Cosway%20St,%20Agbogba,%20Accra&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Xtracity Hostel Location Map"
              className="absolute inset-0 w-full h-full"
            />
          </CardContent>
        </Card>
      </section>

      {/* 3. FAQ Section */}
      <section id="faq" className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <HelpIcon />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Quick answers to the most common queries raised by prospective residents and parents.
          </p>
        </div>

        <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => (
            <details key={idx} className="group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-slate-900 dark:text-white text-sm md:text-base list-none hover:text-[#E03B0D] transition-colors [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="transition group-open:rotate-180 bg-[#E03B0D]/10 text-[#E03B0D] p-1.5 rounded-full ml-4 shrink-0">
                  <svg fill="none" height="16" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
