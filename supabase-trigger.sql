-- ============================================================================
-- AUTOMATISCHE PROFIL-ERSTELLUNG BEI USER-REGISTRIERUNG
-- ============================================================================
-- 
-- Diese Funktion erstellt automatisch ein Profil in der user_profiles Tabelle,
-- wenn ein neuer User in auth.users registriert wird.
--
-- Führe dieses Script im Supabase SQL Editor aus.
--
-- ============================================================================

-- Funktion zum Erstellen eines neuen User-Profils
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, plan, account_type, full_name)
  VALUES (
    NEW.id,
    'starter', -- Standard-Plan
    'individual', -- Standard-Account-Type
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) -- Name aus Metadata oder Email
  );
  RETURN NEW;
END;
$$;

-- Entferne alten Trigger falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Erstelle neuen Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ALTERNATIVE: Wenn du eine "profiles" Tabelle verwenden möchtest
-- ============================================================================
-- 
-- Falls du eine Tabelle namens "profiles" (ohne "user_") verwendest,
-- verwende diese Version:
--
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, account_type, plan)
--   VALUES (
--     NEW.id,
--     'individual', -- oder 'free' wenn du das bevorzugst
--     'starter'
--   );
--   RETURN NEW;
-- END;
-- $$;
--
-- ============================================================================


