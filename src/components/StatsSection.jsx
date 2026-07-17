import React from 'react';

export default function StatsSection() {
  const statsList = [
    { label: 'Core Engineers', value: '8' },
    { label: 'Combined Skillsets', value: '32+' },
    { label: 'Production Uptime', value: '100%' },
    { label: 'Innovative Spark', value: '∞' }
  ];

  return (
    <section className="stats-section container">
      <div className="stats-grid">
        {statsList.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
