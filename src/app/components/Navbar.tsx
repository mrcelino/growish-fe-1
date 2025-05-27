"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/auth";

export function Navbar() {
  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-[#80C978] p-4 shadow-sm flex items-center justify-between px-14">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Info />
      </div>
      {/* Menu */}
      <div className="flex items-center space-x-10">
        <Menu />
      </div>
    </div>
  );
}

function Info() {
  return (
    <>
      <Link href="/dashboard" className="text-3xl font-bold">
        Labora
      </Link>
    </>
  );
}

function Menu() {
  const auth = useAuth();

  const logout = auth?.logout;

  return (
    <>
      <Link href="/dashboard" className="text-black font-semibold text-lg hover:text-[#326D2C] transition duration-300">
        Beranda
      </Link>
      <Link href="/dashboard/tambah" className="text-black font-semibold text-lg hover:text-[#326D2C] transition duration-300">
        Tambah Bahan Pangan
      </Link>
      <Link href="/dashboard/bahan-pangan"className="text-black font-semibold text-lg hover:text-[#326D2C] transition duration-300">
        Bahan Saya
      </Link>
      <div className="flex items-center space-x-4">
        <Image src="/user.png" alt="profile icon" width={45} height={45} className="rounded-full p-2 bg-gray-100" />
        <button
          onClick={logout}
          className="flex items-center justify-center p-2 size-11 bg-[#326D2C] rounded-xl cursor-pointer hover:scale-105"
          disabled={!logout}
        >
          <Image src="/logout.png" alt="logout icon" width={21} height={21} />
        </button>
      </div>
    </>
  );
}
