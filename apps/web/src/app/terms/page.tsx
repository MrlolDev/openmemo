"use client";

import { BackgroundEffect, FadeIn, GlowCard } from "@repo/ui";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <BackgroundEffect variant="minimal" intensity="low">
      <div className="openmemo-base min-h-screen py-24 max-lg:py-20 max-md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-12">
              <h1 className="text-white text-4xl/tight font-bold tracking-tight mb-4 max-lg:text-3xl/tight openmemo-text-glow-primary">
                Terms of Service
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
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Agreement to Terms</h2>
                    <p className="text-white/80 leading-relaxed">
                      These Terms of Service ("Terms") govern your use of the OpenMemo browser extension and related services operated by the OpenMemo team ("we," "us," or "our"). By accessing or using OpenMemo, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use our service.
                    </p>
                  </section>

                  {/* Service Description */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Description of Service</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      OpenMemo is a free, open-source browser extension that provides AI memory management capabilities. Our service includes:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Memory synchronization across supported AI platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Conversation storage and retrieval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Memory categorization and organization tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Cross-platform memory access</span>
                      </li>
                    </ul>
                  </section>

                  {/* User Accounts */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">User Accounts</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      To use OpenMemo, you must:
                    </p>
                    <ul className="text-white/80 space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Create an account through GitHub OAuth authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Provide accurate and complete registration information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Maintain the security of your account credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Be at least 13 years old (or the minimum age in your jurisdiction)</span>
                      </li>
                    </ul>
                    <p className="text-white/80 leading-relaxed">
                      You are responsible for all activities that occur under your account and for maintaining the confidentiality of your authentication tokens.
                    </p>
                  </section>

                  {/* Acceptable Use */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Acceptable Use</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      You agree to use OpenMemo only for lawful purposes and in accordance with these Terms. You agree NOT to:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Use the service for any unlawful or fraudulent purpose</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Store or transmit malicious code, viruses, or harmful content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Attempt to gain unauthorized access to our systems or other users' data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Reverse engineer, decompile, or disassemble the service (except as permitted by open source license)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Use the service to spam, harass, or abuse others</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Violate any applicable laws or regulations</span>
                      </li>
                    </ul>
                  </section>

                  {/* Content and Data */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Your Content and Data</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      <strong>You retain ownership of all content and data you store in OpenMemo.</strong> By using our service, you grant us a limited license to:
                    </p>
                    <ul className="text-white/80 space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Store and process your memory data to provide the service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Sync your data across different AI platforms as requested</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Make backups for data protection and recovery</span>
                      </li>
                    </ul>
                    <p className="text-white/80 leading-relaxed mb-4">
                      You are responsible for:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Ensuring you have the right to store and share any content you upload</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Not storing sensitive personal information, passwords, or confidential data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Complying with all applicable privacy laws and third-party terms</span>
                      </li>
                    </ul>
                  </section>

                  {/* Open Source License */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Open Source License</h2>
                    <p className="text-white/80 leading-relaxed">
                      OpenMemo is open source software available under the MIT License. You can view, modify, and distribute the source code according to the terms of this license. The source code is available on our{" "}
                      <a 
                        href="https://github.com/MrlolDev/openmemo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors"
                      >
                        GitHub repository
                      </a>
                      . These Terms of Service apply to the hosted service, while the MIT License governs the source code.
                    </p>
                  </section>

                  {/* Service Availability */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Service Availability</h2>
                    <p className="text-white/80 leading-relaxed">
                      While we strive to provide reliable service, OpenMemo is provided "as is" without warranties. We do not guarantee uninterrupted access, and the service may be temporarily unavailable due to maintenance, updates, or technical issues. As a free service, we reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice.
                    </p>
                  </section>

                  {/* Privacy */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Privacy</h2>
                    <p className="text-white/80 leading-relaxed">
                      Your privacy is important to us. Please review our{" "}
                      <Link 
                        href="/privacy"
                        className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      {" "}to understand how we collect, use, and protect your information. By using OpenMemo, you consent to the practices described in our Privacy Policy.
                    </p>
                  </section>

                  {/* Limitation of Liability */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Limitation of Liability</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                    </p>
                    <ul className="text-white/80 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>OpenMemo is provided "as is" without warranties of any kind</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>We are not liable for any indirect, incidental, or consequential damages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>Our total liability shall not exceed $100 or the amount you paid us in the past 12 months</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A8FF00] rounded-full mt-2 flex-shrink-0" />
                        <span>We are not responsible for data loss, though we make reasonable efforts to protect your data</span>
                      </li>
                    </ul>
                  </section>

                  {/* Termination */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Termination</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      You may terminate your account at any time by stopping use of the service and deleting your stored data. We may terminate or suspend your account if you violate these Terms, with or without notice.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                      Upon termination, your right to use the service ceases immediately. We will delete your account data within 30 days of termination, though some data may persist in backups for a limited time.
                    </p>
                  </section>

                  {/* Changes to Terms */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Changes to Terms</h2>
                    <p className="text-white/80 leading-relaxed">
                      We may update these Terms from time to time. We will notify users of significant changes by posting a notice in the extension or on our website. Continued use of the service after changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
                    </p>
                  </section>

                  {/* Governing Law */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Governing Law</h2>
                    <p className="text-white/80 leading-relaxed">
                      These Terms are governed by and construed in accordance with the laws of the jurisdiction where the service is operated, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the service will be resolved through binding arbitration or in the courts of competent jurisdiction.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Contact Us</h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="text-white/80 space-y-2">
                      <p><strong>GitHub Issues:</strong> <a href="https://github.com/MrlolDev/openmemo/issues" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors">Report an issue</a></p>
                      <p><strong>Twitter:</strong> <a href="https://twitter.com/mrloldev" target="_blank" rel="noopener noreferrer" className="text-[#A8FF00] hover:text-[#85CC00] underline transition-colors">@mrloldev</a></p>
                    </div>
                  </section>

                  {/* Acknowledgment */}
                  <section>
                    <h2 className="text-white text-2xl font-bold mb-4 text-[#A8FF00]">Acknowledgment</h2>
                    <p className="text-white/80 leading-relaxed">
                      By using OpenMemo, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. Thank you for being part of the OpenMemo community!
                    </p>
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