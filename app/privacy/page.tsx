import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-dvh bg-background'>
      <div className='max-w-3xl mx-auto px-4 py-12'>
        {/* Header */}
        <div className='mb-12'>
          <Link href='/' className='inline-flex items-center gap-2 mb-8'>
            <Image src='/LOGO_VALOR.svg' alt='Valo' width={28} height={28} />
            <span
              className='text-lg font-bold text-white'
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
            >
              valo
            </span>
          </Link>
          <h1
            className='text-3xl sm:text-4xl font-bold text-white mb-2'
            style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          >
            Privacy Policy
          </h1>
          <p className='text-sm text-white/40'>Effective Date: February 12, 2026</p>
        </div>

        {/* Content */}
        <div className='space-y-8 text-sm leading-relaxed text-white/70'>
          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>1. Introduction</h2>
            <p>
              Welcome to Valo. We are committed to protecting your personal information and your right to privacy. This
              Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to
              it.
            </p>
            <p className='mt-2'>
              By accessing or using our platform, you agree to the terms outlined in this Privacy Policy. If you do not
              agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>2. Information We Collect</h2>

            <h3 className='text-sm font-semibold text-white/90 mt-4 mb-2'>2.1 Information You Provide to Us</h3>
            <p>
              We collect information that you voluntarily provide when you register, make a purchase, or otherwise
              interact with our platform, including:
            </p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>Name, email address, and contact details</li>
              <li>Account credentials (username and password)</li>
              <li>Payment and billing information (processed via secure third-party providers)</li>
              <li>Profile information, preferences, and settings</li>
              <li>Any content, messages, or feedback you submit</li>
            </ul>

            <h3 className='text-sm font-semibold text-white/90 mt-4 mb-2'>2.2 Information Collected Automatically</h3>
            <p>When you use our platform, certain information is collected automatically, including:</p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>Device information (browser type, operating system, device identifiers)</li>
              <li>Log data (IP address, access times, pages viewed, referring URLs)</li>
              <li>Usage data (features used, interactions, session duration)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Approximate location data derived from your IP address</li>
            </ul>

            <h3 className='text-sm font-semibold text-white/90 mt-4 mb-2'>2.3 Information from Third Parties</h3>
            <p>
              We may receive information about you from third-party sources, such as social media platforms (if you
              choose to link your account), analytics providers, and advertising partners.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>To provide, operate, and maintain our platform and services</li>
              <li>To process transactions and send related notifications</li>
              <li>To personalize and improve your experience</li>
              <li>To communicate with you, including customer support and updates</li>
              <li>To monitor and analyze usage trends and platform performance</li>
              <li>To detect, prevent, and address fraud, security issues, or technical problems</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>4. Sharing of Information</h2>
            <p>
              We do not sell your personal information. We may share your data in the following circumstances:
            </p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>
                <span className='text-white/70 font-medium'>Service Providers:</span> With trusted third-party vendors
                who assist us in operating our platform (e.g., hosting, payment processing, analytics)
              </li>
              <li>
                <span className='text-white/70 font-medium'>Legal Requirements:</span> When required by law, regulation,
                or legal process
              </li>
              <li>
                <span className='text-white/70 font-medium'>Business Transfers:</span> In connection with a merger,
                acquisition, or sale of assets
              </li>
              <li>
                <span className='text-white/70 font-medium'>With Your Consent:</span> When you have given us explicit
                permission to share your information
              </li>
              <li>
                <span className='text-white/70 font-medium'>Safety and Protection:</span> To protect the rights, safety,
                and property of our users and the public
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies, web beacons, and similar technologies to collect information and improve our services.
              These may include:
            </p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>Essential cookies required for the platform to function</li>
              <li>Analytics cookies to understand how users interact with our platform</li>
              <li>Preference cookies to remember your settings and choices</li>
              <li>Marketing cookies to deliver relevant advertisements</li>
            </ul>
            <p className='mt-2'>
              You can manage your cookie preferences through your browser settings. Disabling certain cookies may limit
              your ability to use some features of our platform.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
              policy, or as required by law. When your data is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>7. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures to protect your personal information,
              including encryption, access controls, and secure data storage. However, no method of transmission or
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>8. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-white/60'>
              <li>
                <span className='text-white/70 font-medium'>Access:</span> Request a copy of the personal data we hold
                about you
              </li>
              <li>
                <span className='text-white/70 font-medium'>Correction:</span> Request correction of inaccurate or
                incomplete data
              </li>
              <li>
                <span className='text-white/70 font-medium'>Deletion:</span> Request deletion of your personal data,
                subject to legal obligations
              </li>
              <li>
                <span className='text-white/70 font-medium'>Portability:</span> Request a copy of your data in a
                structured, machine-readable format
              </li>
              <li>
                <span className='text-white/70 font-medium'>Opt-Out:</span> Opt out of marketing communications at any
                time
              </li>
              <li>
                <span className='text-white/70 font-medium'>Withdraw Consent:</span> Withdraw your consent where
                processing is based on consent
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>9. Children&apos;s Privacy</h2>
            <p>
              Our platform is not intended for use by individuals under the age of 13 (or the applicable age of digital
              consent in your jurisdiction). We do not knowingly collect personal information from children. If we become
              aware that we have collected data from a child, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>10. International Data Transfers</h2>
            <p>
              If you access our platform from outside the country where our servers are located, your information may be
              transferred across international borders. We take appropriate safeguards to ensure your data is protected
              in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>11. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy
              practices of these external sites. We encourage you to review the privacy policies of any third-party
              services you visit.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
              the updated policy on our platform and updating the effective date. Your continued use of our services
              after such changes constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-white mb-3'>13. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at{' '}
              <a href='mailto:support@valo.com' className='text-primary-400 hover:text-primary-300 transition-colors'>
                support@valo.com
              </a>
            </p>
          </section>

          <div className='pt-8 border-t border-white/10 text-white/30 text-xs'>
            &copy; 2026 Valo. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
