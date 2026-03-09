import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Star, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const allMurid = dataStore.getMurid();
  const nilaiIbadah = dataStore.getNilaiIbadah();
  const nilaiTahsin = dataStore.getNilaiTahsin();
  const nilaiDoa = dataStore.getNilaiDoa();

  const myMurid = user?.role === 'mentor'
    ? allMurid.filter((m) => m.mentorId === user.id)
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
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {user?.role === 'mentor' ? `Dashboard — Kelompok ${user.name}` : 'Dashboard Anak Saya'}
        </h1>
        <p className="font-body text-muted-foreground mt-1">Ringkasan perkembangan santri</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`${stat.color} opacity-80`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="font-heading text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Perkembangan Nilai</CardTitle>
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

      {user?.role === 'mentor' && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Daftar Murid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myMurid.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-heading text-sm font-medium text-foreground">{m.nama}</p>
                    <p className="font-body text-xs text-muted-foreground">{m.umur} tahun • {m.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                  </div>
                </div>
              ))}
              {myMurid.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-8">Belum ada murid dalam kelompok Anda</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
