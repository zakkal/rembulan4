import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, Murid } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const DataMuridPage = () => {
  const { user } = useAuth();
  const [muridList, setMuridList] = useState<Murid[]>([]);
  const [search, setSearch] = useState('');
  const [editMurid, setEditMurid] = useState<Murid | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/murids');
        if (response.ok) {
          const data = await response.json();
          setMuridList(data);
        }
      } catch (e) {
        console.error('Failed to fetch', e);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Show all students globally
  const filtered = muridList.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));

  const [form, setForm] = useState({ nama: '', jenisKelamin: 'L' as 'L' | 'P', umur: '', namaOrangTua: '', whatsappOrangTua: '' });

  const resetForm = () => {
    setForm({ nama: '', jenisKelamin: 'L', umur: '', namaOrangTua: '', whatsappOrangTua: '' });
    setEditMurid(null);
  };

  const openAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (m: Murid) => {
    setEditMurid(m);
    setForm({ nama: m.nama, jenisKelamin: m.jenisKelamin, umur: String(m.umur), namaOrangTua: m.namaOrangTua, whatsappOrangTua: m.whatsappOrangTua });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama || !form.umur || !form.namaOrangTua) {
      toast.error('Mohon lengkapi data');
      return;
    }
    let updated: Murid[];
    if (editMurid) {
      updated = muridList.map((m) => m.id === editMurid.id ? { ...m, ...form, umur: Number(form.umur) } : m);
      toast.success('Data murid diperbarui');
    } else {
      const newMurid: Murid = {
        id: `s${Date.now()}`,
        ...form,
        umur: Number(form.umur),
      };
      updated = [...muridList, newMurid];
      toast.success('Murid berhasil ditambahkan');
    }
    const success = await dataStore.syncMurid(updated);
    if (success) {
      setMuridList(updated);
      setIsOpen(false);
      resetForm();
    } else {
      toast.error('Gagal menyimpan data ke server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus murid ini?')) return;
    const updated = muridList.filter((m) => m.id !== id);
    await dataStore.syncMurid(updated);
    setMuridList(updated);
    toast.success('Murid dihapus');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Data Murid</h1>
          <p className="font-body text-muted-foreground mt-1">Kelompok {user?.name}</p>
        </div>
        <Button onClick={openAdd} className="bg-secondary hover:bg-secondary/90 gap-2">
          <Plus className="h-4 w-4" /> Tambah Murid
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari murid..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <Card key={m.id} className="border-border">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">{m.nama}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {m.umur} tahun • {m.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
                <p className="font-body text-xs text-muted-foreground">Orang tua: {m.namaOrangTua} • {m.whatsappOrangTua}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Belum ada murid</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{editMurid ? 'Edit Murid' : 'Tambah Murid Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Nama Murid</Label>
              <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <select value={form.jenisKelamin} onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value as 'L' | 'P' })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-heading">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Umur</Label>
                <Input type="number" value={form.umur} onChange={(e) => setForm({ ...form, umur: e.target.value })} placeholder="Umur" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Orang Tua</Label>
              <Input value={form.namaOrangTua} onChange={(e) => setForm({ ...form, namaOrangTua: e.target.value })} placeholder="Nama orang tua" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Orang Tua</Label>
              <Input value={form.whatsappOrangTua} onChange={(e) => setForm({ ...form, whatsappOrangTua: e.target.value })} placeholder="08xxxxxxxxxx" />
            </div>
            <Button onClick={handleSave} className="w-full">{editMurid ? 'Simpan Perubahan' : 'Tambah Murid'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataMuridPage;
