export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 p-6 pt-40 pb-20 text-left overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold text-black mb-4 text-left">Authentication Error</h1>
        <p className="text-slate-600 mb-6">There was an issue verifying your login code. This can happen if the link has expired or has already been used.</p>
        <a 
          href="/auth" 
          className="block w-full text-center py-4 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all"
        >
          Try Signing In Again
        </a>
      </div>
    </div>
  )
}
