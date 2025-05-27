"use client";
import { useAuth } from "@/app/context/auth";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";

interface ChartDataItem {
  label: string;
  value: number;
}

declare global {
  interface Window {
    Chart: any;
    myPieChart?: any;
  }
}

export default function Details() {
  const { id } = useParams();
  const { user } = useAuth();
  const [material, setMaterial] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const COLORS = [
    "#88CCEE", // Biru muda
    "#44AA99", // Hijau kebiruan
    "#117733", // Hijau tua
    "#999933", // Kuning zaitun
    "#DDCC77", // Kuning pastel
    "#CC6677", // Merah muda
    "#882255", // Merah keunguan gelap
    "#AA4499", // Ungu cerah
    "#332288", // Biru gelap
    "#661100", // Coklat gelap
    "#6699CC", // Biru pastel
    "#888888", // Abu-abu
    "#E69F00", // Oranye keemasan
    "#56B4E9", // Biru terang
  ];

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        setMaterial(json.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    if (id && user?.token) fetchMaterial();
  }, [id, user?.token]);

  const chartData: ChartDataItem[] = [
    { label: "Kalori", value: material?.calories ?? 0 },
    { label: "Karbohidrat", value: material?.carbohydrates ?? 0 },
    { label: "Magnesium", value: material?.magnesium ?? 0 },
    { label: "Protein", value: material?.protein ?? 0 },
    { label: "Gula", value: material?.sugar ?? 0 },
    { label: "Zat Besi", value: material?.iron ?? 0 },
    { label: "Lemak Total", value: material?.totalFat ?? 0 },
    { label: "Lemak Jenuh", value: material?.saturatedFat ?? 0 },
    { label: "Lemak Trans", value: material?.transFat ?? 0 },
    { label: "Serat", value: material?.fiber ?? 0 },
    { label: "Kolesterol", value: material?.cholesterol ?? 0 },
    { label: "Asam Amino", value: material?.aminoAcid ?? 0 },
    { label: "Natrium", value: material?.natrium ?? 0 },
    { label: "Vitamin D", value: material?.vitaminD ?? 0 },
  ];

  useEffect(() => {
    if (!window.Chart || !canvasRef.current || chartData.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    if (window.myPieChart) window.myPieChart.destroy();

    window.myPieChart = new window.Chart(ctx!, {
      type: "pie",
      data: {
        labels: chartData.map((item) => item.label),
        datasets: [
          {
            data: chartData.map((item) => item.value),
            backgroundColor: COLORS.slice(0, chartData.length),
            borderColor: "#000",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: false },
          legend: { display: false },
        },
      },
    });
  }, [chartData]);

  const categoryLabelMap: Record<string, string> = {
    heart: "Jantung",
    diabetes: "Diabetes",
    muscle: "Otot",
    diet: "Diet",
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-semibold text-black">
          Detail Bahan Pangan
        </h2>

        <div className="bg-[#CCE9C8] mt-6 rounded-2xl p-4 md:p-6 h-fit">
          {!material ? (
            <div className="text-center text-gray-700 font-medium">
              Memuat data...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-6">
                {/* Informasi Utama */}
                <div className="bg-[#A9DBA4] rounded-2xl p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Informasi Utama
                  </h2>
                  <div className="grid grid-cols-[auto_min-content_1fr] gap-4 font-medium text-sm md:text-base">
                    <div>Nama Bahan</div>
                    <div>:</div>
                    <div>{material.name}</div>
                    <div>Tanggal Pengujian</div>
                    <div>:</div>
                    <div>
                      {new Date(material.testDate).toLocaleDateString("id-ID")}
                    </div>
                    <div>Kategori Bahan Pangan</div>
                    <div>:</div>
                    <div>{material.materialCategory}</div>
                    <div>Sumber / Asal</div>
                    <div>:</div>
                    <div>{material.source}</div>
                    <div>Kategori Diet</div>
                    <div>:</div>
                    <div>
                      {(material.categories || [])
                        .map(
                          (cat: string) =>
                            categoryLabelMap[cat.toLowerCase()] || cat
                        )
                        .join(", ") || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col bg-[#A9DBA4] rounded-2xl p-4 h-fit">
                  <h2 className="text-lg font-semibold mb-4">
                    Gambar Bahan Pangan
                  </h2>
                  <div className="flex items-center justify-center">
                    <Image
                      src={material.imageUrl}
                      alt={material.name}
                      width={200}
                      height={200}
                      className="w-3/4 object-cover md:h-[400px] rounded-2xl "
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {/* Distribusi Utama */}
                <div className="bg-[#A9DBA4] rounded-2xl p-4 h-fit">
                  <h2 className="text-lg font-semibold mb-4">
                    Distribusi Utama
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-medium">
                    {chartData.map((item, index) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm md:text-base">
                        <div
                          className="size-4 border rounded-md"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <h2>
                          {item.label} ({item.value}gr)
                        </h2>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chart */}
                <div className="flex flex-col gap-4 items-center bg-[#A9DBA4] rounded-2xl p-4">
                  <h2 className="self-start text-lg font-semibold">
                    Visualisasi Distribusi
                  </h2>
                  <div className="h-fit md:w-[400px]">
                    {chartData.length ? (
                      <canvas ref={canvasRef} className="w-full h-full" />
                    ) : (
                      <div className="text-center">Data tidak tersedia</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
