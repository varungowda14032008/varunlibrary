import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xkilcguoujcvtwskkgeb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_mqtK9dQQhzrdTxErdv5CDw_mTxrmUzX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
