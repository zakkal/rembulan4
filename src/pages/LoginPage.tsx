import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Silakan pilih peran terlebih dahulu');
      return;
    }
    const success = login(email, password, selectedRole);
    if (success) {
      toast.success('Berhasil masuk');
      navigate('/');
    } else {
      toast.error('Email atau password salah');
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(124,177,232,0.3)] mb-6">
              <Moon className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-3 tracking-wide">Rembulan <span className="text-primary text-3xl align-super">2026</span></h1>
            <p className="font-body text-primary/80 tracking-widest uppercase text-sm font-semibold">Sistem Monitoring Nilai Santri</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('mentor')}
              className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,177,232,0.2)] transition-all text-left group"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Masuk sebagai Mentor
              </h3>
              <p className="font-body text-sm text-foreground/70 mt-2 leading-relaxed">
                Kelola data murid, input nilai, dan pantau perkembangan kelompok Anda
              </p>
            </button>

            <button
              onClick={() => setSelectedRole('wali')}
              className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,177,232,0.2)] transition-all text-left group"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Masuk sebagai Wali Murid
              </h3>
              <p className="font-body text-sm text-foreground/70 mt-2 leading-relaxed">
                Pantau perkembangan ibadah dan pembelajaran anak Anda
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-foreground/60 mt-10">
            Belum punya akun?{' '}
            <button onClick={() => navigate('/register')} className="text-primary font-heading font-medium hover:text-white transition-colors hover:underline">
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-[0_0_20px_rgba(124,177,232,0.3)] mb-4">
            <Moon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {selectedRole === 'mentor' ? 'Login Mentor' : 'Login Wali Murid'}
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary/50"
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-foreground/70 tracking-wide">Ingat saya</Label>
            </div>

            <Button type="submit" className="w-full font-heading font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(124,177,232,0.4)]">
              Masuk
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-foreground/60 hover:text-white font-heading transition-colors"
            >
              ← Kembali pilih peran
            </button>
          </div>

          <p className="text-center text-sm text-foreground/50 mt-6">
            Belum punya akun?{' '}
            <button onClick={() => navigate('/register')} className="text-primary font-heading font-medium hover:text-white transition-colors hover:underline">
              Daftar
            </button>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-8 p-4 rounded-xl bg-primary/5 backdrop-blur-md border border-primary/20 text-center">
          <p className="font-heading text-xs uppercase tracking-widest font-semibold text-primary/80 mb-2">Demo akun</p>
          <p className="font-body text-xs text-foreground/60 leading-relaxed">
            Mentor: ahmad@mail.com / 123456<br />
            Wali: budi@mail.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
