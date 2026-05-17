import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, Sun, Moon, ChevronLeft } from 'lucide-react';
import YouTube from 'react-youtube';

import { useTheme } from '@/context/ThemeContext';
import { projects } from '@/data/projects';
import ChatBot from '@/components/ChatBot';
import RevealCard from '@/components/RevealCard';

// ─── Theme tokens — mirrors mk() from Profile.jsx exactly ────────────────────
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
  accentBg:     d ? 'bg-[#408A71] text-[#000000] hover:bg-[#d6ff6e] font-semibold'
                  : 'bg-[#111111] text-white hover:bg-[#333333] font-semibold',
  widgetBg:     d ? 'bg-[#0c0c0c]' : 'bg-white',
  accentStat:   d ? 'text-[#408A71]' : 'text-[#111111]',
  activeBox:    d ? 'border-[#555555] bg-[#1a1a1a]' : 'border-[#888888] bg-[#e0e0e0]',
  inactiveBox:  d ? 'border-[#222222]' : 'border-[#d8d8d8]',
  footerText:   d ? 'text-[#282828]'   : 'text-[#bbbbbb]',
  toggleBtn:    d ? 'border border-[#222222] text-[#545454] hover:text-[#b0b0b0] hover:border-[#3a3a3a]'
                  : 'border border-[#d8d8d8] text-[#999999] hover:text-[#444444] hover:border-[#aaaaaa]',
  activePill:   d ? 'bg-[#1a1a1a] text-[#c0c0c0] border border-[#333333]'
                  : 'bg-[#222222] text-white border border-[#222222]',
  inactivePill: d ? 'bg-[#0d0d0d] text-[#444444] border border-[#111111] hover:text-[#787878] hover:border-[#222222]'
                  : 'bg-[#ebebeb] text-[#888888] border border-[#e2e2e2] hover:text-[#444444] hover:border-[#cccccc]',
});

// ─── SectionLabel (mirrors Profile.jsx) ──────────────────────────────────────
const SectionLabel = ({ children, labelColor }) => (
  <div className="flex items-center justify-between mb-4">
    <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${labelColor}`}>{children}</span>
  </div>
);

// ─── VideoPlayer — same minimal style as Profile.jsx ─────────────────────────
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

// ─── VideoRow — same row pattern as ProjectRow in Profile.jsx ─────────────────
const VideoRow = ({ project, onWatch, isPlaying, t }) => (
  <div className={`flex items-center gap-3 py-2.5 border-b ${t.rowBorder} ${t.rowHover} group transition-colors`}>
    {/* Thumbnail */}
    <div className="relative w-20 h-[46px] flex-shrink-0 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={12} className="text-white ml-0.5" />
      </div>
    </div>

    {/* Info */}
<div className="flex-1 min-w-0 text-center">
  <div className="flex items-center justify-center gap-2">
    <p className={`text-xs font-medium truncate ${t.textSub}`}>
      {project.title}
    </p>

    {isPlaying && (
      <span className="flex items-center gap-1 text-[9px] text-[#408A71] font-medium flex-shrink-0">
        <span className="w-1 h-1 rounded-full bg-[#408A71] animate-pulse" />
        PLAYING
      </span>
    )}
  </div>

  <p className={`text-[10px] mt-0.5 truncate ${t.textMuted}`}>
    {project.description}
  </p>
</div>

    {/* Category badge */}
    <span className={`hidden sm:inline-flex flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded-sm ${t.tag}`}>
      {project.category === 'portrait' ? 'Short' : 'Film'}
    </span>

    {/* Tags */}
    <div className="hidden md:flex items-center gap-1">
      {project.technologies.slice(0, 2).map((tech, i) => (
        <span key={i} className={`px-1.5 py-0.5 text-[10px] rounded-sm ${t.tag}`}>{tech}</span>
      ))}
    </div>

    {/* Watch button */}
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

// ─── Filter pills ─────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Landscape', 'Portrait'];

const FilterPills = ({ active, onChange, t, counts }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {FILTERS.map(f => {
      const count = f === 'All' ? counts.all : (counts[f.toLowerCase()] ?? 0);
      const isActive = active === f;
      return (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-2.5 py-1 rounded-sm text-[11px] transition-all flex items-center gap-1.5 ${isActive ? t.activePill : t.inactivePill}`}
        >
          {f}
          <span className={`text-[9px] ${isActive ? '' : t.textMuted}`}>{count}</span>
        </button>
      );
    })}
  </div>
);

