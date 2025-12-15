import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import campusImage from '@/assets/campus-espe.jpg';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Inicio de sesión exitoso",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Campus Image */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        <img
          src='https://srvcas.espe.edu.ec/authenticationendpoint/images/espe4.jpg'
          alt="Campus ESPE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10" />
      </div>

      {/* Right side - Login Form */}
      <div className="relative z-10 w-full lg:w-2/5 flex flex-col items-center justify-center p-8 bg-card shadow-[-30px_0_40px_5px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <img src='https://userscontent2.emaze.com/images/276ba692-d1be-4648-b485-73a553126b40/61f9b780ffdabdd4c0fb185be61146dd.png' alt='Logo ESPE'/>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Ingrese su usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-border"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="espe"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center">
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña? <span className="font-medium">haz click aquí</span>
              </a>
            </div>
          </form>

          {/* Demo credentials 
          <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium text-foreground mb-2">Credenciales de prueba:</p>
            <p className="text-muted-foreground">Estudiante: estudiante@espe.edu.ec</p>
            <p className="text-muted-foreground">Técnico: tecnico@espe.edu.ec</p>
            <p className="text-muted-foreground">Contraseña: 123456</p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
