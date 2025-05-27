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
  imageUrl: string | null;
  protein: number;
  carbohydrates: number;
  sugar: number;
  categories: string[];
}

interface MaterialStats {
  totalMaterials: number;
  myMaterials: number;
  newMaterials: number;
  totalMaterialCategory: number;
}

export default function Home() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<MaterialStats>({
    totalMaterials: 0,
    newMaterials: 0,
    totalMaterialCategory: 0,
    myMaterials: 0,
  });

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const [materialsRes, statsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials?`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/stats`, {
            headers: { Authorization: `Bearer ${user.token}` },
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
        <h2 className="text-xl font-semibold text-black">
          Selamat datang, {user?.name || "Pengguna"}!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 md:mt-2">
          <StatCard title="Total Bahan Pangan" value={stats.totalMaterials} />
          <StatCard title="Bahan saya" value={stats.myMaterials} />
          <StatCard title="Kategori Bahan" value={stats.totalMaterialCategory} />
        </div>
        <Menu materials={materials} />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#A9DBA4] rounded-2xl p-5 mt-6 min-h-20 w-full max-w-sm md:max-w-lg mx-auto md:mx-0 md:min-h-40 shadow-md gap-2">
      <h2 className="text-lg md:text-2xl font-bold">{value}</h2>
      <h2 className="text-base md:text-xl font-semibold text-center">{title}</h2>
    </div>
  );
}

function Menu({ materials }: { materials: Material[] }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryMap: { [key: string]: string } = {
    heart: "Jantung",
    muscle: "Otot",
    diet: "Diet",
    diabetes: "Diabetes",
  };

  const categoryOptions = ["Semua", "Diet", "Otot", "Jantung", "Diabetes"];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = materials.filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "Semua" ||
          m.categories?.some((c) => {
            const translated = categoryMap[c.toLowerCase()];
            return translated?.toLowerCase() === selectedCategory.toLowerCase();
          });

        return matchesSearch && matchesCategory;
      });

      setFilteredMaterials(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, materials]);

  return (
    <div className="flex flex-col mt-8">
      <h2 className="text-xl font-semibold text-black">Riwayat Bahan Pangan</h2>

      {/* Filter Kategori */}
      <div className="flex flex-col md:flex-row mt-6 space-y-4 md:space-y-0 md:space-x-5 md:gap-4">
        {categoryOptions.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`border-[3px] border-[#80C978] rounded-xl max-w-sm  w-full xl:w-24 mx-auto md:mx-0 h-fit py-1 px-4 font-semibold flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition duration-300 ${
              selectedCategory === category ? "bg-[#80C978] text-white" : "bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Input Pencarian */}
      <div className="flex flex-col md:flex-row gap-5 mt-6">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 p-2 font-medium rounded-2xl max-w-sm mx-auto md:max-w-full w-full md:w-3/4 order-2 md:order-1">
          <Image src="/search.png" alt="search" width={30} height={30} className="size-5" />
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
          className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-semibold max-w-sm mx-auto w-full md:w-1/4 order-1"
        >
          + Tambah Bahan Pangan
        </Link>
      </div>

      {/* Daftar Bahan */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((m) => (
            <Card key={m.id} material={m}/>
          ))
        ) : (
          <p className="col-span-5 text-center text-gray-500">Tidak ditemukan bahan pangan.</p>
        )}
      </div>
    </div>
  );
}

function Card({ material }: { material: Material }) {
  const categoryMap: { [key: string]: string } = {
    heart: "Jantung",
    muscle: "Otot",
    diet: "Diet",
    diabetes: "Diabetes",
  };

  // Map categories to relevant nutritional fields
  const nutritionMap: { [key: string]: { fields: [string, string]; labels: [string, string] } } = {
    heart: { fields: ["calories", "carbohydrates"], labels: ["Kalori", "Karbohidrat"] },
    muscle: { fields: ["protein", "calories"], labels: ["Protein", "Kalori"] },
    diet: { fields: ["calories", "sugar"], labels: ["Kalori", "Gula"] },
    diabetes: { fields: ["sugar", "carbohydrates"], labels: ["Gula", "Karbohidrat"] },
  };

  // Translate and join all categories
  const translatedCategories = material.categories
    .map((c) => categoryMap[c.toLowerCase()] || c)
    .join(", ") || "Diet";

  // Determine nutritional fields based on categories
  const selectedFields = material.categories.length > 0
    ? (() => {
        // Prioritize categories for nutritional fields
        const priorityOrder = ["diabetes", "muscle", "diet", "heart"];
        const sortedCategories = material.categories
          .map((c) => c.toLowerCase())
          .sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b));

        // Get fields from the highest priority category
        const primaryCategory = sortedCategories[0];
        return nutritionMap[primaryCategory]?.fields || nutritionMap.diet.fields;
      })()
    : nutritionMap.diet.fields;

  const selectedLabels = material.categories.length > 0
    ? nutritionMap[material.categories[0].toLowerCase()]?.labels || nutritionMap.diet.labels
    : nutritionMap.diet.labels;

  // Get the two nutritional values
  const [value1, value2] = selectedFields.map((field) => material[field as keyof Material] as number);

  return (
    <div className="flex flex-col gap-1 bg-white h-fit rounded-2xl shadow-md border-2 border-gray-100 p-4 w-full max-w-xs mx-auto md:mx-0">
      <Image
        src={material.imageUrl || "/placeholder.png"}
        alt={material.name}
        width={200}
        height={200}
        className="w-full h-56 object-cover rounded-2xl mb-2"
      />
      <h2 className="font-semibold">{material.name}</h2>
      <h2 className="font-medium text-xs">{translatedCategories}</h2>
      <h2 className="font-medium text-xs">
        {selectedLabels[0]}: {value1} {selectedLabels[0] === "Kalori" ? "kcal" : selectedLabels[0] === "Protein" ? "g" : selectedLabels[0] === "Gula" ? "g" : "g"} |{" "}
        {selectedLabels[1]}: {value2} {selectedLabels[1] === "Kalori" ? "kcal" : selectedLabels[1] === "Protein" ? "g" : selectedLabels[1] === "Gula" ? "g" : "g"}
      </h2>
      <div className="flex justify-end mt-2">
        <Link href={`/dashboard/details/${material.id}`} className="flex items-center justify-center bg-[#007BFF] size-7 rounded-md">
          <Image src="/view.png" alt="view icon" width={8} height={8} className="w-5" />
        </Link>
      </div>
    </div>
  );
}