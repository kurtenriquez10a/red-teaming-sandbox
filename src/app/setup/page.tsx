'use client';

import { useState } from 'react';
import PageLayout from '../../components/PageLayout';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const setupDatabase = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/setup-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keystroke?field=test&val=testvalue&session=testsession');
      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: 'Test User',
          employeeId: 'TEST123',
          cardNumber: '1234567890123456',
          ssn: '123456789',
          sessionId: 'testsession'
        })
      });
      
      setResult({
        success: true,
        message: 'Database test completed - check your database for test records',
        keystrokeTest: response.ok,
        submitTest: submitResponse.ok
      });
    } catch (error) {
      setResult({
        success: false,
        error: 'Database test failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
    setIsLoading(false);
  };

  return (
    <PageLayout
      title="Database Setup"
      subtitle="Set up your Neon database tables for red teaming logs"
      showBackButton={true}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Setup Database Tables" to create the required tables</li>
            <li>Wait for confirmation that tables were created successfully</li>
            <li>Click "Test Database" to verify logging is working</li>
            <li>Your red teaming sandbox will then capture all keystroke and submission data</li>
          </ol>
        </div>

        <div className="space-y-4">
          <button
            onClick={setupDatabase}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            {isLoading ? 'Setting up...' : 'Setup Database Tables'}
          </button>

          <button
            onClick={testDatabase}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            {isLoading ? 'Testing...' : 'Test Database'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-semibold ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            
            <div className="mt-2">
              {result.message && (
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
              )}
              
              {result.error && (
                <p className="text-sm text-red-700 mt-1">
                  Error: {result.error}
                </p>
              )}

              {result.tables && (
                <div className="mt-2">
                  <p className="text-sm text-green-700 font-medium">Tables created:</p>
                  <ul className="text-xs text-green-600 ml-4">
                    {result.tables.map((table: any, index: number) => (
                      <li key={index}>• {table.table_name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.keystrokeTest !== undefined && (
                <div className="mt-2 text-sm text-green-700">
                  <p>Keystroke logging: {result.keystrokeTest ? '✅ Working' : '❌ Failed'}</p>
                  <p>Form submission: {result.submitTest ? '✅ Working' : '❌ Failed'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}