'use client';

import React, { useState, useRef, useEffect } from "react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [popup, setPopup] = useState<{ show: boolean; message: string; isError: boolean }>({
    show: false,
    message: "",
    isError: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof FormState]: value }));
  };

  const handleKategoriSelect = (value: string) => {
    setForm((prev) => ({ ...prev, kategoriValue: value }));
    setKategoriOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setPopup({ show: true, message: "Ukuran gambar melebihi batas 5MB", isError: true });
        return;
      }
      console.log("Selected image:", { name: file.name, size: file.size, type: file.type });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setPopup({ show: true, message: "Nama bahan pangan wajib diisi!", isError: true });
      return;
    }
    if (!form.kategoriValue) {
      setPopup({ show: true, message: "Kategori bahan pangan wajib dipilih!", isError: true });
      return;
    }
    console.log("Form data before submit:", form);
    setShowImageModal(true);
  };

const handleSave = async () => {
  if (!user?.token) {
    setPopup({ show: true, message: "User tidak terautentikasi!", isError: true });
    return;
  }

  setIsLoading(true);
  const formData = new FormData();
  formData.append("name", form.name.trim());
  if (form.calories && !isNaN(Number(form.calories))) {
    formData.append("calories", Number(form.calories).toString());
  }
    if (form.protein && !isNaN(Number(form.protein))) {
      formData.append("protein", Number(form.protein).toString());
    }
    if (form.totalFat && !isNaN(Number(form.totalFat))) {
      formData.append("totalFat", Number(form.totalFat).toString());
    }
    if (form.saturatedFat && !isNaN(Number(form.saturatedFat))) {
      formData.append("saturatedFat", Number(form.saturatedFat).toString());
    }
    if (form.transFat && !isNaN(Number(form.transFat))) {
      formData.append("transFat", Number(form.transFat).toString());
    }
    if (form.cholesterol && !isNaN(Number(form.cholesterol))) {
      formData.append("cholesterol", Number(form.cholesterol).toString());
    }
    if (form.carbohydrates && !isNaN(Number(form.carbohydrates))) {
      formData.append("carbohydrates", Number(form.carbohydrates).toString());
    }
    if (form.sugar && !isNaN(Number(form.sugar))) {
      formData.append("sugar", Number(form.sugar).toString());
    }
    if (form.fiber && !isNaN(Number(form.fiber))) {
      formData.append("fiber", Number(form.fiber).toString());
    }
    if (form.natrium && !isNaN(Number(form.natrium))) {
      formData.append("natrium", Number(form.natrium).toString());
    }
    if (form.aminoAcid && !isNaN(Number(form.aminoAcid))) {
      formData.append("aminoAcid", Number(form.aminoAcid).toString());
    }
    if (form.vitaminD && !isNaN(Number(form.vitaminD))) {
      formData.append("vitaminD", Number(form.vitaminD).toString());
    }
    if (form.magnesium && !isNaN(Number(form.magnesium))) {
      formData.append("magnesium", Number(form.magnesium).toString());
    }
    if (form.iron && !isNaN(Number(form.iron))) {
      formData.append("iron", Number(form.iron).toString());
    }
    if (form.testDate) formData.append("testDate", form.testDate);
    if (form.kategoriValue) formData.append("materialCategory", form.kategoriValue);
    if (form.notes) formData.append("notes", form.notes);
    if (form.source) formData.append("source", form.source);
    if (imageFile) formData.append("image", imageFile);


const formDataEntries: Record<string, any> = {};
  formData.forEach((value, key) => {
    formDataEntries[key] = value instanceof File ? { name: value.name, size: value.size, type: value.type } : value;
  });
  console.log("FormData sent to API:", formDataEntries);
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Auth Token:", user.token);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const result = await res.json();
    console.log("API Response:", {
      status: res.status,
      statusText: res.statusText,
      body: result,
    });

    if (res.ok) {
      setPopup({ show: true, message: "Berhasil simpan bahan pangan!", isError: false });
      setShowImageModal(false);
      setImageFile(null);
      setImagePreview(null);
      handleReset();
    } else {
      setPopup({
        show: true,
        message: `Gagal menambahkan: ${result.error || result.message || result.details || "Unknown server error"} (Status: ${res.status})`,
        isError: true,
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setPopup({
      show: true,
      message: `Error saat simpan: ${error instanceof Error ? error.message : String(error)}`,
      isError: true,
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleReset = () => {
    setForm({
      name: "", testDate: "", kategoriValue: "", source: "", notes: "",
      calories: "", protein: "", totalFat: "", saturatedFat: "", transFat: "",
      cholesterol: "", carbohydrates: "", sugar: "", fiber: "", natrium: "",
      aminoAcid: "", vitaminD: "", magnesium: "", iron: "",
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePopupClose = () => {
    const isSuccess = !popup.isError;
    setPopup({ show: false, message: "", isError: false });
    if (isSuccess) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const nutrisiFields: NutrisiField[] = [
    { label: "Kalori", name: "calories" },
    { label: "Protein", name: "protein" },
    { label: "Lemak Total", name: "totalFat" },
    { label: "Lemak Jenuh", name: "saturatedFat" },
    { label: "Lemak Trans", name: "transFat" },
    { label: "Karbohidrat", name: "carbohydrates" },
    { label: "Gula", name: "sugar" },
    { label: "Serat", name: "fiber" },
    { label: "Asam Amino", name: "aminoAcid" },
    { label: "Vitamin D", name: "vitaminD" },
    { label: "Magnesium", name: "magnesium" },
    { label: "Zat Besi", name: "iron" },
    { label: "Kolestrol", name: "cholesterol" },
    { label: "Natrium", name: "natrium" },
  ];

  return (
    <DashboardLayout>
      <div className="">
        <h2 className="text-xl font-semibold text-black">Tambah Bahan Pangan</h2>
        <div className="bg-[#CCE9C8] mt-6 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Data Utama</h2>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Nama Bahan</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Nama Bahan"
                className="w-full p-3 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Tanggal Pengujian</label>
              <input
                name="testDate"
                type="date"
                value={form.testDate}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="font-medium">Kategori Bahan</label>
              <div
                className="bg-white p-3 rounded-lg cursor-pointer border border-gray-300 flex justify-between text-sm"
                onClick={() => setKategoriOpen(!kategoriOpen)}
              >
                <span>{form.kategoriValue || "Pilih Kategori"}</span>
                <Image
                  src="/dropdown.svg"
                  alt="dropdown"
                  width={15}
                  height={15}
                  className={`transition-transform ${kategoriOpen ? "rotate-180" : ""}`}
                />
              </div>
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
                name="source"
                value={form.source}
                onChange={handleInputChange}
                placeholder="Sumber / Asal"
                className="w-full p-3 rounded-lg bg-white text-sm"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">Kandungan Nutrisi</h2>
          <div className="grid grid-cols-7 gap-4 mt-3">
            {nutrisiFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="font-medium">{label}</label>
                <input
                  name={name}
                  type="number"
                  value={form[name]}
                  onChange={handleInputChange}
                  placeholder={label}
                  className="w-full p-3 text-sm rounded-lg bg-white"
                  step="any"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-5 gap-2">
            <label className="font-medium">Catatan</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              placeholder="Catatan"
              className="w-full p-3 text-sm rounded-lg bg-white"
            />
          </div>

          <div className="flex gap-4 mt-8 justify-between">
            <div className="flex gap-4">
              <button
                type="button"
                className="bg-[#DC3545] text-white rounded-lg py-2 px-4"
                onClick={handleReset}
              >
                Batalkan
              </button>
              <button
                type="button"
                className="bg-[#A6A6A6] text-white rounded-lg py-2 px-4"
                onClick={handleReset}
              >
                Bersihkan
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#007BFF] text-white font-semibold rounded-lg py-2 px-4"
              onClick={handleSubmit}
            >
              Lanjutkan
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

      {showImageModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
            <h2 className="font-semibold mb-4">Unggah Gambar</h2>
            <p className="mb-4 text-center">Pilih gambar untuk bahan pangan (maks 5MB)</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mb-4 w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl min-h-80"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-full object-cover rounded-2xl"
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
    </DashboardLayout>
  );
}