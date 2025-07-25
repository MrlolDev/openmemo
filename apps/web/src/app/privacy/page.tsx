"use client";

import { BackgroundEffect, FadeIn, GlowCard } from "@repo/ui";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <BackgroundEffect variant="minimal" intensity="low">
      <div className="openmemo-base min-h-screen py-24 max-lg:py-20 max-md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-12">
              <h1 className="text-white text-4xl/tight font-bold tracking-tight mb-4 max-lg:text-3xl/tight openmemo-text-glow-primary">
                Privacy Policy
              </h1>
              <div className="flex justify-center mb-6">
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#A8FF00] to-transparent" />
              </div>
              <p className="text-white/70 text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <GlowCard size="lg" className="p-8 mb-8">
              <div className="prose prose-invert max-w-none">
                <div className="space-y-8">
                  {/* Introduction */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Introduction</h2>
                    <p className="text-white/80 leading-relaxed">
                      OpenMemo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our browser extension and related services. OpenMemo is a free, open-source AI memory assistant that helps sync your conversations across different AI platforms.
                    </p>
                  </section>

                  {/* Information We Collect */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Information We Collect</h2>
                    
                    <h3 className="text-white text-lg font-semibold mb-3">Personal Information</h3>
                    <p className="text-white/80 leading-relaxed mb-4">
                      We collect minimal personal information to provide our services:
                    </p>
                    <ul className="text-white/80 space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>GitHub Account Information:</strong> When you authenticate via GitHub OAuth, we collect your GitHub username, email address, and profile information necessary for authentication.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Memory Data:</strong> Conversation memories you choose to save through our extension, including text content and associated metadata (timestamps, categories, tags).</span>
                      </li>
                    </ul>

                    <h3 className="text-white text-lg font-semibold mb-3">Technical Information</h3>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Usage Analytics:</strong> Basic usage statistics to improve our service (feature usage, error logs, performance metrics).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Browser Information:</strong> Browser type, version, and extension version for compatibility and debugging purposes.</span>
                      </li>
                    </ul>
                  </section>

                  {/* How We Use Information */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">How We Use Your Information</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      We use the collected information solely to:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Provide and maintain our memory synchronization service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Authenticate and secure your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Store and retrieve your memory data across platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Improve our service and fix technical issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Communicate important service updates</span>
                      </li>
                    </ul>
                  </section>

                  {/* Data Storage and Security */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Data Storage and Security</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      Your data security is our priority:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Encryption:</strong> All data is encrypted in transit using HTTPS and at rest using industry-standard encryption</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Access Control:</strong> Only you can access your memory data through authenticated requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Data Minimization:</strong> We only collect and store data necessary for service functionality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Regular Security Audits:</strong> We regularly review and update our security practices</span>
                      </li>
                    </ul>
                  </section>

                  {/* Data Sharing */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Data Sharing and Disclosure</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      <strong>We do not sell, trade, or rent your personal information to third parties.</strong> We may share your information only in the following limited circumstances:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Service Providers:</strong> With trusted service providers who assist in operating our service (hosting, analytics) under strict confidentiality agreements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Safety and Security:</strong> To protect the rights, property, or safety of OpenMemo, our users, or others</span>
                      </li>
                    </ul>
                  </section>

                  {/* Your Rights */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Your Privacy Rights</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      You have the following rights regarding your personal information:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Access:</strong> Request access to your personal information we hold</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Correction:</strong> Request correction of inaccurate or incomplete information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Deletion:</strong> Request deletion of your personal information and memory data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Data Portability:</strong> Request export of your memory data in a portable format</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing at any time</span>
                      </li>
                    </ul>
                  </section>

                  {/* Open Source Transparency */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Open Source Transparency</h2>
                    <p className="text-white/80 leading-relaxed">
                      OpenMemo is completely open source. You can review our code, data handling practices, and security implementations on our{" "}
                      <a 
                        href="https://github.com/MrlolDev/openmemo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors"
                      >
                        GitHub repository
                      </a>
                      . This transparency ensures you can verify how your data is handled and processed.
                    </p>
                  </section>

                  {/* Data Retention */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Data Retention</h2>
                    <p className="text-white/80 leading-relaxed">
                      We retain your information only as long as necessary to provide our services. Memory data is kept until you delete it or close your account. Account information is deleted within 30 days of account closure. Analytics data is aggregated and anonymized after 12 months.
                    </p>
                  </section>

                  {/* Children's Privacy */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Children's Privacy</h2>
                    <p className="text-white/80 leading-relaxed">
                      OpenMemo is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to remove such information.
                    </p>
                  </section>

                  {/* Changes to Privacy Policy */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Changes to This Privacy Policy</h2>
                    <p className="text-white/80 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For significant changes, we may also notify users through the extension or via email.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Contact Us</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="text-white/80 space-y-2">
                      <p><strong>GitHub Issues:</strong> <a href="https://github.com/MrlolDev/openmemo/issues" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors">Report an issue</a></p>
                      <p><strong>Twitter:</strong> <a href="https://twitter.com/mrloldev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors">@mrloldev</a></p>
                    </div>
                  </section>
                </div>
              </div>
            </GlowCard>
          </FadeIn>

          {/* Back to Home */}
          <FadeIn direction="up" delay={400}>
            <div className="text-center">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8FF00]/10 hover:bg-[#A8FF00]/20 border border-[#A8FF00]/30 rounded-xl text-[#A8FF00] hover:text-[#85CC00] transition-all duration-300 font-medium openmemo-hover-lift"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </BackgroundEffect>
  );
}