// ─── VideosPage ───────────────────────────────────────────────────────────────
const VideosPage = () => {
  const { darkMode, toggleDark } = useTheme();
  const t = mk(darkMode);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  // Sync bg color like Profile.jsx does
  useEffect(() => {
    document.documentElement.style.backgroundColor = t.bgStyle;
    document.body.style.backgroundColor = t.bgStyle;
  }, [darkMode]);

  const counts = useMemo(() => ({
    all:       projects.length,
    landscape: projects.filter(p => p.category === 'landscape').length,
    portrait:  projects.filter(p => p.category === 'portrait').length,
  }), []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(p => p.category === activeFilter.toLowerCase());
  }, [activeFilter]);

  const landscape = filtered.filter(p => p.category === 'landscape');
  const portrait  = filtered.filter(p => p.category === 'portrait');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${t.bg}`} style={{ backgroundColor: t.bgStyle }}>
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.video}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── HEADER — mirrors hero bar style from Profile.jsx ────────────── */}
        <div className={`pb-6 border-b ${t.divider}`}>
          <div className="flex items-center justify-between gap-2">
<div className="flex items-center flex-1 relative">

  <button
    onClick={() => navigate(-1)}
    className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] transition-all z-10 ${t.btnGhost}`}
  >
    <ChevronLeft size={11} /> Back
  </button>

  <div className="absolute left-1/2 -translate-x-1/2 text-center">
    <h1 className={`text-sm sm:text-lg font-semibold tracking-tight leading-tight ${t.text}`}>
      Video Portfolio
    </h1>

    <p className={`text-[10px] ${t.textMuted}`}>
      {filtered.length} {filtered.length === 1 ? 'video' : 'videos'}
    </p>
  </div>

</div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={toggleDark}
                className={`p-1.5 rounded-sm transition-all ${t.toggleBtn}`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun size={12} /> : <Moon size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTER + SECTIONS ───────────────────────────────────────────── */}
        <div className={`pt-6 pb-2 border-t ${t.divider}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${t.sectionLabel}`}>
              Filter
            </span>
            <FilterPills active={activeFilter} onChange={setActiveFilter} t={t} counts={counts} />
          </div>
        </div>

        {/* ── LANDSCAPE ───────────────────────────────────────────────────── */}
        {landscape.length > 0 && (
          <div className={`pt-6 pb-2 border-t ${t.divider}`}>
            <SectionLabel labelColor={t.sectionLabel}>
              Landscape · {landscape.length} {landscape.length === 1 ? 'video' : 'videos'}
            </SectionLabel>
            <div>
              {landscape.map(p => (
                <RevealCard key={p.id}>
                  <VideoRow
                    project={p}
                    onWatch={setSelectedVideo}
                    isPlaying={selectedVideo?.id === p.id}
                    t={t}
                  />
                </RevealCard>
              ))}
            </div>
          </div>
        )}

        {/* ── PORTRAIT ────────────────────────────────────────────────────── */}
        {portrait.length > 0 && (
          <div className={`pt-6 pb-2 border-t ${t.divider}`}>
            <SectionLabel labelColor={t.sectionLabel}>
              Portrait / Shorts · {portrait.length} {portrait.length === 1 ? 'video' : 'videos'}
            </SectionLabel>
            <div>
              {portrait.map(p => (
                <RevealCard key={p.id}>
                  <VideoRow
                    project={p}
                    onWatch={setSelectedVideo}
                    isPlaying={selectedVideo?.id === p.id}
                    t={t}
                  />
                </RevealCard>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className={`pt-6 pb-2 border-t ${t.divider}`}>
            <p className={`text-xs py-8 text-center ${t.textMuted}`}>No videos in this category yet.</p>
          </div>
        )}

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

export default VideosPage;
