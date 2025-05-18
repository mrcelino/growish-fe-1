'use client';
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/app/context/auth';

interface Material {
  id: string;
  name: string;
  calories: number;
  protein: number;
  material_category: string;
}

interface MaterialStats {
  totalMaterials: number;
  newMaterials: number;
  totalMaterialCategories: number;
}

export default function Home() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<MaterialStats>({
    totalMaterials: 0, newMaterials: 0, totalMaterialCategories: 0,
  });

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const [materialsRes, statsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/stats`, {
            headers: { Authorization: `Bearer ${user.token}` },
            credentials: "include",
          }),
        ]);

        const [materialsData, statsData] = await Promise.all([
          materialsRes.json(),
          statsRes.json(),
        ]);

        if (materialsRes.ok) setMaterials(materialsData.data);
        else console.error("Gagal fetch materials:", materialsData.message);

        if (statsRes.ok) setStats(statsData.data);
        else console.error("Gagal fetch stats:", statsData.message);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold text-black">
          Selamat datang, {user?.name || "Pengguna"}!
        </h2>
        <div className="grid grid-cols-3 gap-10 mt-4">
          <StatCard title="Total Bahan Pangan" value={stats.totalMaterials} />
          <StatCard title="Bahan Terbaru (7 Hari)" value={stats.newMaterials} />
          <StatCard title="Kategori Bahan" value={stats.totalMaterialCategories} />
        </div>
        <Menu materials={materials} />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#A9DBA4] rounded-2xl p-6 mt-6 min-h-44 shadow-md gap-2">
      <h2 className="text-3xl font-bold">{value}</h2>
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
    </div>
  );
}

function Menu({ materials }: { materials: Material[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = materials.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaterials(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, materials]);

  return (
    <div className="flex flex-col mt-10">
      <h2 className="text-2xl font-semibold text-black">Riwayat Bahan Pangan</h2>
      <div className="flex mt-6 space-x-5">
        {["Semua", "Diet", "Otot", "Jantung", "Diabetes"].map((category) => (
          <div
            key={category}
            className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md"
          >
            {category}
          </div>
        ))}
      </div>
      <div className="flex gap-5 mt-8">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 py-4 px-4 font-medium text-lg rounded-2xl w-3/4">
          <Image src="/search.png" alt="search" width={30} height={30} className="size-6" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari Bahan Pangan"
            className="w-full placeholder-black outline-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link
          href="/dashboard/tambah"
          className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-semibold text-xl w-1/4"
        >
          + Tambah Bahan Pangan
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-10 mt-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((m) => <Card key={m.id} material={m} />)
        ) : (
          <p className="col-span-5 text-center text-gray-500">Tidak ditemukan bahan pangan.</p>
        )}
      </div>
    </div>
  );
}

function Card({ material }: { material: Material }) {
  return (
    <div className="flex flex-col gap-1 bg-white min-h-36 rounded-2xl shadow-md border-2 border-gray-100 p-6">
      <h2 className="font-semibold text-xl">{material.name}</h2>
      <h2 className="font-medium">{material.material_category}</h2>
      <h2 className="font-medium">
        Protein: {material.protein}g | Kalori: {material.calories} kcal
      </h2>
      <div className="flex space-x-4 justify-end mt-4">
        <Link
          href={`/dashboard/edit/${material.id}`}
          className="flex items-center justify-center bg-[#E2A713] size-9 rounded-md"
        >
          <Image src="/edit.svg" alt="edit icon" width={20} height={20} className="size-6 object-cover" />
        </Link>
        <div className="flex items-center justify-center bg-[#DC3545] size-9 rounded-md">
          <Image src="/delete.svg" alt="delete icon" width={15} height={15} className="size-6" />
        </div>
        <Link href={`/dashboard/details/${material.id}`} className="flex items-center justify-center bg-[#007BFF] size-9 rounded-md">
          <Image src="/view.png" alt="view icon" width={20} height={10} className="w-7" />
        </Link>
      </div>
    </div>
  );
}
