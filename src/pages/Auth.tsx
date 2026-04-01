import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Email and password are required");
      return;
    }

    let result;

    if (isLogin) {
      result = await signIn(cleanEmail, cleanPassword);
    } else {
      if (!cleanUsername) {
        alert("Username is required");
        return;
      }

      result = await signUp(cleanEmail, cleanPassword, cleanUsername);
    }

    if (!result?.error) {
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/");
    } else {
      alert(result.error.message);
    }
  };

  /* 🔥 Google Login */
  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();

    if (!result?.error) {
      navigate("/");
    } else {
      alert(result.error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm space-y-6 bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl">

        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        {/* Username (Signup only) */}
        {!isLogin && (
          <input
            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        {/* Email */}
        <input
          type="email"
          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded font-medium"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

      {/* OR Divider */}
<div className="flex items-center gap-2 text-zinc-400 text-sm">
  <div className="flex-1 h-px bg-zinc-700" />
  OR
  <div className="flex-1 h-px bg-zinc-700" />
</div>

{/* Google Button */}
<button
  onClick={handleGoogleLogin}
  className="w-full bg-white text-black hover:bg-gray-200 transition p-2 rounded font-medium flex items-center justify-center gap-2"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="google"
    className="w-5 h-5"
  />
  Continue with Google
</button>
        {/* Toggle Login / Signup */}
        <p
          className="text-sm text-center cursor-pointer text-zinc-400 hover:text-white transition"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}