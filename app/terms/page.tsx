export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-500 mb-4">Last updated: November 7, 2025</p>
            <p>
              Please read these Terms of Service carefully before using our Gmail Reader application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p>
              By accessing and using this service, you accept and agree to be bound by the terms and provisions 
              of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Description of Service</h2>
            <p>
              Gmail Reader provides a service that allows you to access and view your Gmail messages through our 
              application. The service requires authorization through Google OAuth to access your Gmail account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">User Responsibilities</h2>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information when using our service</li>
              <li>Maintain the security of your Google account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any part of the service</li>
              <li>Not use the service in any way that could damage or impair it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Privacy and Data Use</h2>
            <p>
              Your use of this service is also governed by our{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              . Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by us and are protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p>
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Service Availability</h2>
            <p>
              We strive to provide reliable service, but we do not guarantee that the service will be uninterrupted, 
              timely, secure, or error-free. We reserve the right to modify or discontinue the service at any time 
              without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Termination</h2>
            <p>
              We may terminate or suspend your access to the service immediately, without prior notice or liability, 
              for any reason, including if you breach these Terms. You may also terminate your use of the service 
              at any time by revoking access through your Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material 
              change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without 
              regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:support@codezui.com" className="text-blue-600 hover:underline">
                support@codezui.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
