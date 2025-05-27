"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/auth";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="navbar fixed top-0 left-0 w-full z-50 bg-[#80C978] p-4 shadow-sm flex items-center justify-between px-4 md:px-14">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Info />
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-10">
          <Menu />
        </div>

        {/* Hamburger Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 bg-white rounded-full hover:bg-[#285A22] transition duration-300"
          >
            <Image src="/hamburger.png" alt="menu icon" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-md rounded-b-xl flex flex-col items-center py-4 space-y-4 md:hidden z-50">
          <MobileMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}

function Info() {
  return (
    <>
      <Link href="/dashboard" className="text-2xl md:text-3xl font-bold">
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
      <Link href="/dashboard/bahan-pangan" className="text-black font-semibold text-lg hover:text-[#326D2C] transition duration-300">
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

function MobileMenu({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  const logout = auth?.logout;

  return (
    <>
      <Link href="/dashboard" onClick={onClose} className="text-black font-semibold text-lg hover:text-[#326D2C]">
        Beranda
      </Link>
      <Link href="/dashboard/tambah" onClick={onClose} className="text-black font-semibold text-lg hover:text-[#326D2C]">
        Tambah Bahan Pangan
      </Link>
      <Link href="/dashboard/bahan-pangan" onClick={onClose} className="text-black font-semibold text-lg hover:text-[#326D2C]">
        Bahan Saya
      </Link>
      <button
        onClick={() => {
          logout?.();
          onClose();
        }}
        className="flex items-center justify-center p-2 size-11 bg-[#326D2C] rounded-xl cursor-pointer hover:scale-105"
        >
        <Image src="/logout.png" alt="logout icon" width={21} height={21} />
      </button>

    </>
  );
}
