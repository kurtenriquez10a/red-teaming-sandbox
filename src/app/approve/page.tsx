import { logger } from '../../utils/lib/logger';
import PageLayout from '../../components/PageLayout';
import Link from 'next/link';
import type { ApprovalParams } from '../../types';

interface ApprovePageProps {
  searchParams: Promise<ApprovalParams>;
}

export default async function ApprovePage({ searchParams }: ApprovePageProps) {
  const { employee, id, token } = await searchParams;

  // Log the approval page visit
  await logger({
    type: 'approve',
    timestamp: new Date().toISOString(),
    employee,
    employeeId: id,
    token,
    userAgent: 'server-side-render'
  });

  return (
    <PageLayout
      backgroundGradient="from-green-50 to-emerald-100"
      maxWidth="max-w-md"
    >
      <div className="text-center">
        <div className="text-6xl mb-6">✅</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Expense Report Approved!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Your expense reimbursement has been approved and processed.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          We&apos;ll email you shortly with payment details and confirmation.
        </p>

        {(employee || id || token) && (
          <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Processing Details:</h3>
            {employee && (
              <p className="text-xs text-gray-600 mb-1">
                Employee: <span className="font-mono">{employee}</span>
              </p>
            )}
            {id && (
              <p className="text-xs text-gray-600 mb-1">
                Employee ID: <span className="font-mono">{id}</span>
              </p>
            )}
            {token && (
              <p className="text-xs text-gray-600">
                Auth Token: <span className="font-mono">{token.substring(0, 25)}...</span>
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/submit"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            Submit Another Expense Report
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>

        {/* Hidden tracking pixel */}
        <img 
          src={`/api/pixel?employee=${encodeURIComponent(employee || '')}&id=${encodeURIComponent(id || '')}&token=${encodeURIComponent(token || '')}`}
          alt=""
          style={{ display: 'none' }}
          width="1"
          height="1"
        />
      </div>
    </PageLayout>
  );
}