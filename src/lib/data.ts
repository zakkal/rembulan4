export interface Murid {
  id: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  umur: number;
  namaOrangTua: string;
  whatsappOrangTua: string;
  mentorId: string;
}

export interface NilaiIbadah {
  id: string;
  muridId: string;
  mentorId: string;
  tanggal: string;
  sholat: number;
  adab: number;
  kedisiplinan: number;
  keaktifan: number;
  catatan: string;
}

export interface NilaiTahsin {
  id: string;
  muridId: string;
  mentorId: string;
  tanggal: string;
  makharijulHuruf: number;
  tajwid: number;
  kelancaran: number;
  adabMembaca: number;
  catatan: string;
}

export interface NilaiDoa {
  id: string;
  muridId: string;
  mentorId: string;
  tanggal: string;
  hafalan: number;
  kelancaran: number;
  pemahaman: number;
  catatan: string;
}

// Demo data
export const DEMO_MURID: Murid[] = [
  { id: 's1', nama: 'Ali bin Ahmad', jenisKelamin: 'L', umur: 10, namaOrangTua: 'Budi', whatsappOrangTua: '08345678901', mentorId: 'm1' },
  { id: 's2', nama: 'Fatimah binti Zahra', jenisKelamin: 'P', umur: 9, namaOrangTua: 'Siti', whatsappOrangTua: '08456789012', mentorId: 'm1' },
  { id: 's3', nama: 'Umar bin Khattab', jenisKelamin: 'L', umur: 11, namaOrangTua: 'Hasan', whatsappOrangTua: '08567890123', mentorId: 'm1' },
  { id: 's4', nama: 'Khadijah binti Hasan', jenisKelamin: 'P', umur: 10, namaOrangTua: 'Ridwan', whatsappOrangTua: '08678901234', mentorId: 'm2' },
  { id: 's5', nama: 'Bilal bin Rabah', jenisKelamin: 'L', umur: 12, namaOrangTua: 'Daud', whatsappOrangTua: '08789012345', mentorId: 'm2' },
];

export const DEMO_NILAI_IBADAH: NilaiIbadah[] = [
  { id: 'ni1', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-01', sholat: 85, adab: 90, kedisiplinan: 80, keaktifan: 88, catatan: 'Baik, perlu tingkatkan kedisiplinan' },
  { id: 'ni2', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-08', sholat: 88, adab: 92, kedisiplinan: 85, keaktifan: 90, catatan: 'Ada peningkatan' },
  { id: 'ni3', muridId: 's2', mentorId: 'm1', tanggal: '2026-03-01', sholat: 90, adab: 88, kedisiplinan: 92, keaktifan: 85, catatan: 'Sangat baik' },
  { id: 'ni4', muridId: 's3', mentorId: 'm1', tanggal: '2026-03-01', sholat: 75, adab: 80, kedisiplinan: 70, keaktifan: 82, catatan: 'Perlu bimbingan lebih' },
  { id: 'ni5', muridId: 's4', mentorId: 'm2', tanggal: '2026-03-01', sholat: 92, adab: 95, kedisiplinan: 90, keaktifan: 93, catatan: 'Excellent' },
];

export const DEMO_NILAI_TAHSIN: NilaiTahsin[] = [
  { id: 'nt1', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-01', makharijulHuruf: 80, tajwid: 75, kelancaran: 82, adabMembaca: 90, catatan: 'Perlu latihan makharijul huruf' },
  { id: 'nt2', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-08', makharijulHuruf: 85, tajwid: 80, kelancaran: 85, adabMembaca: 92, catatan: 'Meningkat' },
  { id: 'nt3', muridId: 's2', mentorId: 'm1', tanggal: '2026-03-01', makharijulHuruf: 88, tajwid: 85, kelancaran: 90, adabMembaca: 92, catatan: 'Sangat baik' },
  { id: 'nt4', muridId: 's4', mentorId: 'm2', tanggal: '2026-03-01', makharijulHuruf: 90, tajwid: 88, kelancaran: 92, adabMembaca: 95, catatan: 'Luar biasa' },
];

export const DEMO_NILAI_DOA: NilaiDoa[] = [
  { id: 'nd1', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-01', hafalan: 85, kelancaran: 80, pemahaman: 78, catatan: 'Perlu tingkatkan pemahaman' },
  { id: 'nd2', muridId: 's1', mentorId: 'm1', tanggal: '2026-03-08', hafalan: 88, kelancaran: 85, pemahaman: 82, catatan: 'Ada kemajuan' },
  { id: 'nd3', muridId: 's2', mentorId: 'm1', tanggal: '2026-03-01', hafalan: 92, kelancaran: 90, pemahaman: 88, catatan: 'Sangat baik' },
  { id: 'nd4', muridId: 's4', mentorId: 'm2', tanggal: '2026-03-01', hafalan: 90, kelancaran: 92, pemahaman: 85, catatan: 'Baik' },
];

// Helper to get from localStorage with demo fallback
function getStore<T>(key: string, demo: T[]): T[] {
  const stored = localStorage.getItem(`rembulan_${key}`);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(`rembulan_${key}`, JSON.stringify(demo));
  return demo;
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(`rembulan_${key}`, JSON.stringify(data));
}

export const dataStore = {
  getMurid: () => getStore<Murid>('murid', DEMO_MURID),
  setMurid: (data: Murid[]) => setStore('murid', data),

  syncMurid: async (data: Murid[]) => {
    setStore('murid', data);
    await fetch('/api/murids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  getNilaiIbadah: () => getStore<NilaiIbadah>('nilai_ibadah', []),
  setNilaiIbadah: (data: NilaiIbadah[]) => setStore('nilai_ibadah', data),

  getNilaiTahsin: () => getStore<NilaiTahsin>('nilai_tahsin', []),
  setNilaiTahsin: (data: NilaiTahsin[]) => setStore('nilai_tahsin', data),

  getNilaiDoa: () => getStore<NilaiDoa>('nilai_doa', []),
  setNilaiDoa: (data: NilaiDoa[]) => setStore('nilai_doa', data),

  // New methods to sync with backend
  fetchFromBackend: async () => {
    try {
      const [murids, ibadah, tahsin, doa] = await Promise.all([
        fetch('/api/murids').then(res => res.json()),
        fetch('/api/nilai-ibadah').then(res => res.json()),
        fetch('/api/nilai-tahsin').then(res => res.json()),
        fetch('/api/nilai-doa').then(res => res.json()),
      ]);

      if (murids.length) setStore('murid', murids);
      setStore('nilai_ibadah', ibadah);
      setStore('nilai_tahsin', tahsin);
      setStore('nilai_doa', doa);
    } catch (e) {
      console.error('Failed to sync with backend', e);
    }
  },

  syncNilaiIbadah: async (data: NilaiIbadah[]) => {
    setStore('nilai_ibadah', data);
    await fetch('/api/nilai-ibadah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  syncNilaiTahsin: async (data: NilaiTahsin[]) => {
    setStore('nilai_tahsin', data);
    await fetch('/api/nilai-tahsin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  syncNilaiDoa: async (data: NilaiDoa[]) => {
    setStore('nilai_doa', data);
    await fetch('/api/nilai-doa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
};
