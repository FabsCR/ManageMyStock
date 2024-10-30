import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import supabase from '../config/supabaseClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reports() {
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    fetchMonthlyPurchases();
  }, []);

  const fetchMonthlyPurchases = async () => {
    const { data, error } = await supabase.rpc('get_monthly_purchases'); // Llama a la función almacenada para obtener compras
    if (error) {
      console.error('Error fetching monthly purchases:', error.message);
      setPurchaseData([]);
    } else {
      setPurchaseData(data || []);
    }
  };

  // Configuración del gráfico de compras
  const purchasesChartData = {
    labels: purchaseData ? purchaseData.map((item) => item.month) : [],
    datasets: [
      {
        label: 'Compras Mensuales',
        data: purchaseData ? purchaseData.map((item) => item.total_purchases) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="reports-container">
      <h2>Reporte de Compras 2024</h2>
      <div className="chart-section">
        <h3>Compras Mensuales</h3>
        {purchaseData ? <Bar data={purchasesChartData} /> : <p>Cargando datos de compras...</p>}
      </div>
    </div>
  );
}

export default Reports;