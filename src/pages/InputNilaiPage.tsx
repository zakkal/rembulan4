import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, Murid, NilaiIbadah, NilaiTahsin, NilaiDoa } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const InputNilaiPage = () => {
  const { user } = useAuth();
  const [allMurid, setAllMurid] = useState<Murid[]>([]);
  const [nilaiIbadah, setNilaiIbadah] = useState<NilaiIbadah[]>([]);
  const [nilaiTahsin, setNilaiTahsin] = useState<NilaiTahsin[]>([]);
  const [nilaiDoa, setNilaiDoa] = useState<NilaiDoa[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedMurid, setSelectedMurid] = useState<string>('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [murids, ibadah, tahsin, doa] = await Promise.all([
          fetch('/api/murids').then(res => res.json()),
          fetch('/api/nilai-ibadah').then(res => res.json()),
          fetch('/api/nilai-tahsin').then(res => res.json()),
          fetch('/api/nilai-doa').then(res => res.json()),
        ]);
        setAllMurid(murids);
        setNilaiIbadah(ibadah);
        setNilaiTahsin(tahsin);
        setNilaiDoa(doa);
      } catch (e) {
        console.error('Failed to fetch data', e);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const myMurid = allMurid.filter((m) => m.mentorId === String(user?.id));

  useEffect(() => {
    if (myMurid.length > 0 && !selectedMurid) {
      setSelectedMurid(myMurid[0].id);
    }
  }, [myMurid, selectedMurid]);

  // Ibadah
  const [sholat, setSholat] = useState('');
  const [adab, setAdab] = useState('');
  const [kedisiplinan, setKedisiplinan] = useState('');
  const [keaktifan, setKeaktifan] = useState('');

  // Tahsin
  const [makharijul, setMakharijul] = useState('');
  const [tajwid, setTajwid] = useState('');
  const [kelancaran, setKelancaran] = useState('');
  const [adabMembaca, setAdabMembaca] = useState('');

  // Doa
  const [hafalan, setHafalan] = useState('');
  const [kelancaranDoa, setKelancaranDoa] = useState('');
  const [pemahaman, setPemahaman] = useState('');

  const clamp = (v: string) => Math.min(100, Math.max(0, Number(v) || 0));

  const saveIbadah = async () => {
    if (!selectedMurid || !sholat) { toast.error('Lengkapi data'); return; }
    const entry: NilaiIbadah = {
      id: `ni${Date.now()}`, muridId: selectedMurid, mentorId: user!.id, tanggal,
      sholat: clamp(sholat), adab: clamp(adab), kedisiplinan: clamp(kedisiplinan), keaktifan: clamp(keaktifan), catatan,
    };
    const updated = [...nilaiIbadah, entry];
    await dataStore.syncNilaiIbadah(updated);
    setNilaiIbadah(updated);
    toast.success('Nilai ibadah tersimpan');
    setSholat(''); setAdab(''); setKedisiplinan(''); setKeaktifan(''); setCatatan('');
  };

  const saveTahsin = async () => {
    if (!selectedMurid || !makharijul) { toast.error('Lengkapi data'); return; }
    const entry: NilaiTahsin = {
      id: `nt${Date.now()}`, muridId: selectedMurid, mentorId: user!.id, tanggal,
      makharijulHuruf: clamp(makharijul), tajwid: clamp(tajwid), kelancaran: clamp(kelancaran), adabMembaca: clamp(adabMembaca), catatan,
    };
    const updated = [...nilaiTahsin, entry];
    await dataStore.syncNilaiTahsin(updated);
    setNilaiTahsin(updated);
    toast.success('Nilai tahsin tersimpan');
    setMakharijul(''); setTajwid(''); setKelancaran(''); setAdabMembaca(''); setCatatan('');
  };

  const saveDoa = async () => {
    if (!selectedMurid || !hafalan) { toast.error('Lengkapi data'); return; }
    const entry: NilaiDoa = {
      id: `nd${Date.now()}`, muridId: selectedMurid, mentorId: user!.id, tanggal,
      hafalan: clamp(hafalan), kelancaran: clamp(kelancaranDoa), pemahaman: clamp(pemahaman), catatan,
    };
    const updated = [...nilaiDoa, entry];
    await dataStore.syncNilaiDoa(updated);
    setNilaiDoa(updated);
    toast.success('Nilai doa tersimpan');
    setHafalan(''); setKelancaranDoa(''); setPemahaman(''); setCatatan('');
  };

  const selectedNama = myMurid.find((m) => m.id === selectedMurid)?.nama || '';

  const ScoreInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type="number" min="0" max="100" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0-100" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Input Nilai</h1>
        <p className="font-body text-muted-foreground mt-1">Masukkan nilai untuk murid di kelompok Anda</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pilih Murid</Label>
              <select
                value={selectedMurid}
                onChange={(e) => setSelectedMurid(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-heading"
              >
                {myMurid.map((m) => (
                  <option key={m.id} value={m.id}>{m.nama}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Penilaian</Label>
              <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedNama && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="font-heading text-sm text-primary font-medium">Menginput nilai untuk: {selectedNama}</p>
        </div>
      )}

      <Tabs defaultValue="ibadah">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ibadah" className="font-heading text-xs sm:text-sm">Ibadah</TabsTrigger>
          <TabsTrigger value="tahsin" className="font-heading text-xs sm:text-sm">Tahsin</TabsTrigger>
          <TabsTrigger value="doa" className="font-heading text-xs sm:text-sm">Doa</TabsTrigger>
        </TabsList>

        <TabsContent value="ibadah">
          <Card className="border-border">
            <CardHeader><CardTitle className="font-heading text-base">Nilai Ibadah</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ScoreInput label="Sholat" value={sholat} onChange={setSholat} />
                <ScoreInput label="Adab" value={adab} onChange={setAdab} />
                <ScoreInput label="Kedisiplinan" value={kedisiplinan} onChange={setKedisiplinan} />
                <ScoreInput label="Keaktifan" value={keaktifan} onChange={setKeaktifan} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Catatan Mentor</Label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} placeholder="Catatan perkembangan..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none" />
              </div>
              <Button onClick={saveIbadah} className="w-full">Simpan Nilai Ibadah</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tahsin">
          <Card className="border-border">
            <CardHeader><CardTitle className="font-heading text-base">Nilai Tahsin</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ScoreInput label="Makharijul Huruf" value={makharijul} onChange={setMakharijul} />
                <ScoreInput label="Tajwid" value={tajwid} onChange={setTajwid} />
                <ScoreInput label="Kelancaran" value={kelancaran} onChange={setKelancaran} />
                <ScoreInput label="Adab Membaca" value={adabMembaca} onChange={setAdabMembaca} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Catatan Mentor</Label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} placeholder="Catatan perkembangan..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none" />
              </div>
              <Button onClick={saveTahsin} className="w-full">Simpan Nilai Tahsin</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doa">
          <Card className="border-border">
            <CardHeader><CardTitle className="font-heading text-base">Nilai Doa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ScoreInput label="Hafalan Doa" value={hafalan} onChange={setHafalan} />
                <ScoreInput label="Kelancaran Doa" value={kelancaranDoa} onChange={setKelancaranDoa} />
                <ScoreInput label="Pemahaman Doa" value={pemahaman} onChange={setPemahaman} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Catatan Mentor</Label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} placeholder="Catatan perkembangan..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none" />
              </div>
              <Button onClick={saveDoa} className="w-full">Simpan Nilai Doa</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InputNilaiPage;
