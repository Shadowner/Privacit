<script>
  import { onMount } from 'svelte';
  import { Bar, Pie } from 'svelte-chartjs';
  import { 
    Chart as ChartJS, 
    Title, 
    Tooltip, 
    Legend, 
    BarElement, 
    CategoryScale, 
    LinearScale,
    ArcElement
  } from 'chart.js';

  ChartJS.register(
    Title, 
    Tooltip, 
    Legend, 
    BarElement, 
    CategoryScale, 
    LinearScale,
    ArcElement
  );

  let stats = {
    rewrittenPhrases: 0,
    analyzedPosts: 0,
    factChecked: 0
  };

  let barChartData = {
    labels: ['Phrases réécrites', 'Posts analysés', 'Faits vérifiés'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ]
    }]
  };

  let pieChartData = {
    labels: ['Phrases réécrites', 'Posts analysés', 'Faits vérifiés'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ]
    }]
  };

  onMount(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      stats = {
        rewrittenPhrases: 150,
        analyzedPosts: 75,
        factChecked: 30
      };

      updateCharts();
    }, 1000);
  });

  function updateCharts() {
    barChartData.datasets[0].data = [
      stats.rewrittenPhrases,
      stats.analyzedPosts,
      stats.factChecked
    ];
    barChartData = { ...barChartData };

    pieChartData.datasets[0].data = [
      stats.rewrittenPhrases,
      stats.analyzedPosts,
      stats.factChecked
    ];
    pieChartData = { ...pieChartData };
  }
</script>

<div class="bg-primary-light rounded-lg shadow-md p-6 max-w-4xl mx-auto">
  <h2 class="text-2xl font-bold mb-6">Statistiques de la fenêtre active</h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-blue-100 p-4 rounded-lg text-center">
      <h3 class="text-lg font-semibold mb-2">Phrases réécrites</h3>
      <p class="text-3xl font-bold text-primary-dark">{stats.rewrittenPhrases}</p>
    </div>
    <div class="bg-green-100 p-4 rounded-lg text-center">
      <h3 class="text-lg font-semibold mb-2">Posts analysés</h3>
      <p class="text-3xl font-bold text-green-600">{stats.analyzedPosts}</p>
    </div>
    <div class="bg-yellow-100 p-4 rounded-lg text-center">
      <h3 class="text-lg font-semibold mb-2">Faits vérifiés</h3>
      <p class="text-3xl font-bold text-yellow-600">{stats.factChecked}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h3 class="text-xl font-semibold mb-4">Répartition des activités</h3>
      <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
    <div>
      <h3 class="text-xl font-semibold mb-4">Proportion des activités</h3>
      <Pie data={pieChartData} options={{ responsive: true }} />
    </div>
  </div>
</div>