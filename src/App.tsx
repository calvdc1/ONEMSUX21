/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ChevronRight, 
  Users, 
  Globe, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  Info,
  MessageSquare,
  ExternalLink,
  Github,
  MessageCircle,
  Heart as MessageCircleHeart,
  Send,
  Search,
  Hash,
  Bell,
  BellOff,
  Settings,
  LogOut,
  User as UserIcon,
  Plus,
  Bot,
  Mic,
  Volume2,
  Square,
  PhoneCall,
  Video,
  Smile,
  Pencil,
  Trash2,
  Paperclip,
  Mic2
} from 'lucide-react';

// --- Types ---

interface User {
  id: number;
  name: string;
  email: string;
  campus: string;
  avatar?: string;
  student_id?: string;
  program?: string;
  year_level?: string;
  department?: string;
  bio?: string;
  cover_photo?: string;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  room_id: string;
  timestamp: string;
}
interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}


interface Campus {
  name: string;
  slug: string;
  location: string;
  description: string;
  stats: {
    students: string;
    courses: string;
  };
  top: string;
  left: string;
  color: string;
}

// --- Constants ---

const CAMPUSES: Campus[] = [
  { 
    name: "MSU Main", 
    slug: "msu-main", 
    location: "Marawi City", 
    description: "The flagship campus of the Mindanao State University System.",
    stats: { students: "20k+", courses: "150+" },
    top: "12%", left: "8%",
    color: "#8e1212"
  },
  { 
    name: "MSU IIT", 
    slug: "msu-iit", 
    location: "Iligan City", 
    description: "A premier institution of higher learning in the Philippines.",
    stats: { students: "15k+", courses: "100+" },
    top: "26%", left: "82%",
    color: "#1a3a5a"
  },
  { 
    name: "MSU Gensan", 
    slug: "msu-gensan", 
    location: "General Santos City", 
    description: "Serving the SOCCSKSARGEN region with excellence.",
    stats: { students: "12k+", courses: "80+" },
    top: "38%", left: "12%",
    color: "#1b5e20"
  },
  { 
    name: "MSU Tawi-Tawi", 
    slug: "msu-tawi-tawi", 
    location: "Bongao, Tawi-Tawi", 
    description: "The southernmost campus specializing in fisheries and oceanography.",
    stats: { students: "8k+", courses: "40+" },
    top: "56%", left: "76%",
    color: "#01579b"
  },
  { 
    name: "MSU Naawan", 
    slug: "msu-naawan", 
    location: "Naawan, Misamis Oriental", 
    description: "A center of excellence in fisheries and marine sciences.",
    stats: { students: "5k+", courses: "30+" },
    top: "18%", left: "74%",
    color: "#e65100"
  },
  { 
    name: "MSU Maguindanao", 
    slug: "msu-maguindanao", 
    location: "Datu Odin Sinsuat", 
    description: "Empowering the Bangsamoro through education.",
    stats: { students: "7k+", courses: "45+" },
    top: "64%", left: "10%",
    color: "#33691e"
  },
  { 
    name: "MSU Sulu", 
    slug: "msu-sulu", 
    location: "Jolo, Sulu", 
    description: "Fostering peace and development in the Sulu archipelago.",
    stats: { students: "6k+", courses: "35+" },
    top: "44%", left: "84%",
    color: "#bf360c"
  },
  { 
    name: "MSU Buug", 
    slug: "msu-buug", 
    location: "Buug, Zamboanga Sibugay", 
    description: "Providing quality education in the Sibugay area.",
    stats: { students: "4k+", courses: "25+" },
    top: "70%", left: "68%",
    color: "#4a148c"
  },
];

const SPARKLES = [
  { top: "10%", left: "14%" },
  { top: "22%", left: "78%" },
  { top: "36%", left: "20%" },
  { top: "54%", left: "72%" },
  { top: "68%", left: "16%" },
  { top: "82%", left: "60%" },
];

// --- Components ---

const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f9e7a3" />
        <stop offset="50%" stopColor="#f5d36b" />
        <stop offset="100%" stopColor="#b99740" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logo-grad)" strokeWidth="2" />
    <path 
      d="M50 15 L85 85 L15 85 Z" 
      fill="none" 
      stroke="url(#logo-grad)" 
      strokeWidth="4" 
      strokeLinejoin="round" 
      filter="url(#glow)"
    />
    <text x="50" y="65" textAnchor="middle" fill="url(#logo-grad)" fontSize="12" fontWeight="bold" fontFamily="serif">MSU</text>
  </svg>
);

