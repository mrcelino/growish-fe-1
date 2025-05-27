'use client';

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";

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

export default function Page() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/my-materials`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const materialsData = await response.json();

        if (response.ok) {
          setMaterials(materialsData.data);
        } else {
          console.error("Failed to fetch materials:", materialsData.message);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-black">Bahan Pangan Saya</h2>
        <Menu materials={materials} />
      </div>
    </DashboardLayout>
  );
}

function Menu({ materials }: { materials: Material[] }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
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
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

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

  const handleDeleteMaterial = async () => {
    if (!selectedMaterialId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${selectedMaterialId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        setFilteredMaterials((prev) => prev.filter((m) => m.id !== selectedMaterialId));
        setShowDeleteModal(false);
        setSelectedMaterialId(null);
      } else {
        const errorData = await res.json();
        console.error("Gagal menghapus:", errorData.message);
        alert("Gagal menghapus bahan.");
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedMaterialId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex flex-col">
      {/* Filter Kategori */}
      <div className="flex mt-6 space-x-5">
        {categoryOptions.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`border-[3px] border-[#80C978] rounded-xl py-1 px-4 font-semibold flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition duration-300 ${
              selectedCategory === category ? "bg-[#80C978] text-white" : "bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Input Pencarian */}
      <div className="flex gap-5 mt-6">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 p-2 font-medium rounded-2xl w-3/4">
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
          className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-semibold w-1/4"
        >
          + Tambah Bahan Pangan
        </Link>
      </div>

      {/* Daftar Bahan */}
      <div className="grid grid-cols-5 gap-6 mt-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((m) => (
            <Card key={m.id} material={m} onDelete={openDeleteModal} />
          ))
        ) : (
          <p className="col-span-5 text-center text-gray-500">Tidak ditemukan bahan pangan.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMaterialId && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
            <h2 className="text-lg font-semibold mb-6">Hapus Bahan Pangan?</h2>
            <p className="mb-5">Apakah Anda yakin ingin menghapus bahan ini?</p>
            <div className="flex w-full space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteMaterial}
                className="w-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 transition duration-300 text-white font-medium rounded-lg cursor-pointer"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ material, onDelete }: { material: Material; onDelete: (id: string) => void }) {
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
    <div className="flex flex-col gap-1 bg-white h-fit rounded-2xl shadow-md border-2 border-gray-100 p-4">
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
      <div className="flex space-x-4 justify-end mt-2">
        <Link
          href={`/dashboard/edit/${material.id}`}
          className="flex items-center justify-center bg-[#E2A713] size-7 rounded-md"
        >
          <Image src="/edit.svg" alt="edit icon" width={20} height={20} className="w-4 object-cover" />
        </Link>
        <button
          onClick={() => onDelete(material.id)}
          className="flex items-center justify-center bg-[#DC3545] size-7 rounded-md"
        >
          <Image src="/delete.svg" alt="delete icon" width={15} height={15} className="w-4" />
        </button>
        <Link href={`/dashboard/details/${material.id}`} className="flex items-center justify-center bg-[#007BFF] size-7 rounded-md">
          <Image src="/view.png" alt="view icon" width={20} height={10} className="w-5" />
        </Link>
      </div>
    </div>
  );
}