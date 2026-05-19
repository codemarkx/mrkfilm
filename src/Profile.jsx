// ─── src/Profile.jsx — bryllim.com style, fully responsive, no drawer ────────

import cvFile from '@/assets/CV-video-editor.pdf';
import LightProfile from '@/assets/bg-light.png';
import DarkProfile from '@/assets/bg-black.png';
import {
  Calendar, Mail, MapPin, Moon, Play, Sun, X,
  Video, Megaphone, Share2, Sparkles, PenTool, ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { featuredProjects } from '@/data/projects';
import ChatBot from '@/components/ChatBot';
import VideosPage from '@/pages/VideosPage';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const mk = (d) => ({
  bgStyle:      d ? '#000000'    : '#f4f4f4',
  bg:           d ? 'bg-[#000000]'    : 'bg-[#f4f4f4]',
  text:         d ? 'text-[#e8e8e8]'  : 'text-[#0a0a0a]',
  textSub:      d ? 'text-[#c0c0c0]'  : 'text-[#222222]',
  textMuted:    d ? 'text-[#555555]'  : 'text-[#888888]',
  sectionLabel: d ? 'text-[#505050]'  : 'text-[#888888]',
  divider:      d ? 'border-[#191919]': 'border-[#e2e2e2]',
  rowBorder:    d ? 'border-[#111111]': 'border-[#ebebeb]',
  rowHover:     d ? 'hover:bg-[#0a0a0a]' : 'hover:bg-[#ededed]',
  pill:         d ? 'bg-[#161616] text-[#787878] hover:text-[#b0b0b0]'
                  : 'bg-[#e8e8e8] text-[#555555] hover:text-[#222222]',
  tag:          d ? 'bg-[#111111] text-[#555555]' : 'bg-[#e8e8e8] text-[#666666]',
  btnGhost:     d ? 'border border-[#222222] text-[#686868] hover:text-[#b0b0b0] hover:border-[#3a3a3a]'
                  : 'border border-[#d8d8d8] text-[#666666] hover:text-[#111111] hover:border-[#aaaaaa]',
  accentBg:     d ? 'bg-[#408A71] text-[#000000] hover:bg-[#2e2e2e] hover:text-[#b0b0b0] font-semibold'
                  : 'bg-[#111111] text-white hover:bg-[#333333] font-semibold',
  widgetBg:     d ? 'bg-[#0c0c0c]' : 'bg-white',
  widgetLabel:  d ? 'text-[#404040]' : 'text-[#aaaaaa]',
  iconBg:       d ? 'bg-[#111111]'  : 'bg-[#eeeeee]',
  iconColor:    d ? 'text-[#4a4a4a] group-hover:text-[#909090]' : 'text-[#999999] group-hover:text-[#444444]',
  accentStat:   d ? 'text-[#408A71]' : 'text-[#111111]',
  activeBox:    d ? 'border-[#555555] bg-[#1a1a1a]' : 'border-[#888888] bg-[#e0e0e0]',
  inactiveBox:  d ? 'border-[#222222]' : 'border-[#d8d8d8]',
  eduNote:      d ? 'text-[#408A71]/50' : 'text-[#888888]',
  footerText:   d ? 'text-[#282828]'   : 'text-[#bbbbbb]',
  toggleBtn:    d ? 'border border-[#222222] text-[#545454] hover:text-[#b0b0b0] hover:border-[#3a3a3a]'
                  : 'border border-[#d8d8d8] text-[#999999] hover:text-[#444444] hover:border-[#aaaaaa]',
});

// ─── VideoPlayer ──────────────────────────────────────────────────────────────
const VideoPlayer = ({ videoUrl, title, onClose }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const getVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/,
    ];
    for (const p of patterns) { const m = url?.match(p); if (m) return m[1]; }
    return null;
  };

  const videoId = getVideoId(videoUrl);
  const opts = { height: '100%', width: '100%', playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0 } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/98 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[#e0e0e0] text-xs font-medium truncate pr-4">{title}</p>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#555555] hover:text-[#aaaaaa] border border-[#222222] hover:border-[#444444] rounded-sm transition-all flex-shrink-0"
          >
            <X size={11} /> ESC
          </button>
        </div>
        <div className="relative aspect-video bg-[#0a0a0a] rounded-sm overflow-hidden">
          {videoId
            ? <YouTube videoId={videoId} opts={opts} onReady={(e) => e.target.playVideo()} className="w-full h-full" iframeClassName="w-full h-full" />
            : videoUrl
              ? <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
              : <div className="flex items-center justify-center h-full text-[#333333] text-sm">No valid source</div>
          }
        </div>
      </div>
    </div>
  );
};