const CampusLogo = ({ slug, className = "w-full h-full" }: { slug: string, className?: string }) => {
  const campus = CAMPUSES.find(c => c.slug === slug);
  const color = campus?.color || "#b99740";
  
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#grad-${slug})`} />
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M50 25 L75 75 L25 75 Z" fill="white" />
      <text x="50" y="65" textAnchor="middle" fill={color} fontSize="10" fontWeight="900" fontFamily="serif">
        {slug.split('-')[1]?.toUpperCase() || 'MSU'}
      </text>
    </svg>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'explorer' | 'about' | 'dashboard' | 'messenger' | 'newsfeed' | 'profile' | 'freedomwall' | 'feedbacks' | 'assistant' | 'settings' | 'library' | 'lostfound' | 'groups' | 'confession'>('home');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showOpeningSplash, setShowOpeningSplash] = useState(true);
  const [showLogoutSplash, setShowLogoutSplash] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onemsu_auth') === 'true';
    }
    return false;
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onemsu_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const isPrependingRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [otherLastRead, setOtherLastRead] = useState<string | null>(null);
  const [groups, setGroups] = useState<{ id: number; name: string; description: string; campus: string; logo_url?: string }[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ id: number; user_id: number; content: string; timestamp: string }[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [freedomPosts, setFreedomPosts] = useState<{ id: number; user_id: number | null; alias: string; content: string; campus: string; image_url?: string; likes: number; reports: number; timestamp: string }[]>([]);
  const [freedomText, setFreedomText] = useState('');
  const [freedomImagePreview, setFreedomImagePreview] = useState<string | null>(null);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantVoiceMode, setAssistantVoiceMode] = useState<'text' | 'voice'>('text');
  const [assistantListening, setAssistantListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({});
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [imageEditorTarget, setImageEditorTarget] = useState<'avatar' | 'cover'>('avatar');
  const [imageEditorSource, setImageEditorSource] = useState<string>('');
  const [imageZoom, setImageZoom] = useState(1);
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);
  const [mobileMessengerView, setMobileMessengerView] = useState<'list' | 'chat'>('list');
  const [messageEditId, setMessageEditId] = useState<number | null>(null);
  const [messageEditText, setMessageEditText] = useState('');
  const [composerAttachment, setComposerAttachment] = useState<{ url: string; type: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const mediaRecorderRef = useRef<any>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [followingFeed, setFollowingFeed] = useState<any[]>([]);
  const [ownerSettings, setOwnerSettings] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ id: number; name: string; description: string; campus: string; logo_url?: string } | null>(null);
  const [newGroup, setNewGroup] = useState<{ name: string; description: string; campus: string; logoPreview: string | null }>({ name: '', description: '', campus: '', logoPreview: null });
  const [dashboardCreateOpen, setDashboardCreateOpen] = useState(false);
  const [dashboardCreating, setDashboardCreating] = useState(false);
  const [mutedRooms, setMutedRooms] = useState<string[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('onemsu_muted_rooms') : null;
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [compactBubbles, setCompactBubbles] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [notesByRoom, setNotesByRoom] = useState<Record<string, string>>(() => {
    try {
      const key = typeof window !== 'undefined'
        ? (user ? `onemsu_notes_${user.id}` : 'onemsu_notes_guest')
        : null;
      const saved = key ? localStorage.getItem(key) : null;
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [stickyNotes, setStickyNotes] = useState<{ id: string; content: string; color: string; createdAt: string }[]>(() => {
    try {
      const key = typeof window !== 'undefined'
        ? (user ? `onemsu_stickies_${user.id}` : 'onemsu_stickies_guest')
        : null;
      const saved = key ? localStorage.getItem(key) : null;
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const safeJson = async (r: Response) => {
    try {
      const t = await r.text();
      if (!t) return {};
      return JSON.parse(t);
    } catch {
      return {};
    }
  };

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onemsu_courses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowOpeningSplash(false), 10000);
    return () => window.clearTimeout(timer);
  }, []);
  const routeToView = (route: string) => {
    const map: Record<string, any> = {
      '/home': 'home',
      '/messenger': 'messenger',
      '/groups': 'groups',
      '/profile': 'profile',
      '/confession': 'confession',
      '/library': 'library',
      '/lost-found': 'lostfound',
      '/settings': 'settings',
      '/dashboard': 'dashboard',
      '/assistant': 'assistant',
      '/feedback': 'feedbacks',
    };
    return map[route] || 'home';
  };

  const viewToRoute = (v: string) => {
    const map: Record<string, string> = {
      home: '/home',
      messenger: '/messenger',
      groups: '/groups',
      profile: '/profile',
      confession: '/confession',
      library: '/library',
      lostfound: '/lost-found',
      settings: '/settings',
      dashboard: '/dashboard',
      assistant: '/assistant',
      feedbacks: '/feedback',
    };
    return map[v] || '/home';
  };

  const navigateTo = (nextView: any) => {
    setView(nextView);
    if (typeof window !== 'undefined') window.location.hash = viewToRoute(nextView);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyRoute = () => {
      const route = (window.location.hash || '#/home').replace('#', '');
      const next = routeToView(route);
      setView(next);
    };
    applyRoute();
    window.addEventListener('hashchange', applyRoute);
    return () => window.removeEventListener('hashchange', applyRoute);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target = viewToRoute(view);
    if ((window.location.hash || '#/home').replace('#', '') !== target) {
      window.location.hash = target;
    }
  }, [view]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    localStorage.setItem('onemsu_auth', isLoggedIn.toString());
    if (user) localStorage.setItem('onemsu_user', JSON.stringify(user));
    else localStorage.removeItem('onemsu_user');
  }, [isLoggedIn, user]);

  useEffect(() => {
    localStorage.setItem('onemsu_courses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    if (view === 'dashboard' || view === 'explorer') {
      setLoadingGroups(true);
      fetch('/api/groups')
        .then((res) => res.json())
        .then((data) => setGroups(data))
        .finally(() => setLoadingGroups(false));
      fetch('/api/feedbacks')
        .then((res) => res.json())
        .then((data) => setFeedbacks(data));
      const campusParam = user?.campus ? `?campus=${encodeURIComponent(user.campus)}` : '';
      fetch(`/api/freedomwall${campusParam}`)
        .then((res) => res.json())
        .then((data) => setFreedomPosts(data));
    }
  }, [view]);
  useEffect(() => {
    if (isLoggedIn && view === 'home') navigateTo('dashboard');
  }, [isLoggedIn, view]);
  useEffect(() => {
    if (!user) return;
    fetch(`/api/follows/${user.id}?viewer=${user.id}`).then(r => r.json()).then((res) => {
      if (res.success) setFollowStats({ followers: res.followers || 0, following: res.following || 0 });
    }).catch(() => {});
    fetch(`/api/feed/${user.id}`).then(r => r.json()).then((res) => {
      if (res.success) setFollowingFeed(res.items || []);
    }).catch(() => {});
    if (user.email === 'xandercamarin@gmail.com') {
      fetch(`/api/owner/settings?email=${encodeURIComponent(user.email)}`).then(r => r.json()).then((res) => {
        if (res.success) setOwnerSettings(res.settings);
      }).catch(() => {});
    }
  }, [user?.id, user?.email]);


  useEffect(() => {
    if (isLoggedIn && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${protocol}//${window.location.host}`);
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'join', userId: user.id, roomId: activeRoom }));
        setOnlineUsers((prev) => ({ ...prev, [user.id]: true }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          if (data.roomId === activeRoom) {
            setMessages(prev => [...prev, data]);
          } else {
            setUnreadCount((n) => n + 1);
            if (typeof document !== 'undefined') document.title = `(${unreadCount + 1}) ONEMSU`;
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(`${data.senderName || 'New message'}`, { body: data.content || 'Attachment received' });
            }
          }
        } else if (data.type === 'presence') {
          setOnlineUsers((prev) => ({ ...prev, [data.userId]: !!data.online }));
        }
      };

      return () => {
        socket.close();
      };
    }
  }, [isLoggedIn, user, activeRoom]);

  const sendSeen = () => {
    if (!socketRef.current || !user || !activeRoom) return;
    const last = messages[messages.length - 1]?.timestamp;
    if (!last) return;
    socketRef.current.send(JSON.stringify({ type: 'seen', userId: user.id, roomId: activeRoom, lastRead: last }));
  };

  useEffect(() => {
    setUnreadCount(0);
    if (typeof document !== 'undefined') document.title = 'ONEMSU';
    if (isLoggedIn && activeRoom) {
      setHasMore(true);
      fetch(`/api/messages/${activeRoom}?viewer=${user?.id || 0}`)
        .then(res => res.json())
        .then((data: Message[]) => {
          setMessages(data);
          setHasMore(data.length >= 50);
          // On room change, stick to bottom
          requestAnimationFrame(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              stickToBottomRef.current = true;
            }
          });
          if (activeRoom.startsWith('dm-') && user) {
            fetch(`/api/receipts/${activeRoom}?viewer=${user.id}`).then(r => r.json()).then((res) => {
              if (res.success) setOtherLastRead(res.last_read || null);
            });
          } else {
            setOtherLastRead(null);
          }
        });
    }
  }, [isLoggedIn, activeRoom]);

  useEffect(() => {
    const peerId = getDmPeerId(activeRoom);
    if (!peerId) return;
    fetch(`/api/status/${peerId}`).then(r => r.json()).then((res) => {
      if (res?.success) setOnlineUsers((prev) => ({ ...prev, [peerId]: !!res.online }));
    }).catch(() => {});
  }, [activeRoom, user?.id]);

  useEffect(() => {
    if (scrollRef.current && stickToBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      sendSeen();
    }
  }, [messages]);
  // Keep the chat pinned to the latest message when the user is at the bottom.
  useEffect(() => {
    try { localStorage.setItem('onemsu_muted_rooms', JSON.stringify(mutedRooms)); } catch {}
  }, [mutedRooms]);
  useEffect(() => {
    try {
      const key = user ? `onemsu_notes_${user.id}` : 'onemsu_notes_guest';
      localStorage.setItem(key, JSON.stringify(notesByRoom));
    } catch {}
  }, [notesByRoom, user]);
  useEffect(() => {
    try {
      const key = user ? `onemsu_notes_${user.id}` : 'onemsu_notes_guest';
      const saved = localStorage.getItem(key);
      setNotesByRoom(saved ? JSON.parse(saved) : {});
    } catch {
      setNotesByRoom({});
    }
  }, [user]);
  useEffect(() => {
    try {
      const key = user ? `onemsu_stickies_${user.id}` : 'onemsu_stickies_guest';
      localStorage.setItem(key, JSON.stringify(stickyNotes));
    } catch {}
  }, [stickyNotes, user]);
  useEffect(() => {
    try {
      const key = user ? `onemsu_stickies_${user.id}` : 'onemsu_stickies_guest';
      const saved = localStorage.getItem(key);
      setStickyNotes(saved ? JSON.parse(saved) : []);
    } catch {
      setStickyNotes([]);
    }
  }, [user]);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length > 2) {
      const res = await fetch(`/api/users/search?q=${q}`);
      const data = await res.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const getDmPeerId = (room: string) => {
    if (!room.startsWith('dm-') || !user) return null;
    const parts = room.split('-');
    if (parts.length !== 3) return null;
    const a = Number(parts[1]);
    const b = Number(parts[2]);
    return a === user.id ? b : b === user.id ? a : null;
  };

  const openImageEditor = (file: File, target: 'avatar' | 'cover') => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageEditorSource(reader.result as string);
      setImageEditorTarget(target);
      setImageZoom(1);
      setImageOffsetX(0);
      setImageOffsetY(0);
      setImageEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const saveEditedImage = async () => {
    if (!imageEditorSource || !user) return;
    const img = new Image();
    img.src = imageEditorSource;
    await new Promise((resolve) => { img.onload = () => resolve(null); });

    const canvas = document.createElement('canvas');
    const outW = imageEditorTarget === 'cover' ? 1200 : 512;
    const outH = imageEditorTarget === 'cover' ? 420 : 512;
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseScale = Math.max(outW / img.width, outH / img.height);
    const scale = baseScale * imageZoom;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (outW - drawW) / 2 + imageOffsetX;
    const y = (outH - drawH) / 2 + imageOffsetY;

    ctx.fillStyle = '#0a0502';
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, x, y, drawW, drawH);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const up = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl })
    }).then(r => r.json());
    if (!up.success) return;

    const payload = imageEditorTarget === 'avatar' ? { avatar: up.url } : { cover_photo: up.url };
    const res = await fetch(`/api/profile/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) setUser(res.user);
    setImageEditorOpen(false);
  };

  const toggleReaction = async (messageId: number, emoji: string) => {
    if (!user) return;
    const res = await fetch(`/api/messages/${messageId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, emoji })
    }).then(r => r.json());
    if (res.success) {
      setMessages(prev => prev.map((m: any) => m.id === messageId ? { ...m, reactions: res.reactions, my_reactions: res.my_reactions } : m));
    }
  };

  const editOwnMessage = async (messageId: number) => {
    if (!user || !messageEditText.trim()) return;
    const res = await fetch(`/api/messages/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, content: messageEditText.trim() })
    }).then(r => r.json());
    if (res.success) {
      setMessages(prev => prev.map((m: any) => m.id === messageId ? { ...m, ...res.message } : m));
      setMessageEditId(null);
      setMessageEditText('');
    }
  };

  const deleteOwnMessage = async (messageId: number) => {
    if (!user) return;
    const res = await fetch(`/api/messages/${messageId}?userId=${user.id}`, { method: 'DELETE' }).then(r => r.json());
    if (res.success) setMessages(prev => prev.filter((m: any) => m.id !== messageId));
  };

  const sendMessage = (content: string) => {
    if (socketRef.current && user && (content.trim() || composerAttachment)) {
      socketRef.current.send(JSON.stringify({
        type: 'chat',
        senderId: user.id,
        senderName: user.name,
        content,
        roomId: activeRoom,
        attachmentUrl: composerAttachment?.url,
        attachmentType: composerAttachment?.type,
      }));
      setComposerAttachment(null);
    }
  };

  const attachFileToComposer = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const up = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: reader.result })
      }).then(r => r.json());
      if (up.success) setComposerAttachment({ url: up.url, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const toggleVoiceNote = async () => {
    if (isRecordingVoice) {
      mediaRecorderRef.current?.stop?.();
      setIsRecordingVoice(false);
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    mediaChunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) mediaChunksRef.current.push(e.data); };
    recorder.onstop = async () => {
      const blob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = async () => {
        const up = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: reader.result })
        }).then(r => r.json());
        if (up.success) setComposerAttachment({ url: up.url, type: 'audio/webm' });
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start();
    setIsRecordingVoice(true);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const student_id = formData.get('student_id') as string;
    const program = formData.get('program') as string;
    const year_level = formData.get('year_level') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, student_id, program, year_level, email, password, campus: 'MSU Main' })
    });

    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setIsLoggedIn(true);
      setIsSignupOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleLogout = async () => {
    if (showLogoutSplash) return;
    setShowLogoutSplash(true);
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setIsLoggedIn(false);
    setUser(null);
    navigateTo('home');
    localStorage.removeItem('onemsu_auth');
    localStorage.removeItem('onemsu_user');
    setOnlineUsers({});
    setShowLogoutSplash(false);
  };

  const speakAssistantText = (text: string) => {
    if (typeof window === 'undefined' || assistantVoiceMode !== 'voice') return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  const sendAssistantMessage = async () => {
    const prompt = assistantInput.trim();
    if (!prompt || assistantLoading) return;

    const userMsg: AssistantMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setAssistantMessages((prev) => [...prev, userMsg]);
    setAssistantInput('');
    setAssistantLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          campus: user?.campus || 'MSU',
          userName: user?.name || 'MSU Student'
        })
      });
      const data = await safeJson(res);
      const text = typeof data.reply === 'string' && data.reply.trim()
        ? data.reply
        : 'I can help with ONEMSU questions, campus info, enrollment steps, and student services.';

      const aiMsg: AssistantMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setAssistantMessages((prev) => [...prev, aiMsg]);
      speakAssistantText(text);
    } catch {
      const fallback = 'I could not reach the AI service right now. Please try again in a few seconds.';
      const aiMsg: AssistantMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: fallback,
        timestamp: new Date().toISOString(),
      };
      setAssistantMessages((prev) => [...prev, aiMsg]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const toggleVoiceListening = () => {
    if (assistantListening) {
      speechRecognitionRef.current?.stop?.();
      setAssistantListening(false);
      return;
    }
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setAssistantInput(transcript);
    };
    recognition.onerror = () => setAssistantListening(false);
    recognition.onend = () => setAssistantListening(false);
    speechRecognitionRef.current = recognition;
    setAssistantListening(true);
    recognition.start();
  };

  const renderAssistant = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white flex items-center gap-3"><Bot className="text-amber-400" /> JARVIS AI</h2>
            <p className="text-gray-400 mt-2">Talk by text or voice. Choose if AI replies in text only or with voice.</p>
          </div>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-400 hover:text-white"><X /></button>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="text-sm text-gray-300">AI response mode</div>
            <div className="flex gap-2">
              <button
                onClick={() => setAssistantVoiceMode('text')}
                className={`px-3 py-2 rounded-lg text-sm border ${assistantVoiceMode === 'text' ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
              >
                Text only
              </button>
              <button
                onClick={() => setAssistantVoiceMode('voice')}
                className={`px-3 py-2 rounded-lg text-sm border flex items-center gap-2 ${assistantVoiceMode === 'voice' ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
              >
                <Volume2 size={14} /> Voice + Text
              </button>
            </div>
          </div>

          <div className="h-[420px] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            {assistantMessages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div>
                  <Bot className="mx-auto mb-3 text-amber-400" />
                  <p>Hi! I’m JARVIS AI. Ask about MSU campuses, programs, or student services.</p>
                </div>
              </div>
            )}
            {assistantMessages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-amber-500 text-black' : 'bg-white/10 text-white border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {assistantLoading && <div className="text-xs text-gray-400">JARVIS is thinking…</div>}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendAssistantMessage(); }}
              placeholder="Ask JARVIS anything about ONEMSU..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40"
            />
            <button
              onClick={toggleVoiceListening}
              title={assistantListening ? 'Stop listening' : 'Use voice input'}
              className={`px-4 rounded-xl border ${assistantListening ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-white/5 text-gray-300 border-white/10'}`}
            >
              {assistantListening ? <Square size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={sendAssistantMessage}
              disabled={assistantLoading || !assistantInput.trim()}
              className="px-5 rounded-xl bg-amber-500 text-black font-bold disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Tip: click the mic, speak your question, then press Send.</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 cursor-pointer" onClick={() => navigateTo('home')}><Logo /></div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'MSUan'}!</h2>
              <p className="text-gray-500 text-sm">Connected to {user?.email || 'Unified System'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigateTo('messenger')}
              className="p-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors"
            >
              <MessageCircle size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-gold p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} /> Freedom Wall Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freedomPosts.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    {p.image_url && <img src={p.image_url} alt="" className="w-full h-32 object-cover" />}
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-400">{p.alias}</span>
                        <span className="text-[10px] text-gray-500">{p.campus}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-200 line-clamp-3">{p.content}</div>
                    </div>
                  </div>
                ))}
                {freedomPosts.length === 0 && (
                  <div className="text-sm text-gray-500">No posts yet. Be the first to share.</div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => navigateTo('confession')} className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
                  Open Freedom Wall
                </button>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-amber-500" /> Campus Board</h3>
              <div className="flex flex-wrap gap-2">
                {CAMPUSES.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { navigateTo('confession'); }}
                    className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 hover:bg-white/20"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2"><BookOpen size={18} className="text-amber-500" /> Notes</h4>
                  <button
                    onClick={() => {
                      const palette = [
                        'bg-amber-500/20 border-amber-500/30',
                        'bg-rose-500/20 border-rose-500/30',
                        'bg-emerald-500/20 border-emerald-500/30',
                        'bg-sky-500/20 border-sky-500/30',
                        'bg-purple-500/20 border-purple-500/30'
                      ];
                      const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
                      const color = palette[Math.floor(Math.random() * palette.length)];
                      setStickyNotes(prev => [{ id, content: '', color, createdAt: new Date().toISOString() }, ...prev]);
                    }}
                    className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20"
                    title="Add note"
                    aria-label="Add note"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {stickyNotes.length === 0 ? (
                  <p className="text-sm text-gray-500">No notes yet. Use + to create a sticky note.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {stickyNotes.map(n => (
                      <div key={n.id} className={`p-3 rounded-2xl border ${n.color}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                          <button
                            className="text-xs text-gray-400 hover:text-white"
                            onClick={() => setStickyNotes(prev => prev.filter(x => x.id !== n.id))}
                            title="Delete note"
                            aria-label="Delete note"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <textarea
                          value={n.content}
                          onChange={(e) => {
                            const v = e.target.value;
                            setStickyNotes(prev => prev.map(x => x.id === n.id ? { ...x, content: v } : x));
                          }}
                          placeholder="Write a note…"
                          className="w-full h-28 bg-transparent text-sm text-white focus:outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2"><Users size={18} className="text-amber-500" /> Community Groups</h4>
                  <button
                    onClick={() => setDashboardCreateOpen(v => !v)}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"
                  >
                    {dashboardCreateOpen ? 'Close' : 'Create'}
                  </button>
                </div>
                {dashboardCreateOpen && (
                  <div className="mb-4 space-y-2">
                    <input
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder="Group name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                    <select
                      value={newGroup.campus}
                      onChange={(e) => setNewGroup({ ...newGroup, campus: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="" className="bg-[#0a0502]">Select campus</option>
                      {CAMPUSES.map(c => (
                        <option key={c.slug} value={c.name} className="bg-[#0a0502]">{c.name}</option>
                      ))}
                    </select>
                    <textarea
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                      placeholder="Description (optional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                      rows={2}
                    />
                    <div className="flex items-center gap-3">
            <button onClick={() => setMobileMessengerView('list')} className="md:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Back to rooms">←</button>
                      <label className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 cursor-pointer w-fit">
                        Upload logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) { setNewGroup({ ...newGroup, logoPreview: '' }); return; }
                            const reader = new FileReader();
                            reader.onload = () => setNewGroup({ ...newGroup, logoPreview: reader.result as string });
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      {newGroup.logoPreview ? <span className="text-xs text-amber-400">Logo attached</span> : <span className="text-xs text-gray-500">Optional</span>}
                    </div>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newGroup.name || !newGroup.campus || dashboardCreating) return;
                          setDashboardCreating(true);
                          try {
                            let logoUrl: string | undefined;
                            if (newGroup.logoPreview) {
                              const up = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl: newGroup.logoPreview })
                              }).then(safeJson);
                              if (up.success) logoUrl = up.url;
                            }
                            const res = await fetch('/api/groups', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ name: newGroup.name, description: newGroup.description, campus: newGroup.campus, logoUrl })
                            }).then(safeJson);
                            if (res.success) {
                              setGroups((prev) => [res.group, ...prev]);
                              setNewGroup({ name: '', description: '', campus: '', logoPreview: '' });
                              setDashboardCreateOpen(false);
                            }
                          } finally {
                            setDashboardCreating(false);
                          }
                        }}
                        disabled={!newGroup.name || !newGroup.campus || dashboardCreating}
                        aria-busy={dashboardCreating}
                        className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                      >
                        {dashboardCreating ? 'Creating…' : 'Create Group'}
                      </button>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                  </div>
                )}
                <div className="space-y-3">
                  {loadingGroups && <div className="text-sm text-gray-500">Loading groups...</div>}
                  {!loadingGroups && groups.length === 0 && <div className="text-sm text-gray-500">No groups found.</div>}
                  {!loadingGroups && groups.map(group => (
                    <div key={group.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <span className="text-sm">{group.name}</span>
                        <span className="block text-[10px] text-gray-500">{group.campus}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveRoom(group.name.toLowerCase().replace(/\s+/g, '-'));
                          navigateTo('messenger');
                        }}
                        className="text-amber-500 hover:text-amber-400 text-xs"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card-gold p-6 rounded-3xl">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Messenger', icon: <MessageCircle size={14} />, action: () => navigateTo('messenger') },
                  { name: 'JARVIS AI', icon: <Bot size={14} />, action: () => setView('assistant') },
                  { name: 'Library', icon: <BookOpen size={14} />, action: () => window.open('https://openlibrary.org', '_blank') },
                  { name: 'Grades', icon: <Sparkles size={14} /> },
                  { name: 'Finance', icon: <ShieldCheck size={14} /> },
                  { name: 'Discord', icon: <ExternalLink size={14} />, action: () => window.open('https://discord.gg/gjuygmrPnR', '_blank') },
                  { name: 'Profile', icon: <Users size={14} />, action: () => navigateTo('profile') },
                  { name: 'Threads', icon: <MessageSquare size={14} />, action: () => setView('newsfeed') },
                  { name: 'Freedom Wall', icon: <Sparkles size={14} />, action: () => navigateTo('confession') },
                  { name: 'Explorer', icon: <Globe size={14} />, action: () => navigateTo('groups') },
                  { name: 'Feedbacks', icon: <Info size={14} />, action: () => navigateTo('feedbacks') }
                ].map(item => (
                  <button 
                    key={item.name} 
                    onClick={() => item.action ? item.action() : null}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium hover:bg-amber-500 hover:text-black transition-all flex flex-col items-center gap-2"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedbacks moved to its own view via Quick Actions */}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-hidden hero-metallic">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8"><Logo /></div>
          <span className="hidden sm:inline">ONE<span className="text-amber-500">MSU</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => navigateTo('groups')} className="text-gray-400 hover:text-white transition-colors">Campuses</button>
          <button onClick={() => setView('about')} className="text-gray-400 hover:text-white transition-colors">About</button>
          <button 
            onClick={() => isLoggedIn ? navigateTo('dashboard') : setIsLoginOpen(true)}
            className="px-5 py-2 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* Background Elements */}
      <motion.div
        aria-hidden
        animate={{ x: mouse.x * 20, y: mouse.y * 12 }}
        transition={{ type: "spring", stiffness: 40, damping: 18 }}
        className="pointer-events-none absolute -top-40 -right-28 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(248,196,64,0.18),transparent_60%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: mouse.x * -16, y: mouse.y * -10 }}
        transition={{ type: "spring", stiffness: 40, damping: 18 }}
        className="pointer-events-none absolute -bottom-44 -left-32 w-[26rem] h-[26rem] rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(229,57,53,0.22),transparent_60%)] blur-3xl"
      />
      {SPARKLES.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2.6 + i * 0.2, repeat: Infinity }}
          style={{ top: p.top, left: p.left }}
          className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,197,24,0.6)]"
        />
      ))}

      {/* Campus Chips (Floating) */}
      {CAMPUSES.map((c, i) => (
        <motion.div
          key={c.slug}
          style={{ top: c.top, left: c.left }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.4, y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-auto select-none hidden md:block cursor-pointer z-20"
          onClick={() => {
            setSelectedCampus(c);
            navigateTo('groups');
          }}
        >
          <span className="px-3 py-1 rounded-full text-[10px] font-medium border border-amber-400/20 bg-amber-100/5 text-amber-200/60 backdrop-blur-sm hover:bg-amber-400/20 hover:text-amber-200 transition-colors">
            {c.name}
          </span>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8 drop-shadow-[0_0_40px_rgba(248,196,64,0.3)]">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-100/10 text-amber-200 text-xs md:text-sm mb-6"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-amber-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Mindanao State University
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-metallic-gold">
          ONE<span className="text-white">MSU</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300/90 max-w-2xl mb-12 leading-relaxed">
          The digital heart of the MSU community. Connect, explore, and thrive across all campuses in one unified experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('groups')}
            className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
          >
            Explore Campuses <ArrowRight size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLoginOpen(true)}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl font-bold backdrop-blur-md transition-colors"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Log in'}
          </motion.button>
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md card-gold p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-metallic-gold">Connect to ONEMSU</h3>
                <button onClick={() => setIsLoginOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MSU Email / ID</label>
                  {composerAttachment && (
                  <div className="mr-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span>{composerAttachment.type.startsWith('audio/') ? 'Voicemail attached' : 'Attachment ready'}</span>
                    <button type="button" onClick={() => setComposerAttachment(null)} className="text-rose-400">✕</button>
                  </div>
                )}
                <label className="p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer" title="Attach photo">
                  <Paperclip size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f=e.target.files?.[0]; if (f) attachFileToComposer(f); }} />
                </label>
                <button type="button" onClick={toggleVoiceNote} className={`p-3 rounded-xl border ${isRecordingVoice ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' : 'bg-white/5 border-white/10 text-gray-300'}`} title="Voice message">
                  <Mic2 size={16} />
                </button>
                <input 
                    name="email"
                    type="email" 
                    placeholder="e.g. juan.delacruz@msumain.edu.ph"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/10 bg-white/5 text-amber-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-amber-500 hover:underline">Forgot password?</a>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account? <button onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} className="text-amber-500 font-semibold hover:underline">Register here</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {isSignupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md card-gold p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-metallic-gold">Create Student Account</h3>
                <button onClick={() => setIsSignupOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              
              <form className="space-y-6" onSubmit={handleSignup}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ID Number</label>
                  <input 
                    name="student_id"
                    type="text" 
                    placeholder="2024-00001"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Course</label>
                  <input 
                    name="program"
                    type="text" 
                    placeholder="BS Computer Engineering"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Year Level</label>
                  <input 
                    name="year_level"
                    type="text" 
                    placeholder="1st Year"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="juan.delacruz@msumain.edu.ph"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
                >
                  Create Account
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account? <button onClick={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} className="text-amber-500 font-semibold hover:underline">Sign In</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 text-gray-500 text-xs">
        <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure Access</span>
        <span className="flex items-center gap-1"><Globe size={14} /> Global Network</span>
        <span className="flex items-center gap-1"><Users size={14} /> 100k+ Alumni</span>
      </div>
    </div>
  );

  const renderExplorer = () => (
    <div className="min-h-screen bg-[#0a0502] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-metallic-gold mb-2">Campus Explorer</h2>
            <p className="text-gray-400">Discover the diverse branches of the MSU System.</p>
          </div>
          <button 
            onClick={() => navigateTo('home')}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUSES.map((campus, idx) => (
            <motion.div
              key={campus.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCampus(campus)}
              className="card-gold p-6 rounded-2xl cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12">
                  <CampusLogo slug={campus.slug} />
                </div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-1">{campus.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{campus.location}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={12} /> {campus.stats.students}</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> {campus.stats.courses}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-amber-500" /> Community Groups</h3>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Create Group</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="Group name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
              <select
                value={newGroup.campus}
                onChange={(e) => setNewGroup({ ...newGroup, campus: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="" className="bg-[#0a0502]">Select campus</option>
                {CAMPUSES.map(c => <option key={c.slug} value={c.name} className="bg-[#0a0502]">{c.name}</option>)}
              </select>
              <input
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="Description"
                className="w-full md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
              <label className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 cursor-pointer w-fit">
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) { setNewGroup({ ...newGroup, logoPreview: '' }); return; }
                    const reader = new FileReader();
                    reader.onload = () => setNewGroup({ ...newGroup, logoPreview: reader.result as string });
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </label>
              {newGroup.logoPreview ? <span className="text-xs text-amber-400">Logo attached</span> : <span className="text-xs text-gray-500">Optional</span>}
            </div>
            <div className="mt-3">
              <button
                onClick={async () => {
                  if (!newGroup.name || !newGroup.campus) return;
                  let logoUrl: string | undefined;
                  if (newGroup.logoPreview) {
                    const up = await fetch('/api/upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ dataUrl: newGroup.logoPreview })
                    }).then(safeJson);
                    if (up.success) logoUrl = up.url;
                  }
                  const res = await fetch('/api/groups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newGroup.name, description: newGroup.description, campus: newGroup.campus, logoUrl })
                  }).then(safeJson);
                  if (res.success) {
                    setGroups((prev) => [res.group, ...prev]);
                    setNewGroup({ name: '', description: '', campus: '', logoPreview: '' });
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
              >
                Create Group
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setSelectedCampus(null)} className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 hover:bg-white/20">All</button>
            {CAMPUSES.map(c => (
              <button key={c.slug} onClick={() => setSelectedCampus(c)} className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 hover:bg-white/20">
                {c.name}
              </button>
            ))}
          </div>
          {loadingGroups && <div className="text-sm text-gray-500">Loading groups...</div>}
          {!loadingGroups && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groups
                .filter(g => !selectedCampus || g.campus === selectedCampus.name)
                .map(group => (
                  <div key={group.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                        {group.logo_url ? <img src={group.logo_url} alt="" className="w-full h-full object-cover" /> : group.name[0]}
                      </div>
                      <div>
                        <span className="text-sm">{group.name}</span>
                        <span className="block text-[10px] text-gray-500">{group.campus}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedGroup(group)}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          setActiveRoom(group.name.toLowerCase().replace(/\s+/g, '-'));
                          navigateTo('messenger');
                        }}
                        className="text-amber-500 hover:text-amber-400 text-xs"
                      >
                        Join
                      </button>
                    </div>
                  </div>
              ))}
              {groups.filter(g => !selectedCampus || g.campus === selectedCampus.name).length === 0 && (
                <div className="text-sm text-gray-500">No groups for this campus.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Campus Detail Modal */}
      <AnimatePresence>
        {selectedCampus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl card-gold rounded-3xl overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-amber-900/40 to-black relative flex items-center justify-center">
                <div className="w-32 h-32">
                  <CampusLogo slug={selectedCampus.slug} />
                </div>
                <button 
                  onClick={() => setSelectedCampus(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-4xl font-bold text-white mb-1">{selectedCampus.name}</h3>
                  <p className="text-amber-400 flex items-center gap-1"><MapPin size={16} /> {selectedCampus.location}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {selectedCampus.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Student Body</p>
                    <p className="text-2xl font-bold text-white">{selectedCampus.stats.students}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Academic Programs</p>
                    <p className="text-2xl font-bold text-white">{selectedCampus.stats.courses}</p>
                  </div>
                </div>
                <button className="w-full bg-amber-500 text-black py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors">
                  Visit Campus Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl card-gold rounded-3xl overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-amber-900/40 to-black relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                  {selectedGroup.logo_url ? <img src={selectedGroup.logo_url} alt="" className="w-full h-full object-cover" /> : selectedGroup.name[0]}
                </div>
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-bold text-white mb-1">{selectedGroup.name}</h3>
                  <p className="text-amber-400">{selectedGroup.campus}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">{selectedGroup.description || 'No description provided.'}</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setSelectedGroup(null)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">Close</button>
                  <button
                    onClick={() => {
                      setActiveRoom(selectedGroup.name.toLowerCase().replace(/\s+/g, '-'));
                      setSelectedGroup(null);
                      navigateTo('messenger');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                  >
                    Join Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200">
      <nav className="p-6 flex justify-between items-center border-bottom border-white/5">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8"><Logo /></div>
          <span>ONE<span className="text-amber-500">MSU</span></span>
        </div>
        <button onClick={() => navigateTo('home')} className="text-gray-400 hover:text-white"><X /></button>
      </nav>

      <main className="max-w-4xl mx-auto p-8 md:p-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-5xl font-bold mb-8 text-metallic-gold">Our Legacy</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-6">
            Mindanao State University was established on September 1, 1961, through Republic Act 1387, as amended. It was the brain-child of the late Senator Domocao A. Alonto, as one of the government’s responses to the so-called “Mindanao Problem.”
          </p>
          <p className="text-xl text-gray-400 leading-relaxed">
            The University's original mission was anchored on instruction, research and extension. Its primary objective was to integrate the Muslims and other cultural minorities into the mainstream of Philippine body politic.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-4 text-amber-400">Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To be a premier supra-regional university in the ASEAN region, committed to the development of Mindanao, Palawan, and the Sulu Archipelago.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-4 text-amber-400">Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To provide relevant and quality education, research and extension services for the socio-economic and cultural transformation of the communities.
            </p>
          </motion.div>
        </div>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12">Join the Community</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">Apply Now</button>
            <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">Contact Us</button>
          </div>
        </section>
      </main>

      <footer className="p-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© 2026 Mindanao State University System. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Accessibility</a>
        </div>
      </footer>
    </div>
  );

  const renderFeedbacks = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-metallic-gold">Feedbacks</h2>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20">
          <h3 className="font-bold mb-2 flex items-center gap-2"><Info size={16} /> Share your thoughts</h3>
          <p className="text-xs text-gray-400 mb-4">We value your suggestions and comments.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!user || !feedbackText.trim()) return;
              fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, content: feedbackText.trim() })
              })
                .then((r) => r.json())
                .then((res) => {
                  if (res.success) {
                    setFeedbacks((prev) => [res.item, ...prev]);
                    setFeedbackText('');
                  }
                });
            }}
            className="space-y-3"
          >
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
              rows={4}
            />
            <button
              type="submit"
              disabled={!user}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              Post Feedback
            </button>
          </form>
        </div>
        <div className="mt-6 space-y-3">
          {feedbacks.map((f) => (
            <div key={f.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-sm text-gray-300">{f.content}</div>
              <div className="text-[10px] text-gray-500 mt-1">{new Date(f.timestamp).toLocaleString()}</div>
            </div>
          ))}
          {feedbacks.length === 0 && <div className="text-sm text-gray-500">No feedback yet.</div>}
        </div>
      </div>
    </div>
  );

  const renderNewsfeed = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-metallic-gold">Library Feed</h2>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-amber-500" /> Following Feed</h4>
            <div className="space-y-3">
              {followingFeed.slice(0, 12).map((m: any) => (
                <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm font-semibold text-white">{m.sender_name}</div>
                  <div className="text-sm text-gray-300">{m.content || 'Shared an attachment'}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{new Date(m.timestamp).toLocaleString()}</div>
                </div>
              ))}
              {followingFeed.length === 0 && <div className="text-sm text-gray-500">Nothing here yet.</div>}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-amber-500" /> Announcements</h4>
            <Feed room="announcements" />
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-amber-500" /> Global</h4>
            <Feed room="global" />
          </div>
        </div>
      </div>
    </div>
  );

  const Feed = ({ room }: { room: string }) => {
    const [items, setItems] = useState<Message[]>([]);
    useEffect(() => {
      fetch(`/api/messages/${room}`).then(r => r.json()).then(setItems);
    }, [room]);
    return (
      <div className="space-y-4">
        {items.map((m, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm font-semibold">{m.sender_name}</div>
            <div className="text-sm text-gray-300">{m.content}</div>
            <div className="text-[10px] text-gray-500 mt-1">{new Date(m.timestamp).toLocaleString()}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-500">No posts yet.</div>}
      </div>
    );
  };

  const ProfileForm = ({ user, onSaved }: { user: User | null; onSaved: (u: User) => void }) => {
    const [form, setForm] = useState({
      name: user?.name || '',
      campus: user?.campus || '',
      avatar: user?.avatar || '',
      student_id: user?.student_id || '',
      program: user?.program || '',
      year_level: user?.year_level || '',
      department: user?.department || '',
      bio: user?.bio || '',
      cover_photo: user?.cover_photo || ''
    });
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);
    useEffect(() => {
      if (user) {
        fetch(`/api/profile/${user.id}`).then(r => r.json()).then((res) => {
          if (res.success) setForm((prev) => ({
            ...prev,
            name: res.user.name ?? '',
            campus: res.user.campus ?? '',
            avatar: res.user.avatar ?? '',
            student_id: res.user.student_id ?? '',
            program: res.user.program ?? '',
            year_level: res.user.year_level ?? '',
            department: res.user.department ?? '',
            bio: res.user.bio ?? '',
            cover_photo: res.user.cover_photo ?? ''
          }));
        });
      }
    }, [user]);
    const save = async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (!user) return;
      setSaving(true);
      const res = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(r => r.json());
      setSaving(false);
      if (res.success) {
        onSaved(res.user);
        setSavedAt(Date.now());
        setTimeout(() => setSavedAt(null), 2000);
      }
    };
    return (
      <form className="p-8 rounded-3xl bg-white/5 border border-white/10" onSubmit={save}>
        <div className="h-24 rounded-2xl bg-white/10 mb-6" style={{ backgroundImage: form.cover_photo ? `url(${form.cover_photo})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold overflow-hidden">
            {form.avatar ? <img src={form.avatar} alt="" className="w-full h-full object-cover" /> : (form.name || 'U')[0]}
          </div>
          <div>
            <div className="text-xl font-bold text-white">{form.name || 'MSUan'}</div>
            <div className="text-sm text-gray-500">{user?.email || 'Not connected'}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Campus" value={form.campus} onChange={(v) => setForm({ ...form, campus: v })} />
          <Input label="Student ID" value={form.student_id} onChange={(v) => setForm({ ...form, student_id: v })} />
          <Input label="Course / Program" value={form.program} onChange={(v) => setForm({ ...form, program: v })} />
          <Input label="Year Level" value={form.year_level} onChange={(v) => setForm({ ...form, year_level: v })} />
          <Input label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
          <Input label="Profile Photo URL (or upload below)" value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
          <Input label="Background Photo URL (or upload below)" value={form.cover_photo} onChange={(v) => setForm({ ...form, cover_photo: v })} />
          <Textarea label="Bio / Intro" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={saving} className={`px-4 py-2 rounded-lg bg-amber-500 text-black font-bold transition-colors ${saving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-amber-400'}`}>{saving ? 'Saving…' : 'Save Changes'}</button>
          <button onClick={() => navigateTo('messenger')} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">Open Messenger</button>
          {savedAt && <span className="text-xs text-emerald-400">Saved</span>}
        </div>
      </form>
    );
  };
  
  const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
    </div>
  );
  const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="md:col-span-2">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50" />
    </div>
  );
  const renderProfile = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-metallic-gold">Profile</h2>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
          <div className="h-40 md:h-56 w-full bg-gradient-to-br from-amber-900/30 to-black relative group"
               style={{ backgroundImage: user?.cover_photo ? `url(${user.cover_photo})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <label className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/30 text-white text-xs border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
              Change Background
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) openImageEditor(f, 'cover');
              }} />
            </label>
            <div className="absolute -bottom-10 left-6">
              <div className="w-24 h-24 rounded-full ring-4 ring-[#0a0502] overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold relative group/avatar">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.name || 'U')[0]}
                <label className="absolute inset-0 bg-black/45 text-[10px] text-white flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  Change Profile
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) openImageEditor(f, 'avatar');
                  }} />
                </label>
              </div>
            </div>
          </div>
          <div className="px-6 pt-12 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-400 mb-1">Student Profile • ONEMSU</div>
                <div className="text-2xl font-bold text-white">{user?.name || 'MSUan'}</div>
                <div className="text-sm text-gray-400">{user?.program || 'Course not set'}</div>
                <div className="text-sm text-gray-500">ID: {user?.student_id || 'N/A'} • {user?.year_level || 'Year not set'}</div>
                <div className="text-sm text-gray-500">{user?.email || 'Not connected'}</div>
                {user?.bio && <div className="mt-2 text-sm text-gray-300">{user.bio}</div>}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{followStats.followers}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{followStats.following}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Following</div>
                </div>
                <button
                  onClick={() => setProfileEditing(v => !v)}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-gray-200 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  {profileEditing ? 'Close Editor' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {profileEditing ? (
          <div className="mt-6">
            <ProfileForm user={user} onSaved={(u) => { setUser(u); setProfileEditing(false); }} />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-500">Full Name</div>
              <div className="text-lg font-semibold text-white mt-1">{user?.name || 'Not set'}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-500">Course</div>
              <div className="text-lg font-semibold text-white mt-1">{user?.program || 'Not set'}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-500">ID Number</div>
              <div className="text-lg font-semibold text-white mt-1">{user?.student_id || 'Not set'}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-500">Year Level</div>
              <div className="text-lg font-semibold text-white mt-1">{user?.year_level || 'Not set'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-metallic-gold">Settings</h2>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left cursor-pointer" onClick={() => navigateTo('profile')}>
            <div className="font-semibold">Profile</div><div className="text-xs text-gray-500">Manage your account</div>
          </button>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left cursor-pointer" onClick={() => navigateTo('messenger')}>
            <div className="font-semibold">Messenger</div><div className="text-xs text-gray-500">Chat and media preferences</div>
          </button>
        </div>
        {user?.email === 'xandercamarin@gmail.com' && ownerSettings && (
          <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-amber-500/30">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Owner Control Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Site Name</div>
                <input value={ownerSettings.site_name || 'ONEMSU'} onChange={(e) => setOwnerSettings((s: any) => ({ ...s, site_name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2" />
              </div>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span>Maintenance Mode</span>
                <input type="checkbox" checked={!!ownerSettings.maintenance_mode} onChange={(e) => setOwnerSettings((s: any) => ({ ...s, maintenance_mode: e.target.checked ? 1 : 0 }))} />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span>Messenger Enabled</span>
                <input type="checkbox" checked={!!ownerSettings.messenger_enabled} onChange={(e) => setOwnerSettings((s: any) => ({ ...s, messenger_enabled: e.target.checked ? 1 : 0 }))} />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span>Confession Enabled</span>
                <input type="checkbox" checked={!!ownerSettings.confession_enabled} onChange={(e) => setOwnerSettings((s: any) => ({ ...s, confession_enabled: e.target.checked ? 1 : 0 }))} />
              </label>
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black font-bold" onClick={async () => {
              const res = await fetch('/api/owner/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, ...ownerSettings }) }).then(r => r.json());
              if (res.success) setOwnerSettings(res.settings);
            }}>Save Owner Settings</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderFreedomwall = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-metallic-gold flex items-center gap-2"><MessageCircleHeart size={28} className="text-rose-400" /> Freedom Wall</h2>
            <p className="text-gray-400 mt-1">Share your thoughts anonymously</p>
          </div>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="card-gold p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-3">
            <label className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 cursor-pointer">
              Upload picture
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) { setFreedomImagePreview(null); return; }
                  const reader = new FileReader();
                  reader.onload = () => setFreedomImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }}
                className="hidden"
              />
            </label>
            {freedomImagePreview && <span className="text-xs text-amber-400">Image attached</span>}
          </div>
          <textarea
            value={freedomText}
            onChange={(e) => setFreedomText(e.target.value)}
            placeholder="Share your thoughts anonymously..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
          {freedomImagePreview && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">
              <img src={freedomImagePreview} alt="" className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500">Posting as a unique alias</div>
            <button
              onClick={async () => {
                if (!user || !freedomText.trim()) return;
                let imageUrl: string | undefined;
                if (freedomImagePreview) {
                  const up = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataUrl: freedomImagePreview })
                  }).then(r => r.json());
                  if (up.success) imageUrl = up.url;
                }
                const res = await fetch('/api/freedomwall', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.id, content: freedomText.trim(), campus: user.campus || 'Global', imageUrl })
                }).then(r => r.json());
                if (res.success) {
                  setFreedomText('');
                  setFreedomImagePreview(null);
                  setFreedomPosts((prev) => [res.item, ...prev]);
                }
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {freedomPosts.map((p) => (
            <div key={p.id} className="rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              {p.image_url && <img src={p.image_url} alt="" className="w-full max-h-72 object-cover" />}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold">{p.alias}</div>
                    <div className="text-[10px] text-gray-500">{p.campus} • {new Date(p.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => {
                        fetch(`/api/freedomwall/${p.id}/react`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ type: 'like' })
                        }).then(r => r.json()).then(res => {
                          if (res.success) setFreedomPosts((prev) => prev.map(x => x.id === p.id ? res.item : x));
                        });
                      }}
                      className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                    >
                      Like {p.likes}
                    </button>
                    <button
                      onClick={() => {
                        fetch(`/api/freedomwall/${p.id}/react`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ type: 'report' })
                        }).then(r => r.json()).then(res => {
                          if (res.success) setFreedomPosts((prev) => prev.map(x => x.id === p.id ? res.item : x));
                        });
                      }}
                      className="px-3 py-1 rounded-full bg-white/10 text-gray-400 hover:bg-white/20"
                    >
                      Report {p.reports}
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-200">{p.content}</div>
              </div>
            </div>
          ))}
          {freedomPosts.length === 0 && <div className="text-sm text-gray-500">No posts yet.</div>}
        </div>
      </div>
    </div>
  );
  const renderMessenger = () => (
    <div className="h-screen w-screen bg-[#0a0502] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className={`${mobileMessengerView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-white/5 flex-col`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Messenger</h2>
          <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search users"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/30"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map(u => (
                <button 
                  key={u.id}
                  onClick={() => {
                    setActiveRoom(`dm-${Math.min(user!.id, u.id)}-${Math.max(user!.id, u.id)}`);
                    setMobileMessengerView('chat');
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.campus} • <span className={onlineUsers[u.id] ? 'text-emerald-400' : 'text-gray-500'}>{onlineUsers[u.id] ? 'Active' : 'Offline'}</span></p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Channels</div>
          {['global', 'announcements', 'help-desk'].map(room => (
            <button 
              key={room}
              onClick={() => { setActiveRoom(room); setMobileMessengerView('chat'); }}
              aria-current={activeRoom === room ? 'page' : undefined}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeRoom === room ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30`}
            >
              <Hash size={18} />
              <span className="text-sm font-bold capitalize">{room}</span>
            </button>
          ))}
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6">Campuses</div>
          {CAMPUSES.map(c => (
            <button 
              key={c.slug}
              onClick={() => { setActiveRoom(c.slug); setMobileMessengerView('chat'); }}
              aria-current={activeRoom === c.slug ? 'page' : undefined}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeRoom === c.slug ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30`}
            >
              <div className="w-5 h-5"><CampusLogo slug={c.slug} /></div>
              <span className="text-sm font-bold">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              {activeRoom.startsWith('dm') ? 'DM' : activeRoom[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white capitalize">{activeRoom.replace(/-/g, ' ')}</h3>
              {getDmPeerId(activeRoom) && (
                <span className={`text-xs ${onlineUsers[getDmPeerId(activeRoom)!] ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {onlineUsers[getDmPeerId(activeRoom)!] ? 'Active' : 'Offline'}
                </span>
              )}
              <p className="text-[10px] text-gray-500">
                {activeRoom.startsWith('dm') ? 'Direct Message' : ['global', 'announcements', 'help-desk'].includes(activeRoom) ? 'Channel' : 'Campus'}
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 text-gray-500">
            {activeRoom.startsWith('dm-') && (
              <>
                <button title="Call" aria-label="Call" className="p-2 rounded-lg hover:text-white hover:bg-white/5">
                  <PhoneCall size={20} />
                </button>
                <button title="Video call" aria-label="Video call" className="p-2 rounded-lg hover:text-white hover:bg-white/5">
                  <Video size={20} />
                </button>
                <button title="Info" aria-label="Info" className="p-2 rounded-lg hover:text-white hover:bg-white/5">
                  <Info size={20} />
                </button>
              </>
            )}
            <button
              onClick={() => setMutedRooms(prev => prev.includes(activeRoom) ? prev.filter(r => r !== activeRoom) : [...prev, activeRoom])}
              title={mutedRooms.includes(activeRoom) ? 'Unmute room' : 'Mute room'}
              aria-label={mutedRooms.includes(activeRoom) ? 'Unmute room' : 'Mute room'}
              className="p-2 rounded-lg hover:text-white hover:bg-white/5"
            >
              {mutedRooms.includes(activeRoom) ? <BellOff size={20} /> : <Bell size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                title="Room settings"
                aria-haspopup="menu"
                aria-expanded={settingsOpen}
                className="p-2 rounded-lg hover:text-white hover:bg-white/5"
              >
                <Settings size={20} />
              </button>
              {settingsOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl bg-black/90 border border-white/10 shadow-xl p-2 text-sm z-20">
                  <button
                    onClick={() => setCompactBubbles(v => !v)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
                    role="menuitem"
                  >
                    {compactBubbles ? 'Disable compact bubbles' : 'Enable compact bubbles'}
                  </button>
                  <button
                    onClick={() => setShowTimestamps(v => !v)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
                    role="menuitem"
                  >
                    {showTimestamps ? 'Hide timestamps' : 'Show timestamps'}
                  </button>
                  <button
                    onClick={() => setMessages([])}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-rose-400"
                    role="menuitem"
                  >
                    Clear local messages
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 md:flex md:gap-6">
          <div className={`${mobileMessengerView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 min-w-0 flex-col`}>
            <div className="flex-1 min-w-0 p-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500">
                  <div>
                    <MessageCircle className="mx-auto mb-3 opacity-70" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={scrollRef}
                  className="h-full overflow-auto scrollbar-hide"
                  onScroll={async (e) => {
                    const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight < 24;
                    stickToBottomRef.current = atBottom;
                    if (atBottom) sendSeen();
                    if (e.currentTarget.scrollTop > 0 || isLoadingMore || !hasMore) return;
                    const oldest = messages[0]?.timestamp;
                    if (!oldest) return;
                    setIsLoadingMore(true);
                    try {
                      const older: Message[] = await fetch(`/api/messages/${activeRoom}?before=${encodeURIComponent(oldest)}&viewer=${user?.id || 0}`).then(r => r.json());
                      if (older.length > 0) {
                        setMessages(prev => [...older, ...prev]);
                        setHasMore(older.length >= 50);
                      } else {
                        setHasMore(false);
                      }
                    } finally {
                      setIsLoadingMore(false);
                    }
                  }}
                >
                  {isLoadingMore && (
                    <div className="py-3 text-center text-xs text-gray-500">Loading older messages…</div>
                  )}
                  {messages.map((m, index) => {
                    const sid = (m as any).sender_id ?? (m as any).senderId;
                    const sname = (m as any).sender_name ?? (m as any).senderName;
                    const ts = (m as any).timestamp;
                    const isMe = sid === user?.id;
                    let lastMyIndex = -1;
                    if (activeRoom.startsWith('dm-')) {
                      for (let k = messages.length - 1; k >= 0; k--) {
                        const sid2 = (messages[k] as any).sender_id ?? (messages[k] as any).senderId;
                        if (sid2 === user?.id) { lastMyIndex = k; break; }
                      }
                    }
                    const seenThis = isMe && otherLastRead && ts && activeRoom.startsWith('dm-') && index === lastMyIndex && new Date(ts) <= new Date(otherLastRead);
                    return (
                      <div key={String((m as any).id ?? `${(m as any).timestamp}-${index}`)} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-6`}>
                        <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <span className={`text-[10px] font-bold text-gray-500 ${isMe ? 'mr-2 text-right' : 'ml-2 text-left'}`}>
                            <button onClick={async () => {
                              const uid = sid;
                              if (!uid) return;
                              const res = await fetch(`/api/profile/${uid}`).then(r => r.json());
                              if (res.success) alert(`${res.user.name}
${res.user.program || ''}
ID: ${res.user.student_id || ''}
${res.user.year_level || ''}`);
                            }} className="hover:underline">{sname}</button>
                          </span>
                          <div className={`${compactBubbles ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-2xl text-sm break-words whitespace-pre-wrap ${isMe ? 'bg-amber-500 text-black rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                            {(m as any).content || (m as any).attachment_url ? null : ''}
                            {(m as any).content}
                            {(m as any).attachment_url && (
                              <div className="mt-2">
                                {String((m as any).attachment_type || '').startsWith('image/') ? (
                                  <img src={(m as any).attachment_url} alt="attachment" className="max-h-48 rounded-lg border border-white/10" />
                                ) : String((m as any).attachment_type || '').startsWith('audio/') ? (
                                  <audio controls src={(m as any).attachment_url} className="max-w-full" />
                                ) : (
                                  <a href={(m as any).attachment_url} target="_blank" className="underline">Open attachment</a>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-1">
                            {['👍','❤️','😂','😮','😢'].map((em) => {
                              const list = (m as any).reactions || [];
                              const mine = ((m as any).my_reactions || []).includes(em);
                              const found = list.find((r: any) => r.emoji === em);
                              return (
                                <button key={em} onClick={() => toggleReaction(Number((m as any).id), em)} className={`text-xs px-1.5 py-0.5 rounded-full border ${mine ? 'bg-amber-500/20 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                                  {em}{found ? ` ${found.count}` : ''}
                                </button>
                              );
                            })}
                            {isMe && (
                              <>
                                <button onClick={() => { setMessageEditId(Number((m as any).id)); setMessageEditText(String((m as any).content || '')); }} className="text-[10px] text-gray-400 hover:text-white"><Pencil size={12} /></button>
                                <button onClick={() => deleteOwnMessage(Number((m as any).id))} className="text-[10px] text-rose-400 hover:text-rose-300"><Trash2 size={12} /></button>
                              </>
                            )}
                          </div>
                          {messageEditId === Number((m as any).id) && (
                            <div className="mt-2 flex gap-2">
                              <input value={messageEditText} onChange={(e) => setMessageEditText(e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-xs" />
                              <button onClick={() => editOwnMessage(Number((m as any).id))} className="text-xs px-2 rounded bg-amber-500 text-black">Save</button>
                            </div>
                          )}
                          {showTimestamps && (
                            <span className="text-[8px] text-gray-600 px-2">
                              {new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {seenThis && <span className="ml-2 text-emerald-400">Seen</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-6 bg-black/20">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                  sendMessage(input.value);
                  input.value = '';
                }}
                className="flex w-full gap-2 sm:gap-4"
              >
                <input 
                  name="message"
                  type="text"
                  placeholder={activeRoom.startsWith('dm') ? 'Message user…' : `Message ${activeRoom.replace(/-/g, ' ')}…`}
                  aria-label="Type your message"
                  autoComplete="off"
                  className="min-w-0 flex-1 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 md:px-8 md:py-4 md:text-base text-white focus:outline-none focus:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/30"
                />
                <button 
                  type="submit"
                  title="Send message"
                  aria-label="Send message"
                  className="p-4 md:p-5 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
          <aside className="hidden md:block w-80 border-l border-white/5 bg-black/10">
            <div className="p-6">
              <h4 className="font-bold mb-4">Conversation Details</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Room</div>
                  <div className="text-white capitalize">{activeRoom.replace(/-/g, ' ')}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Unread Notifications</div>
                  <div className="text-white">{unreadCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">Reactions, media attachments, voicemail, and message management are enabled in this chat.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );

  if (imageEditorOpen) {
    return (
      <div className="min-h-screen bg-black/95 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a0502] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-metallic-gold">Edit {imageEditorTarget === 'avatar' ? 'Profile' : 'Background'} Photo</h3>
            <button onClick={() => setImageEditorOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
          </div>
          <div className="h-72 rounded-2xl overflow-hidden border border-white/10 bg-black/40 mb-4 relative">
            <img
              src={imageEditorSource}
              alt="edit"
              style={{
                transform: `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageZoom})`,
                transformOrigin: 'center center'
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Zoom</div>
              <input type="range" min="1" max="2.5" step="0.01" value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Move Horizontal</div>
              <input type="range" min="-260" max="260" step="1" value={imageOffsetX} onChange={(e) => setImageOffsetX(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Move Vertical</div>
              <input type="range" min="-260" max="260" step="1" value={imageOffsetY} onChange={(e) => setImageOffsetY(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setImageEditorOpen(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">Cancel</button>
            <button onClick={saveEditedImage} className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold">Save</button>
          </div>
        </div>
      </div>
    );
  }

  if (showLogoutSplash) {
    return (
      <div className="min-h-screen hero-metallic flex items-center justify-center px-6">
        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 md:w-28 md:h-28 mb-6"
          >
            <Logo />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-metallic-gold">Signing out...</h2>
          <p className="mt-3 text-gray-300">Securing your ONEMSU session</p>
          <div className="mt-6 w-64 h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            />
          </div>
        </div>
      </div>
    );
  }

  if (showOpeningSplash) {
    return (
      <div className="min-h-screen hero-metallic flex items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          {SPARKLES.map((p, i) => (
            <motion.div
              key={`splash-${i}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0.15, 0.55, 0.15], scale: [0.9, 1.3, 0.9] }}
              transition={{ duration: 2.2 + i * 0.2, repeat: Infinity }}
              style={{ top: p.top, left: p.left }}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(245,197,24,0.6)]"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1], opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="w-44 h-44 md:w-56 md:h-56 mb-6 drop-shadow-[0_0_45px_rgba(248,196,64,0.45)]"
          >
            <Logo />
          </motion.div>

          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-100/10 text-amber-200 text-xs md:text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Mindanao State University
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-metallic-gold">
            ONE<span className="text-white">MSU</span>
          </h1>
          <p className="mt-4 text-gray-300 text-sm md:text-base">Launching your MSU digital community experience...</p>

          <div className="mt-8 w-64 md:w-80 h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 10, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300"
            />
          </div>
          <p className="mt-2 text-xs text-amber-200/80">Preparing ONEMSU...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderHome()}
          </motion.div>
        )}
        {view === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderExplorer()}
          </motion.div>
        )}
        {view === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderAbout()}
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {renderDashboard()}
          </motion.div>
        )}
        {view === 'newsfeed' && (
          <motion.div
            key="newsfeed"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderNewsfeed()}
          </motion.div>
        )}
        {view === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderProfile()}
          </motion.div>
        )}
        {(view === 'freedomwall' || view === 'confession') && (
          <motion.div
            key="freedomwall"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderFreedomwall()}
          </motion.div>
        )}
        {view === 'assistant' && (
          <motion.div
            key="assistant"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderAssistant()}
          </motion.div>
        )}
        {view === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {renderSettingsPage()}
          </motion.div>
        )}
        {view === 'library' && (
          <motion.div key="library" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {renderNewsfeed()}
          </motion.div>
        )}
        {view === 'groups' && (
          <motion.div key="groups" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {renderExplorer()}
          </motion.div>
        )}
        {view === 'lostfound' && (
          <motion.div key="lostfound" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {renderFeedbacks()}
          </motion.div>
        )}
        {view === 'feedbacks' && (
          <motion.div
            key="feedbacks"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.15 }}
          >
            {renderFeedbacks()}
          </motion.div>
        )}
        {view === 'messenger' && (
          <motion.div
            key="messenger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.15 }}
          >
            {renderMessenger()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation Overlay (Mobile) */}
      <div className="fixed top-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full bg-amber-500 text-black shadow-lg"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-8 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <button onClick={() => { navigateTo('home'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Home</button>
              <button onClick={() => { navigateTo('groups'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Campuses</button>
              <button onClick={() => { setView('about'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">About</button>
              <div className="h-px w-24 bg-amber-500/30 mx-auto my-4" />
              <div className="flex gap-6 justify-center text-amber-500">
                <Github size={24} />
                <Globe size={24} />
                <Info size={24} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
