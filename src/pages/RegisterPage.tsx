import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [muridId, setMuridId] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const allMurid = dataStore.getMurid();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    if (role === 'wali' && !muridId) {
      toast.error('Silakan pilih murid');
      return;
    }

    const success = register({ name, email, whatsapp, password, role, muridId: role === 'wali' ? muridId : undefined });
    if (success) {
      toast.success('Pendaftaran berhasil!');
      navigate('/');
    } else {
      toast.error('Email sudah terdaftar');
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(124,177,232,0.3)] mb-6">
              <Moon className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-3 tracking-wide">Daftar Akun</h1>
            <p className="font-body text-primary/80 tracking-widest uppercase text-sm font-semibold">Program Rembulan 2026</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setRole('mentor')}
              className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,177,232,0.2)] transition-all text-left group"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Daftar sebagai Mentor
              </h3>
              <p className="font-body text-sm text-foreground/70 mt-2 leading-relaxed">
                Buat kelompok dan mulai membimbing santri
              </p>
            </button>

            <button
              onClick={() => setRole('wali')}
              className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,177,232,0.2)] transition-all text-left group"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Daftar sebagai Wali Murid
              </h3>
              <p className="font-body text-sm text-foreground/70 mt-2 leading-relaxed">
                Pantau perkembangan ibadah dan pembelajaran anak Anda
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-foreground/60 mt-10">
            Sudah punya akun?{' '}
            <button onClick={() => navigate('/login')} className="text-primary font-heading font-medium hover:text-white transition-colors hover:underline">
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-8 relative z-10">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-[0_0_20px_rgba(124,177,232,0.3)] mb-4">
            <Moon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground tracking-wide">
            Daftar {role === 'mentor' ? 'Mentor' : 'Wali Murid'}
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Nama Lengkap</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama lengkap" className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="contoh@email.com" className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa" className="text-foreground/80">Nomor WhatsApp</Label>
              <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="08xxxxxxxxxx" className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-foreground/80">Konfirmasi Password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Ulangi password" className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50" />
            </div>

            {role === 'wali' && (
              <div className="space-y-2">
                <Label htmlFor="murid" className="text-foreground/80">Pilih Anak/Murid</Label>
                <select
                  id="murid"
                  value={muridId}
                  onChange={(e) => setMuridId(e.target.value)}
                  className="w-full h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm font-heading text-foreground focus-visible:ring-1 focus-visible:ring-primary/50 outline-none"
                  required
                >
                  <option value="" className="bg-[#0a1930] text-foreground">-- Pilih murid --</option>
                  {allMurid.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0a1930] text-foreground">{m.nama} (ID: {m.id})</option>
                  ))}
                </select>
              </div>
            )}

            <Button type="submit" className="w-full mt-4 font-heading font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(124,177,232,0.4)]">Daftar</Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button onClick={() => setRole(null)} className="text-sm text-foreground/60 hover:text-white font-heading transition-colors">
              ← Kembali pilih peran
            </button>
          </div>

          <p className="text-center text-sm text-foreground/50 mt-6">
            Sudah punya akun?{' '}
            <button onClick={() => navigate('/login')} className="text-primary font-heading font-medium hover:text-white transition-colors hover:underline">
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
