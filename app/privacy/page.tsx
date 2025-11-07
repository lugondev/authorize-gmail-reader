export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-500 mb-4">Last updated: November 7, 2025</p>
            <p>
              This Privacy Policy describes how we collect, use, and handle your information when you use our Gmail Reader application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p className="mb-2">When you use our service, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your Google account email address</li>
              <li>Gmail messages and metadata that you authorize us to access</li>
              <li>Authentication tokens provided by Google OAuth</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our Gmail reading service</li>
              <li>Display your Gmail messages within our application</li>
              <li>Authenticate your identity through Google OAuth</li>
              <li>Improve and optimize our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Storage and Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. 
              Your Gmail data is accessed through secure Google APIs and authentication tokens are stored securely.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We only access your Gmail data 
              to provide the services you request and do not share it with any external parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Google API Services User Data Policy</h2>
            <p>
              This application's use of information received from Google APIs adheres to the{' '}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Revoke access to your Gmail account at any time through your Google Account settings</li>
              <li>Request deletion of your data</li>
              <li>Access the information we have about you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
