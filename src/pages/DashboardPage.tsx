import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, Murid, NilaiIbadah, NilaiTahsin, NilaiDoa } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Star, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardPage = () => {
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
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (isLoadingData) {
    return <div className="flex items-center justify-center min-h-[400px] text-primary/50 font-heading">Memuat data...</div>;
  }

  const myMurid = user?.role === 'mentor'
    ? allMurid.filter((m) => m.mentorId === String(user.id))
    : allMurid.filter((m) => m.id === user?.muridId);

  const myMuridIds = myMurid.map((m) => m.id);

  const myNilaiIbadah = nilaiIbadah.filter((n) => myMuridIds.includes(n.muridId));
  const myNilaiTahsin = nilaiTahsin.filter((n) => myMuridIds.includes(n.muridId));
  const myNilaiDoa = nilaiDoa.filter((n) => myMuridIds.includes(n.muridId));

  const avgIbadah = myNilaiIbadah.length > 0
    ? Math.round(myNilaiIbadah.reduce((sum, n) => sum + (n.sholat + n.adab + n.kedisiplinan + n.keaktifan) / 4, 0) / myNilaiIbadah.length)
    : 0;

  const avgTahsin = myNilaiTahsin.length > 0
    ? Math.round(myNilaiTahsin.reduce((sum, n) => sum + (n.makharijulHuruf + n.tajwid + n.kelancaran + n.adabMembaca) / 4, 0) / myNilaiTahsin.length)
    : 0;

  const avgDoa = myNilaiDoa.length > 0
    ? Math.round(myNilaiDoa.reduce((sum, n) => sum + (n.hafalan + n.kelancaran + n.pemahaman) / 3, 0) / myNilaiDoa.length)
    : 0;

  // Build chart data by date
  const dateSet = new Set<string>();
  myNilaiIbadah.forEach((n) => dateSet.add(n.tanggal));
  myNilaiTahsin.forEach((n) => dateSet.add(n.tanggal));
  myNilaiDoa.forEach((n) => dateSet.add(n.tanggal));
  const dates = Array.from(dateSet).sort();

  const chartData = dates.map((date) => {
    const ib = myNilaiIbadah.filter((n) => n.tanggal === date);
    const ts = myNilaiTahsin.filter((n) => n.tanggal === date);
    const doa = myNilaiDoa.filter((n) => n.tanggal === date);
    return {
      tanggal: date.slice(5), // MM-DD
      ibadah: ib.length ? Math.round(ib.reduce((s, n) => s + (n.sholat + n.adab + n.kedisiplinan + n.keaktifan) / 4, 0) / ib.length) : null,
      tahsin: ts.length ? Math.round(ts.reduce((s, n) => s + (n.makharijulHuruf + n.tajwid + n.kelancaran + n.adabMembaca) / 4, 0) / ts.length) : null,
      doa: doa.length ? Math.round(doa.reduce((s, n) => s + (n.hafalan + n.kelancaran + n.pemahaman) / 3, 0) / doa.length) : null,
    };
  });

  const stats = [
    { label: 'Total Murid', value: myMurid.length, icon: Users, color: 'text-primary' },
    { label: 'Rata-rata Ibadah', value: avgIbadah, icon: Heart, color: 'text-primary' },
    { label: 'Rata-rata Tahsin', value: avgTahsin, icon: BookOpen, color: 'text-chart-5' },
    { label: 'Rata-rata Doa', value: avgDoa, icon: Star, color: 'text-chart-4' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide drop-shadow-md">
          {user?.role === 'mentor' ? `Dashboard Kelompok ${user.name}` : 'Dashboard Anak Saya'}
        </h1>
        <p className="font-body text-primary/80 mt-2 tracking-widest uppercase text-sm font-semibold">Ringkasan Perkembangan Santri</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(124,177,232,0.15)] group">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 ${stat.color} opacity-90 group-hover:bg-primary/20 transition-colors`}>
                  <stat.icon className="h-6 w-6 DropShadow" />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-foreground drop-shadow-md">{stat.value}</p>
                  <p className="font-heading text-[10px] text-foreground/60 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-foreground/90 font-semibold tracking-wide">Perkembangan Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="tanggal" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
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

      {user?.role === 'mentor' && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-foreground/90 font-semibold tracking-wide">Daftar Murid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myMurid.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-heading text-base font-semibold text-foreground tracking-wide">{m.nama}</p>
                    <p className="font-body text-xs text-foreground/60 mt-1 uppercase tracking-widest">{m.umur} tahun • {m.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                  </div>
                </div>
              ))}
              {myMurid.length === 0 && (
                <p className="font-body text-sm text-foreground/50 text-center py-8">Belum ada murid dalam kelompok Anda</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
