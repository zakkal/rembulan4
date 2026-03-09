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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Moon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Rembulan 4</h1>
            <p className="font-body text-muted-foreground">Sistem Monitoring Nilai Santri</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('mentor')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Masuk sebagai Mentor
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Kelola data murid, input nilai, dan pantau perkembangan kelompok Anda
              </p>
            </button>

            <button
              onClick={() => setSelectedRole('wali')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Masuk sebagai Wali Murid
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Pantau perkembangan ibadah dan pembelajaran anak Anda
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Belum punya akun?{' '}
            <button onClick={() => navigate('/register')} className="text-primary font-heading font-medium hover:underline">
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Moon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {selectedRole === 'mentor' ? 'Login Mentor' : 'Login Wali Murid'}
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Ingat saya</Label>
          </div>

          <Button type="submit" className="w-full">Masuk</Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => setSelectedRole(null)}
            className="text-sm text-muted-foreground hover:text-foreground font-heading"
          >
            ← Kembali pilih peran
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Belum punya akun?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-heading font-medium hover:underline">
            Daftar
          </button>
        </p>

        {/* Demo credentials hint */}
        <div className="mt-8 p-4 rounded-lg bg-accent/30 border border-accent">
          <p className="font-heading text-xs font-medium text-foreground mb-1">Demo akun:</p>
          <p className="font-body text-xs text-muted-foreground">
            Mentor: ahmad@mail.com / 123456<br />
            Wali: budi@mail.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
