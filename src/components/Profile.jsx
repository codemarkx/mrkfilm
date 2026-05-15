import cvFile from '@/assets/CV-video-editor.pdf';
import LightProfile from '@/assets/bg-light.png';
import DarkProfile from '@/assets/bg-black.png';
import { Calendar, Film, Mail, MapPin, Moon, Palette, Play, Sun, X,
         Video, Megaphone, Share2, Sparkles, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Project1 from '@/assets/UNEP-50-Logo-Blue-Eng-RGB.jpg';
import ProjectVerticalnursing from '@/assets/nursing.png';
import Project2 from '@/assets/unicharm.png';
import Project3 from '@/assets/car-1.jfif';
import Project4 from '@/assets/kld-clc.png';
import Project5 from '@/assets/novus-logo.png';
import Project6 from '@/assets/cod.jpeg';
import Project7 from '@/assets/steak.jfif';
import Project8 from '@/assets/sining.png';
import Project9 from '@/assets/predebut.png';

import ChatBot from '@/components/ChatBot';

// Inside ProfileContent's return, just before the closing </div>:



import YouTube from 'react-youtube';

// ─── Body background sync (prevents the "box" effect) ────────────────────────
const DARK_BG  = '#0a0a0f';
const LIGHT_BG = '#f0f2f7';

const syncBodyBg = (dark) => {
  document.body.style.backgroundColor = dark ? DARK_BG : LIGHT_BG;
  document.body.style.margin = '0';
};

// ─── Shared theme tokens ──────────────────────────────────────────────────────
const t = {
  // page wrapper — transparent so body colour shows through seamlessly
  pageBg:    (d) => d ? 'bg-transparent' : 'bg-transparent',
  cardBg:    (d) => d ? 'bg-[#111118]'   : 'bg-white',
  cardBorder:(d) => d ? 'border border-[#1e1e2e]' : 'border border-gray-200',
  innerBg:   (d) => d ? 'bg-[#0d0d14]'   : 'bg-gray-50',
  innerBorder:(d)=> d ? 'border border-[#1e1e2e]' : 'border border-gray-200',
  pillBg:    (d) => d ? 'bg-[#1a1a28] text-[#a0a8c0]' : 'bg-blue-50 text-blue-800',
  heading:   (d) => d ? 'text-white'     : 'text-gray-800',
  sub:       (d) => d ? 'text-[#8891a8]' : 'text-gray-600',
  muted:     (d) => d ? 'text-[#5a6278]' : 'text-gray-400',
  divider:   (d) => d ? 'border-[#1e1e2e]' : 'border-gray-200',
  accent:    (d) => d ? 'text-[#6c8cff]' : 'text-blue-600',
  accentBg:  (d) => d ? 'bg-[#1a2040] hover:bg-[#232b52] text-[#8aa0ff]' : 'bg-blue-500 hover:bg-blue-600 text-white',
  btnOutline:(d) => d ? 'border border-[#1e1e2e] hover:bg-[#1a1a28] text-[#c0c8e0]' : 'border border-gray-300 hover:bg-gray-100 text-gray-700',
  skillItem: (d) => d ? 'bg-[#0d0d14] border border-[#1e1e2e]' : 'bg-gray-100',
  skillIcon: (d) => d ? 'bg-[#1a1a28]'  : 'bg-gray-200',
  expBorder: (d) => d ? 'border-[#3a3a5c]' : 'border-gray-400',
  eduBorder: (d) => d ? 'border-[#3a3a5c]' : 'border-gray-400',
  tagBg:     (d) => d ? 'bg-[#1a1a28] text-[#8891a8]' : 'bg-blue-100 text-blue-800',
  shadow:    (d) => d ? 'shadow-[0_2px_24px_rgba(0,0,0,0.6)]' : 'shadow-lg',
};

// ─── VideoPlayer ─────────────────────────────────────────────────────────────
const VideoPlayer = ({ videoUrl, title, onClose }) => {
  const getYouTubeVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const p of patterns) {
      const m = url?.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const isLocal = videoUrl && !videoId;

  const opts = {
    height: '100%', width: '100%',
    playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0 },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">

      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="relative aspect-video bg-black">
          {videoId ? (
            <YouTube
              videoId={videoId} opts={opts}
              onReady={(e) => e.target.playVideo()}
              className="w-full h-full" iframeClassName="w-full h-full"
            />
          ) : isLocal ? (
            <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">No valid video source</div>
          )}
        </div>

        <div className="px-5 py-3 bg-[#0a0a0f] border-t border-white/10">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
        </div>
      </div>
    </div>
  );
};

