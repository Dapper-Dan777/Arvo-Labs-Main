import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Mail, Lock, User, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { calculatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthLabel, type PasswordStrength } from "@/lib/passwordStrength";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Login States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    // Lade "Angemeldet bleiben" Präferenz aus localStorage
    return localStorage.getItem('arvo_remember_me') === 'true';
  });
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  
  // Register States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordStrength = calculatePasswordStrength(registerPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUsername || !loginPassword) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    const result = await login(loginUsername, loginPassword, twoFactorCode || undefined);
    
    if (result.success) {
      // Speichere "Angemeldet bleiben" Präferenz
      if (rememberMe) {
        localStorage.setItem('arvo_remember_me', 'true');
      } else {
        localStorage.removeItem('arvo_remember_me');
      }
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie werden zum Dashboard weitergeleitet...",
      });
      setRequires2FA(false);
      setTwoFactorCode("");
      // Weiterleitung zum Dashboard
      navigate("/dashboard");
    } else if (result.requires2FA) {
      setRequires2FA(true);
      toast({
        title: "2FA erforderlich",
        description: result.error || "Bitte geben Sie Ihren 2FA-Code ein.",
      });
    } else {
      setRequires2FA(false);
      setTwoFactorCode("");
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: result.error || "Benutzername oder Passwort ist falsch.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerUsername || !registerPassword || !registerConfirmPassword) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: "Fehler",
        description: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive",
      });
      return;
    }

    const result = await register(registerUsername, registerPassword, registerName, registerEmail);
    
    if (result.success) {
      toast({
        title: "Registrierung erfolgreich",
        description: "Ihr Account wurde erstellt. Bitte bestätigen Sie Ihre E-Mail-Adresse. Sie wurden zum Dashboard weitergeleitet...",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: result.error || "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implementiere Passwort-Reset-Funktion
    toast({
      title: "E-Mail gesendet",
      description: `Wir haben Ihnen eine E-Mail zum Zurücksetzen des Passworts an ${forgotPasswordEmail} gesendet.`,
    });
    setForgotPasswordOpen(false);
    setForgotPasswordEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh-background p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Arvo Labs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Willkommen zurück
          </p>
        </div>

        {/* Login/Register Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Dashboard Login
            </CardTitle>
            <CardDescription className="text-center">
              Melden Sie sich an, um auf Ihr Dashboard zuzugreifen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Anmelden</TabsTrigger>
                <TabsTrigger value="register">Registrieren</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Benutzername</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Ihr Benutzername"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="pl-10"
                        required
                        minLength={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Passwort</Label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                      >
                        Passwort vergessen?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                      Angemeldet bleiben
                    </Label>
                  </div>
                  {requires2FA && (
                    <div className="space-y-2">
                      <Label htmlFor="login-2fa">2FA-Code</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-2fa"
                          type="text"
                          placeholder="6-stelliger Code"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="pl-10"
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Geben Sie den Code aus Ihrer Authenticator-App ein</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird angemeldet..." : requires2FA ? "2FA-Code bestätigen" : "Anmelden"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Vollständiger Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Ihr vollständiger Name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-Mail-Adresse</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="ihre@email.de"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Wir senden Ihnen eine Bestätigungs-E-Mail</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Benutzername</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Benutzername (min. 3 Zeichen)"
                        value={registerUsername}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                          setRegisterUsername(value);
                        }}
                        className="pl-10"
                        required
                        minLength={3}
                        pattern="[a-zA-Z0-9_]+"
                        title="Nur Buchstaben, Zahlen und Unterstriche erlaubt"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Nur Buchstaben, Zahlen und Unterstriche</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Passwort</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Mindestens 6 Zeichen"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {registerPassword && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Passwort-Stärke:</span>
                          <span className={cn(
                            "font-medium",
                            passwordStrength.strength === "weak" && "text-red-500",
                            passwordStrength.strength === "fair" && "text-orange-500",
                            passwordStrength.strength === "good" && "text-yellow-500",
                            passwordStrength.strength === "strong" && "text-green-500"
                          )}>
                            {getPasswordStrengthLabel(passwordStrength.strength)}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength.score} 
                          className="h-2"
                        />
                        {passwordStrength.feedback.length > 0 && (
                          <div className="space-y-1">
                            {passwordStrength.feedback.map((msg, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <XCircle className="h-3 w-3" />
                                <span>{msg}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {passwordStrength.strength === "strong" && (
                          <div className="flex items-center gap-1.5 text-xs text-green-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Sehr sicheres Passwort!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Passwort bestätigen</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Passwort wiederholen"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className={cn(
                          "pl-10 pr-10",
                          registerConfirmPassword && registerPassword !== registerConfirmPassword && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                      <div className="flex items-center gap-1.5 text-xs text-red-500">
                        <XCircle className="h-3 w-3" />
                        <span>Passwörter stimmen nicht überein</span>
                      </div>
                    )}
                    {registerConfirmPassword && registerPassword === registerConfirmPassword && registerPassword.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-green-500">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Passwörter stimmen überein</span>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird registriert..." : "Registrieren"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Mit der Anmeldung akzeptieren Sie unsere{" "}
          <Link to="/help" className="text-purple-600 hover:underline dark:text-purple-400">
            Nutzungsbedingungen
          </Link>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passwort zurücksetzen</DialogTitle>
            <DialogDescription>
              Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-password-email">E-Mail-Adresse</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="forgot-password-email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotPasswordOpen(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit">
                Link senden
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

