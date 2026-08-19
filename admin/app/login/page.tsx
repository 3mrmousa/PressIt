"use client";
import { MyButton } from "../../components/ui/MyButton";
import RadialGlow from "../../components/ui/RadialGlow";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useMe } from "../../hooks/userMe";
import { redirect, useRouter } from "next/navigation";
import { login, logout } from "../../features/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { data: user } = useMe();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (
    user?.data &&
    (user.data.role === "admin" || user.data.role === "manager")
  ) {
    redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      if (res.data.role !== "admin" && res.data.role !== "manager") {
        await logout();
        toast.error("You are not smart enough to login");
        return;
      }
      toast.success("Login Successful");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col
    items-center justify-center gap-8 bg-white"
    >
      <RadialGlow zIndex={0} />
      <h1 className="relative z-10 text-4xl font-bold text-purple-600">
        Pressit Admin
      </h1>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white min-w-sm flex flex-col gap-6 
      shadow-lg shadow-purple-400 p-6 rounded-xl border border-purple-100"
      >
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-slate-600 tracking-wide">
            Login to your account
          </h3>
          <p className="text-sm font-light text-slate-600 tracking-wide">
            Please enter your email and password and login
            <br />
            to your pressit admin or manager account.
          </p>
        </div>
        <input
          type="text"
          placeholder="Email"
          autoComplete="email"
          className="outline-none border p-2 rounded-md w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            className="outline-none border p-2 rounded-md w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <MyButton type="submit">Login</MyButton>
      </form>
    </div>
  );
}