// ─── ProjectRow ───────────────────────────────────────────────────────────────
const ProjectRow = ({ project, onWatch, isPlaying, t }) => (
  <div className={`flex items-center gap-3 py-2.5 border-b ${t.rowBorder} ${t.rowHover} group transition-colors`}>
    <div className="relative w-20 h-[46px] flex-shrink-0 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={12} className="text-white ml-0.5" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className={`text-xs font-medium truncate ${t.textSub}`}>{project.title}</p>
        {isPlaying && (
          <span className="flex items-center gap-1 text-[9px] text-[#408A71] font-medium flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#408A71] animate-pulse" /> PLAYING
          </span>
        )}
      </div>
      <p className={`text-[10px] mt-0.5 truncate ${t.textMuted}`}>{project.description}</p>
    </div>
    <div className="hidden sm:flex items-center gap-1">
      {project.technologies.slice(0, 2).map((tech, i) => (
        <span key={i} className={`px-1.5 py-0.5 text-[10px] rounded-sm ${t.tag}`}>{tech}</span>
      ))}
    </div>
    <button
      onClick={() => onWatch(project)}
      disabled={!project.video}
      className={`flex-shrink-0 px-2.5 py-1.5 rounded-sm text-[11px] flex items-center gap-1 transition-all ${
        project.video ? t.btnGhost : `${t.textMuted} cursor-not-allowed`
      }`}
    >
      <Play size={9} /> Watch
    </button>
  </div>
);

// ─── Section + SectionLabel ───────────────────────────────────────────────────
const Section = ({ children, divider, className = '' }) => (
  <div className={`pt-6 pb-2 border-t ${divider} ${className}`}>{children}</div>
);

const SectionLabel = ({ children, action, onAction, labelColor }) => (
  <div className="flex items-center justify-between mb-4">
    <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${labelColor}`}>{children}</span>
    {action && (
      <button onClick={onAction} className="flex items-center gap-1 text-[11px] text-[#555555] hover:text-[#888888] transition-colors">
        {action} <ChevronRight size={11} />
      </button>
    )}
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const SidebarContent = ({ t, handleEmail, skills }) => (
  <div className="space-y-3">
    <div>
      <SectionLabel labelColor={t.sectionLabel}>Skills</SectionLabel>
      <div>
        {skills.map((s, i) => (
          <div key={i} className={`flex items-start gap-2 py-2 border-b ${t.rowBorder} group cursor-default`}>
            <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-sm mt-0.5 ${t.iconBg}`}>
              <s.icon size={10} className={`transition-colors ${t.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1 text-center">
              <p className={`text-[11px] font-medium leading-tight truncate ${t.textSub}`}>{s.label}</p>
              <p className={`text-[10px] leading-tight truncate ${t.textMuted}`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className={`rounded-sm p-2.5 ${t.widgetBg}`}>
      <p className={`text-[10px] tracking-[0.14em] uppercase mb-3 ${t.widgetLabel}`}>Portfolio Stats</p>
      <div className="space-y-2.5">
        {[
          { label: 'Projects Done',  value: '50+' },
          { label: 'Clients Served', value: '20+' },
          { label: 'Years Active',   value: '3'   },
        ].map((stat, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={`text-[11px] ${t.textMuted}`}>{stat.label}</span>
            <span className={`text-sm font-semibold ${t.accentStat}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={`rounded-sm p-2.5 ${t.widgetBg}`}>
      <p className={`text-xs mb-2.5 leading-relaxed ${t.textSub}`}>Available for freelance projects and collaborations.</p>
      <button onClick={handleEmail} className={`w-full py-1.5 text-xs rounded-sm transition-all ${t.accentBg}`}>
        Get in touch
      </button>
    </div>
  </div>
);

