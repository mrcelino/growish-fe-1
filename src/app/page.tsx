"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "researcher" }),
      });

      const data = await res.json();

      if (res.ok) {
        login({
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role,
          token: data.data.token,
        });


        document.cookie = `token=${data.data.token}; path=/; max-age=3600; ${
          process.env.NODE_ENV === "production" ? "secure; samesite=strict" : ""
        }`;

        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 bg-[#E7F5E5] min-h-[350px] md:h-fit p-3 md:p-6 xl:p-12 rounded-xl md:rounded-[30px] w-full max-w-[355px] md:max-w-sm lg:max-w-full lg:w-1/3">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[#326D2C] text-lg md:text-2xl font-semibold">Login</h2>
          <h2 className="font-medium text-base md:text-xl">Selamat datang di Labora</h2>
        </div>
        {error && <p className="text-red-500 text-lg font-medium">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full gap-4 flex flex-col items-center"
        >
          <div className="flex flex-col gap-6 mt-2 md:mt-4 w-5/6 md:w-full">
            <input
              type="email"
              placeholder="Email"
              className="bg-white text-black placeholder-black font-medium rounded-xl md:rounded-2xl py-2 px-4 text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              className="bg-white text-black placeholder-black font-medium rounded-xl md:rounded-2xl py-2 px-4 text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link href="/register" className="font-semibold text-xs md:text-sm ml-2">Belum punya akun?</Link>
            <button
              type="submit"
              className="flex space-x-2 items-center justify-center bg-[#80C978] text-sm md:text-base font-semibold rounded-xl md:rounded-2xl p-2 cursor-pointer"
            >
              <Image
                src="/upload.png"
                alt="upload icon"
                width={20}
                height={20}
                className="size-4"
              />
              <h2>Masuk</h2>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
