// Importa la función createClient desde el SDK de Supabase
import { createClient } from '@supabase/supabase-js';

// URL y llave de acceso para conectar con Supabase, obtenidas de las variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Crea una instancia de cliente de Supabase para interactuar con la base de datos
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta la instancia de Supabase para su uso en otros módulos
export default supabase;