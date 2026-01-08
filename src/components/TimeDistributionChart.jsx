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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function TimeDistributionChart({ timePatterns }) {
    if (!timePatterns) return null;

    const data = {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [
            {
                label: 'Pages Visited',
                data: [
                    timePatterns.morning?.length || 0,
                    timePatterns.afternoon?.length || 0,
                    timePatterns.evening?.length || 0,
                    timePatterns.night?.length || 0
                ],
                backgroundColor: [
                    'rgba(246, 173, 85, 0.8)',   // Morning - Gold
                    'rgba(107, 70, 193, 0.8)',   // Afternoon - Purple
                    'rgba(159, 122, 234, 0.8)',  // Evening - Light Purple
                    'rgba(45, 27, 78, 0.8)'      // Night - Dark Purple
                ],
                borderColor: [
                    'rgba(246, 173, 85, 1)',
                    'rgba(107, 70, 193, 1)',
                    'rgba(159, 122, 234, 1)',
                    'rgba(45, 27, 78, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(45, 27, 78, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                borderColor: 'rgba(107, 70, 193, 0.5)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y} pages`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: '#718096'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#718096',
                    font: {
                        weight: 600
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="wisdom-card fade-in mb-6">
            <h2 className="mb-6">⏰ Time Distribution</h2>
            <div style={{ height: '300px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
