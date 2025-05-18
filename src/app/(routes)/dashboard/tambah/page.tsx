"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";
import { useAuth } from "@/app/context/auth";

const kategoriOptions = [
  "Pangan Fungsional & Fortifikasi", "Minuman & Ekstrak", "Produk Olahan",
  "Bahan Tambahan Pangan (Additive)", "Rempah & Bumbu", "Minyak & Lemak",
  "Produk Hewani", "Sayuran", "Buah-buahan", "Umbi-umbian",
  "Kacang-Kacangan & Legum", "Biji-bijian & Serealia",
] as const;

interface FormState {
  name: string;
  testDate: string;
  kategoriValue: string;
  source: string;
  notes: string;
  calories: string;
  protein: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  carbohydrates: string;
  sugar: string;
  fiber: string;
  natrium: string;
  aminoAcid: string;
  vitaminD: string;
  magnesium: string;
  iron: string;
}

interface NutrisiField {
  label: string;
  name: keyof FormState;
}

export default function Tambah() {
  const { user } = useAuth();
  const router = useRouter();
  const [kategoriOpen, setKategoriOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", testDate: "", kategoriValue: "", source: "", notes: "",
    calories: "", protein: "", totalFat: "", saturatedFat: "", transFat: "",
    cholesterol: "", carbohydrates: "", sugar: "", fiber: "", natrium: "",
    aminoAcid: "", vitaminD: "", magnesium: "", iron: "",
  });
  const [popup, setPopup] = useState<{ show: boolean; message: string; isError: boolean }>({
    show: false,
    message: "",
    isError: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof FormState]: value }));
  };

  const handleKategoriSelect = (value: string) => {
    setForm((prev) => ({ ...prev, kategoriValue: value }));
    setKategoriOpen(false);
  };

  const handleSubmit = async () => {
    if (!user?.token) {
      setPopup({ show: true, message: "User tidak terautentikasi!", isError: true });
      return;
    }

    const payload = {
      ...form,
      calories: Number(form.calories), protein: Number(form.protein),
      total_fat: Number(form.totalFat), saturated_fat: Number(form.saturatedFat),
      trans_fat: Number(form.transFat), cholesterol: Number(form.cholesterol),
      carbohydrates: Number(form.carbohydrates), sugar: Number(form.sugar),
      fiber: Number(form.fiber), natrium: Number(form.natrium),
      amino_acid: Number(form.aminoAcid), vitamin_d: Number(form.vitaminD),
      magnesium: Number(form.magnesium), iron: Number(form.iron),
      material_category: form.kategoriValue, test_date: form.testDate,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || res.statusText);
      setPopup({ show: true, message: "Berhasil simpan bahan pangan!", isError: false });
      handleReset();
    } catch (error) {
      setPopup({
        show: true,
        message: `Error saat simpan: ${error instanceof Error ? error.message : String(error)}`,
        isError: true,
      });
    }
  };

  const handlePopupClose = () => {
    const wasSuccess = !popup.isError;
    setPopup({ show: false, message: "", isError: false });
    if (wasSuccess) {
      router.push("/dashboard");
    }
  };

  const handleReset = () => {
    setForm({
      name: "", testDate: "", kategoriValue: "", source: "", notes: "",
      calories: "", protein: "", totalFat: "", saturatedFat: "", transFat: "",
      cholesterol: "", carbohydrates: "", sugar: "", fiber: "", natrium: "",
      aminoAcid: "", vitaminD: "", magnesium: "", iron: "",
    });
  };

  const nutrisiFields: NutrisiField[] = [
    { label: "Kalori", name: "calories" }, { label: "Protein", name: "protein" },
    { label: "Lemak Total", name: "totalFat" }, { label: "Lemak Jenuh", name: "saturatedFat" },
    { label: "Lemak Trans", name: "transFat" }, { label: "Karbohidrat", name: "carbohydrates" },
    { label: "Gula", name: "sugar" }, { label: "Serat", name: "fiber" },
    { label: "Asam Amino", name: "aminoAcid" }, { label: "Vitamin D", name: "vitaminD" },
    { label: "Magnesium", name: "magnesium" }, { label: "Zat Besi", name: "iron" },
    { label: "Kolestrol", name: "cholesterol" }, { label: "Natrium", name: "natrium" },
  ];

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-semibold text-black">
          Tambah Bahan Pangan
        </h2>
        <div className="bg-[#CCE9C8] mt-10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold">Data Utama</h2>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Nama Bahan</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Nama Bahan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Tanggal Pengujian</label>
              <input
                name="testDate"
                type="date"
                value={form.testDate}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-lg font-medium">Kategori Bahan</label>
              <div
                className="bg-white p-4 rounded-lg cursor-pointer border border-gray-300 flex justify-between"
                onClick={() => setKategoriOpen(!kategoriOpen)}
              >
                <span>{form.kategoriValue || "Pilih Kategori"}</span>
                <Image
                  src="/dropdown.svg"
                  alt="dropdown"
                  width={20}
                  height={20}
                  className={`transition-transform ${
                    kategoriOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {kategoriOpen && (
                <div className="absolute top-full mt-1 bg-white w-full rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {kategoriOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                      onClick={() => handleKategoriSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Sumber / Asal</label>
              <input
                name="source"
                value={form.source}
                onChange={handleInputChange}
                placeholder="Sumber / Asal"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-10">Kandungan Nutrisi</h2>
          <div className="grid grid-cols-7 gap-4 mt-5">
            {nutrisiFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="text-lg font-medium">{label}</label>
                <input
                  name={name}
                  type="number"
                  value={form[name]}
                  onChange={handleInputChange}
                  placeholder="Kandungan"
                  className="w-full p-4 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-5 gap-2">
            <label className="text-lg font-medium">Catatan</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              placeholder="Catatan"
              className="w-full p-4 rounded-lg bg-white"
            />
          </div>

          <div className="flex gap-4 mt-10 justify-between">
            <div className="flex gap-4">
              <button
                className="bg-[#DC3545] text-white rounded-xl py-3 px-4 text-lg"
                onClick={handleReset}
              >
                Batalkan
              </button>
              <button
                className="bg-[#A6A6A6] text-white rounded-xl py-3 px-4 text-lg"
                onClick={handleReset}
              >
                Bersihkan
              </button>
            </div>
            <button
              className="bg-[#007BFF] text-white font-semibold rounded-xl py-3 px-4 text-lg"
              onClick={handleSubmit}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div
            className={`flex flex-col gap-10 justify-center items-center p-6 rounded-lg shadow-lg ${
              popup.isError ? "bg-red-100" : "bg-green-100"
            } w-1/4`}
          >
            <p className="text-2xl font-medium">{popup.message}</p>
            <button
              className="bg-[#007BFF] text-white  font-medium text-lg rounded-lg py-2 px-4"
              onClick={handlePopupClose}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}