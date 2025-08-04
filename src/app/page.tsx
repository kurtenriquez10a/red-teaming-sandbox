import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            TripEase
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Fast, Secure Expense Reimbursements
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Submit your travel expense reports securely and get reimbursed quickly. 
            Our streamlined process ensures your expenses are processed efficiently 
            with enterprise-grade security.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Get your reimbursements processed in under 24 hours</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">Bank-level encryption protects your sensitive data</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple interface works on any device</p>
            </div>
          </div>
          
          <Link 
            href="/submit"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Submit Expense Report →
          </Link>
        </div>
      </div>
    </div>
  );
}
