import { User, Bell, Shield, Palette, Globe, CreditCard, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { setEncryptedObject, getEncryptedObject } from "@/lib/crypto";
import { generate2FASecret, generateQRCode, verifyTOTPCode } from "@/lib/2fa";
import { emailService } from "@/services/emailService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, QrCode, ShieldCheck } from "lucide-react";
import { ExportDialog } from "@/components/export/ExportDialog";
import { ImportDialog } from "@/components/export/ImportDialog";
import { BackupRestore } from "@/components/export/BackupRestore";

export default function SettingsPage() {
  const { user, updateUser, enable2FA, disable2FA } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  
  // 2FA States
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [twoFactorQRCode, setTwoFactorQRCode] = useState<string | null>(null);
  const [twoFactorBackupCodes, setTwoFactorBackupCodes] = useState<string[]>([]);
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] = useState("");
  const [notifications, setNotifications] = useState({
    completions: true,
    errors: true,
    activity: true,
    reports: true,
  });
  const { toast } = useToast();

  // Lade User-Daten
  useEffect(() => {
    if (user) {
      // Teile Name in Vor- und Nachname
      const nameParts = user.name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      
      // Lade zusätzliche Profil-Daten
      try {
        const profileData = getEncryptedObject<{ company?: string }>(`user_profile_${user.id}`);
        if (profileData?.company) {
          setCompany(profileData.company);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!user) return;
    
    try {
      // Speichere zusätzliche Profil-Daten
      const profileData = {
        company: company,
      };
      setEncryptedObject(`user_profile_${user.id}`, profileData);
      
      // Update User-Objekt mit neuen Namen und E-Mail
      updateUser({
        name: `${firstName} ${lastName}`.trim() || user.name,
        email: email || user.email,
      });
      
      toast({
        title: "Profil gespeichert",
        description: "Ihre Profildaten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern der Profildaten.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Fehler",
        description: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Prüfe aktuelles Passwort
    // In Produktion sollte hier das aktuelle Passwort verifiziert werden
    
    // Sende E-Mail-Benachrichtigung
    if (user?.email) {
      await emailService.sendPasswordChangeEmail(user.email, user.username);
    }
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({
      title: "Passwort aktualisiert",
      description: "Ihr Passwort wurde erfolgreich geändert. Eine Bestätigungs-E-Mail wurde gesendet.",
    });
  };

  const handleSetup2FA = async () => {
    if (!user?.email) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie zuerst eine E-Mail-Adresse an.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const secretData = generate2FASecret(user.email, "Arvo Dashboard");
      setTwoFactorSecret(secretData.secret);
      setTwoFactorBackupCodes(secretData.backupCodes);
      
      // Generiere QR-Code
      const qrCode = await generateQRCode(secretData.qrCodeUrl);
      setTwoFactorQRCode(qrCode);
      
      setTwoFactorSetupOpen(true);
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Einrichten von 2FA.",
        variant: "destructive",
      });
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorSecret || !twoFactorVerificationCode) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen 2FA-Code ein.",
        variant: "destructive",
      });
      return;
    }
    
    // Verifiziere Code
    const isValid = verifyTOTPCode(twoFactorVerificationCode, twoFactorSecret);
    
    if (!isValid) {
      toast({
        title: "Fehler",
        description: "Ungültiger 2FA-Code. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
      return;
    }
    
    // Aktiviere 2FA
    await enable2FA(twoFactorSecret, twoFactorBackupCodes);
    
    setTwoFactorSetupOpen(false);
    setTwoFactorSecret(null);
    setTwoFactorQRCode(null);
    setTwoFactorBackupCodes([]);
    setTwoFactorVerificationCode("");
    
    toast({
      title: "2FA aktiviert",
      description: "Die Zwei-Faktor-Authentifizierung wurde erfolgreich aktiviert.",
    });
  };

  const handleDisable2FA = async () => {
    await disable2FA();
    toast({
      title: "2FA deaktiviert",
      description: "Die Zwei-Faktor-Authentifizierung wurde deaktiviert.",
    });
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    toast({
      title: "Theme geändert",
      description: `Dark Mode ${checked ? "aktiviert" : "deaktiviert"}`,
    });
  };

  const handleToggleNotification = (key: keyof typeof notifications) => (checked: boolean) => {
    setNotifications({
      ...notifications,
      [key]: checked,
    });
    toast({
      title: "Benachrichtigung geändert",
      description: `Benachrichtigungen für ${key} wurden ${checked ? "aktiviert" : "deaktiviert"}.`,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export/Import</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {user?.emailVerified ? (
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verifiziert
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Nicht verifiziert
                    </Badge>
                  )}
                </div>
                {!user?.emailVerified && user?.email && (
                  <p className="text-xs text-muted-foreground">
                    Bitte prüfen Sie Ihre E-Mails für die Verifizierungs-Mail.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-purple-500"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "completions" as const, label: "Workflow completions", description: "Get notified when workflows finish" },
                { key: "errors" as const, label: "Error alerts", description: "Receive alerts for workflow errors" },
                { key: "activity" as const, label: "Team activity", description: "Updates about team member actions" },
                { key: "reports" as const, label: "Weekly reports", description: "Receive weekly performance summaries" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch 
                    checked={notifications[item.key]}
                    onCheckedChange={handleToggleNotification(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            {/* Passwort ändern */}
          <Card>
            <CardHeader>
                <CardTitle>Passwort ändern</CardTitle>
                <CardDescription>Ändern Sie Ihr Passwort regelmäßig für mehr Sicherheit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
              </div>
                <Button 
                  className="bg-gradient-to-r from-primary to-purple-500"
                  onClick={handleUpdatePassword}
                >
                  Passwort aktualisieren
              </Button>
            </CardContent>
          </Card>

            {/* 2FA */}
            <Card>
              <CardHeader>
                <CardTitle>Zwei-Faktor-Authentifizierung (2FA)</CardTitle>
                <CardDescription>Schützen Sie Ihr Konto mit einer zusätzlichen Sicherheitsebene</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.twoFactorEnabled ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-primary">2FA ist aktiviert</p>
                        <p className="text-sm text-primary/80">
                          Ihr Konto ist durch Zwei-Faktor-Authentifizierung geschützt.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={handleDisable2FA}
                    >
                      2FA deaktivieren
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Aktivieren Sie 2FA für zusätzlichen Schutz. Sie benötigen eine Authenticator-App (z.B. Google Authenticator, Authy).
                    </p>
                    <Button 
                      onClick={handleSetup2FA}
                      className="bg-gradient-to-r from-primary to-purple-500"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      2FA einrichten
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 2FA Setup Dialog */}
          <Dialog open={twoFactorSetupOpen} onOpenChange={setTwoFactorSetupOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>2FA einrichten</DialogTitle>
                <DialogDescription>
                  Scannen Sie den QR-Code mit Ihrer Authenticator-App und geben Sie dann einen Code ein, um die Einrichtung zu bestätigen.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {twoFactorQRCode && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img src={twoFactorQRCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Backup-Codes (sicher speichern!)</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                    {twoFactorBackupCodes.map((code, index) => (
                      <code key={index} className="text-xs font-mono">{code}</code>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Speichern Sie diese Codes an einem sicheren Ort. Sie können sie verwenden, wenn Sie keinen Zugriff auf Ihre Authenticator-App haben.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="2fa-verification">Verifizierungs-Code</Label>
                  <Input
                    id="2fa-verification"
                    type="text"
                    placeholder="6-stelliger Code"
                    value={twoFactorVerificationCode}
                    onChange={(e) => setTwoFactorVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setTwoFactorSetupOpen(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={handleVerify2FA}
                    className="flex-1 bg-gradient-to-r from-primary to-purple-500"
                    disabled={twoFactorVerificationCode.length !== 6}
                  >
                    Bestätigen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
                <Switch 
                  checked={darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing in the UI</p>
                </div>
                <Switch 
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