// ─── Main Profile ─────────────────────────────────────────────────────────────
const ProfileContent = () => {
  const { darkMode, toggleDark } = useTheme();
  const t = mk(darkMode);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.backgroundColor = t.bgStyle;
    document.body.style.backgroundColor = t.bgStyle;
  }, [darkMode]);

  const handleDownloadCV = () => {
    const a = document.createElement('a');
    a.href = cvFile; a.download = 'Mark_Quitaleg_CV.pdf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleEmail = () => {
    window.location.href = 'mailto:quitalegmj24@gmail.com?subject=Inquiry from Portfolio&body=Hello Mark,';
  };

  const techStack = [
    { label: 'Video',  items: ['Premiere Pro', 'After Effects', 'Capcut', 'KineMaster'] },
    { label: 'Design', items: ['Photoshop', 'Canva', 'Illustrator', 'Figma', 'Lightroom'] },
    { label: 'Other',  items: ['Freepik', 'Pixabay', 'Pexels', 'ChatGPT'] },
  ];

  const skills = [
    { icon: Video,     label: 'Film Editing',       sub: 'Premiere Pro · Capcut · Color Grading' },
    { icon: Megaphone, label: 'Commercial & Ads',   sub: 'Premiere Pro · Capcut' },
    { icon: Share2,    label: 'Short-Form Content', sub: 'Capcut · Premiere Pro · After Effects' },
    { icon: Sparkles,  label: 'Trailers & Promos',  sub: 'Premiere Pro · After Effects' },
    { icon: PenTool,   label: 'Graphics Design',    sub: 'Photoshop · Canva · Illustrator' },
  ];

  const experience = [
    { role: 'Freelance Video Editor',     org: 'WFH',            period: '2023 – Present', active: true },
    { role: 'Head Of Video Editing Team', org: 'Organization',   period: '2023 – 2024',    active: false },
    { role: 'Vice President',             org: 'Multimedia Org', period: '2024 – 2025',    active: false },
  ];


  const education = [
    { institution: 'Kolehiyo ng Lungsod ng Dasmariñas', degree: 'BS Information Systems',        period: '2022 – Present', note: "Dean's Lister", active: true },
    { institution: 'Dasmarinas Integrated High School', degree: 'Humanities and Social Sciences', period: '2016 – 2022',    note: 'Graduated with honors' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${t.bg}`} style={{ backgroundColor: t.bgStyle }}>
      {selectedVideo && (
        <VideoPlayer videoUrl={selectedVideo.video} title={selectedVideo.title} onClose={() => setSelectedVideo(null)} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div className={`pb-6 border-b ${t.divider}`}>
          <div className="flex items-start justify-between gap-2">

            {/* Left: avatar + stacked identity */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-sm">
                <img
                  src={darkMode ? DarkProfile : LightProfile}
                  alt="Mark Quitaleg"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <h1 className={`text-sm sm:text-lg font-semibold tracking-tight leading-tight ${t.text}`}>
                    Mark Quitaleg
                  </h1>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" viewBox="0 0 22 22">
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0"/>
                  </svg>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin size={9} className={`flex-shrink-0 ${t.textMuted}`} />
                  <span className={`text-[10px] leading-tight ${t.textMuted}`}>
                    Dasmariñas Cavite, Philippines
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <span className={`text-[10px] sm:text-[11px] ${t.textSub}`}>Video Editor · Freelance</span>
                  <span className={`text-[10px] sm:text-[11px] ${t.textMuted}`}>· 22 y/o</span>
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={toggleDark}
                className={`p-1.5 rounded-sm transition-all ${t.toggleBtn}`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun size={12} /> : <Moon size={12} />}
              </button>
              <button
                onClick={handleDownloadCV}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] transition-all ${t.btnGhost}`}
              >
                <Calendar size={11} />
                <span className="hidden sm:inline">CV</span>
              </button>
              <button
                onClick={handleEmail}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] transition-all ${t.accentBg}`}
              >
                <Mail size={11} />
                <span className="hidden sm:inline">Email</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── BODY: two-col on lg+, single col on mobile ─────────────────── */}
        <div className="flex gap-10 xl:gap-12 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* About */}
            <Section divider={t.divider}>
              <SectionLabel labelColor={t.sectionLabel}>About</SectionLabel>
              <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed ${t.textSub}`}>
                <p>Started in video editing through necessity, stayed for the craft. Now heading Media Production at my school's organization, overseeing everything from pre-production planning to final export across <span className={t.text}>films, commercials, and live event coverage.</span></p>
                <p>On the freelance side, I work with clients on social media content, promotional videos, and digital projects where clear communication and clean execution matter as much as technical skill.</p>
                <p>Alongside editing, I handle graphic design using <span className={t.text}>Photoshop, Illustrator, and Canva</span> for projects that need more than just footage. Currently finishing BS Information Systems at KLD as a consistent <span className={t.text}>Dean's Lister,</span> which sharpens the systems thinking I bring into every project.</p>
              </div>
            </Section>

            {/* Tech Stack */}
            <Section divider={t.divider}>
              <SectionLabel labelColor={t.sectionLabel}>Tech Stack</SectionLabel>
              <div className="space-y-2.5">
                {techStack.map((group, gi) => (
                  <div key={gi} className="flex items-start gap-3">
                    <span className={`text-[10px] w-10 flex-shrink-0 pt-0.5 ${t.textMuted}`}>{group.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {group.items.map((item, ii) => (
                        <span key={ii} className={`px-2 py-0.5 rounded-sm text-[10px] sm:text-[11px] transition-all cursor-default ${t.pill}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Recent Projects */}
            <Section divider={t.divider}>
              <SectionLabel labelColor={t.sectionLabel} action="View All" onAction={() => navigate('/videos')}>
                Recent Projects
              </SectionLabel>
              <div>
                {featuredProjects.map(p => (
                  <ProjectRow key={p.id} project={p} onWatch={setSelectedVideo} isPlaying={selectedVideo?.id === p.id} t={t} />
                ))}
              </div>
            </Section>

     {/* ── EXPERIENCE + EDUCATION — side by side ───────────────────── */}
<Section divider={t.divider}>
  <div className="grid grid-cols-2 gap-4">

    {/* Experience */}
    <div className="text-left">
      <SectionLabel labelColor={t.sectionLabel}>Experience</SectionLabel>
      <div>
        {experience.map((e, i) => (
          <div key={i} className={`flex items-start gap-2 py-2 border-b ${t.rowBorder}`}>
            <div className={`w-2.5 h-2.5 mt-[3px] flex-shrink-0 rounded-sm border ${e.active ? t.activeBox : t.inactiveBox}`} />
            <div className="min-w-0 text-left">
              <p className={`text-[11px] font-medium leading-snug ${t.textSub}`}>{e.role}</p>
              <p className={`text-[10px] ${t.textMuted}`}>{e.org}</p>
              <p className={`text-[10px] ${t.textMuted}`}>{e.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div className="text-left">
      <SectionLabel labelColor={t.sectionLabel}>Education</SectionLabel>
      <div>
        {education.map((e, i) => (
          <div key={i} className={`flex items-start gap-2 py-2 border-b ${t.rowBorder}`}>
         <div className={`w-2.5 h-2.5 mt-[3px] flex-shrink-0 rounded-sm border ${e.active ? t.activeBox : t.inactiveBox}`} />
            <div className="min-w-0 text-left">
              <p className={`text-[11px] font-medium leading-snug ${t.textSub}`}>{e.institution}</p>
              <p className={`text-[10px] mt-0.5 ${t.textMuted}`}>{e.degree}</p>
              <p className={`text-[10px] mt-0.5 ${t.eduNote}`}>{e.note}</p>
              <p className={`text-[10px] ${t.textMuted}`}>{e.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</Section>

            {/* Sidebar flows inline on mobile — no drawer */}
            <div className="lg:hidden">
              <Section divider={t.divider}>
                <SidebarContent t={t} handleEmail={handleEmail} skills={skills} />
              </Section>
            </div>

          </div>

          {/* Desktop sticky sidebar */}
          <div className="w-48 xl:w-52 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <div className={`pt-6 border-t ${t.divider}`}>
                <SidebarContent t={t} handleEmail={handleEmail} skills={skills} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`mt-10 pt-5 border-t ${t.divider} flex items-center justify-between`}>
          <p className={`text-[11px] ${t.footerText}`}>© {new Date().getFullYear()} Mark Quitaleg</p>
          <p className={`text-[11px] ${t.footerText}`}>Video Editor · Dasmariñas, PH</p>
        </div>

      </div>

      <ChatBot darkMode={darkMode} />
    </div>
  );
};

// ─── Router root ──────────────────────────────────────────────────────────────
const Profile = () => (
  <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/"       element={<ProfileContent />} />
        <Route path="/videos" element={<VideosPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default Profile;
