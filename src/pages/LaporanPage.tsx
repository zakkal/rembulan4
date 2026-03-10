import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, Murid, NilaiIbadah, NilaiTahsin, NilaiDoa } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

const LaporanPage = () => {
  const { user } = useAuth();
  const [allMurid, setAllMurid] = useState<Murid[]>([]);
  const [nilaiIbadah, setNilaiIbadah] = useState<NilaiIbadah[]>([]);
  const [nilaiTahsin, setNilaiTahsin] = useState<NilaiTahsin[]>([]);
  const [nilaiDoa, setNilaiDoa] = useState<NilaiDoa[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
        console.error('Failed to fetch report data', e);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const myMurid = user?.role === 'mentor'
    ? allMurid.filter((m) => m.mentorId === String(user.id))
    : allMurid.filter((m) => m.id === user?.muridId);

  const [selectedMuridId, setSelectedMuridId] = useState('');

  useEffect(() => {
    if (myMurid.length > 0 && !selectedMuridId) {
      setSelectedMuridId(myMurid[0].id);
    }
  }, [myMurid, selectedMuridId]);

  const selectedMurid = myMurid.find((m) => m.id === selectedMuridId);

  const muridIbadah = nilaiIbadah.filter((n) => n.muridId === selectedMuridId).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const muridTahsin = nilaiTahsin.filter((n) => n.muridId === selectedMuridId).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const muridDoa = nilaiDoa.filter((n) => n.muridId === selectedMuridId).sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  if (isLoadingData) {
    return <div className="flex items-center justify-center min-h-[400px] text-primary/50 font-heading">Memuat data...</div>;
  }

  const avgIbadah = muridIbadah.length ? Math.round(muridIbadah.reduce((s, n) => s + (n.sholat + n.adab + n.kedisiplinan + n.keaktifan) / 4, 0) / muridIbadah.length) : 0;
  const avgTahsin = muridTahsin.length ? Math.round(muridTahsin.reduce((s, n) => s + (n.makharijulHuruf + n.tajwid + n.kelancaran + n.adabMembaca) / 4, 0) / muridTahsin.length) : 0;
  const avgDoa = muridDoa.length ? Math.round(muridDoa.reduce((s, n) => s + (n.hafalan + n.kelancaran + n.pemahaman) / 3, 0) / muridDoa.length) : 0;

  // Chart data
  const dateSet = new Set<string>();
  muridIbadah.forEach((n) => dateSet.add(n.tanggal));
  muridTahsin.forEach((n) => dateSet.add(n.tanggal));
  muridDoa.forEach((n) => dateSet.add(n.tanggal));
  const dates = Array.from(dateSet).sort();

  const chartData = dates.map((date) => {
    const ib = muridIbadah.find((n) => n.tanggal === date);
    const ts = muridTahsin.find((n) => n.tanggal === date);
    const doa = muridDoa.find((n) => n.tanggal === date);
    return {
      tanggal: date.slice(5),
      ibadah: ib ? Math.round((ib.sholat + ib.adab + ib.kedisiplinan + ib.keaktifan) / 4) : null,
      tahsin: ts ? Math.round((ts.makharijulHuruf + ts.tajwid + ts.kelancaran + ts.adabMembaca) / 4) : null,
      doa: doa ? Math.round((doa.hafalan + doa.kelancaran + doa.pemahaman) / 3) : null,
    };
  });

  const handleDownloadPdf = () => {
    // Simple text-based report download
    let content = `LAPORAN PERKEMBANGAN SANTRI\nProgram Rembulan 4\n\n`;
    content += `Nama: ${selectedMurid?.nama}\n`;
    content += `Umur: ${selectedMurid?.umur} tahun\n\n`;
    content += `RATA-RATA NILAI\n`;
    content += `Ibadah: ${avgIbadah}\nTahsin: ${avgTahsin}\nDoa: ${avgDoa}\n\n`;
    content += `RIWAYAT NILAI IBADAH\n`;
    muridIbadah.forEach((n) => {
      content += `${n.tanggal} — Sholat: ${n.sholat}, Adab: ${n.adab}, Kedisiplinan: ${n.kedisiplinan}, Keaktifan: ${n.keaktifan}\n  Catatan: ${n.catatan}\n`;
    });
    content += `\nRIWAYAT NILAI TAHSIN\n`;
    muridTahsin.forEach((n) => {
      content += `${n.tanggal} — Makharijul: ${n.makharijulHuruf}, Tajwid: ${n.tajwid}, Kelancaran: ${n.kelancaran}, Adab: ${n.adabMembaca}\n  Catatan: ${n.catatan}\n`;
    });
    content += `\nRIWAYAT NILAI DOA\n`;
    muridDoa.forEach((n) => {
      content += `${n.tanggal} — Hafalan: ${n.hafalan}, Kelancaran: ${n.kelancaran}, Pemahaman: ${n.pemahaman}\n  Catatan: ${n.catatan}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_${selectedMurid?.nama?.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Laporan Nilai</h1>
          <p className="font-body text-muted-foreground mt-1">
            {user?.role === 'mentor' ? 'Laporan perkembangan murid' : 'Laporan perkembangan anak'}
          </p>
        </div>
        {selectedMurid && (
          <Button onClick={handleDownloadPdf} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Laporan
          </Button>
        )}
      </div>

      {myMurid.length > 1 && (
        <div className="max-w-xs">
          <select
            value={selectedMuridId}
            onChange={(e) => setSelectedMuridId(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-heading"
          >
            {myMurid.map((m) => (
              <option key={m.id} value={m.id}>{m.nama}</option>
            ))}
          </select>
        </div>
      )}

      {selectedMurid && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <p className="font-heading text-3xl font-bold text-primary">{avgIbadah}</p>
                <p className="font-heading text-xs text-muted-foreground mt-1">Rata-rata Ibadah</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <p className="font-heading text-3xl font-bold text-chart-5">{avgTahsin}</p>
                <p className="font-heading text-xs text-muted-foreground mt-1">Rata-rata Tahsin</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <p className="font-heading text-3xl font-bold text-chart-4">{avgDoa}</p>
                <p className="font-heading text-xs text-muted-foreground mt-1">Rata-rata Doa</p>
              </CardContent>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Grafik Perkembangan — {selectedMurid.nama}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(33 15% 85%)" />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
                      <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13 }} />
                      <Legend wrapperStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13 }} />
                      <Line type="monotone" dataKey="ibadah" name="Ibadah" stroke="hsl(212 72% 59%)" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" dataKey="tahsin" name="Tahsin" stroke="hsl(212 60% 45%)" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" dataKey="doa" name="Doa" stroke="hsl(248 39% 39%)" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Riwayat Nilai */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Riwayat Nilai</h2>

            {muridIbadah.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="font-heading text-base">Nilai Ibadah</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {muridIbadah.map((n) => (
                      <div key={n.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-heading text-xs font-medium text-muted-foreground">{n.tanggal}</p>
                          <p className="font-heading text-sm font-bold text-primary">
                            {Math.round((n.sholat + n.adab + n.kedisiplinan + n.keaktifan) / 4)}
                          </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs font-body text-muted-foreground">
                          <span>Sholat: {n.sholat}</span>
                          <span>Adab: {n.adab}</span>
                          <span>Disiplin: {n.kedisiplinan}</span>
                          <span>Aktif: {n.keaktifan}</span>
                        </div>
                        {n.catatan && <p className="font-body text-xs text-muted-foreground mt-2 italic">"{n.catatan}"</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {muridTahsin.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="font-heading text-base">Nilai Tahsin</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {muridTahsin.map((n) => (
                      <div key={n.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-heading text-xs font-medium text-muted-foreground">{n.tanggal}</p>
                          <p className="font-heading text-sm font-bold text-chart-5">
                            {Math.round((n.makharijulHuruf + n.tajwid + n.kelancaran + n.adabMembaca) / 4)}
                          </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs font-body text-muted-foreground">
                          <span>Makharij: {n.makharijulHuruf}</span>
                          <span>Tajwid: {n.tajwid}</span>
                          <span>Lancar: {n.kelancaran}</span>
                          <span>Adab: {n.adabMembaca}</span>
                        </div>
                        {n.catatan && <p className="font-body text-xs text-muted-foreground mt-2 italic">"{n.catatan}"</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {muridDoa.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="font-heading text-base">Nilai Doa</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {muridDoa.map((n) => (
                      <div key={n.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-heading text-xs font-medium text-muted-foreground">{n.tanggal}</p>
                          <p className="font-heading text-sm font-bold text-chart-4">
                            {Math.round((n.hafalan + n.kelancaran + n.pemahaman) / 3)}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs font-body text-muted-foreground">
                          <span>Hafalan: {n.hafalan}</span>
                          <span>Lancar: {n.kelancaran}</span>
                          <span>Paham: {n.pemahaman}</span>
                        </div>
                        {n.catatan && <p className="font-body text-xs text-muted-foreground mt-2 italic">"{n.catatan}"</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {myMurid.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-muted-foreground">Belum ada data murid</p>
        </div>
      )}
    </div>
  );
};

export default LaporanPage;
