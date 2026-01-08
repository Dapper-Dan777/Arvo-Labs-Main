import {
  Mail, Tag, MessageSquare, Hash, AtSign, MessageCircle,
  Zap, Code, FileText, ClipboardCheck, UserPlus, Briefcase,
  Database, TrendingUp, ShoppingCart, User, Package, CreditCard,
  Users, Calendar, CalendarCheck, FileUp, FolderPlus, Twitter,
  Instagram, SquareKanban, CheckSquare, Clock, Send, FileEdit,
  Edit, UserCog, PlusCircle, DollarSign, XCircle,
} from 'lucide-react';

export const iconMap: Record<string, any> = {
  // Communication
  Mail,
  Tag,
  MessageSquare,
  MessageCircle,
  Hash,
  AtSign,
  Send,
  FileEdit,
  Edit,
  
  // Webhooks & HTTP
  Zap,
  Code,
  
  // Forms
  FileText,
  ClipboardCheck,
  
  // CRM
  UserPlus,
  Briefcase,
  UserCog,
  PlusCircle,
  Database,
  TrendingUp,
  
  // E-Commerce
  ShoppingCart,
  User,
  Package,
  
  // Payments
  CreditCard,
  Users,
  DollarSign,
  XCircle,
  
  // Calendar
  Calendar,
  CalendarCheck,
  
  // Storage
  FileUp,
  FolderPlus,
  
  // Social
  Twitter,
  Instagram,
  
  // Project Management
  SquareKanban,
  CheckSquare,
  
  // Schedule
  Clock,
};

export function getIcon(iconName: string) {
  return iconMap[iconName] || Zap;
}