// ─── VideoCard — used in /videos gallery page (keeps aspect ratio per category)
const VideoCard = ({ project, onWatch, darkMode, aspect = 'video' }) => {
  const aspectClass = aspect === 'vertical' ? 'aspect-[9/16]' : 'aspect-video';
  return (
    <div className={`rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 ${t.innerBg(darkMode)} ${t.innerBorder(darkMode)} ${t.shadow(darkMode)}`}>
      <div className={`relative ${aspectClass} overflow-hidden flex-shrink-0`}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {project.video && (
          <button onClick={() => onWatch(project)} className="absolute inset-0 flex items-center justify-center group">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-200">
              <Play size={22} className="text-white ml-1" />
            </div>
          </button>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/80 text-white font-medium uppercase tracking-wide">
            {project.category === 'vertical' ? '📱 Short' : '🎬 Film'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-bold text-sm mb-1 leading-snug ${t.heading(darkMode)}`}>{project.title}</h3>
        <p className={`text-xs mb-3 flex-1 leading-relaxed ${t.sub(darkMode)}`}>{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.map((tech, i) => (
            <span key={i} className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${t.tagBg(darkMode)}`}>{tech}</span>
          ))}
        </div>
        <button
          onClick={() => onWatch(project)} disabled={!project.video}
          className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            project.video ? t.accentBg(darkMode) : (darkMode ? 'bg-[#1a1a28] text-[#3a3a5c] cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
          }`}
        >
          <Play size={13} /> Watch Demo
        </button>
      </div>

    </div>
  );
};

// ─── ProjectRow — used on MAIN PAGE: horizontal list, fixed 160px thumbnail, no height mismatch
const ProjectRow = ({ project, onWatch, darkMode }) => (
  <div className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] ${t.innerBg(darkMode)} ${t.innerBorder(darkMode)}`}>
    {/* Fixed-size thumbnail — always landscape crop regardless of source */}
    <div className="relative w-28 h-[72px] flex-shrink-0 rounded-lg overflow-hidden">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
          <Play size={11} className="text-white ml-0.5" />
        </div>
      </div>
      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-600/80 text-white font-medium leading-none">
        {project.category === 'vertical' ? 'Short' : 'Film'}
      </span>
    </div>

    {/* Text info */}
    <div className="flex-1 min-w-0">
      <p className={`font-semibold text-sm leading-snug truncate ${t.heading(darkMode)}`}>{project.title}</p>
      <p className={`text-[11px] mt-0.5 truncate ${t.sub(darkMode)}`}>{project.description}</p>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {project.technologies.slice(0, 3).map((tech, i) => (
          <span key={i} className={`px-1.5 py-0.5 text-[9px] rounded font-medium ${t.tagBg(darkMode)}`}>{tech}</span>
        ))}
      </div>
    </div>

    {/* Watch button */}
    <button
      onClick={() => onWatch(project)} disabled={!project.video}
      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all duration-200 ${
        project.video ? t.accentBg(darkMode) : (darkMode ? 'bg-[#1a1a28] text-[#3a3a5c] cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
      }`}
    >
      <Play size={11} /> Watch
    </button>
  </div>
);

// ─── VideoSection (auto-adjusting grid) ──────────────────────────────────────
const VideoSection = ({ title, emoji, videos, onWatch, darkMode, aspect }) => {
  if (!videos.length) return null;
  const count = videos.length;
  // Responsive grid: 1 col on mobile, 2 on sm, 3 on lg, 4 on xl (max)
  const gridCols = count === 1
    ? 'grid-cols-1 max-w-sm'
    : count === 2
    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <section className={`rounded-2xl p-6 transition-colors duration-300 ${t.cardBg(darkMode)} ${t.cardBorder(darkMode)} ${t.shadow(darkMode)}`}>
      <h2 className={`text-lg font-bold mb-5 pb-3 border-b flex items-center gap-2 ${t.heading(darkMode)} ${t.divider(darkMode)}`}>
        <span className="text-xl">{emoji}</span> {title}
        <span className={`ml-auto text-xs font-normal px-2.5 py-1 rounded-full ${t.pillBg(darkMode)}`}>
          {count} {count === 1 ? 'video' : 'videos'}
        </span>
      </h2>
      <div className={`grid gap-5 ${gridCols} mx-auto w-full`}>
        {videos.map(p => (
          <VideoCard key={p.id} project={p} onWatch={onWatch} darkMode={darkMode} aspect={aspect} />
        ))}
      </div>
    </section>
  );
};

// ─── VideosPage ───────────────────────────────────────────────────────────────
const VideosPageWrapper = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    setDarkMode(isDark);
    syncBodyBg(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Mr and Ms Nursing 2025 Trailer",
      description: "Trailer video for our school's Mr and Ms Nursing 2025 event.",
      image: ProjectVerticalnursing,
      video: "https://www.youtube.com/watch?v=s10ZPlpj8Xs",
      technologies: ["After Effects" , "Premiere Pro"],
      category: "portrait",
    },
    {
      id: 2,
      title: "Unicharm Logo Animation",
      description: "Unicharm logo animation for our school project.",
      image: Project2,
      video: "https://www.youtube.com/watch?v=4OSYexflm7c",
      technologies: ["After Effects", "Canva"],
      category: "portrait",
    },
    {
      id: 3,
      title: "Car Montage",
      description: "Car montage video for a client.",
      image: Project3,
      video: "https://www.youtube.com/shorts/MZD33qTNrRk",
      technologies: ["After Effects", "Canva"],
      category: "vertical",
    },
    {
      id: 4,
      title: "Wooden Horse Steakhouse",
      description: "Promotional video for Wooden Horse Steakhouse, a local restaurant.",
      image: Project7,
      video: "https://youtube.com/shorts/VjaFiRqrL1w?feature=share",
      technologies: ["After Effects", "Canva"],
      category: "vertical",
    },
     {
      id: 5,
      title: "Mobile Legends & Call of Duty teaser",
      description: "A teaser video for our school's esports event, featuring Mobile Legends and Call of Duty.",
      image: Project6,
      video: "https://www.youtube.com/watch?v=_kdfjMOt5O",
      technologies: ["After Effects", "Capcut"],
      category: "portrait",
    },
     {
      id: 6,
      title: "Sining Malaya",
      description: "A promotional video for Sining Malaya, our school's annual arts festival.",
      image: Project8,
      video: "https://www.youtube.com/watch?v=Hjy1DUXUEfA",
      technologies: ["After Effects", "Capcut"],
      category: "portrait",
    },
{
      id: 7,
      title: "Pre-debut 18th birthday",
      description: "A pre-debut video for a client's 18th birthday, showcasing their journey and milestones.",
      image: Project9,
      video: "https://www.youtube.com/watch?v=6tRjti-g6f8",
      technologies: ["After Effects", "Capcut"],
      category: "portrait",
    },

  ];

  const portrait = projects.filter(p => p.category === 'portrait');
  const vertical  = projects.filter(p => p.category === 'vertical');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${t.pageBg(darkMode)}`}>
      {selectedVideo && (
        <VideoPlayer videoUrl={selectedVideo.video} title={selectedVideo.title} onClose={() => setSelectedVideo(null)} />
      )}

      {/* Top bar */}
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b ${darkMode ? 'bg-[#0a0a0f]/80 border-[#1e1e2e]' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${t.btnOutline(darkMode)}`}
          >
            ← Back
          </button>
          <span className={`font-bold text-sm tracking-wide ${t.heading(darkMode)}`}>Video Portfolio</span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${t.pillBg(darkMode)}`}>{projects.length} videos</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <VideoSection
          title="LANDSCAPE"
          videos={portrait} onWatch={setSelectedVideo}
          darkMode={darkMode} aspect="video"
        />
        <VideoSection
          title="PORTRAIT"
          videos={vertical} onWatch={setSelectedVideo}
          darkMode={darkMode} aspect="vertical"
        />
          <ChatBot darkMode={darkMode} />
      </div>

      <p className={`text-center text-xs pb-8 ${t.muted(darkMode)}`}>© {new Date().getFullYear()} Mark Quitaleg</p>

