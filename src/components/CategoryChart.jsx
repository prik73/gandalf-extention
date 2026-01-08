import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ categories }) {
    if (!categories) return null;

    // Filter out empty categories and prepare data
    const categoryData = Object.entries(categories)
        .filter(([_, items]) => items.length > 0)
        .sort((a, b) => b[1].length - a[1].length);

    if (categoryData.length === 0) return null;

    const labels = categoryData.map(([cat]) =>
        cat.charAt(0).toUpperCase() + cat.slice(1)
    );

    const values = categoryData.map(([_, items]) => items.length);

    // Color palette - wisdom theme
    const colors = [
        'rgba(107, 70, 193, 0.8)',   // Purple
        'rgba(246, 173, 85, 0.8)',   // Gold
        'rgba(72, 187, 120, 0.8)',   // Green
        'rgba(237, 137, 54, 0.8)',   // Orange
        'rgba(159, 122, 234, 0.8)',  // Light Purple
        'rgba(160, 174, 192, 0.8)',  // Gray
        'rgba(45, 27, 78, 0.8)',     // Dark Purple
        'rgba(237, 100, 166, 0.8)',  // Pink
    ];

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                hoverOffset: 10
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: {
                        size: 13,
                        weight: 600
                    },
                    color: '#2d3748',
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(45, 27, 78, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                borderColor: 'rgba(107, 70, 193, 0.5)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} pages (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="wisdom-card fade-in mb-6">
            <h2 className="mb-6">📊 Category Breakdown</h2>
            <div style={{ height: '350px' }}>
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
