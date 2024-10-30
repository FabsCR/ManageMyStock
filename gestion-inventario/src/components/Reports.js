// Importa React, hooks necesarios y la librería para gráficos de barras (Bar)
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
// Importa los elementos necesarios de Chart.js para configurar el gráfico
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// Importa la configuración de Supabase para acceder a los datos de la base de datos
import supabase from '../config/supabaseClient';

// Registra los elementos de Chart.js que se usarán en el gráfico
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reports() {
  // Estado para almacenar los datos de compras mensuales
  const [purchaseData, setPurchaseData] = useState(null);

  // Carga inicial de datos de compras mensuales al montar el componente
  useEffect(() => {
    fetchMonthlyPurchases();
  }, []);

  // Función para obtener los datos de compras mensuales usando la función almacenada en Supabase
  const fetchMonthlyPurchases = async () => {
    const { data, error } = await supabase.rpc('get_monthly_purchases'); // Llama a la función almacenada 'get_monthly_purchases'
    if (error) {
      console.error('Error fetching monthly purchases:', error.message);
      setPurchaseData([]); // Si hay error, configura el estado como un arreglo vacío
    } else {
      setPurchaseData(data || []); // Si los datos son exitosos, actualiza el estado con los datos obtenidos
    }
  };

  // Configuración del gráfico de compras con los datos obtenidos
  const purchasesChartData = {
    labels: purchaseData ? purchaseData.map((item) => item.month) : [], // Mapea los meses para las etiquetas del gráfico
    datasets: [
      {
        label: 'Compras Mensuales', // Etiqueta del conjunto de datos
        data: purchaseData ? purchaseData.map((item) => item.total_purchases) : [], // Mapea los datos de compras mensuales
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color de las barras
      },
    ],
  };

  return (
    <div className="reports-container">
      <h2>Reporte de Compras 2024</h2>
      <div className="chart-section">
        <h3>Compras Mensuales</h3>
        {/* Renderiza el gráfico de barras si existen datos, o muestra un mensaje de carga */}
        {purchaseData ? <Bar data={purchasesChartData} /> : <p>Cargando datos de compras...</p>}
      </div>
    </div>
  );
}

export default Reports;