<ChatBot darkMode={darkMode} />
    </div>


  );

};


// ─── Main Profile ─────────────────────────────────────────────────────────────
const ProfileContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    setDarkMode(isDark);
    syncBodyBg(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    syncBodyBg(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleDownloadCV = () => {
    const a = document.createElement('a');
    a.href = cvFile; a.download = 'Mark_Quitaleg_CV.pdf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleEmail = () => {
    window.location.href = 'mailto:quitalegmj24@gmail.com?subject=Inquiry from Portfolio&body=Hello Mark,';
  };

  const techStack = ['Premiere Pro', 'After Effects', 'Capcut', 'Freepik', 'Canva', 'Adobe Illustrator', 'Figma', 'Adobe Lightroom', 'Photoshop', 'ChatGPT', 'Pixabay', 'Pexels', 'KineMaster'];

  const projects = [
    {
      id: 1, title: "United Nations Environment Programme",
      description: "A video for UNEP to raise awareness about environmental issues.",
      image: Project1, video: "https://www.youtube.com/watch?v=AmVsHUE6duY",
      technologies: ["Premiere Pro", "Capcut", "After Effects"], category: "portrait",
    },
    {
      id: 2, title: "Car Montage",
      description: "A car montage video for a client, showcasing various angles and features of the vehicle.",
      image: Project3, video: "https://www.youtube.com/shorts/MZD33qTNrRk",
      technologies: ["After Effects", "Canva"], category: "portrait",
    },
    {
      id: 3, title: "NOVUS",
      description: "Novus logo animation for our organization.",
      image: Project5, video: "https://youtu.be/k8ux459AR00",
      technologies: ["After Effects", "Canva"], category: "vertical",
    },



  ];

  const education = [
    {
      institution: "Kolehiyo ng Lungsod ng Dasmariñas",
      degree: "Bachelor of Science in Information Systems",
      period: "2022 – Present", description: "Dean's Lister",
    },
    {
      institution: "Dasmarinas Integrated High School",
      degree: "Humanities and Social Sciences (HUMSS)",
      period: "2016 – 2022", description: "Graduated with honors",
    },
  ];

const skills = [
  { icon: Video, label: "Film Editing",              sub: "Premiere Pro, Capcut, Color Grading" },
  { icon: Megaphone, label: "Commercial & Advertising",  sub: "Premiere Pro, Capcut" },
  { icon: Share2, label: "Social Media & Short-Form", sub: "Capcut, Premiere Pro, After Effects" },
  { icon: Sparkles, label: "Trailer & Promo Videos",    sub: "Premiere Pro, After Effects" },
  { icon: PenTool, label: "Graphics Design",        sub: "Photoshop, Canva, Illustrator" },
];

  const experience = [
    { role: "Freelance Video Editor",       org: "WFH",            period: "2023 – Present" },
    { role: "Head Of Video Editing Team",   org: "Organization",   period: "2023 – 2024" },
    { role: "Vice President",               org: "Multimedia Org", period: "2024 – 2025" },
  ];

  // ── Shared card wrapper ──
  const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 transition-colors duration-300 ${t.cardBg(darkMode)} ${t.cardBorder(darkMode)} ${t.shadow(darkMode)} ${className}`}>
      {children}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 className={`text-xl font-bold mb-4 pb-2 border-b ${t.heading(darkMode)} ${t.divider(darkMode)}`}>{children}</h2>
  );

  return (
    <div className={`min-h-screen py-4 px-4 transition-colors duration-300 ${t.pageBg(darkMode)}`}>
      {selectedVideo && (
        <VideoPlayer videoUrl={selectedVideo.video} title={selectedVideo.title} onClose={() => setSelectedVideo(null)} />
      )}

      {/* Dark mode toggle */}
      <div className="max-w-7xl mx-auto flex justify-end mb-4">
        <button onClick={toggleDark} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${t.btnOutline(darkMode)}`}>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* ══════ MOBILE ══════ */}
        <div className="lg:hidden space-y-6">
          {/* Profile card */}
          <Card>
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl mb-4 ring-2 ring-offset-2 ring-blue-500/30">
                <img src={darkMode ? DarkProfile : LightProfile} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h1 className={`text-2xl font-bold mb-1 flex items-center gap-1 ${t.heading(darkMode)}`}>
                Mark Quitaleg
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 22 22"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0"/></svg>
              </h1>
              <div className={`flex items-center text-sm mb-1 ${t.sub(darkMode)}`}><MapPin size={13} className="mr-1.5" /> Dasmariñas Cavite, Philippines</div>
              <p className={`text-base font-semibold mt-2 ${t.accent(darkMode)}`}>Video Editor</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 mb-5">
              <button onClick={handleDownloadCV} className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${t.btnOutline(darkMode)}`}>
                <Calendar size={18} /><span className="text-xs mt-1 font-medium">Download CV</span>
              </button>
              <button onClick={handleEmail} className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${t.btnOutline(darkMode)}`}>
                <Mail size={18} /><span className="text-xs mt-1 font-medium">Contact</span>
              </button>
            </div>

            <h2 className={`text-base font-bold mb-3 pb-2 border-b ${t.heading(darkMode)} ${t.divider(darkMode)}`}>Skills & Expertise</h2>
            <div className="space-y-2">
              {skills.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${t.skillItem(darkMode)}`}>
                  <div className={`p-2 rounded-lg ${t.skillIcon(darkMode)}`}><s.icon size={16} className={t.sub(darkMode)} /></div>
                  <div><p className={`font-medium text-xs ${t.heading(darkMode)}`}>{s.label}</p><p className={`text-[11px] ${t.sub(darkMode)}`}>{s.sub}</p></div>
                </div>
              ))}
            </div>
          </Card>

          {/* About */}
          <Card>
            <SectionTitle>About</SectionTitle>
            <div className={`space-y-3 text-sm leading-relaxed ${t.sub(darkMode)}`}>
              <p>A 4th-year student currently completing On-the-Job Training (OJT), with hands-on leadership experience as the <span className={`font-semibold ${t.heading(darkMode)}`}>Head of the Video Editing Team</span> in my school's multimedia organization.</p>
              <p>Led a team of editors, delegated tasks under tight deadlines, and ensured brand and story consistency across cinematic films, advertisements, commercials, and podcast post-production.</p>
              <p>Successfully delivered paid project work for external clients — bridging the gap between creative direction and efficient execution.</p>
            </div>
          </Card>

          {/* Portfolio Videos */}
          <Card>
            <div className={`flex items-center justify-between mb-4 pb-2 border-b ${t.divider(darkMode)}`}>
              <h2 className={`text-xl font-bold ${t.heading(darkMode)}`}>Portfolio Videos</h2>
              <button onClick={() => navigate('/videos')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${t.accentBg(darkMode)}`}>See More</button>
            </div>
            <div className="space-y-2">
              {projects.map(p => (
                <ProjectRow key={p.id} project={p} onWatch={setSelectedVideo} darkMode={darkMode} />
              ))}
            </div>
          </Card>

          {/* Experience + Education */}
          <Card>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-4">
              {experience.map((e, i) => (
                <div key={i} className={`border-l-4 pl-4 py-0.5 ${t.expBorder(darkMode)}`}>
                  <p className={`font-bold text-sm ${t.heading(darkMode)}`}>{e.role}</p>
                  <p className={`text-xs ${t.sub(darkMode)}`}>{e.org}</p>
                  <p className={`text-xs ${t.muted(darkMode)}`}>{e.period}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {education.map((e, i) => (
                <div key={i} className={`border-l-4 pl-4 py-0.5 ${t.eduBorder(darkMode)}`}>
                  <p className={`font-bold text-sm ${t.heading(darkMode)}`}>{e.institution}</p>
                  <p className={`text-xs ${t.sub(darkMode)}`}>{e.degree}</p>
                  <p className={`text-xs ${t.muted(darkMode)}`}>{e.period}</p>
                  <p className={`text-xs mt-0.5 ${t.muted(darkMode)}`}>{e.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tools */}
          <Card>
            <SectionTitle>Tools & Resources</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pillBg(darkMode)}`}>{tech}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* ══════ DESKTOP ══════ */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">

          {/* Left sidebar */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-xl mb-4 ring-2 ring-offset-2 ring-blue-500/30">
                  <img src={darkMode ? DarkProfile : LightProfile} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h1 className={`text-xl font-bold mb-1 flex items-center gap-1 ${t.heading(darkMode)}`}>
                  Mark Quitaleg
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 22 22"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0"/></svg>
                </h1>
                <div className={`flex items-center text-xs mb-0.5 ${t.sub(darkMode)}`}><MapPin size={12} className="mr-1" />Dasmariñas Cavite, Philippines</div>
                <p className={`text-xs mb-1 ${t.muted(darkMode)}`}>22 years old · Filipino</p>
                <p className={`text-sm font-semibold mt-1 mb-5 ${t.accent(darkMode)}`}>Video Editor</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                <button onClick={handleDownloadCV} className={`flex flex-col items-center p-3 rounded-xl transition ${t.btnOutline(darkMode)}`}>
                  <Calendar size={18} /><span className="text-xs mt-1 font-medium">Download CV</span>
                </button>
                <button onClick={handleEmail} className={`flex flex-col items-center p-3 rounded-xl transition ${t.btnOutline(darkMode)}`}>
                  <Mail size={18} /><span className="text-xs mt-1 font-medium">Contact</span>
                </button>
              </div>

              <h2 className={`text-sm font-bold mb-3 pb-2 border-b ${t.heading(darkMode)} ${t.divider(darkMode)}`}>Skills & Expertise</h2>
              <div className="space-y-2">
                {skills.map((s, i) => (
                  <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${t.skillItem(darkMode)}`}>
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${t.skillIcon(darkMode)}`}><s.icon size={14} className={t.sub(darkMode)} /></div>
                    <div><p className={`font-medium text-xs ${t.heading(darkMode)}`}>{s.label}</p><p className={`text-[10px] leading-tight ${t.sub(darkMode)}`}>{s.sub}</p></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right main content */}
          <div className="col-span-3 space-y-6">

            {/* About + Tools row */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-2">
                <SectionTitle>About</SectionTitle>
                <div className={`space-y-3 text-sm leading-relaxed ${t.sub(darkMode)}`}>
                  <p>A 4th-year student currently completing On-the-Job Training (OJT), with hands-on leadership experience as the <span className={`font-semibold ${t.heading(darkMode)}`}>Head of the Video Editing Team</span> in my school's multimedia organization.</p>
                  <p>Led a team of editors, delegated tasks under tight deadlines, and ensured brand and story consistency across cinematic films, advertisements, commercials, and podcast post-production.</p>
                  <p>Successfully delivered paid project work for external clients — bridging the gap between creative direction and efficient execution.</p>
                </div>
              </Card>

              <Card>
                <SectionTitle>Tools & Resources</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech, i) => (
                    <span key={i} className={`px-2 py-1 rounded-full text-[11px] font-medium ${t.pillBg(darkMode)}`}>{tech}</span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Video Projects */}
            <Card>
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${t.divider(darkMode)}`}>
                <h2 className={`text-xl font-bold ${t.heading(darkMode)}`}>Video Projects</h2>
                <button onClick={() => navigate('/videos')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${t.accentBg(darkMode)}`}>See More</button>
              </div>
              {/* Clean list — no height mismatch between landscape & vertical thumbnails */}
              <div className="space-y-2">
                {projects.map(p => (
                  <ProjectRow key={p.id} project={p} onWatch={setSelectedVideo} darkMode={darkMode} />
                ))}
              </div>
            </Card>

            {/* Experience + Education */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <SectionTitle>Experience</SectionTitle>
                <div className="space-y-4">
                  {experience.map((e, i) => (
                    <div key={i} className={`border-l-4 pl-4 py-0.5 ${t.expBorder(darkMode)}`}>
                      <p className={`font-bold text-sm ${t.heading(darkMode)}`}>{e.role}</p>
                      <p className={`text-xs ${t.sub(darkMode)}`}>{e.org}</p>
                      <p className={`text-xs ${t.muted(darkMode)}`}>{e.period}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionTitle>Education</SectionTitle>
                <div className="space-y-4">
                  {education.map((e, i) => (
                    <div key={i} className={`border-l-4 pl-4 py-0.5 ${t.eduBorder(darkMode)}`}>
                      <p className={`font-bold text-sm ${t.heading(darkMode)}`}>{e.institution}</p>
                      <p className={`text-xs ${t.sub(darkMode)}`}>{e.degree}</p>
                      <p className={`text-xs ${t.muted(darkMode)}`}>{e.period}</p>
                      <p className={`text-xs mt-0.5 ${t.muted(darkMode)}`}>{e.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        <p className={`mt-6 text-center text-xs ${t.muted(darkMode)}`}>© {new Date().getFullYear()} Mark Quitaleg. All rights reserved.</p>
      </div>
      <ChatBot darkMode={darkMode} />
    </div>
  );
};

// ─── Router root ──────────────────────────────────────────────────────────────
const Profile = () => (
  <Router>
    <Routes>
      <Route path="/"       element={<ProfileContent />} />
      <Route path="/videos" element={<VideosPageWrapper />} />
    </Routes>
  </Router>
);

export default Profile;
