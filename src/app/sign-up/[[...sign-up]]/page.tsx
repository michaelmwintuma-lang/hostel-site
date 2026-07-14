'use client';

import { SignUp } from '@clerk/nextjs';
import AppLogo from '@/components/AppLogo';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061A10] via-[#0D3D22] to-[#0a2d1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-3">
              <AppLogo alt="Hostel Portal" width={110} height={36} className="h-9 w-auto object-contain" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white font-bold text-xl tracking-tight">Create an Account</h1>
            <p className="text-emerald-300/70 text-xs mt-0.5">Sign up to access the portal</p>
          </div>
        </div>

        <div className="flex justify-center">
          <SignUp
            routing="hash"
            signInUrl="/admin-login"
            forceRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-0',
                formButtonPrimary: 'bg-[#E03B0D] hover:bg-[#A12808] text-white rounded-full',
                formFieldLabel: 'text-white/80',
                formFieldInput: 'bg-white/10 border-white/20 text-white placeholder-white/30',
                footerActionText: 'text-white/70',
                footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                dividerLine: 'bg-white/20',
                dividerText: 'text-white/50',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                socialButtonsBlockButtonText: 'text-white',
                formFieldInputShowPasswordButton: 'text-white/50 hover:text-white',
                identityPreviewText: 'text-white/80',
                identityPreviewEditButton: 'text-emerald-400 hover:text-emerald-300',
              }
            }}
          />
        </div>

        <p className="text-center text-xs text-white/25 hover:text-white/50 transition-colors">
          <a href="/">← Back to public site</a>
        </p>
      </div>
    </div>
  );
}
