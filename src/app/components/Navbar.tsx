"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/auth";

export function Navbar() {
  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-[#80C978] p-5 shadow-sm flex items-center justify-between px-20">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Info />
      </div>
      {/* Menu */}
      <div className="flex items-center space-x-14">
        <Menu />
      </div>
    </div>
  );
}

function Info() {
  return (
    <>
      <Link href="/dashboard" className="text-4xl font-bold">
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
      <Link href="/dashboard" className="text-black font-semibold text-xl hover:text-[#326D2C] transition duration-300">
        Beranda
      </Link>
      <Link href="/dashboard/tambah" className="text-black font-semibold text-xl hover:text-[#326D2C] transition duration-300">
        Tambah Bahan Pangan
      </Link>
      <div className="flex items-center space-x-6">
        <Image src="/user.png" alt="profile icon" width={50} height={50} className="rounded-full p-2 bg-gray-100" />
        <button
          onClick={logout}
          className="flex items-center justify-center p-2 size-12 bg-[#326D2C] rounded-2xl cursor-pointer hover:scale-105"
          disabled={!logout}
        >
          <Image src="/logout.png" alt="logout icon" width={25} height={25} />
        </button>
      </div>
    </>
  );
}
