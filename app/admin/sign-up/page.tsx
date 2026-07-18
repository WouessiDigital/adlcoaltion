"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import SignUpForm from "./SignUpForm";

function AdminSignUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  // Isha's exact secret token from the handover document
  const SECURE_TOKEN = "17TkwPEyo1oJM7XIFW9eDk4CWThV6CrBsWrjjIhTrT7YW3xVcHUP7kcUmQgDwFOy";

  useEffect(() => {
    // If the token in the URL is wrong or missing, kick them out to login page
    if (token !== SECURE_TOKEN) {
      router.push('/admin/login'); 
    }
  }, [token, router]);

  // Hide the page content if they don't have the token
  if (token !== SECURE_TOKEN) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Access Denied.</div>;
  }

  // Render the actual form if the token matches
  return <SignUpForm />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminSignUpContent />
    </Suspense>
  );
}