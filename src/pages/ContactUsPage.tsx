import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ContactUsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'news-tip',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.contactUs}
        description="Contact NEWSORA newsroom, submit verified tips, press releases, or connect with our Grievance Redressal Officer."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.contactUs }]} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {/* Newsroom Details */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white pb-2 border-b border-slate-100 dark:border-navy-800">
                Newsroom Desk
              </h2>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Mail className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-navy-950 dark:text-white">Editorial Inquiries:</span>
                  <a href="mailto:editor@newsora.in" className="text-brand-500 hover:underline">
                    editor@newsora.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Phone className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-navy-950 dark:text-white">Desk WhatsApp Hotline:</span>
                  <span className="text-slate-600 dark:text-slate-300">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-navy-950 dark:text-white">Principal Newsroom:</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Bandra Kurla Complex, Mumbai, Maharashtra 400051, India
                  </span>
                </div>
              </div>
            </div>

            {/* Grievance Officer Compliance Card */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                <Shield className="w-4 h-4" />
                <span>Grievance Redressal</span>
              </div>
              <p className="text-amber-800 dark:text-amber-400">
                In compliance with the IT Rules 2021, grievances regarding published content can be emailed to:
              </p>
              <p className="font-mono text-amber-950 dark:text-amber-200 font-semibold">
                grievance@newsora.in
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-6 shadow-sm">
              <h2 className="font-headline font-bold text-xl text-navy-950 dark:text-white mb-2">
                Send a News Tip or Inquiry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Have verified information, documents, or an original report? Send it securely to our journalists.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
                    Thank You for Your Submission
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Your message has been received by the NEWSORA desk. A correspondent will verify your tip shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', subject: 'news-tip', message: '' });
                    }}
                    className="mt-4 px-4 py-2 bg-slate-100 dark:bg-navy-800 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
                  >
                    Submit Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Your Name / Pseudonym
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anand Sharma"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address (Confidential)
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. anand@example.com"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                    >
                      <option value="news-tip">Submit an Investigative Tip</option>
                      <option value="correction">Request an Editorial Correction</option>
                      <option value="press-release">Press Release / Media Advisory</option>
                      <option value="general">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Message / Fact Summary
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Provide details, dates, source links, or background context..."
                      className="w-full p-3 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Newsroom</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
