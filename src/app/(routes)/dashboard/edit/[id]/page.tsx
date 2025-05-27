"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/layout/DashboardLayout";
import { useAuth } from "@/app/context/auth";

const kategoriOptions = [
  "Pangan Fungsional & Fortifikasi", "Minuman & Ekstrak", "Produk Olahan",
  "Bahan Tambahan Pangan (Additive)", "Rempah & Bumbu", "Minyak & Lemak",
  "Produk Hewani", "Sayuran", "Buah-buahan", "Umbi-umbian",
  "Kacang-Kacangan & Legum", "Biji-bijian & Serealia",
] as const;

interface FormData {
  name: string;
  testDate: string;
  materialCategory: string;
  source: string;
  calories: string;
  protein: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  carbohydrates: string;
  sugar: string;
  fiber: string;
  aminoAcid: string;
  vitamin_d: string;
  magnesium: string;
  iron: string;
  cholesterol: string;
  natrium: string;
  notes: string;
}

const initialForm: FormData = {
  name: "",
  testDate: "",
  materialCategory: "",
  source: "",
  calories: "",
  protein: "",
  totalFat: "",
  saturatedFat: "",
  transFat: "",
  carbohydrates: "",
  sugar: "",
  fiber: "",
  aminoAcid: "",
  vitamin_d: "",
  magnesium: "",
  iron: "",
  cholesterol: "",
  natrium: "",
  notes: "",
};

export default function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<FormData>(initialForm);
  const [kategoriOpen, setKategoriOpen] = useState(false);
  const [popup, setPopup] = useState<{ show: boolean; message: string; isError: boolean }>({
    show: false,
    message: "",
    isError: false,
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id || !user?.token) return;

    const fetchMaterial = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.data) throw new Error(data.message || "Data tidak ditemukan");

        const m = data.data;
        setForm({
          name: m.name ?? "",
          testDate: m.testDate?.split("T")[0] ?? "",
          materialCategory: m.materialCategory ?? "",
          source: m.source ?? "",
          calories: m.calories != null ? String(m.calories) : "",
          protein: m.protein != null ? String(m.protein) : "",
          totalFat: m.totalFat != null ? String(m.totalFat) : "",
          saturatedFat: m.saturatedFat != null ? String(m.saturatedFat) : "",
          transFat: m.transFat != null ? String(m.transFat) : "",
          carbohydrates: m.carbohydrates != null ? String(m.carbohydrates) : "",
          sugar: m.sugar != null ? String(m.sugar) : "",
          fiber: m.fiber != null ? String(m.fiber) : "",
          aminoAcid: m.aminoAcid != null ? String(m.aminoAcid) : "",
          vitamin_d: m.vitaminD != null ? String(m.vitaminD) : "",
          magnesium: m.magnesium != null ? String(m.magnesium) : "",
          iron: m.iron != null ? String(m.iron) : "",
          cholesterol: m.cholesterol != null ? String(m.cholesterol) : "",
          natrium: m.natrium != null ? String(m.natrium) : "",
          notes: m.notes ?? "",
        });

        // Set imagePreview jika ada imageUrl
        if (m.imageUrl) {
          setImagePreview(m.imageUrl);
        }
      } catch (err) {
        console.error("Gagal fetch data bahan:", err);
      }
    };

    fetchMaterial();
  }, [id, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKategoriSelect = (option: string) => {
    setForm((prev) => ({
      ...prev,
      materialCategory: option,
    }));
    setKategoriOpen(false);
  };

  const handleSimpanClick = () => {
    setShowImageModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key as keyof FormData]);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan data");
      }

      setPopup({ show: true, message: "Berhasil update bahan pangan!", isError: false });
      setShowImageModal(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      setPopup({ show: true, message: error.message || "Gagal menyimpan data", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopup({ show: false, message: "", isError: false });
    if (!popup.isError) {
      router.push("/dashboard");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-semibold text-black">Edit Bahan Pangan</h2>
        <div className="bg-[#CCE9C8] mt-6 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Data Utama</h2>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Nama Bahan</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama Bahan"
                className="w-full p-3 rounded-lg bg-white text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Tanggal Pengujian</label>
              <input
                type="date"
                name="testDate"
                value={form.testDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-medium">Kategori Bahan</label>
              <input
                type="text"
                name="materialCategory"
                value={form.materialCategory}
                readOnly
                onClick={() => setKategoriOpen(!kategoriOpen)}
                placeholder="Kategori Bahan"
                className="w-full p-3 rounded-lg bg-white cursor-pointer text-sm"
              />
              {kategoriOpen && (
                <div className="absolute top-full mt-1 bg-white w-full rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {kategoriOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 text-sm hover:bg-green-100 cursor-pointer"
                      onClick={() => handleKategoriSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Sumber / Asal</label>
              <input
                type="text"
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Sumber / Asal"
                className="w-full p-3 rounded-lg bg-white text-sm"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">Kandungan Nutrisi</h2>
          <div className="grid grid-cols-7 gap-4 mt-3">
            {[
              ["calories", "Kalori"],
              ["protein", "Protein"],
              ["totalFat", "Lemak Total"],
              ["saturatedFat", "Lemak Jenuh"],
              ["transFat", "Lemak Trans"],
              ["carbohydrates", "Karbohidrat"],
              ["sugar", "Gula"],
              ["fiber", "Serat"],
              ["aminoAcid", "Asam Amino"],
              ["vitamin_d", "Vitamin D"],
              ["magnesium", "Magnesium"],
              ["iron", "Zat Besi"],
              ["cholesterol", "Kolestrol"],
              ["natrium", "Natrium"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="font-medium">{label}</label>
                <input
                  type="number"
                  step="any"
                  name={name}
                  value={form[name as keyof FormData]}
                  onChange={handleChange}
                  placeholder={label}
                  className="w-full p-3 text-sm rounded-lg bg-white"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="font-medium">Catatan</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Catatan"
              className="w-full p-3 rounded-lg bg-white text-sm"
            />
          </div>

          <div className="flex gap-4 mt-8 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 px-5 py-2 rounded-lg font-semibold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSimpanClick}
              className="bg-green-700 px-4 py-2 rounded-lg font-semibold text-white"
            >
              Simpan
            </button>
          </div>
        </div>

        {showImageModal && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
              <h2 className="text-lg font-semibold mb-4">Unggah Gambar</h2>
              <p className="mb-4 text-center">Pilih gambar untuk bahan pangan (maks 5MB)</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl min-h-80"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-gray-500 text-center">Belum ada gambar dipilih</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex w-full space-x-3">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`w-1/2 px-4 py-2 bg-[#007BFF] hover:bg-blue-600 transition duration-300 text-white font-medium rounded-lg cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {popup.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div
              className={`flex flex-col gap-10 justify-center items-center p-6 rounded-lg w-1/2 shadow-lg ${
                popup.isError ? "bg-red-100" : "bg-green-100"
              } w-1/4`}
            >
              <p className="text-xl font-medium">{popup.message}</p>
              <button
                className="bg-[#007BFF] text-white font-medium text-lg rounded-lg py-2 px-4"
                onClick={handlePopupClose}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}