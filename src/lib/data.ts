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

// Demo data - Emptied for production
export const DEMO_MURID: Murid[] = [];
export const DEMO_NILAI_IBADAH: NilaiIbadah[] = [];
export const DEMO_NILAI_TAHSIN: NilaiTahsin[] = [];
export const DEMO_NILAI_DOA: NilaiDoa[] = [];

// Helper to get from localStorage 
function getStore<T>(key: string, demo: T[]): T[] {
  const stored = localStorage.getItem(`rembulan_${key}`);
  if (stored) {
    const data = JSON.parse(stored);
    // Force purge old dummy data if found
    if (Array.isArray(data) && data.length > 0 && (data[0] as any).id === 's1') {
      localStorage.removeItem(`rembulan_${key}`);
      return [];
    }
    return data;
  }
  return [];
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(`rembulan_${key}`, JSON.stringify(data));
}

export const dataStore = {
  getMurid: () => getStore<Murid>('murid', DEMO_MURID),
  setMurid: (data: Murid[]) => setStore('murid', data),

  syncMurid: async (data: Murid[]): Promise<boolean> => {
    setStore('murid', data);
    try {
      const response = await fetch('/api/murids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to sync murids');
      console.log('Murids synced successfully');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
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

      setStore('murid', murids);
      setStore('nilai_ibadah', ibadah);
      setStore('nilai_tahsin', tahsin);
      setStore('nilai_doa', doa);
    } catch (e) {
      console.error('Failed to sync with backend', e);
    }
  },

  syncNilaiIbadah: async (data: NilaiIbadah[]): Promise<boolean> => {
    setStore('nilai_ibadah', data);
    try {
      const response = await fetch('/api/nilai-ibadah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to sync ibadah');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  syncNilaiTahsin: async (data: NilaiTahsin[]): Promise<boolean> => {
    setStore('nilai_tahsin', data);
    try {
      const response = await fetch('/api/nilai-tahsin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to sync tahsin');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  syncNilaiDoa: async (data: NilaiDoa[]): Promise<boolean> => {
    setStore('nilai_doa', data);
    try {
      const response = await fetch('/api/nilai-doa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to sync doa');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
