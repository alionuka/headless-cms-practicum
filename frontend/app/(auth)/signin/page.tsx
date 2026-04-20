import SigninForm from "./SigninForm";

export default function SigninPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-600">
        Sign in to continue to your account.
      </p>

      <SigninForm />

      <p className="mt-6 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-black underline">
          Sign up
        </a>
      </p>
    </div>
  );
}