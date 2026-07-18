import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ParticleEffect from './components/ParticleEffect';
import Header from './components/Header';
import StatsSection from './components/StatsSection';
import TeammateCard from './components/TeammateCard';
import TeammateModal from './components/TeammateModal';
import { playClick } from './utils/audio';

const DEFAULT_MEMBERS = [
  {
    id: "akhila_sagar",
    name: "Akhila Sagar",
    role: "Captain",
    dept: "Strategic Operations & Creative Direction",
    skills: "Leadership, Product Strategy, Public Speaking, Agile Management",
    email: "akhila.sagar@nocturna.io",
    linkedin: "https://linkedin.com/in/akhila-sagar",
    quote: "Forged in darkness, we find our vision; united by light, we execute it.",
    image: "images/akhila.jpeg"
  },
  {
    id: "anirudh_kr",
    name: "Anirudh KR",
    role: "Vice Captain",
    dept: "Systems Architecture & Engineering",
    skills: "Backend Architecture, Scalability, DevOps, System Design",
    email: "anirudh.kr@nocturna.io",
    linkedin: "https://linkedin.com/in/anirudh-kr",
    quote: "In the shadow of complexity, clean code is the light that guides us.",
    image: "images/anirudh.jpeg"
  },
  {
    id: "aadil_s",
    name: "Aadil.S",
    role: "Core Member",
    dept: "Frontend Engineering & UI/UX Lab",
    skills: "React, Web Animations, Interface Design, TailwindCSS",
    email: "aadil.s@nocturna.io",
    linkedin: "https://linkedin.com/in/aadil-s",
    quote: "The interface is the canvas where science meets aesthetic design.",
    image: "images/aadil.jpeg"
  },
  {
    id: "arvin_abraham",
    name: "Arvin Abraham",
    role: "Core Member",
    dept: "Full-Stack Development",
    skills: "Node.js, GraphQL, PostgreSQL, Security Auditing",
    email: "arvin.abraham@nocturna.io",
    linkedin: "https://linkedin.com/in/arvin-abraham",
    quote: "Security isn't an afterthought; it is the foundation of our illumination.",
    image: "images/arvin.jpeg"
  },
  {
    id: "ananya_nair",
    name: "Ananya Nair",
    role: "Core Member",
    dept: "Data Science & Analytics",
    skills: "Python, Machine Learning, Data Visualization, Quantitative Models",
    email: "ananya.nair@nocturna.io",
    linkedin: "https://linkedin.com/in/ananya-nair",
    quote: "Data tells stories of where we've been and shines a light on where we're going.",
    image: "images/ananya.jpeg"
  },
  {
    id: "anna_varghese",
    name: "Anna Varghese",
    role: "Core Member",
    dept: "Product Management",
    skills: "User Research, Product Roadmap, Communication, Growth Strategy",
    email: "anna.varghese@nocturna.io",
    linkedin: "https://linkedin.com/in/anna-varghese",
    quote: "Building products that matter requires navigating the unknown with clarity.",
    image: "images/anna.jpeg"
  },
  {
    id: "anusree",
    name: "Anusree",
    role: "Core Member",
    dept: "Creative Design & Visual Arts",
    skills: "Brand Identity, Illustration, Motion Graphics, HSL Color Theory",
    email: "anusree@nocturna.io",
    linkedin: "https://linkedin.com/in/anusree",
    quote: "Art is the light that breaks through the shadows of ordinary experiences.",
    image: "images/anusree.jpeg"
  },
  {
    id: "adil_suhail",
    name: "Adil Suhail",
    role: "Core Member",
    dept: "Cloud & Infrastructure Operations",
    skills: "AWS, Kubernetes, Performance Tuning, CI/CD Pipelines",
    email: "adil.suhail@nocturna.io",
    linkedin: "https://linkedin.com/in/adil-suhail",
    quote: "Zero downtime is my language. High performance is my signature.",
    image: "images/adil.jpeg"
  }
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('noctora-theme') || 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTeammate, setSelectedTeammate] = useState(null);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('noctora-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleFilterClick = (filter) => {
    playClick();
    setActiveFilter(filter);
  };

  // Classify teammate department into standardized filter tags
  const categorizeTeammate = (member) => {
    const deptLower = member.dept.toLowerCase();
    const roleLower = member.role.toLowerCase();

    if (deptLower.includes('strategic') || deptLower.includes('product')) {
      return 'Strategy_PM';
    }
    if (deptLower.includes('creative') || deptLower.includes('visual')) {
      return 'Creative_Design';
    }
    if (deptLower.includes('data science') || deptLower.includes('analytics')) {
      return 'Data_Science';
    }
    // Engineering cards (systems/fullstack/frontend/cloud)
    return 'Engineering';
  };

  // Dynamic filter lists for pills
  const filters = [
    { key: 'All', label: 'All Operations' },
    { key: 'Engineering', label: 'Engineering & DevOps' },
    { key: 'Strategy_PM', label: 'Product & Strategy' },
    { key: 'Creative_Design', label: 'Branding & Design' },
    { key: 'Data_Science', label: 'Data Science' },
  ];

  // Perform search and category filter filtering
  const filteredTeammates = DEFAULT_MEMBERS.filter((member) => {
    // 1. Filter by department pill select
    if (activeFilter !== 'All') {
      const category = categorizeTeammate(member);
      if (category !== activeFilter) return false;
    }

    // 2. Filter by search input
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = member.name.toLowerCase().includes(query);
      const matchRole = member.role.toLowerCase().includes(query);
      const matchDept = member.dept.toLowerCase().includes(query);
      const matchSkills = member.skills.toLowerCase().includes(query);
      return matchName || matchRole || matchDept || matchSkills;
    }

    return true;
  });

  return (
    <>
      {/* Background Interactive canvas particles & ambient page light shapes */}
      <ParticleEffect theme={theme} />
      <div className="ambient-glow" />

      {/* Corporate Eclipse Navigation Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Hero Banner with tagline */}
      <section className="hero container">
        <h1 className="text-gradient">NOCTORA</h1>
        <div className="tagline-container">
          <span className="tagline-sub">Forged in darkness ,driven by light</span>
        </div>
        <p className="hero-description">
          A collective of systems administrators, product experts, analytics wizards, 
          and creative innovators. We orchestrate clean architecture, premium UI, and secure deployments.
        </p>
      </section>

      {/* Team dashboard stats counters */}
      <StatsSection />

      {/* Core Grid and Filter controls */}
      <main className="container">
        <div className="filter-bar">
          {/* Fuzzy Search Wrapper */}
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by name, role, department or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department filter selection pill lists */}
          <div className="filter-pills">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => handleFilterClick(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teammate grid list */}
        {filteredTeammates.length > 0 ? (
          <div className="team-grid">
            {filteredTeammates.map((member) => (
              <TeammateCard 
                key={member.id} 
                teammate={member} 
                onViewProfile={setSelectedTeammate}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No team members match your filter query.</p>
            <button 
              className="filter-btn active" 
              style={{ marginTop: '1rem' }}
              onClick={() => { playClick(); setSearchQuery(''); setActiveFilter('All'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Dialog Teammate profile detail Modal */}
      <TeammateModal 
        teammate={selectedTeammate}
        isOpen={selectedTeammate !== null}
        onClose={() => setSelectedTeammate(null)}
      />

      {/* Interactive Footer */}
      <footer>
        <div className="container">
          <div className="footer-brand">NOCTORA</div>
          <p className="footer-text">
            © 2026 Noctora. Forged in Darkness, Driven by Light. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
