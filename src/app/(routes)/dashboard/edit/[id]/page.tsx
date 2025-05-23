import React from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
export default function Tambah() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-semibold text-black">
          Edit Bahan Pangan
        </h2>
        <div className="bg-[#CCE9C8] mt-10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold">Data Utama</h2>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Nama Bahan</label>
              <input
                type="text"
                placeholder="Nama Bahan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">
                Tanggal Pengujian
              </label>
              <input
                type="text"
                placeholder="24-03-2005"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">
                Kategori Bahan
              </label>
              <input
                type="text"
                placeholder="Kategori Bahan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Sumber / Asal</label>
              <input
                type="text"
                placeholder="Sumber / Asal"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-10">Kandungan Nutrisi</h2>
          <div className="grid grid-cols-7 gap-4 mt-5">
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Kalori</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Protein</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Lemak Total</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Lemak Jenuh</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Lemak Trans</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Karbohidrat</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Gula</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Serat</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Asam Amino</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Vitamin D</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Magnesium</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Zat Besi</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Kolestrol</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium">Natrium</label>
              <input
                type="text"
                placeholder="Kandungan"
                className="w-full p-4 rounded-lg bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col mt-5 gap-2">
            <label className="block text-lg font-medium">Catatan</label>
            <input
              type="text"
              placeholder="Catatan"
              className="w-full p-4 rounded-lg bg-white"
            />
          </div>
          <div className="flex gap-4 mt-10 justify-between">
            <div className="flex flex-start gap-4">
              <button className="flex items-center justify-center bg-[#DC3545] text-white rounded-xl py-3 px-4 text-lg mt-10">
                <h2 className="font-medium text-xl">Batalkan</h2>
              </button>
              <button className="flex items-center justify-center bg-[#A6A6A6] text-white rounded-xl py-3 px-4 text-lg mt-10">
                <h2 className="font-medium text-xl">Bersihkan</h2>
              </button>
            </div>
            <div className="flex">
              <button className="flex items-center justify-center bg-[#007BFF] text-white rounded-xl py-3 px-4 text-lg mt-10">
                <h2 className="font-medium text-xl">Simpan</h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
