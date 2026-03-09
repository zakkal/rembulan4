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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Moon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Daftar Akun</h1>
            <p className="font-body text-muted-foreground">Pilih peran Anda di Program Rembulan 4</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setRole('mentor')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-secondary hover:shadow-md transition-all text-left group"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
                Daftar sebagai Mentor
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Buat kelompok dan mulai membimbing santri
              </p>
            </button>

            <button
              onClick={() => setRole('wali')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Daftar sebagai Wali Murid
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Pantau perkembangan anak Anda
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Sudah punya akun?{' '}
            <button onClick={() => navigate('/login')} className="text-primary font-heading font-medium hover:underline">
              Masuk
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Moon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Daftar {role === 'mentor' ? 'Mentor' : 'Wali Murid'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama lengkap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="contoh@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa">Nomor WhatsApp</Label>
            <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="08xxxxxxxxxx" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Konfirmasi Password</Label>
            <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Ulangi password" />
          </div>

          {role === 'wali' && (
            <div className="space-y-2">
              <Label htmlFor="murid">Pilih Anak/Murid</Label>
              <select
                id="murid"
                value={muridId}
                onChange={(e) => setMuridId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-heading"
                required
              >
                <option value="">-- Pilih murid --</option>
                {allMurid.map((m) => (
                  <option key={m.id} value={m.id}>{m.nama} (ID: {m.id})</option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" className="w-full mt-2">Daftar</Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button onClick={() => setRole(null)} className="text-sm text-muted-foreground hover:text-foreground font-heading">
            ← Kembali pilih peran
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Sudah punya akun?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-heading font-medium hover:underline">
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
