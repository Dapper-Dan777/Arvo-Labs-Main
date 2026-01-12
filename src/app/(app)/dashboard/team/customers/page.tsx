"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, Edit, Trash2, Mail, Loader2, Settings, X, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  getCustomersForUser,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
  CustomerInput,
} from "@/lib/customers";
import {
  getCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  CustomFieldDefinition,
} from "@/lib/customerFields";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";

export default function CustomersPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Fields State
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [newFieldDialogOpen, setNewFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null);
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ customerId: string; field: string } | null>(null);
  const [editingCellValue, setEditingCellValue] = useState("");

  // New Field Form State
  const [newFieldData, setNewFieldData] = useState({
    name: "",
    key: "",
    type: "text" as "text" | "number" | "dropdown" | "date" | "boolean",
    options: [] as string[],
    required: false,
  });
  const [newOption, setNewOption] = useState("");

  // Form State
  const [formData, setFormData] = useState<CustomerInput>({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    notes: "",
    custom_fields: {},
  });

  // Lade Kunden und Custom Fields beim Mount
  useEffect(() => {
    if (user?.id) {
      loadCustomers();
      loadCustomFields();
      initializeDefaultFields();
    } else {
      setLoading(false);
    }
  }, [user?.id]);


  // Initialisiere Standard-Felder (Prio, Ziel Preis, Notiz)
  const initializeDefaultFields = async () => {
    if (!user?.id) return;

    const fields = await getCustomFields(user.id);
    const fieldKeys = fields.map(f => f.key);

    // Erstelle Prio-Feld, falls noch nicht vorhanden
    if (!fieldKeys.includes('prio')) {
      try {
        await createCustomField(user.id, {
          name: "Prio",
          key: "prio",
          type: "dropdown",
          options: ["Niedrig", "Mittel", "Hoch", "Sehr Hoch"],
          required: false,
        });
      } catch (error) {
        console.error("Error creating prio field:", error);
      }
    }

    // Erstelle Ziel Preis-Feld, falls noch nicht vorhanden
    if (!fieldKeys.includes('ziel_preis')) {
      try {
        await createCustomField(user.id, {
          name: "Ziel Preis",
          key: "ziel_preis",
          type: "number",
          required: false,
        });
      } catch (error) {
        console.error("Error creating ziel_preis field:", error);
      }
    }

    // Erstelle Notiz-Feld, falls noch nicht vorhanden
    if (!fieldKeys.includes('notiz')) {
      try {
        await createCustomField(user.id, {
          name: "Notiz",
          key: "notiz",
          type: "text",
          required: false,
        });
      } catch (error) {
        console.error("Error creating notiz field:", error);
      }
    }

    // Lade Felder neu, um die neuen Felder anzuzeigen
    await loadCustomFields();
  };

  const loadCustomers = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCustomersForUser(user.id);
      setCustomers(data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast({
        title: "Fehler",
        description: "Kunden konnten nicht geladen werden.",
        variant: "destructive",
      });
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomFields = async () => {
    if (!user?.id) {
      setCustomFields([]);
      return;
    }

    try {
      const fields = await getCustomFields(user.id);
      setCustomFields((fields || []).sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error("Error loading custom fields:", error);
      setCustomFields([]);
    }
  };

  const handleCreate = () => {
    setFormData({
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      notes: "",
      custom_fields: {},
    });
    setSelectedCustomer(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      company_name: customer.company_name,
      contact_name: customer.contact_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes || "",
      custom_fields: customer.custom_fields || {},
    });
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    if (!formData.company_name.trim()) {
      toast({
        title: "Fehler",
        description: "Firmenname ist ein Pflichtfeld.",
        variant: "destructive",
      });
      return;
    }

    // E-Mail Validierung (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData, user.id);
        toast({
          title: "Erfolgreich aktualisiert",
          description: `${formData.company_name} wurde erfolgreich aktualisiert.`,
        });
        setEditDialogOpen(false);
      } else {
        await createCustomer(formData, user.id);
        toast({
          title: "Kunde erstellt",
          description: `${formData.company_name} wurde erfolgreich erstellt.`,
        });
        setCreateDialogOpen(false);
      }

      await loadCustomers();
      
      setFormData({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        notes: "",
        custom_fields: {},
      });
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Fehler",
        description: "Kunde konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer || !user?.id) return;

    setIsSubmitting(true);
    try {
      await deleteCustomer(selectedCustomer.id, user.id);
      toast({
        title: "Kunde gelöscht",
        description: `${selectedCustomer.company_name} wurde erfolgreich gelöscht.`,
      });
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Fehler",
        description: "Kunde konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Field Handlers
  const handleAddNewField = () => {
    setNewFieldData({
      name: "",
      key: "",
      type: "text",
      options: [],
      required: false,
    });
    setNewOption("");
    setEditingField(null);
    setNewFieldDialogOpen(true);
  };

  const handleEditField = (field: CustomFieldDefinition) => {
    setNewFieldData({
      name: field.name,
      key: field.key,
      type: field.type,
      options: field.options || [],
      required: field.required || false,
    });
    setEditingField(field);
    setNewFieldDialogOpen(true);
  };

  const handleSaveField = async () => {
    if (!user?.id) return;

    if (!newFieldData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für das Feld ein.",
        variant: "destructive",
      });
      return;
    }

    // Generiere Key aus Name, falls nicht angegeben
    const key = newFieldData.key.trim() || 
      newFieldData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Prüfe auf Duplikate
    const existing = customFields.find(
      (f) => f.key === key && (!editingField || f.id !== editingField.id)
    );
    if (existing) {
      toast({
        title: "Fehler",
        description: "Ein Feld mit diesem Schlüssel existiert bereits.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingField) {
        await updateCustomField(user.id, editingField.id, {
          name: newFieldData.name,
          key: key,
          type: newFieldData.type,
          options: newFieldData.type === "dropdown" ? newFieldData.options : undefined,
          required: newFieldData.required,
        });
        toast({
          title: "Feld aktualisiert",
          description: "Das Feld wurde erfolgreich aktualisiert.",
        });
      } else {
        await createCustomField(user.id, {
          name: newFieldData.name,
          key: key,
          type: newFieldData.type,
          options: newFieldData.type === "dropdown" ? newFieldData.options : undefined,
          required: newFieldData.required,
        });
        toast({
          title: "Feld erstellt",
          description: "Das Feld wurde erfolgreich erstellt.",
        });
      }

      await loadCustomFields();
      setNewFieldDialogOpen(false);
      setEditingField(null);
    } catch (error) {
      console.error("Error saving field:", error);
      toast({
        title: "Fehler",
        description: "Feld konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!user?.id) return;

    try {
      await deleteCustomField(user.id, fieldId);
      toast({
        title: "Feld gelöscht",
        description: "Das Feld wurde erfolgreich gelöscht.",
      });
      await loadCustomFields();
    } catch (error) {
      console.error("Error deleting field:", error);
      toast({
        title: "Fehler",
        description: "Feld konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const addOption = () => {
    if (newOption.trim() && !newFieldData.options.includes(newOption.trim())) {
      setNewFieldData({
        ...newFieldData,
        options: [...newFieldData.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (option: string) => {
    setNewFieldData({
      ...newFieldData,
      options: newFieldData.options.filter((o) => o !== option),
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy", { locale: de });
    } catch {
      return dateString;
    }
  };

  const updateCustomFieldValue = (key: string, value: any) => {
    setFormData({
      ...formData,
      custom_fields: {
        ...formData.custom_fields,
        [key]: value,
      },
    });
  };

  const renderCustomFieldInput = (field: CustomFieldDefinition) => {
    const value = formData.custom_fields?.[field.key] || "";

    switch (field.type) {
      case "dropdown":
        return (
          <Select
            value={String(value)}
            onValueChange={(val) => updateCustomFieldValue(field.key, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Wählen Sie ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateCustomFieldValue(field.key, e.target.value ? Number(e.target.value) : null)}
            placeholder={field.name}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => updateCustomFieldValue(field.key, e.target.value || null)}
          />
        );
      case "boolean":
        return (
          <Select
            value={value === true ? "true" : value === false ? "false" : ""}
            onValueChange={(val) => updateCustomFieldValue(field.key, val === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen Sie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ja</SelectItem>
              <SelectItem value="false">Nein</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => updateCustomFieldValue(field.key, e.target.value)}
            placeholder={field.name}
          />
        );
    }
  };

  // Inline editing handlers
  const handleCellEdit = (customer: Customer, fieldKey: string) => {
    const field = customFields.find(f => f.key === fieldKey);
    if (!field) return;

    const currentValue = customer.custom_fields?.[fieldKey] || "";
    setEditingCell({ customerId: customer.id, field: fieldKey });
    setEditingCellValue(String(currentValue));
  };

  const handleCellSave = async () => {
    if (!editingCell || !user?.id) return;

    const customer = customers.find(c => c.id === editingCell.customerId);
    if (!customer) return;

    const field = customFields.find(f => f.key === editingCell.field);
    if (!field) return;

    // Konvertiere Wert basierend auf Feldtyp
    let convertedValue: any = editingCellValue;
    if (field.type === "number") {
      convertedValue = editingCellValue && editingCellValue.trim() !== "" 
        ? parseFloat(editingCellValue) 
        : null;
    } else if (field.type === "boolean") {
      convertedValue = editingCellValue === "true";
    } else if (field.type === "text") {
      convertedValue = editingCellValue.trim() || null;
    }

    try {
      const updatedCustomFields = {
        ...(customer.custom_fields || {}),
        [editingCell.field]: convertedValue,
      };

      await updateCustomer(
        customer.id,
        {
          company_name: customer.company_name,
          contact_name: customer.contact_name,
          email: customer.email,
          phone: customer.phone,
          notes: customer.notes,
          custom_fields: updatedCustomFields,
        },
        user.id
      );

      toast({
        title: "Gespeichert",
        description: `${field.name} wurde aktualisiert.`,
      });

      await loadCustomers();
      setEditingCell(null);
      setEditingCellValue("");
    } catch (error) {
      console.error("Error saving cell:", error);
      toast({
        title: "Fehler",
        description: "Wert konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingCellValue("");
  };

  // Helper: Prioritäts-Farben (nur Text-Farbe, kein Hintergrund)
  const getPrioColor = (prio: string): string => {
    if (!prio) return "text-muted-foreground";
    const prioLower = prio.toLowerCase().trim();
    if (prioLower === "niedrig") return "text-green-600 dark:text-green-400 font-medium";
    if (prioLower === "mittel") return "text-yellow-600 dark:text-yellow-400 font-medium";
    if (prioLower === "hoch") return "text-red-600 dark:text-red-400 font-medium";
    if (prioLower === "sehr hoch" || prioLower === "sehrhoch") return "text-red-700 dark:text-red-500 font-bold";
    return "text-foreground";
  };

  const renderCustomFieldValue = (customer: Customer, field: CustomFieldDefinition) => {
    const isEditing = editingCell?.customerId === customer.id && editingCell?.field === field.key;
    const value = customer.custom_fields?.[field.key];

    // Prio-Feld: Immer als Dropdown anzeigen
    if (field.key === 'prio' && field.type === 'dropdown' && field.options) {
      const currentValue = value || null;
      return (
        <Select
          value={currentValue ? String(currentValue) : undefined}
          onValueChange={async (val) => {
            try {
              const updatedCustomFields = {
                ...(customer.custom_fields || {}),
                [field.key]: val || null,
              };
              await updateCustomer(
                customer.id,
                {
                  company_name: customer.company_name,
                  contact_name: customer.contact_name,
                  email: customer.email,
                  phone: customer.phone,
                  notes: customer.notes,
                  custom_fields: updatedCustomFields,
                },
                user?.id || ""
              );
              await loadCustomers();
              toast({
                title: "Gespeichert",
                description: `Priorität wurde auf "${val}" gesetzt.`,
              });
            } catch (error) {
              console.error("Error updating prio:", error);
              toast({
                title: "Fehler",
                description: "Priorität konnte nicht gespeichert werden.",
                variant: "destructive",
              });
            }
          }}
        >
          <SelectTrigger className={`h-8 w-full border-0 bg-transparent hover:bg-muted px-2 ${currentValue ? getPrioColor(String(currentValue)) : 'text-muted-foreground'}`}>
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                <span className={getPrioColor(option)}>{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Inline-Editing Mode für andere Felder
    if (isEditing) {
      // Dropdown-Feld (nicht Prio)
      if (field.type === 'dropdown' && field.options) {
        return (
          <Select
            value={editingCellValue || undefined}
            onValueChange={(val) => {
              setEditingCellValue(val);
              // Auto-save für Dropdown
              const updatedCustomFields = {
                ...(customer.custom_fields || {}),
                [field.key]: val || null,
              };
              updateCustomer(
                customer.id,
                {
                  company_name: customer.company_name,
                  contact_name: customer.contact_name,
                  email: customer.email,
                  phone: customer.phone,
                  notes: customer.notes,
                  custom_fields: updatedCustomFields,
                },
                user?.id || ""
              ).then(() => {
                loadCustomers();
                setEditingCell(null);
              });
            }}
            onOpenChange={(open) => {
              if (!open && editingCell) {
                setTimeout(() => setEditingCell(null), 100);
              }
            }}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="-" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      // Number-Feld
      if (field.type === 'number') {
        return (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              step="0.01"
              value={editingCellValue}
              onChange={(e) => setEditingCellValue(e.target.value)}
              className="h-8 w-24"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCellSave();
                } else if (e.key === "Escape") {
                  handleCellCancel();
                }
              }}
              onBlur={handleCellSave}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCellSave}
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCellCancel}
            >
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        );
      }

      // Text-Felder (inkl. Notiz)
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editingCellValue}
            onChange={(e) => setEditingCellValue(e.target.value)}
            className="h-8 min-w-[200px]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCellSave();
              } else if (e.key === "Escape") {
                handleCellCancel();
              }
            }}
            onBlur={handleCellSave}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCellSave}
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCellCancel}
          >
            <XCircle className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // Display Mode (nicht im Edit-Modus)
    if (value === null || value === undefined || value === "") {
      return (
        <span
          className="text-muted-foreground cursor-pointer hover:text-foreground hover:bg-muted px-2 py-1 rounded"
          onClick={() => handleCellEdit(customer, field.key)}
          title="Klicken zum Bearbeiten"
        >
          -
        </span>
      );
    }

    const displayValue = (() => {
      switch (field.type) {
        case "boolean":
          return value ? "Ja" : "Nein";
        case "date":
          try {
            return formatDate(String(value));
          } catch {
            return String(value);
          }
        case "number":
          // Formatierung für Zahlen (z.B. Preis)
          if (typeof value === "number") {
            return new Intl.NumberFormat("de-DE", {
              style: field.key === 'ziel_preis' ? 'currency' : 'decimal',
              currency: 'EUR',
              minimumFractionDigits: field.key === 'ziel_preis' ? 2 : 0,
            }).format(value);
          }
          return String(value);
        default:
          return String(value);
      }
    })();

    // Alle Felder sind klickbar für Inline-Editing (außer Prio, das hat bereits ein Dropdown)
    return (
      <span
        className="cursor-pointer hover:underline hover:bg-muted px-2 py-1 rounded"
        onClick={() => handleCellEdit(customer, field.key)}
        title="Klicken zum Bearbeiten"
      >
        {displayValue}
      </span>
    );
  };

  // Wenn kein User vorhanden ist, zeige Ladeanzeige
  if (!user) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={Building2}
        title="Kunden"
        description="Kunden-Datenbank verwalten und organisieren"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kunden-Datenbank</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Felder verwalten
          </Button>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-primary to-purple-500">
            <Plus className="h-4 w-4 mr-2" />
            Neuer Kunde
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt Kunden</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mit E-Mail</p>
                <p className="text-2xl font-bold">
                  {customers.filter((c) => c.email).length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Benutzerdefinierte Felder</p>
                <p className="text-2xl font-bold">{customFields.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Noch keine Kunden vorhanden.</p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ersten Kunden erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border relative">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">Firma</th>
                        <th className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">Kontakt</th>
                        <th className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">E-Mail</th>
                        <th className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">Telefon</th>
                        {customFields.map((field) => (
                          <th key={field.id} className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">
                            {field.name}
                          </th>
                        ))}
                        <th className="h-12 px-4 text-left align-middle font-medium whitespace-nowrap">Erstellt</th>
                        <th className="h-12 px-4 text-right align-middle font-medium whitespace-nowrap">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle whitespace-nowrap">
                            <span className="font-medium truncate block max-w-[200px]">{customer.company_name}</span>
                          </td>
                          <td className="p-4 align-middle whitespace-nowrap">
                            {customer.contact_name ? (
                              <span className="truncate block max-w-[150px]">{customer.contact_name}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 align-middle whitespace-nowrap">
                            {customer.email ? (
                              <a
                                href={`mailto:${customer.email}`}
                                className="text-primary hover:underline truncate block max-w-[200px]"
                              >
                                {customer.email}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 align-middle whitespace-nowrap">
                            {customer.phone ? (
                              <a
                                href={`tel:${customer.phone}`}
                                className="text-primary hover:underline truncate block max-w-[150px]"
                              >
                                {customer.phone}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          {customFields.map((field) => (
                            <td key={field.id} className="p-4 align-middle whitespace-nowrap">
                              <div className="truncate max-w-[150px]">
                                {renderCustomFieldValue(customer, field)}
                              </div>
                            </td>
                          ))}
                          <td className="p-4 align-middle text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(customer.created_at)}
                          </td>
                          <td className="p-4 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(customer)}
                                title="Bearbeiten"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(customer)}
                                title="Löschen"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        setEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? "Kunde bearbeiten" : "Neuen Kunden erstellen"}</DialogTitle>
            <DialogDescription>
              {selectedCustomer
                ? "Aktualisieren Sie die Informationen des Kunden."
                : "Erfassen Sie die Informationen für einen neuen Kunden."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">
                  Firmenname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company_name"
                  placeholder="z.B. Acme GmbH"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">Kontaktperson</Label>
                <Input
                  id="contact_name"
                  placeholder="z.B. Max Mustermann"
                  value={formData.contact_name}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kontakt@firma.de"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+49 123 456789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  placeholder="Weitere Informationen zum Kunden..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>
              
              {/* Custom Fields */}
              {customFields.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Zusätzliche Felder</h3>
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`custom_${field.key}`}>
                        {field.name}
                        {field.required && <span className="text-destructive"> *</span>}
                      </Label>
                      {renderCustomFieldInput(field)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setEditDialogOpen(false);
                }}
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  selectedCustomer ? "Speichern" : "Erstellen"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog - Custom Fields Management */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Benutzerdefinierte Felder verwalten</DialogTitle>
            <DialogDescription>
              Erstellen Sie eigene Felder, die in der Kunden-Datenbank verwendet werden können.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={handleAddNewField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Neues Feld erstellen
            </Button>

            {customFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine benutzerdefinierten Felder vorhanden.
              </div>
            ) : (
              <div className="space-y-2">
                {customFields.map((field) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{field.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Typ: {field.type === "dropdown" ? "Dropdown" : 
                                  field.type === "text" ? "Text" :
                                  field.type === "number" ? "Zahl" :
                                  field.type === "date" ? "Datum" : "Ja/Nein"}
                            {field.options && field.options.length > 0 && (
                              <> • Optionen: {field.options.join(", ")}</>
                            )}
                            {field.required && <> • Pflichtfeld</>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteField(field.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Field Dialog */}
      <Dialog open={newFieldDialogOpen} onOpenChange={setNewFieldDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingField ? "Feld bearbeiten" : "Neues Feld erstellen"}
            </DialogTitle>
            <DialogDescription>
              Definieren Sie ein neues Feld, das in der Kunden-Datenbank verwendet werden soll.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field_name">
                Feldname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="field_name"
                placeholder="z.B. Status, Priorität, Branche"
                value={newFieldData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewFieldData({
                    ...newFieldData,
                    name: name,
                    key: newFieldData.key || name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                  });
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_key">Technischer Schlüssel</Label>
              <Input
                id="field_key"
                placeholder="wird automatisch generiert"
                value={newFieldData.key}
                onChange={(e) =>
                  setNewFieldData({ ...newFieldData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })
                }
              />
              <p className="text-xs text-muted-foreground">
                Wird intern verwendet (z.B. für Status-Feld: "status")
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_type">Feldtyp <span className="text-destructive">*</span></Label>
              <Select
                value={newFieldData.type}
                onValueChange={(val: any) =>
                  setNewFieldData({ ...newFieldData, type: val, options: val === "dropdown" ? newFieldData.options : [] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Zahl</SelectItem>
                  <SelectItem value="date">Datum</SelectItem>
                  <SelectItem value="boolean">Ja/Nein</SelectItem>
                  <SelectItem value="dropdown">Dropdown (mit Optionen)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newFieldData.type === "dropdown" && (
              <div className="space-y-2">
                <Label>Optionen für Dropdown</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Neue Option eingeben"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <Button type="button" onClick={addOption} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newFieldData.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newFieldData.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        <span>{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => removeOption(option)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field_required"
                checked={newFieldData.required}
                onChange={(e) =>
                  setNewFieldData({ ...newFieldData, required: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="field_required" className="cursor-pointer">
                Pflichtfeld
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewFieldDialogOpen(false);
                setEditingField(null);
              }}
            >
              Abbrechen
            </Button>
            <Button onClick={handleSaveField}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunde löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie wirklich <strong>{selectedCustomer?.company_name}</strong> löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gelöscht...
                </>
              ) : (
                "Löschen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

