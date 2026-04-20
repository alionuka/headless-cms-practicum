import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Create account</h1>
      <p className="mb-6 text-sm text-gray-600">
        Sign up to access your dashboard.
      </p>

      <SignupForm />

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/signin" className="font-medium text-black underline">
          Sign in
        </a>
      </p>
    </div>
  );
}