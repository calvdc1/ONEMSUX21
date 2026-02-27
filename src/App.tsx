/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent, useRef, forwardRef } from 'react';
import type { HTMLProps } from 'react';
import { Virtuoso } from 'react-virtuoso';
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
  Clock,
  Heart,
  MoreHorizontal,
  Share2,
  Image,
  Mic,
  Video,
  PhoneOff,
  Monitor
} from 'lucide-react';

// --- Types ---

interface User {
  id: number;
  name: string;
  email: string;
  campus: string;
  avatar?: string;
  cover_photo?: string;
  bio?: string;
  student_id?: string;
  program?: string;
  year_level?: string;
  department?: string;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  room_id: string;
  media_url?: string;
  media_type?: string;
  timestamp: string;
  deleted?: boolean;
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

interface Schedule {
  id: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  day: string;
  time: string;
  location: string;
  campus: string;
}

interface Room {
  id: number;
  building: string;
  number: string;
  capacity: number;
  type: string;
  floor: number;
  campus: string;
  available?: boolean;
}

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  requirements: string[];
  campus: string;
  link?: string;
}

interface Internship {
  id: number;
  company: string;
  position: string;
  description: string;
  postedBy: string;
  campus: string;
  postedDate: string;
  deadline?: string;
  type?: string;
}

interface LostItem {
  id: number;
  user_id: number;
  itemName: string;
  description: string;
  category: string;
  location: string;
  status: 'lost' | 'found';
  image_url?: string;
  postedDate: string;
  campus: string;
  contactName?: string;
  contactPhone?: string;
}

interface CampusEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  attendees: number;
  campus: string;
  image_url?: string;
  rsvpUsers?: number[];
}

interface Building {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  type: string;
}

// --- Constants ---

const CAMPUSES: Campus[] = [
  { 
    name: "MSU Main", 
    slug: "msu-main", 
    location: "Marawi City", 
    description: "The flagship campus of the Mindanao State University System. Located in Marawi City, it is a melting pot of cultures and a center of academic excellence.",
    stats: { students: "25k+", courses: "180+" },
    top: "12%", left: "8%",
    color: "#8e1212"
  },
  { 
    name: "MSU IIT", 
    slug: "msu-iit", 
    location: "Iligan City", 
    description: "A premier institution of higher learning in the Philippines, known for its strong programs in science, technology, and engineering.",
    stats: { students: "18k+", courses: "120+" },
    top: "26%", left: "82%",
    color: "#1a3a5a"
  },
  { 
    name: "MSU Gensan", 
    slug: "msu-gensan", 
    location: "General Santos City", 
    description: "Serving the SOCCSKSARGEN region with excellence in agriculture, fisheries, and business education.",
    stats: { students: "12k+", courses: "90+" },
    top: "38%", left: "12%",
    color: "#1b5e20"
  },
  { 
    name: "MSU Tawi-Tawi", 
    slug: "msu-tawi-tawi", 
    location: "Bongao, Tawi-Tawi", 
    description: "The southernmost campus specializing in fisheries, oceanography, and marine biodiversity conservation.",
    stats: { students: "8k+", courses: "45+" },
    top: "56%", left: "76%",
    color: "#01579b"
  },
  { 
    name: "MSU Naawan", 
    slug: "msu-naawan", 
    location: "Naawan, Misamis Oriental", 
    description: "A center of excellence in fisheries and marine sciences, dedicated to sustainable coastal resource management.",
    stats: { students: "5k+", courses: "35+" },
    top: "18%", left: "74%",
    color: "#e65100"
  },
  { 
    name: "MSU Maguindanao", 
    slug: "msu-maguindanao", 
    location: "Datu Odin Sinsuat", 
    description: "Empowering the Bangsamoro through education, with a focus on peace and development studies.",
    stats: { students: "7k+", courses: "50+" },
    top: "64%", left: "10%",
    color: "#33691e"
  },
  { 
    name: "MSU Sulu", 
    slug: "msu-sulu", 
    location: "Jolo, Sulu", 
    description: "Fostering peace and development in the Sulu archipelago through quality education and cultural preservation.",
    stats: { students: "6k+", courses: "40+" },
    top: "44%", left: "84%",
    color: "#bf360c"
  },
  { 
    name: "MSU Buug", 
    slug: "msu-buug", 
    location: "Buug, Zamboanga Sibugay", 
    description: "Providing quality education in the Sibugay area, emphasizing agriculture and forestry.",
    stats: { students: "4k+", courses: "30+" },
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
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f9e7a3" />
        <stop offset="50%" stopColor="#f5d36b" />
        <stop offset="100%" stopColor="#b99740" />
      </linearGradient>
      <filter id="logo-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer Ring */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="url(#gold-grad)" strokeWidth="3" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#gold-grad)" strokeWidth="1" strokeOpacity="0.5" />
    
    {/* Inner Circle Background */}
    <circle cx="50" cy="50" r="40" fill="#0a0502" />
    
    {/* Torch / Flame (Simplified SVG representation of the logo) */}
    <path d="M50 20 L55 35 L45 35 Z" fill="#f59e0b" filter="url(#logo-glow)" />
    <rect x="48" y="35" width="4" height="15" fill="url(#gold-grad)" />
    
    {/* Text Arc */}
    <text 
      x="50" y="65" 
      textAnchor="middle" 
      fill="url(#gold-grad)" 
      fontSize="10" 
      fontWeight="900" 
      fontFamily="serif"
      filter="url(#logo-glow)"
    >
      ONEMSU
    </text>
    
    {/* Decorative Elements */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#gold-grad)" strokeWidth="0.5" strokeDasharray="2 2" />
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
      <text x="50" y="65" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="serif" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}>
        {slug.split('-')[1]?.toUpperCase() || 'MSU'}
      </text>
    </svg>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'explorer' | 'about' | 'dashboard' | 'messenger' | 'newsfeed' | 'profile' | 'confession' | 'feedbacks' | 'schedule' | 'roomfinder' | 'scholarships' | 'internships' | 'campusmap' | 'lostandfound' | 'events'>('home');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
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
  const [activeRoom, setActiveRoom] = useState<string>('announcements');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const stickToBottomRef = useRef(true);
  const isPrependingRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [otherLastRead, setOtherLastRead] = useState<string | null>(null);
  const [groups, setGroups] = useState<{ id: number; name: string; description: string; campus: string; logo_url?: string }[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<{ id: number; name: string; description: string; campus: string; logo_url?: string }[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ id: number; user_id: number; content: string; timestamp: string }[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [freedomPosts, setFreedomPosts] = useState<{ id: number; user_id: number | null; alias: string; content: string; campus: string; image_url?: string; likes: number; reports: number; timestamp: string }[]>([]);
  const [freedomText, setFreedomText] = useState('');
  const [freedomImagePreview, setFreedomImagePreview] = useState<string | null>(null);
  const isOwner = (email?: string) => email === 'xandercamarin@gmail.com' || email === 'sophiakayeaninao@gmail.com';
  const isVerified = (email?: string) => isOwner(email) || email === 'krisandrea.gonzaga@g.msuiit.edu.ph' || email === 'marcoalfons.bollozos@g.msuiit.edu.ph';
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
  const [toast, setToast] = useState<{ message: string; roomId: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const pendingClientIds = useRef<Set<string>>(new Set());
  const [isInVoice, setIsInVoice] = useState(false);
  const [voicePeers, setVoicePeers] = useState<string[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Map<number, RTCPeerConnection>>(new Map());
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Map<number, MediaStream>>(new Map());

  // Utility Features State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleFilter, setScheduleFilter] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomFilter, setRoomFilter] = useState({ building: '', capacity: 0 });
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [scholarshipFilter, setScholarshipFilter] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [internshipFilter, setInternshipFilter] = useState('');
  const [campusBuildings, setCampusBuildings] = useState<Building[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [newLostItem, setNewLostItem] = useState<Partial<LostItem>>({ status: 'lost', itemName: '', description: '', category: '', location: '' });
  const [lostItemFilter, setLostItemFilter] = useState({ status: 'lost' as const, category: '' });
  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>([]);
  const [eventFilter, setEventFilter] = useState('');
  const [userRsvps, setUserRsvps] = useState<number[]>([]);

  const normalizeIncoming = (raw: any) => {
    // Accept both server styles: roomId vs room_id, senderId vs sender_id, etc.
    const roomId = raw.roomId ?? raw.room_id ?? raw.room ?? '';
    const sender_id = raw.sender_id ?? raw.senderId ?? raw.sender ?? null;
    const sender_name = raw.sender_name ?? raw.senderName ?? raw.name ?? 'Unknown';
    const content = raw.content ?? raw.message ?? '';
    const timestamp = raw.timestamp ?? raw.created_at ?? new Date().toISOString();

    const media_url = raw.media_url ?? raw.mediaUrl ?? raw.media ?? undefined;
    const media_type = raw.media_type ?? raw.mediaType ?? raw.mimeType ?? undefined;

    const id = 
      raw.id ?? 
      raw.message_id ?? 
      raw.msgId ?? 
      // fallback deterministic-ish id 
      `${roomId}-${timestamp}-${sender_id ?? 'x'}`;

    const clientId = raw.clientId ?? raw.client_id ?? undefined;

    return { 
      id, 
      clientId, 
      sender_id, 
      sender_name, 
      content, 
      room_id: roomId, 
      roomId, 
      media_url, 
      media_type, 
      timestamp 
    } as any;
  };

  const START_INDEX = 10000;
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('onemsu_unread') : null;
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('onemsu_unread', JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  const [notesByRoom, setNotesByRoom] = useState<Record<string, string>>(() => {
    try {
      const key = typeof window !== 'undefined'
        ? (user ? `onemsu_notes_${user.id}` : 'onemsu_notes_guest')
        : 'onemsu_notes_guest';
      const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [stickyNotes, setStickyNotes] = useState<{ id: string; content: string; color: string; createdAt: string }[]>(() => {
    try {
      const key = typeof window !== 'undefined'
        ? (user ? `onemsu_stickies_${user.id}` : 'onemsu_stickies_guest')
        : 'onemsu_stickies_guest';
      const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
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

  const virtuosoRef = useRef<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({}); // roomId -> names[]
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [directMessageList, setDirectMessageList] = useState<{ id: number; name: string; roomId: string; lastMessage?: string; unread: number; avatar?: string; campus?: string }[]>([]);

  // Effect to populate DM list from local storage or API
  useEffect(() => {
    if (user) {
      // Load saved DM list
      const savedDMs = localStorage.getItem(`onemsu_dms_${user.id}`);
      if (savedDMs) {
        setDirectMessageList(JSON.parse(savedDMs));
      }
    }
  }, [user]);

  // Save DM list when it changes
  useEffect(() => {
    if (user && directMessageList.length > 0) {
      localStorage.setItem(`onemsu_dms_${user.id}`, JSON.stringify(directMessageList));
    }
  }, [directMessageList, user]);

  const addToDMList = (otherUser: { id: number; name: string; avatar?: string; campus?: string }) => {
    setDirectMessageList(prev => {
      const roomId = `dm-${Math.min(user!.id, otherUser.id)}-${Math.max(user!.id, otherUser.id)}`;
      if (prev.some(dm => dm.roomId === roomId)) return prev;
      return [{
        id: otherUser.id,
        name: otherUser.name,
        roomId,
        unread: 0,
        avatar: otherUser.avatar,
        campus: otherUser.campus
      }, ...prev];
    });
  };

  const isUserOnline = (userId: number) => onlineUsers.includes(userId);

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onemsu_courses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

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
    if (view === 'dashboard' || view === 'explorer' || view === 'messenger') {
      setLoadingGroups(true);
      fetch('/api/groups')
        .then((res) => res.json())
        .then((data) => setGroups(data))
        .finally(() => setLoadingGroups(false));
      
      if (user) {
        fetch(`/api/users/${user.id}/groups`)
          .then(res => res.json())
          .then(data => setJoinedGroups(data));
      }

      if (view !== 'messenger') {
        fetch('/api/feedbacks')
          .then((res) => res.json())
          .then((data) => setFeedbacks(data));
        // Highlights should show posts from all campuses
        fetch(`/api/freedomwall`)
          .then((res) => res.json())
          .then((data) => setFreedomPosts(data));
      }
    }
  }, [view, user]);
  useEffect(() => {
    if (isLoggedIn && view === 'home') setView('dashboard');
  }, [isLoggedIn, view]);

  useEffect(() => {
    if (isLoggedIn && user) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${protocol}//${window.location.host}`);
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'join', userId: user.id, roomId: activeRoom }));
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          const msg = normalizeIncoming(data);

          // If server echoes our optimistic message, remove the optimistic one by clientId
          if (msg.clientId && pendingClientIds.current.has(String(msg.clientId))) {
            pendingClientIds.current.delete(String(msg.clientId));
            setMessages(prev => prev.filter(m => (m as any).clientId !== msg.clientId));
          } else if (msg.sender_id === user.id && !msg.clientId) {
             // If message from self but no clientId (e.g. from another tab), check if we have a matching optimistic message
             // This is tricky because timestamps might differ slightly.
             // We'll rely on the fact that if we sent it from this tab, we attached a clientId.
             // If we receive a message from ourselves without a clientId, it must be from another session/tab, so we keep it.
             // HOWEVER, the server might not be echoing back the clientId if we didn't update the server code to do so.
             // Let's check if the message content matches any pending optimistic message
             setMessages(prev => {
                // If we have an optimistic message with same content and very recent, we might want to replace it
                // But better is to ensure server echoes clientId.
                // If server doesn't echo clientId, we have a problem: duplication.
                
                // Temporary fix: if we see a message from ourselves that matches the content of the last message in the list
                // and the last message was optimistic (has clientId), then replace it.
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && (lastMsg as any).clientId && lastMsg.content === msg.content && lastMsg.sender_id === msg.sender_id) {
                   return [...prev.slice(0, -1), msg];
                }
                return prev;
             });
          }

          // De-dupe by id
          const msgId = String(msg.id);
          if (processedMessageIds.current.has(msgId)) return;
          processedMessageIds.current.add(msgId);

          const isInCorrectView = (view === 'messenger' || view === 'newsfeed' || view === 'explorer');
          const isCurrentRoom = (msg.roomId === activeRoom);

          if (isCurrentRoom && isInCorrectView) {
            setMessages(prev => {
              if (prev.some(m => String((m as any).id) === msgId)) return prev;
              return [...prev, msg];
            });
          } else {
            setUnreadCounts(prev => ({
              ...prev,
              [msg.roomId]: (prev[msg.roomId] || 0) + 1
            }));

            setToast({ 
              message: `${msg.sender_name}: ${String(msg.content).substring(0, 30)}${String(msg.content).length > 30 ? '...' : ''}`, 
              roomId: msg.roomId 
            });
            setTimeout(() => setToast(null), 5000);

            // Play sound
            try {
              const NOTIFICATION_AUDIO = 'data:audio/mp3;base64,//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
              const sound = new Audio(NOTIFICATION_AUDIO); 
              sound.volume = 0.5;
              sound.play().catch(e => console.log('Audio play failed', e));
            } catch (e) {}
          }
        } else if (data.type === 'presence') {
          setOnlineUsers(data.onlineUsers);
        } else if (data.type === 'typing') {
          const { roomId, senderName, isTyping } = data;
          setTypingUsers(prev => {
            const current = prev[roomId] || [];
            if (isTyping) {
              if (current.includes(senderName)) return prev;
              return { ...prev, [roomId]: [...current, senderName] };
            } else {
              return { ...prev, [roomId]: current.filter(n => n !== senderName) };
            }
          });
        } else if (data.type === 'voice-existing-users') {
          // We just joined, initiate calls to existing users
          data.users.forEach(async (targetId: number) => {
            createPeerConnection(targetId, true);
          });
        } else if (data.type === 'user-joined-voice') {
          // Someone joined, wait for their offer
        } else if (data.type === 'user-left-voice') {
          removePeerConnection(data.userId);
        } else if (data.type === 'voice-signal') {
          handleVoiceSignal(data);
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
    if (isLoggedIn && activeRoom) {
      // Clear unread for this room when viewed
      setUnreadCounts(prev => {
        if (!prev[activeRoom]) return prev;
        const next = { ...prev };
        delete next[activeRoom];
        return next;
      });
      
      setHasMore(true);
      setMessages([]);
      setFirstItemIndex(START_INDEX);
      setIsLoadingMore(true);

      const url = `/api/messages/${activeRoom}?userId=${user?.id || ''}&limit=6`;
      fetch(url)
        .then(res => res.json())
        .then((data: Message[]) => {
          setMessages(data);
          setHasMore(data.length >= 6);
          // On room change, scroll to bottom
          requestAnimationFrame(() => {
            if (virtuosoRef.current) {
              virtuosoRef.current.scrollToIndex({ index: data.length - 1, align: 'end' });
            }
          });
          if (activeRoom.startsWith('dm-') && user) {
            fetch(`/api/receipts/${activeRoom}?viewer=${user.id}`).then(r => r.json()).then((res) => {
              if (res.success) setOtherLastRead(res.last_read || null);
            });
          } else {
            setOtherLastRead(null);
          }
        })
        .finally(() => setIsLoadingMore(false));
    }
  }, [isLoggedIn, activeRoom]);

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

  const joinGroup = async (group: any) => {
    if (!user) return;
    const res = await fetch(`/api/groups/${group.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    }).then(r => r.json());
    if (res.success) {
      setJoinedGroups(prev => {
        if (prev.some(g => g.id === group.id)) return prev;
        return [...prev, group];
      });
      setActiveRoom(group.name.toLowerCase().replace(/\s+/g, '-'));
      setView('messenger');
    }
  };
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

  const sendMessage = async (content: string, mediaUrl?: string, mediaType?: string) => {
    if (!user || !activeRoom || isSending) return;

    const text = (content ?? '').trim();
    if (!text && !mediaUrl) return;

    setIsSending(true);

    // AI Assistant Logic
    if (activeRoom === 'dm-ai-assistant') {
      const userMsg = {
        id: `local-${Date.now()}`,
        sender_id: user.id,
        sender_name: user.name,
        content: text,
        roomId: activeRoom,
        room_id: activeRoom,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMsg as any]);
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index: 'last', align: 'end', behavior: 'smooth' });
      }, 50);
      
      // Simulate AI typing
      setTypingUsers(prev => ({ ...prev, [activeRoom]: ['AI Assistant'] }));
      
      try {
        // Build conversation history for context
        const history = messages
          .filter(m => m.room_id === activeRoom)
          .map(m => ({
            role: m.sender_id === 0 ? "model" : "user",
            parts: [{ text: m.content }]
          }));

        // Add current message
        history.push({ role: "user", parts: [{ text }] });

        // Add system instruction to shape persona
        const systemInstruction = {
          role: "user",
          parts: [{ text: `
            You are the ONEMSU AI Assistant, a powerful, knowledgeable, and proactive virtual companion for students of the Mindanao State University (MSU) system.

            Your Identity:
            - Name: ONEMSU AI
            - Personality: Helpful, intelligent, empathetic, and always ready to assist. You are like a "super-student" who knows everything about university life.
            - Tone: Professional yet warm, encouraging, and clear.

            Your Capabilities & Knowledge Base:
            1. **University Information**: You know about all MSU campuses (Marawi, IIT, Gensan, Tawi-Tawi, Naawan, Maguindanao, Sulu, Buug). You can discuss their locations, specializations, and general history.
            2. **Academic Assistance**: You can help with study tips, explaining complex concepts, suggesting research topics, and guiding students on how to manage their academic workload.
            3. **Student Life**: You offer advice on mental health, dealing with stress, making friends, and balancing life and studies.
            4. **App Navigation**: You are an expert on the ONEMSU app. You can explain how to use the Confession Wall, Campus Board, Notes, Messenger, and other features.
            5. **General Knowledge**: You are connected to a vast knowledge base (via your underlying LLM) and can answer general questions about science, history, technology, current events, and more, just like ChatGPT.

            Your Instructions:
            - **Answer ALL questions**: Do not refuse to answer unless the query is harmful, illegal, or explicit. If a question is outside your specific MSU training, answer it using your general knowledge.
            - **Be Proactive**: If a student seems stressed, offer comforting words. If they ask about a course, suggest related study materials.
            - **Format Clearly**: Use bullet points, bold text, and short paragraphs to make your answers easy to read on mobile devices.
            - **No "I don't know"**: If you lack specific real-time data (like "is the library open right now?"), provide general schedules or tell them where to check, rather than just saying you don't know.
            - **Engage**: Ask follow-up questions to ensure the user is satisfied.

            Current Context:
            User is currently in the "Direct Message" view with you.
            
            Now, please respond to the user's latest message comprehensively and helpfully.
          ` }]
        };
        
        // Prepend system instruction to history (Gemini Pro API via REST doesn't have a separate system_instruction field in v1beta yet, so we prepend it as a user message)
        const contents = [systemInstruction, ...history];

        const GEMINI_API_KEY = "AIzaSyAF2nzTlCtgouiM6n0StTEiWl9nzfCkZMc";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents
          })
        });
        
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request right now.";
        
        setTypingUsers(prev => ({ ...prev, [activeRoom]: [] }));
        
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender_id: 0, // AI ID
          sender_name: 'ONEMSU AI',
          content: aiResponse,
          roomId: activeRoom,
          room_id: activeRoom,
          timestamp: new Date().toISOString(),
          sender_email: 'ai@onemsu.edu.ph' // Fake email for verified badge logic if needed
        };
        
        setMessages(prev => [...prev, aiMsg as any]);
        
        // Scroll to bottom
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({ index: 'last', align: 'end', behavior: 'smooth' });
        }, 50);
        
      } catch (error) {
        console.error("AI Error:", error);
        setTypingUsers(prev => ({ ...prev, [activeRoom]: [] }));
        setMessages(prev => [...prev, {
          id: `ai-err-${Date.now()}`,
          sender_id: 0,
          sender_name: 'ONEMSU AI',
          content: "Sorry, I encountered an error connecting to my brain.",
          roomId: activeRoom,
          room_id: activeRoom,
          timestamp: new Date().toISOString()
        } as any]);
      } finally {
        setIsSending(false);
      }
      return;
    }

    if (!socketRef.current) {
        setIsSending(false);
        return;
    }

    // Create a clientId so we can remove the optimistic copy when server echoes back
    const clientId = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    pendingClientIds.current.add(clientId);

    const optimistic: any = {
      id: `local-${clientId}`,
      clientId,
      sender_id: user.id,
      sender_name: user.name,
      content: text,
      roomId: activeRoom,
      room_id: activeRoom,
      media_url: mediaUrl,
      media_type: mediaType,
      timestamp: new Date().toISOString()
    };

    // Show instantly
    setMessages(prev => [...prev, optimistic]);

    try {
        // Send to server
        socketRef.current.send(JSON.stringify({
          type: 'chat',
          clientId,              // IMPORTANT
          senderId: user.id,
          senderName: user.name,
          content: text,
          roomId: activeRoom,
          mediaUrl,
          mediaType
        }));

        // Scroll
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({ index: 'last', align: 'end', behavior: 'smooth' });
        }, 50);
    } catch (e) {
        console.error("Send error:", e);
        // Optionally revert optimistic update here
    } finally {
        setIsSending(false);
    }
  };

  const createPeerConnection = async (targetId: number, initiator: boolean) => {
    if (!socketRef.current || !user) return;
    
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnections.current.set(targetId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.send(JSON.stringify({
          type: 'voice-signal',
          targetId,
          payload: { type: 'candidate', candidate: event.candidate }
        }));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => {
        const next = new Map(prev);
        next.set(targetId, event.streams[0]);
        return next;
      });
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.send(JSON.stringify({
        type: 'voice-signal',
        targetId,
        payload: { type: 'offer', sdp: offer }
      }));
    }
  };

  const handleVoiceSignal = async (data: any) => {
    const { senderId, payload } = data;
    let pc = peerConnections.current.get(senderId);

    if (!pc) {
      await createPeerConnection(senderId, false);
      pc = peerConnections.current.get(senderId);
    }
    
    if (!pc) return;

    if (payload.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.send(JSON.stringify({
        type: 'voice-signal',
        targetId: senderId,
        payload: { type: 'answer', sdp: answer }
      }));
    } else if (payload.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    } else if (payload.type === 'candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    }
  };

  const removePeerConnection = (userId: number) => {
    const pc = peerConnections.current.get(userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(userId);
    }
    setRemoteStreams(prev => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  };

  const joinVoiceChannel = async () => {
    if (!socketRef.current || !user || !activeRoom) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: cameraOn });
      localStreamRef.current = stream;
      setIsInVoice(true);
      socketRef.current.send(JSON.stringify({ type: 'join-voice', roomId: activeRoom, userId: user.id }));
    } catch (err) {
      console.error("Failed to get media", err);
      alert("Could not access microphone/camera");
    }
  };

  const leaveVoiceChannel = () => {
    if (!socketRef.current || !user || !activeRoom) return;
    
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    setRemoteStreams(new Map());
    
    socketRef.current.send(JSON.stringify({ type: 'leave-voice', roomId: activeRoom, userId: user.id }));
    setIsInVoice(false);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleCamera = async () => {
    if (!localStreamRef.current) return;
    
    if (cameraOn) {
      // Turn off
      const track = localStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.stop();
        localStreamRef.current.removeTrack(track);
        // Renegotiate? For simplicity, we might need to restart connection or use replaceTrack if we kept the track but disabled it. 
        // Disabling track is easier:
        // track.enabled = false;
        // But to really stop camera light, we stop track.
        setCameraOn(false);
      }
    } else {
      // Turn on
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStreamRef.current.addTrack(videoTrack);
        setCameraOn(true);
        // We need to add this track to all peer connections
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          } else {
            pc.addTrack(videoTrack, localStreamRef.current!);
          }
        });
      } catch (e) {
        console.error("No camera", e);
      }
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setUser(data.user);
          setIsLoggedIn(true);
          setIsLoginOpen(false);
          setIsAuthLoading(false);
        }, 1000);
      } else {
        alert(data.message);
        setIsAuthLoading(false);
      }
    } catch {
      setIsAuthLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const campus = formData.get('campus') as string;

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, campus })
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setUser(data.user);
          setIsLoggedIn(true);
          setIsSignupOpen(false);
          setIsAuthLoading(false);
        }, 1000);
      } else {
        alert(data.message);
        setIsAuthLoading(false);
      }
    } catch {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setView('home');
    localStorage.removeItem('onemsu_auth');
    localStorage.removeItem('onemsu_user');
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).then(r => r.json());

      setIsAuthLoading(false);
      if (res.success) {
        alert(res.message);
        setIsForgotOpen(false);
        setIsLoginOpen(true);
      } else {
        alert(res.message);
      }
    } catch {
      setIsAuthLoading(false);
      alert("Failed to send reset link. Please try again later.");
    }
  };

  const clearChat = async () => {
    if (!user || !activeRoom) return;
    const res = await fetch('/api/messages/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, roomId: activeRoom })
    }).then(r => r.json());
    if (res.success) {
      setMessages([]);
      setSettingsOpen(false);
    }
  };

  const deleteMessage = async (msgId: number) => {
    if (!user) return;
    const res = await fetch(`/api/messages/${msgId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    }).then(r => r.json());
    if (res.success) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  const renderDashboard = () => {
    const messengerUnread = Object.entries(unreadCounts)
      .filter(([room]) => room.startsWith('dm-') || room.startsWith('group-') || ['global', 'help-desk'].includes(room))
      .reduce((sum, [_, count]) => (sum as number) + (count as number), 0);

    const updatesUnread = Object.entries(unreadCounts)
      .filter(([room]) => room.startsWith('newsfeed-') || room === 'announcements')
      .reduce((sum, [_, count]) => (sum as number) + (count as number), 0);

    return (
    <div className="h-full w-full bg-[#0a0502] p-4 md:p-8 lg:p-12 overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto pb-20">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'MSUan'}!</h2>
              <p className="text-gray-500 text-sm">Connected to {user?.email || 'Unified System'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-8">
            <div className="card-gold p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} /> Confession Wall
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freedomPosts.slice(0, 5).map((p) => (
                  <div key={p.id} className={`rounded-2xl overflow-hidden bg-white/5 border border-white/10 ${freedomPosts.indexOf(p) === 0 ? 'md:col-span-2' : ''}`}>
                    {p.image_url && <img src={p.image_url} alt="" className={`${freedomPosts.indexOf(p) === 0 ? 'h-48' : 'h-32'} w-full object-cover`} />}
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-amber-400">{p.alias}</span>
                        <span className="text-[10px] text-gray-500">{p.campus} • {new Date(p.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className={`mt-2 ${freedomPosts.indexOf(p) === 0 ? 'text-base' : 'text-sm'} text-gray-200 line-clamp-3`}>{p.content}</div>
                    </div>
                  </div>
                ))}
                {freedomPosts.length === 0 && (
                  <div className="text-sm text-gray-500">No posts yet. Be the first to share.</div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setView('confession')} className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
                  Open Confession
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                          setView('messenger');
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

          {/* Right Side Panel */}
          <div className="space-y-8">
            <div className="card-gold p-6 rounded-3xl">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Messenger', icon: <MessageCircle size={14} />, action: () => setView('messenger'), unread: messengerUnread },
                  { name: 'Schedule', icon: <Clock size={14} />, action: () => setView('schedule') },
                  { name: 'Room Finder', icon: <MapPin size={14} />, action: () => setView('roomfinder') },
                  { name: 'Scholarships', icon: <Sparkles size={14} />, action: () => setView('scholarships') },
                  { name: 'Internships', icon: <BookOpen size={14} />, action: () => setView('internships') },
                  { name: 'Campus Map', icon: <Globe size={14} />, action: () => setView('campusmap') },
                  { name: 'Lost & Found', icon: <Search size={14} />, action: () => setView('lostandfound') },
                  { name: 'Events', icon: <Heart size={14} />, action: () => setView('events') },
                  { name: 'Profile', icon: <Users size={14} />, action: () => setView('profile') },
                  { name: 'Updates', icon: <MessageSquare size={14} />, action: () => setView('newsfeed'), unread: updatesUnread },
                  { name: 'Confession', icon: <Sparkles size={14} />, action: () => setView('confession') },
                  { name: 'Feedbacks', icon: <Info size={14} />, action: () => setView('feedbacks') }
                ].map(item => (
                  <button 
                    key={item.name} 
                    onClick={() => item.action ? item.action() : null}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium hover:bg-amber-500 hover:text-black transition-all flex flex-col items-center gap-2 relative group"
                  >
                    {(item as any).unread > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: 1 
                        }}
                        transition={{
                          scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                        }}
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-rose-900/40 z-10"
                      >
                        {(item as any).unread > 99 ? '99+' : (item as any).unread}
                      </motion.span>
                    )}
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-gold p-6 rounded-3xl">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-amber-500" /> Campus Information</h3>
              <div className="space-y-3">
                {CAMPUSES.map((c) => (
                  <div key={c.slug} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-lg">
                        <CampusLogo slug={c.slug} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">{c.name}</h4>
                          <button 
                            onClick={() => setSelectedCampus(c)}
                            className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black transition-colors"
                          >
                            About
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 mb-2">
                          <MapPin size={10} /> {c.location}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                        <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                           <div className="text-[10px] text-gray-500">
                             <span className="text-amber-500 font-bold">{c.stats.students}</span> Students
                           </div>
                           <div className="text-[10px] text-gray-500">
                             <span className="text-amber-500 font-bold">{c.stats.courses}</span> Programs
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                  {stickyNotes.slice(0, 4).map(n => (
                    <div key={n.id} className={`p-3 rounded-2xl border ${n.color} transition-all hover:scale-[1.02]`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-white/60 font-medium">{new Date(n.createdAt).toLocaleDateString()}</span>
                        <button
                          className="text-xs text-white/60 hover:text-white transition-colors"
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
                        className="w-full h-28 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedbacks moved to its own view via Quick Actions */}
          </div>
        </div>
      </div>
    </div>
  );
  };

  const renderHome = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-hidden hero-metallic">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 font-bold text-xl cursor-pointer" onClick={() => setView('home')}>
          <div className="w-12 h-12">
            <Logo />
          </div>
          <span className="hidden sm:inline tracking-tighter">ONE<span className="text-amber-500">MSU</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => setView('explorer')} className="text-gray-400 hover:text-white transition-colors">Campuses</button>
          <button onClick={() => setView('about')} className="text-gray-400 hover:text-white transition-colors">About</button>
          <button 
            onClick={() => isLoggedIn ? setView('dashboard') : setIsLoginOpen(true)}
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
            setView('explorer');
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
        <div className="mb-8" />

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
            onClick={() => setView('explorer')}
            className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
          >
            Explore Campuses <ArrowRight size={18} />
          </motion.button>
          
          {!isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLoginOpen(true)}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl font-bold backdrop-blur-md transition-colors"
            >
              Log in
            </motion.button>
          )}
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
                  <button 
                    type="button"
                    onClick={() => { setIsLoginOpen(false); setIsForgotOpen(true); }}
                    className="text-amber-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className={`w-full bg-amber-500 text-black py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 ${isAuthLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:bg-amber-400 active:scale-95'}`}
                >
                  {isAuthLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Connecting...
                    </>
                  ) : (
                    'Sign In'
                  )}
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
                <h3 className="text-2xl font-bold text-metallic-gold">Join ONEMSU</h3>
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gmail Address</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="juan.delacruz@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                    pattern=".+@gmail\.com"
                    title="Please use a valid @gmail.com address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Campus</label>
                  <select 
                    name="campus"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  >
                    {CAMPUSES.map(c => <option key={c.slug} value={c.name} className="bg-[#0a0502]">{c.name}</option>)}
                  </select>
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
                  disabled={isAuthLoading}
                  className={`w-full bg-amber-500 text-black py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 ${isAuthLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:bg-amber-400 active:scale-95'}`}
                >
                  {isAuthLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
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

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md card-gold p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-metallic-gold">Reset Password</h3>
                <button onClick={() => setIsForgotOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              
              <p className="text-gray-400 text-sm mb-8">
                Enter your registered Gmail address and we'll send you a link to reset your password.
              </p>
              
              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gmail Address</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="juan.delacruz@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                    pattern=".+@gmail\.com"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className={`w-full bg-amber-500 text-black py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 ${isAuthLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:bg-amber-400 active:scale-95'}`}
                >
                  {isAuthLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <button 
                  onClick={() => { setIsForgotOpen(false); setIsLoginOpen(true); }} 
                  className="text-sm text-gray-500 hover:text-amber-500 flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <ArrowRight className="rotate-180" size={16} /> Back to Sign In
                </button>
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

  const renderExplorer = () => {
    const activeCampus = selectedCampus || CAMPUSES[0];

    return (
      <div className="h-full w-full bg-[#0a0502] flex overflow-hidden">
        {/* Sidebar - Campus List */}
        <div className="w-80 border-r border-white/5 flex flex-col shrink-0 bg-black/40 backdrop-blur-md hidden md:flex">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-metallic-gold">MSU System</h2>
            <button onClick={() => setView('home')} className="text-gray-500 hover:text-white"><X /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {CAMPUSES.map((campus) => (
              <button
                key={campus.slug}
                onClick={() => setSelectedCampus(campus)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeCampus.slug === campus.slug ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <div className="w-8 h-8 shrink-0">
                  <CampusLogo slug={campus.slug} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold truncate">{campus.name}</p>
                  <p className={`text-[10px] ${activeCampus.slug === campus.slug ? 'text-black/60' : 'text-gray-500'}`}>{campus.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Feed Style */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide">
          {/* Cover Area */}
          <div className="relative h-48 md:h-64 shrink-0 overflow-hidden bg-gradient-to-br from-amber-900/40 to-black">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <CampusLogo slug={activeCampus.slug} className="w-96 h-96" />
            </div>
            <div className="absolute bottom-6 left-8 flex items-end gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-black/60 border-4 border-black/40 p-4 backdrop-blur-md">
                <CampusLogo slug={activeCampus.slug} />
              </div>
              <div className="pb-2">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 drop-shadow-2xl">{activeCampus.name}</h1>
                <p className="text-amber-400 flex items-center gap-1 font-medium"><MapPin size={16} /> {activeCampus.location}</p>
              </div>
            </div>
            <button 
              onClick={() => setView('home')}
              className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Feed Grid */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">
            {/* Left/Middle: The Newsfeed */}
            <div className="flex-1 space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="text-amber-500" size={20} /> Campus Board
                </h4>
                <CampusNewsfeed campus={activeCampus} />
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="w-full lg:w-80 space-y-6 shrink-0">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">About Campus</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {activeCampus.description}
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Students</p>
                      <p className="text-lg font-bold text-white">{activeCampus.stats.students}</p>
                    </div>
                    <Users size={20} className="text-amber-500/50" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Programs</p>
                      <p className="text-lg font-bold text-white">{activeCampus.stats.courses}</p>
                    </div>
                    <BookOpen size={20} className="text-amber-500/50" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Official Channels</h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs transition-colors">Campus Announcements</button>
                  <button className="w-full text-left px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs transition-colors">Help & Support</button>
                  <button className="w-full text-left px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs transition-colors">Student Council</button>
                </div>
              </div>
            </div>
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
                <div className="p-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
                  <div className="mb-8">
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {selectedCampus.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Student Body</p>
                        <p className="text-2xl font-bold text-white">{selectedCampus.stats.students}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Academic Programs</p>
                        <p className="text-2xl font-bold text-white">{selectedCampus.stats.courses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-8" />
                  
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="text-amber-500" size={20} /> Campus Newsfeed
                  </h4>
                  <CampusNewsfeed campus={selectedCampus} />
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
                        joinGroup(selectedGroup);
                        setSelectedGroup(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                    >
                      {joinedGroups.some(g => g.id === selectedGroup.id) ? 'Open Chat' : 'Join Chat'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const CampusNewsfeed = ({ campus }: { campus: Campus }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [media, setMedia] = useState<{ url: string; type: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const room = `newsfeed-${campus.slug}`;

    const fetchPosts = () => {
      fetch(`/api/messages/${room}`).then(r => r.json()).then(setPosts);
    };

    useEffect(() => {
      fetchPosts();
      const interval = setInterval(fetchPosts, 5000);
      return () => clearInterval(interval);
    }, [room]);

    const handlePost = async () => {
      if (!user || (!text.trim() && !media)) return;
      setLoading(true);
      try {
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            type: 'chat',
            senderId: user.id,
            senderName: user.name,
            senderEmail: user.email,
            senderAvatar: user.avatar,
            content: text.trim(),
            roomId: room,
            mediaUrl: media?.url,
            mediaType: media?.type
          }));
          setText('');
          setMedia(null);
          setTimeout(fetchPosts, 500);
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Post Input */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0 overflow-hidden ring-2 ring-white/5">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.name || 'U')[0]}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
              className="flex-1 bg-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-none transition-all"
              rows={2}
            />
          </div>
          
          {media && (
            <div className="relative mb-4 ml-13 rounded-2xl overflow-hidden border border-white/10 max-w-sm group">
              {media.type.startsWith('video') ? (
                <video src={media.url} controls className="w-full" />
              ) : (
                <img src={media.url} alt="" className="w-full object-cover max-h-64" />
              )}
              <button 
                onClick={() => setMedia(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-white/5 ml-13">
            <div className="flex gap-1">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-gray-400 cursor-pointer transition-colors group">
                <Image size={18} className="group-hover:text-emerald-500" />
                <span className="text-xs font-medium">Photo/Video</span>
                <input 
                  type="file" 
                  accept="image/*,video/*,.gif" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dataUrl: reader.result as string })
                      }).then(r => r.json());
                      if (res.success) {
                        setMedia({ url: res.url, type: res.mimeType });
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            <button 
              onClick={handlePost}
              disabled={loading || (!text.trim() && !media)}
              className="px-6 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-amber-900/20"
            >
              {loading ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-4 max-h-[800px] overflow-y-auto scrollbar-hide pb-12 pr-1">
          {posts.slice().reverse().map((post, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-xl hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm overflow-hidden ring-2 ring-white/5 cursor-pointer"
                    onClick={() => setSelectedProfileId(post.sender_id || post.senderId)}
                  >
                    {post.sender_avatar || post.senderAvatar ? (
                      <img src={post.sender_avatar || post.senderAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (post.sender_name || 'U')[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer transition-colors"
                        onClick={() => setSelectedProfileId(post.sender_id || post.senderId)}
                      >
                        {post.sender_name}
                      </span>
                      {isOwner(post.sender_email || post.senderEmail) && (
                        <ShieldCheck size={14} className="text-amber-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} /> {new Date(post.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-white/5 text-gray-500 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed px-1">{post.content}</p>
              
              {(post.media_url || post.mediaUrl) && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 mb-4">
                  {(post.media_type || post.mediaType)?.startsWith('video') ? (
                    <video src={post.media_url || post.mediaUrl} controls className="w-full max-h-[500px]" />
                  ) : (
                    <img src={post.media_url || post.mediaUrl} alt="" className="w-full object-contain max-h-[500px]" />
                  )}
                </div>
              )}

              <div className="flex items-center gap-6 pt-3 border-t border-white/5 px-1">
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors">
                  <Heart size={18} /> 0
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors">
                  <MessageCircle size={18} /> 0
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-medium">No posts in {campus.name} yet.</p>
              <p className="text-xs text-gray-600 mt-1">Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200">
      <nav className="p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3 font-bold text-xl cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10"><Logo /></div>
          <span>ONE<span className="text-amber-500">MSU</span></span>
        </div>
        <button onClick={() => setView('home')} className="text-gray-400 hover:text-white transition-colors"><X /></button>
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
            <button 
              onClick={() => {
                if (isLoggedIn) setView('dashboard');
                else {
                  setView('home');
                  setIsSignupOpen(true);
                }
              }}
              className="px-8 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              Apply Now
            </button>
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
          <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
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
          <h2 className="text-3xl font-bold text-metallic-gold">Latest Update</h2>
          <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-amber-500" /> Announcements</h4>
            <Feed room="announcements" />
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
      student_id: '',
      program: '',
      year_level: '',
      department: '',
      bio: '',
      cover_photo: ''
    });
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);
    useEffect(() => {
      if (user) {
        fetch(`/api/profile/${user.id}?viewerId=${user.id}`).then(r => r.json()).then((res) => {
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
      <form className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6" onSubmit={save}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edit Your Profile</h3>
          <button type="button" onClick={() => onSaved(user!)} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div 
                className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-2xl overflow-hidden ring-2 ring-amber-500/30 relative group/avatar cursor-pointer"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                {form.avatar ? <img src={form.avatar} alt="" className="w-full h-full object-cover" /> : (form.name || 'U')[0]}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  Change
                </div>
              </div>
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  // Convert to base64
                  const reader = new FileReader();
                  reader.onload = async (ev) => {
                    const dataUrl = ev.target?.result as string;
                    try {
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dataUrl })
                      }).then(r => r.json());
                      
                      if (res.success) {
                        setForm(prev => ({ ...prev, avatar: res.url }));
                      }
                    } catch (err) {
                      console.error('Upload failed', err);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <div className="flex-1">
                <Input label="Display Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Campus</div>
            <select 
              value={form.campus} 
              onChange={(e) => setForm({ ...form, campus: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="" disabled className="bg-[#0a0502]">Select your campus</option>
              {CAMPUSES.map(c => (
                <option key={c.slug} value={c.name} className="bg-[#0a0502]">{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Student ID" value={form.student_id} onChange={(v) => setForm({ ...form, student_id: v })} />
          <Input label="Course / Program" value={form.program} onChange={(v) => setForm({ ...form, program: v })} />
          <Input label="Year Level" value={form.year_level} onChange={(v) => setForm({ ...form, year_level: v })} />
          <Input label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
          <div className="md:col-span-2">
            <Textarea label="Bio / Intro" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} />
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Avatar Image URL" value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
            <Input label="Cover Image URL" value={form.cover_photo} onChange={(v) => setForm({ ...form, cover_photo: v })} />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              disabled={saving} 
              className={`px-8 py-3 rounded-xl bg-amber-500 text-black font-bold transition-all shadow-lg shadow-amber-900/20 ${saving ? 'opacity-60 cursor-not-allowed scale-95' : 'hover:bg-amber-400 hover:scale-105 active:scale-95'}`}
            >
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
            {savedAt && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-sm text-emerald-400 font-medium flex items-center gap-1"
              >
                <ShieldCheck size={16} /> All changes saved!
              </motion.span>
            )}
          </div>
          <button 
            type="button"
            onClick={() => onSaved(user!)} 
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
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
  const [profileData, setProfileData] = useState<any>(null);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [tempCover, setTempCover] = useState<string | null>(null);

  useEffect(() => {
    if (user && view === 'profile') {
      fetch(`/api/profile/${user.id}?viewerId=${user.id}`).then(r => r.json()).then(res => {
        if (res.success) setProfileData(res.user);
      });
    }
  }, [user, view]);

  const toggleFollow = async (targetId: number) => {
    if (!user) return;
    const res = await fetch(`/api/profile/${targetId}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId: user.id })
    }).then(r => r.json());
    if (res.success) {
      if (selectedProfileId === targetId) {
        // Refresh detail view
        fetch(`/api/profile/${targetId}?viewerId=${user.id}`).then(r => r.json()).then(res => {
          if (res.success) {
            // update local detail if needed
          }
        });
      }
      // Refresh current user data if looking at their profile
      if (view === 'profile') {
        fetch(`/api/profile/${user.id}?viewerId=${user.id}`).then(r => r.json()).then(res => {
          if (res.success) setProfileData(res.user);
        });
      }
    }
  };

  const renderProfile = () => (
    <div className="h-full w-full bg-[#0a0502] text-gray-200 p-4 md:p-12 overflow-y-auto scrollbar-hide">
      <div className="max-w-3xl mx-auto pb-20">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-metallic-gold">Profile</h2>
          <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
          <div 
            className="h-40 md:h-56 w-full bg-gradient-to-br from-amber-900/30 to-black relative group cursor-pointer"
            style={{ backgroundImage: (tempCover || user?.cover_photo) ? `url(${tempCover || user.cover_photo})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*,.gif';
              input.onchange = async (e: any) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async () => {
                  const dataUrl = reader.result as string;
                  setTempCover(dataUrl);
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataUrl })
                  }).then(r => r.json());
                  if (res.success && user) {
                    const upRes = await fetch(`/api/profile/${user.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cover_photo: res.url })
                    }).then(r => r.json());
                    if (upRes.success) {
                      setUser(upRes.user);
                      setProfileData(prev => ({ ...prev, cover_photo: res.url }));
                      setTempCover(null);
                    }
                  }
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }}
          >
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold">
              Change Cover Photo
            </div>
            <div className="absolute -bottom-10 left-6">
              <div 
                className="w-24 h-24 rounded-full ring-4 ring-[#0a0502] overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold relative group/avatar cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*,.gif';
                  input.onchange = async (ev: any) => {
                    const file = ev.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const dataUrl = reader.result as string;
                      setTempAvatar(dataUrl);
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dataUrl })
                      }).then(r => r.json());
                      if (res.success && user) {
                        const upRes = await fetch(`/api/profile/${user.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ avatar: res.url })
                        }).then(r => r.json());
                        if (upRes.success) {
                          setUser(upRes.user);
                          setProfileData(prev => ({ ...prev, avatar: res.url }));
                          setTempAvatar(null);
                        }
                      }
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }}
              >
                {(tempAvatar || user?.avatar) ? <img src={tempAvatar || user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.name || 'U')[0]}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  Change
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 pt-12 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  {user?.name || 'MSUan'}
                  {isVerified(user?.email) && (
                    <span className="p-1 rounded-full bg-amber-500 text-black" title="Verified">
                      <ShieldCheck size={14} />
                    </span>
                  )}
                  {user?.email === 'xandercamarin@gmail.com' && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] uppercase tracking-wider font-bold shadow-lg shadow-rose-500/20" title="Founder">
                      Founder
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                  {user?.campus && (
                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-500" /> {user.campus}</div>
                  )}
                  {user?.program && (
                    <div className="flex items-center gap-1.5"><BookOpen size={12} className="text-amber-500" /> {user.program}</div>
                  )}
                  {user?.year_level && (
                    <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-amber-500" /> Year {user.year_level}</div>
                  )}
                  {user?.department && (
                    <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-amber-500" /> {user.department}</div>
                  )}
                </div>

                {user?.bio && <div className="mt-4 text-sm text-gray-300 leading-relaxed max-w-xl">{(user as any).bio}</div>}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{profileData?.followers || 0}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{profileData?.following || 0}</div>
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
          <div className="mt-6 grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs">
                No posts
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderConfession = () => (
    <div className="h-full w-full bg-[#0a0502] text-gray-200 p-4 md:p-12 overflow-y-auto scrollbar-hide">
      <div className="max-w-3xl mx-auto pb-20">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-metallic-gold">Confession</h2>
          <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-white"><X /></button>
        </header>
        <div className="card-gold p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-3">
            <label className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 cursor-pointer">
              Upload picture
              <input
                type="file"
                accept="image/*,.gif"
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
            placeholder="Post anonymously to the Confession..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
          {freedomImagePreview && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">
              <img src={freedomImagePreview} alt="" className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500 italic">Your post will be assigned a sequential anonymous ID (e.g. Anonymous #123)</div>
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
                    <div className="text-sm font-semibold flex items-center gap-2">
                      {p.alias}
                      {p.user_id && freedomPosts.find(x => x.id === p.id)?.user_id === user?.id && isOwner(user?.email) && (
                        <span className="p-0.5 rounded-full bg-amber-500 text-black" title="Verified Owner">
                          <ShieldCheck size={10} />
                        </span>
                      )}
                    </div>
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
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  const handleTyping = () => {
    if (!user || !activeRoom || !socketRef.current) return;
    
    // Skip typing indicator for AI assistant
    if (activeRoom === 'dm-ai-assistant') return;
    
    if (!isTypingLocal) {
      setIsTypingLocal(true);
      socketRef.current.send(JSON.stringify({
        type: 'typing',
        senderId: user.id,
        senderName: user.name,
        roomId: activeRoom,
        isTyping: true
      }));
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTypingLocal(false);
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'typing',
          senderId: user.id,
          senderName: user.name,
          roomId: activeRoom,
          isTyping: false
        }));
      }
    }, 2000);
  };

  const renderMessenger = () => {
    // Determine the other participant in a DM
    let otherParticipantId: number | null = null;
    if (activeRoom.startsWith('dm-')) {
      const parts = activeRoom.split('-');
      if (parts.length === 3) {
        const a = Number(parts[1]);
        const b = Number(parts[2]);
        otherParticipantId = (user && a === user.id) ? b : a;
      }
    }
    const isOtherOnline = otherParticipantId ? isUserOnline(otherParticipantId) : false;

    const totalUnread = Object.entries(unreadCounts)
      .filter(([room]) => room.startsWith('dm-') || room.startsWith('group-') || ['global', 'help-desk'].includes(room))
      .reduce((sum, [_, count]) => (sum as number) + (count as number), 0);

    return (
    <div className="h-[100dvh] bg-[#0a0502] flex flex-col md:flex-row overflow-hidden text-gray-200">
      {/* Sidebar */}
      <div className={`
        flex flex-col shrink-0 border-r border-white/5 transition-all duration-300
        ${showMobileSidebar ? 'w-full absolute inset-0 z-20 bg-[#0a0502] md:static md:w-80 md:bg-transparent' : 'hidden md:flex md:w-80'}
      `}>
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Messenger
              {totalUnread > 0 && (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ scale: { repeat: Infinity, duration: 2 } }}
                  className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-900/40"
                >
                  {totalUnread}
                </motion.span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {user && isOwner(user.email) && (
              <button 
                onClick={() => setActiveRoom('announcements')}
                className={`p-2 rounded-lg transition-all ${activeRoom === 'announcements' ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
                title="Updates"
              >
                <MessageSquare size={16} />
              </button>
            )}
            <button 
              onClick={() => setView('profile')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="View Profile"
            >
              <UserIcon size={16} />
            </button>
            <button 
              onClick={() => {
                setUser(null);
                setView('home');
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
            <button onClick={() => setView('dashboard')} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>
        
        <div className="p-4 bg-black/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 absolute z-30 left-4 right-4 bg-black/95 border border-white/10 rounded-xl p-2 shadow-2xl">
              {searchResults.map(u => (
                <button 
                  key={u.id}
                  onClick={() => {
                    const roomId = `dm-${Math.min(user!.id, u.id)}-${Math.max(user!.id, u.id)}`;
                    setActiveRoom(roomId);
                    addToDMList({ id: u.id, name: u.name, campus: u.campus, avatar: u.avatar });
                    setSearchResults([]);
                    setSearchQuery('');
                    setShowMobileSidebar(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.campus}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {user && isOwner(user.email) && (
            <>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Updates</div>
              {['announcements'].map(room => (
                <button 
                  key={room}
                  onClick={() => { setActiveRoom(room); setShowMobileSidebar(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeRoom === room ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <span className="text-sm font-bold capitalize">{room}</span>
                  {unreadCounts[room] > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeRoom === room ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'}`}>
                      {unreadCounts[room]}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6">Direct Messages</div>
          <button 
            onClick={() => { setActiveRoom('dm-ai-assistant'); setShowMobileSidebar(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeRoom === 'dm-ai-assistant' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                <Bot size={12} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-bold truncate">ONEMSU AI Assistant</p>
              </div>
            </div>
          </button>
          {directMessageList.map(dm => (
            <button 
              key={dm.id}
              onClick={() => { setActiveRoom(dm.roomId); setShowMobileSidebar(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeRoom === dm.roomId ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                  {dm.avatar ? <img src={dm.avatar} alt="" className="w-full h-full object-cover" /> : dm.name[0]}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold truncate">{dm.name}</p>
                </div>
              </div>
              {unreadCounts[dm.roomId] > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${activeRoom === dm.roomId ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'}`}>
                  {unreadCounts[dm.roomId]}
                </span>
              )}
            </button>
          ))}
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6">Groups</div>
          <div className="space-y-1">
            {joinedGroups
              .filter(group => isOwner(user?.email) || !user?.campus || group.campus === user.campus)
              .map(group => {
                const gRoom = group.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button 
                    key={group.id}
                    onClick={() => { setActiveRoom(gRoom); setShowMobileSidebar(false); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeRoom === gRoom ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {group.logo_url ? <img src={group.logo_url} alt="" className="w-full h-full object-cover rounded" /> : group.name[0]}
                      </div>
                      <span className="text-sm font-bold truncate">{group.name}</span>
                    </div>
                    {unreadCounts[gRoom] > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${activeRoom === gRoom ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'}`}>
                        {unreadCounts[gRoom]}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6">Campuses</div>
          {CAMPUSES
            .filter(c => isOwner(user?.email) || isVerified(user?.email) || !user?.campus || c.name === user.campus)
            .map(c => (
              <button 
                key={c.slug}
                onClick={() => { setActiveRoom(c.slug); setShowMobileSidebar(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeRoom === c.slug ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 shrink-0"><CampusLogo slug={c.slug} /></div>
                  <span className="text-sm font-bold truncate">{c.name}</span>
                </div>
                {unreadCounts[c.slug] > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${activeRoom === c.slug ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'}`}>
                    {unreadCounts[c.slug]}
                  </span>
                )}
              </button>
            ))
          }
          {user?.campus && CAMPUSES.filter(c => c.name === user.campus).length === 0 && (
             <div className="px-3 py-2 text-[10px] text-gray-600 italic">No matching campus found.</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        flex-col h-full min-w-0 transition-all duration-300
        ${showMobileSidebar ? 'hidden md:flex flex-1' : 'flex w-full'}
      `}>
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setShowMobileSidebar(true)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white">
              <ChevronRight className="rotate-180" size={24} />
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0 cursor-pointer"
              onClick={() => {
                if (activeRoom.startsWith('dm')) {
                   const dmUser = directMessageList.find(d => d.roomId === activeRoom);
                   if (dmUser) setSelectedProfileId(dmUser.id);
                   else if (otherParticipantId) setSelectedProfileId(otherParticipantId);
                }
              }}
            >
              {activeRoom.startsWith('dm') ? (
                 directMessageList.find(d => d.roomId === activeRoom)?.avatar ? 
                 <img src={directMessageList.find(d => d.roomId === activeRoom)?.avatar} className="w-full h-full object-cover rounded-full" /> : 
                 (directMessageList.find(d => d.roomId === activeRoom)?.name[0] || 'DM')
              ) : activeRoom[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 
                className="font-bold text-white capitalize truncate cursor-pointer hover:text-amber-400"
                onClick={() => {
                  if (activeRoom.startsWith('dm')) {
                     const dmUser = directMessageList.find(d => d.roomId === activeRoom);
                     if (dmUser) setSelectedProfileId(dmUser.id);
                     else if (otherParticipantId) setSelectedProfileId(otherParticipantId);
                  }
                }}
              >
                {activeRoom.startsWith('dm') ? 
                  (directMessageList.find(d => d.roomId === activeRoom)?.name || activeRoom.replace(/-/g, ' ')) : 
                  activeRoom.replace(/-/g, ' ')}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-gray-500 truncate">
                  {activeRoom.startsWith('dm') ? 'Direct Message' : ['global', 'announcements', 'help-desk'].includes(activeRoom) ? 'Channel' : 'Campus'}
                </p>
                {activeRoom.startsWith('dm') && (
                  <p className={`text-[10px] flex items-center gap-1 ${isOtherOnline ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOtherOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                    {isOtherOnline ? 'Active now' : 'Offline'}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-gray-500">
            <button
              onClick={() => setMutedRooms(prev => prev.includes(activeRoom) ? prev.filter(r => r !== activeRoom) : [...prev, activeRoom])}
              className="p-2 rounded-lg hover:text-white hover:bg-white/5"
            >
              {mutedRooms.includes(activeRoom) ? <BellOff size={20} /> : <Bell size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2 rounded-lg hover:text-white hover:bg-white/5"
              >
                <Settings size={20} />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-black/90 border border-white/10 shadow-2xl p-2 text-sm z-50">
                  <button onClick={() => setCompactBubbles(v => !v)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
                    {compactBubbles ? 'Disable compact bubbles' : 'Enable compact bubbles'}
                  </button>
                  <button onClick={() => setShowTimestamps(v => !v)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
                    {showTimestamps ? 'Hide timestamps' : 'Show timestamps'}
                  </button>
                  <button onClick={clearChat} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-rose-400">
                    Clear for me
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative bg-[#0a0502]">
          <div className="flex-1 flex flex-col min-w-0 h-full mx-auto max-w-5xl w-full border-x border-white/5 shadow-2xl">
            {isInVoice && (
              <div className="p-4 border-b border-white/5 bg-black/40">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                    <video 
                      ref={el => { if (el && localStreamRef.current) el.srcObject = localStreamRef.current; }} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 px-2 py-1 rounded-full flex items-center gap-2">
                      {user?.name || 'Me'}
                      {!micOn && <PhoneOff size={10} className="text-rose-500" />}
                    </div>
                  </div>
                  {Array.from(remoteStreams.entries()).map(([id, stream]) => (
                    <div key={id} className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                      <video 
                        ref={el => { if (el) el.srcObject = stream; }} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 px-2 py-1 rounded-full">
                        User {id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 p-4 md:px-6 md:py-6 overflow-hidden relative h-full">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500">
                  <div>
                    <MessageCircle className="mx-auto mb-3 opacity-70" />
                    <p className="text-sm">No messages yet.</p>
                  </div>
                </div>
              ) : (
                <>
                  <Virtuoso
                    ref={virtuosoRef}
                    style={{ height: '100%' }}
                    data={messages}
                    firstItemIndex={firstItemIndex}
                    initialTopMostItemIndex={messages.length - 1}
                    computeItemKey={(index, item) => String((item as any).id ?? index)}
                    followOutput="auto"
                    alignToBottom={true} // Ensure initial load is at bottom
                    components={{
                      Scroller: forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => (
                        <div {...props} ref={ref as any} className={`${props.className ?? ''} scrollbar-hide`} style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }} />
                      )),
                      Header: () => isLoadingMore ? <div className="py-3 text-center text-xs text-gray-500">Loading older messages…</div> : <div className="h-4" />
                    }}
                    startReached={async () => {
                      if (isLoadingMore || !hasMore) return;
                      
                      const oldestMessage = messages[0];
                      if (!oldestMessage) return;

                      setIsLoadingMore(true);
                      
                      try {
                        const beforeTimestamp = oldestMessage.timestamp;
                        const response = await fetch(`/api/messages/${activeRoom}?userId=${user?.id}&before=${encodeURIComponent(beforeTimestamp)}`);
                        const olderMessages: Message[] = await response.json();
                        
                        if (olderMessages && olderMessages.length > 0) {
                          const newUnique = olderMessages.filter(nm => !messages.some(pm => pm.id === nm.id));
                          
                          if (newUnique.length > 0) {
                            setFirstItemIndex(prev => prev - newUnique.length);
                            setMessages(prev => [...newUnique, ...prev]);
                          }
                          
                          setHasMore(olderMessages.length >= 50);
                        } else {
                          setHasMore(false);
                        }
                      } catch (error) {
                        console.error("Failed to load older messages:", error);
                      } finally {
                        setIsLoadingMore(false);
                      }
                    }}
                    itemContent={(index, m) => {
                      const sid = (m as any).sender_id ?? (m as any).senderId;
                      const sname = (m as any).sender_name ?? (m as any).senderName;
                      const ts = (m as any).timestamp;
                      const mUrl = (m as any).media_url ?? (m as any).mediaUrl;
                      const mType = (m as any).media_type ?? (m as any).mediaType;
                      const isMe = sid === user?.id;
                      
                      const prevMsg = messages[index - 1];
                      const prevSid = prevMsg ? ((prevMsg as any).sender_id ?? (prevMsg as any).senderId) : null;
                      const isChain = prevSid === sid;
                      
                      const nextMsg = messages[index + 1];
                      const nextSid = nextMsg ? ((nextMsg as any).sender_id ?? (nextMsg as any).senderId) : null;
                      const isLastInChain = nextSid !== sid;

                      return (
                        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isLastInChain ? 'mb-2' : 'mb-1'} px-4 md:px-6`}>
                          <div 
                            className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} gap-1 relative min-w-0`}
                            onContextMenu={(e) => {
                              if (isMe) {
                                e.preventDefault();
                                if (confirm('Delete this message?')) deleteMessage(m.id);
                              }
                            }}
                          >
                            {!activeRoom.startsWith('dm') && !isChain && !isMe && (
                              <span 
                                className={`text-xs font-bold text-gray-400 mt-2 mb-0.5 flex items-center gap-1 cursor-pointer hover:text-amber-400 justify-start w-auto`}
                                onClick={() => setSelectedProfileId(sid)}
                              >
                                {sname}
                                {isVerified((m as any).sender_email || (m as any).senderEmail) && (
                                  <span className="p-0.5 rounded-full bg-amber-500 text-black" title="Verified">
                                    <ShieldCheck size={8} />
                                  </span>
                                )}
                                {((m as any).sender_email === 'xandercamarin@gmail.com' || (m as any).senderEmail === 'xandercamarin@gmail.com') && (
                                  <span className="p-0.5 rounded bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[8px] font-bold" title="Founder">
                                    FOUNDER
                                  </span>
                                )}
                              </span>
                            )}
                            <div className={`
                              ${compactBubbles ? 'px-3 py-1.5' : 'px-4 py-2'} 
                              text-sm break-words whitespace-pre-wrap [overflow-wrap:anywhere] shadow-sm max-w-full
                              ${isMe 
                                ? `bg-amber-500 text-black ${isChain ? 'rounded-tr-md' : 'rounded-tr-2xl'} ${isLastInChain ? 'rounded-br-2xl' : 'rounded-br-md'} rounded-l-2xl` 
                                : `bg-white/10 text-white ${isChain ? 'rounded-tl-md' : 'rounded-tl-2xl'} ${isLastInChain ? 'rounded-bl-2xl' : 'rounded-bl-md'} rounded-r-2xl`}
                            `}>
                              {(m as any).content}
                              {mUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-full">
                                  {mType?.startsWith('video') ? <video src={mUrl} controls className="w-full" /> : <img src={mUrl} alt="" className="w-full object-cover" />}
                                </div>
                              )}
                            </div>
                            {showTimestamps && isLastInChain && (
                              <span className={`text-[9px] text-gray-500 px-1 ${isMe ? 'text-right' : 'text-left'} w-full flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }}
                    atBottomStateChange={(isAtBottom) => {
                      stickToBottomRef.current = isAtBottom;
                      if (isAtBottom) sendSeen();
                    }}
                  />
                  {typingUsers[activeRoom]?.length > 0 && (
                    <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[10px] text-amber-500 font-bold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/20 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" />
                      </div>
                      {typingUsers[activeRoom].join(', ')} {typingUsers[activeRoom].length > 1 ? 'are' : 'is'} {activeRoom === 'dm-ai-assistant' ? 'compiling response...' : 'typing...'}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 md:p-6 bg-black/40 border-t border-white/5">
              {(activeRoom === 'announcements' && !isOwner(user?.email)) ? (
                <div className="flex justify-center items-center py-3 bg-white/5 rounded-2xl border border-white/10 text-gray-500 text-sm">
                  <ShieldCheck size={16} className="mr-2 text-amber-500/50" />
                  This channel is read-only. Only MSU Admins can post.
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!user) return; // Guard clause
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                      const msgContent = input.value;
                      // Clear immediately to prevent double send
                      input.value = '';
                      setIsTypingLocal(false);
                      
                      // Send
                      sendMessage(msgContent);
                      
                      if (socketRef.current) {
                        socketRef.current.send(JSON.stringify({
                          type: 'typing',
                          senderId: user.id,
                          senderName: user.name,
                          roomId: activeRoom,
                          isTyping: false
                        }));
                      }
                    }
                  }}
                  className="flex w-full items-center gap-2"
                >
                  <input 
                    name="message"
                    type="text"
                    placeholder="Type a message…"
                    autoComplete="off"
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         // Manually trigger the submit handler since requestSubmit() can be flaky in some contexts
                         const form = e.currentTarget.form;
                         if (form) {
                           form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                         }
                       }
                    }}
                    className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                  <button 
                    type="submit"
                    disabled={isSending}
                    className={`p-3 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 transition-colors shrink-0 flex items-center justify-center ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSending ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Profile Detail Overlay */}
      <AnimatePresence>
        {selectedProfileId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <ProfileDetail id={selectedProfileId} onClose={() => setSelectedProfileId(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
    );
  };

  const ProfileDetail = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const [pUser, setPUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (!id || isNaN(id)) {
        setError(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(false);
      fetch(`/api/profile/${id}?viewerId=${user?.id}`)
        .then(r => r.json())
        .then(res => {
          if (res.success) setPUser(res.user);
          else setError(true);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
      <div className="text-white flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-bold">Loading profile...</div>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">Cancel</button>
      </div>
    );

    if (error || !pUser) return (
      <div className="bg-[#0a0502] p-8 rounded-2xl border border-white/10 text-center max-w-sm">
        <div className="text-rose-500 font-bold mb-2">Profile Not Found</div>
        <p className="text-gray-400 text-sm mb-6">Could not load user information.</p>
        <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 text-white font-medium">Close</button>
      </div>
    );

    const handleFollow = async () => {
      await toggleFollow(id);
      fetch(`/api/profile/${id}?viewerId=${user?.id}`).then(r => r.json()).then(res => res.success && setPUser(res.user));
    };

    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md card-gold rounded-3xl overflow-hidden shadow-2xl"
      >
        <div 
          className="h-32 bg-gradient-to-br from-amber-600/30 to-black relative"
          style={{ backgroundImage: pUser.cover_photo ? `url(${pUser.cover_photo})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pb-8 relative">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full ring-4 ring-black overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-3xl">
              {pUser.avatar ? <img src={pUser.avatar} alt="" className="w-full h-full object-cover" /> : pUser.name[0]}
            </div>
          </div>
          <div className="pt-14">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {pUser.name}
                  {isOwner(pUser.email) && (
                    <span className="p-1 rounded-full bg-amber-500 text-black" title="Verified Owner">
                      <ShieldCheck size={14} />
                    </span>
                  )}
                </h3>
                <p className="text-amber-500 text-sm font-medium">{pUser.campus}</p>
              </div>
              {user && user.id !== id && (
                <button
                  onClick={handleFollow}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${pUser.isFollowing ? 'bg-white/10 text-white border border-white/20' : 'bg-amber-500 text-black'}`}
                >
                  {pUser.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            
            <div className="mt-4 flex gap-6 text-center">
              <div>
                <div className="text-lg font-bold text-white">{pUser.followers || 0}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{pUser.following || 0}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Following</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-300">
              {pUser.program && <p><span className="text-gray-500 uppercase text-[10px] block">Program</span> {pUser.program}</p>}
              {pUser.bio && <p className="italic text-gray-400">"{pUser.bio}"</p>}
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => {
                  setActiveRoom(`dm-${Math.min(user!.id, pUser.id)}-${Math.max(user!.id, pUser.id)}`);
                  onClose();
                  setView('messenger');
                  setShowMobileSidebar(false);
                }}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-all"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Utility feature render functions
  const generateMockSchedules = (): Schedule[] => [
    { id: 1, courseCode: 'CS101', courseName: 'Introduction to Programming', instructor: 'Dr. Maria Santos', day: 'Monday, Wednesday, Friday', time: '08:00 - 09:30 AM', location: 'ICT Building Room 101', campus: user?.campus || 'MSU Main' },
    { id: 2, courseCode: 'CS202', courseName: 'Data Structures', instructor: 'Prof. John Reyes', day: 'Tuesday, Thursday', time: '10:00 - 11:30 AM', location: 'ICT Building Room 205', campus: user?.campus || 'MSU Main' },
    { id: 3, courseCode: 'MATH101', courseName: 'Calculus I', instructor: 'Dr. Grace Fernandez', day: 'Monday, Wednesday, Friday', time: '01:00 - 02:30 PM', location: 'Science Building Room 301', campus: user?.campus || 'MSU Main' },
    { id: 4, courseCode: 'ENG101', courseName: 'English Composition', instructor: 'Prof. Angela Cruz', day: 'Tuesday, Thursday', time: '02:00 - 03:30 PM', location: 'Arts Building Room 102', campus: user?.campus || 'MSU Main' },
    { id: 5, courseCode: 'PHYS101', courseName: 'Physics I', instructor: 'Dr. Miguel Torres', day: 'Monday, Wednesday, Friday', time: '11:00 AM - 12:30 PM', location: 'Science Building Lab 101', campus: user?.campus || 'MSU Main' },
  ];

  const generateMockRooms = (): Room[] => [
    { id: 1, building: 'ICT Building', number: '101', capacity: 45, type: 'Classroom', floor: 1, campus: user?.campus || 'MSU Main', available: true },
    { id: 2, building: 'ICT Building', number: '205', capacity: 30, type: 'Computer Lab', floor: 2, campus: user?.campus || 'MSU Main', available: false },
    { id: 3, building: 'Science Building', number: '301', capacity: 60, type: 'Lecture Hall', floor: 3, campus: user?.campus || 'MSU Main', available: true },
    { id: 4, building: 'Arts Building', number: '102', capacity: 35, type: 'Classroom', floor: 1, campus: user?.campus || 'MSU Main', available: true },
    { id: 5, building: 'Library', number: 'Study Room A', capacity: 10, type: 'Study Room', floor: 2, campus: user?.campus || 'MSU Main', available: true },
    { id: 6, building: 'Student Center', number: 'Meeting Room 1', capacity: 20, type: 'Meeting Room', floor: 1, campus: user?.campus || 'MSU Main', available: false },
  ];

  const generateMockScholarships = (): Scholarship[] => [
    { id: 1, name: 'Presidential Scholarship', description: 'Full tuition coverage for top performing students', amount: '₱150,000/semester', deadline: '2024-06-30', requirements: ['GPA 3.5+', 'Essay', 'Interview'], campus: user?.campus || 'MSU Main' },
    { id: 2, name: 'Merit-Based Grant', description: 'Partial tuition support based on academic excellence', amount: '₱75,000/semester', deadline: '2024-07-15', requirements: ['GPA 3.0+', 'Application'], campus: user?.campus || 'MSU Main' },
    { id: 3, name: 'Need-Based Scholarship', description: 'Financial aid for deserving students', amount: '₱50,000/semester', deadline: '2024-06-20', requirements: ['Income Documentation', 'Essay'], campus: user?.campus || 'MSU Main' },
    { id: 4, name: 'Athlete Scholarship', description: 'Support for student athletes', amount: '₱100,000/semester', deadline: '2024-08-01', requirements: ['Sports Performance', 'Coaches Recommendation'], campus: user?.campus || 'MSU Main' },
  ];

  const generateMockInternships = (): Internship[] => [
    { id: 1, company: 'TechCorp Philippines', position: 'Software Developer Intern', description: 'Work on web development projects using React and Node.js', postedBy: 'HR Department', campus: user?.campus || 'MSU Main', postedDate: '2024-01-15', deadline: '2024-02-28', type: 'Virtual' },
    { id: 2, company: 'Digital Solutions Inc', position: 'Data Analyst Intern', description: 'Analyze business data and create reports', postedBy: 'HR Department', campus: user?.campus || 'MSU Main', postedDate: '2024-01-10', deadline: '2024-02-20', type: 'On-site' },
    { id: 3, company: 'Marketing Pros Agency', position: 'Marketing Intern', description: 'Assist with social media campaigns and content creation', postedBy: 'HR Department', campus: user?.campus || 'MSU Main', postedDate: '2024-01-20', deadline: '2024-03-10', type: 'Hybrid' },
    { id: 4, company: 'Consulting Group Asia', position: 'Business Consultant Intern', description: 'Support consultants in business analysis and strategy', postedBy: 'HR Department', campus: user?.campus || 'MSU Main', postedDate: '2024-01-18', deadline: '2024-03-05', type: 'On-site' },
  ];

  const generateMockBuildings = (): Building[] => [
    { id: 'ict', name: 'ICT Building', x: 25, y: 30, description: 'Information and Communications Technology', type: 'Academic' },
    { id: 'science', name: 'Science Building', x: 60, y: 40, description: 'Physics, Chemistry, Biology Labs', type: 'Academic' },
    { id: 'arts', name: 'Arts Building', x: 40, y: 60, description: 'Languages, History, Philosophy', type: 'Academic' },
    { id: 'library', name: 'Library', x: 50, y: 50, description: 'University Library - Central', type: 'Facility' },
    { id: 'student', name: 'Student Center', x: 70, y: 30, description: 'Student Activities and Services', type: 'Facility' },
    { id: 'gym', name: 'Sports Complex', x: 80, y: 70, description: 'Gymnasium and Athletic Facilities', type: 'Facility' },
  ];

  const generateMockLostItems = (): LostItem[] => [
    { id: 1, user_id: 1, itemName: 'Black Wallet', description: 'Leather wallet with student ID', category: 'Accessories', location: 'Library Building', status: 'lost', postedDate: '2024-01-20', campus: user?.campus || 'MSU Main', contactName: 'John Doe', contactPhone: '09123456789' },
    { id: 2, user_id: 2, itemName: 'Silver Watch', description: 'Seiko watch with metal band', category: 'Electronics', location: 'Student Center Cafe', status: 'found', postedDate: '2024-01-19', campus: user?.campus || 'MSU Main', contactName: 'Maria Santos', contactPhone: '09187654321' },
    { id: 3, user_id: 3, itemName: 'AirPods Case', description: 'White AirPods case with charging cable', category: 'Electronics', location: 'ICT Building', status: 'lost', postedDate: '2024-01-21', campus: user?.campus || 'MSU Main', contactName: 'Alex Brown', contactPhone: '09111223344' },
  ];

  const generateMockEvents = (): CampusEvent[] => [
    { id: 1, name: 'Welcome Week 2024', date: '2024-02-10', time: '10:00 AM', location: 'Student Plaza', description: 'Opening celebration for the semester with activities and performances', capacity: 500, attendees: 234, campus: user?.campus || 'MSU Main', rsvpUsers: [] },
    { id: 2, name: 'Tech Summit 2024', date: '2024-02-15', time: '09:00 AM', location: 'ICT Building Auditorium', description: 'Latest trends in technology and innovation', capacity: 300, attendees: 156, campus: user?.campus || 'MSU Main', rsvpUsers: [] },
    { id: 3, name: 'Sports Festival', date: '2024-02-20', time: '07:00 AM', location: 'Sports Complex', description: 'Inter-college sports competitions', capacity: 1000, attendees: 567, campus: user?.campus || 'MSU Main', rsvpUsers: [] },
    { id: 4, name: 'Career Fair 2024', date: '2024-02-25', time: '09:00 AM', location: 'Main Gymnasium', description: 'Meet with companies and explore job opportunities', capacity: 400, attendees: 289, campus: user?.campus || 'MSU Main', rsvpUsers: [] },
  ];

  const renderSchedule = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Class Schedule</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6 flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <input type="text" placeholder="Search by course code or name..." value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>
        </div>
        <div className="grid gap-4">
          {(schedules.length > 0 ? schedules : generateMockSchedules()).filter(s => s.courseName.toLowerCase().includes(scheduleFilter.toLowerCase()) || s.courseCode.toLowerCase().includes(scheduleFilter.toLowerCase())).map(schedule => (
            <div key={schedule.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-amber-400">{schedule.courseCode}</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">Course</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{schedule.courseName}</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Instructor:</span> {schedule.instructor}</p>
                <p><span className="text-gray-400">Schedule:</span> {schedule.day} @ {schedule.time}</p>
                <p><span className="text-gray-400">Room:</span> {schedule.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRoomFinder = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Room Finder</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Building</label>
            <input type="text" placeholder="Search building..." value={roomFilter.building} onChange={(e) => setRoomFilter({...roomFilter, building: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min. Capacity</label>
            <input type="number" placeholder="0" value={roomFilter.capacity} onChange={(e) => setRoomFilter({...roomFilter, capacity: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(rooms.length > 0 ? rooms : generateMockRooms()).filter(r => (!roomFilter.building || r.building.toLowerCase().includes(roomFilter.building.toLowerCase())) && (roomFilter.capacity === 0 || r.capacity >= roomFilter.capacity)).map(room => (
            <div key={room.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{room.building} - {room.number}</h3>
                  <p className="text-sm text-gray-400">{room.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${room.available ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{room.available ? 'Available' : 'Occupied'}</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Capacity:</span> {room.capacity} people</p>
                <p><span className="text-gray-400">Floor:</span> {room.floor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScholarships = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Scholarship Board</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6">
          <input type="text" placeholder="Search scholarships..." value={scholarshipFilter} onChange={(e) => setScholarshipFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(scholarships.length > 0 ? scholarships : generateMockScholarships()).filter(s => s.name.toLowerCase().includes(scholarshipFilter.toLowerCase()) || s.description.toLowerCase().includes(scholarshipFilter.toLowerCase())).map(scholarship => (
            <div key={scholarship.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">{scholarship.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{scholarship.description}</p>
              <div className="space-y-3 text-sm">
                <p><span className="text-amber-400 font-semibold">Amount:</span> {scholarship.amount}</p>
                <p><span className="text-amber-400 font-semibold">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}</p>
                <div>
                  <p className="text-amber-400 font-semibold mb-2">Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {scholarship.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Internship Board</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6">
          <input type="text" placeholder="Search internships..." value={internshipFilter} onChange={(e) => setInternshipFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
        </div>
        <div className="grid gap-6">
          {(internships.length > 0 ? internships : generateMockInternships()).filter(i => i.company.toLowerCase().includes(internshipFilter.toLowerCase()) || i.position.toLowerCase().includes(internshipFilter.toLowerCase())).map(internship => (
            <div key={internship.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{internship.position}</h3>
                  <p className="text-amber-400 font-semibold">{internship.company}</p>
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">{internship.type}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{internship.description}</p>
              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <p><span className="text-gray-300">Posted:</span> {new Date(internship.postedDate).toLocaleDateString()}</p>
                {internship.deadline && <p><span className="text-gray-300">Deadline:</span> {new Date(internship.deadline).toLocaleDateString()}</p>}
              </div>
              <button className="w-full px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCampusMap = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Campus Map</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative" style={{ aspectRatio: '4/3' }}>
              <svg viewBox="0 0 500 400" className="w-full h-full">
                <defs>
                  <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#0a0502" />
                  </linearGradient>
                </defs>
                <rect width="500" height="400" fill="url(#mapGrad)" />
                <line x1="50" y1="0" x2="50" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="100" y1="0" x2="100" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="150" y1="0" x2="150" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="250" y1="0" x2="250" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="300" y1="0" x2="300" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="350" y1="0" x2="350" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="400" y1="0" x2="400" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="450" y1="0" x2="450" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="200" x2="500" y2="200" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="250" x2="500" y2="250" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="300" x2="500" y2="300" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                <line x1="0" y1="350" x2="500" y2="350" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                {(campusBuildings.length > 0 ? campusBuildings : generateMockBuildings()).map((building) => {
                  const x = (building.x / 100) * 500;
                  const y = (building.y / 100) * 400;
                  return (
                    <g key={building.id}>
                      <rect x={x - 30} y={y - 20} width="60" height="40" fill="#b99740" opacity="0.8" rx="4" />
                      <text x={x} y={y + 5} textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">{building.name.split(' ')[0]}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Locations</h3>
            <div className="space-y-3">
              {(campusBuildings.length > 0 ? campusBuildings : generateMockBuildings()).map((building) => (
                <div key={building.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/8 transition-colors cursor-pointer">
                  <h4 className="font-bold text-white text-sm">{building.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{building.description}</p>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded inline-block mt-2">{building.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLostAndFound = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Lost & Found</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Post a Lost or Found Item</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Item name" value={newLostItem.itemName || ''} onChange={(e) => setNewLostItem({...newLostItem, itemName: e.target.value})} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
              <select value={newLostItem.status || 'lost'} onChange={(e) => setNewLostItem({...newLostItem, status: e.target.value as 'lost' | 'found'})} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500"><option value="lost">Lost Item</option><option value="found">Found Item</option></select>
            </div>
            <input type="text" placeholder="Description" value={newLostItem.description || ''} onChange={(e) => setNewLostItem({...newLostItem, description: e.target.value})} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Category (e.g., Electronics, Accessories)" value={newLostItem.category || ''} onChange={(e) => setNewLostItem({...newLostItem, category: e.target.value})} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
              <input type="text" placeholder="Location" value={newLostItem.location || ''} onChange={(e) => setNewLostItem({...newLostItem, location: e.target.value})} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
            </div>
            <button className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors w-full">Post Item</button>
          </div>
        </div>
        <div className="mb-6 flex gap-2 flex-wrap">
          <button onClick={() => setLostItemFilter({...lostItemFilter, status: 'lost'})} className={`px-4 py-2 rounded-lg transition-colors ${lostItemFilter.status === 'lost' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-200 hover:bg-white/10'}`}>Lost Items</button>
          <button onClick={() => setLostItemFilter({...lostItemFilter, status: 'found'})} className={`px-4 py-2 rounded-lg transition-colors ${lostItemFilter.status === 'found' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-200 hover:bg-white/10'}`}>Found Items</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(lostItems.length > 0 ? lostItems : generateMockLostItems()).filter(item => item.status === lostItemFilter.status).map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.itemName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${item.status === 'lost' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{item.status === 'lost' ? 'Lost' : 'Found'}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-gray-300">Category:</span> {item.category}</p>
                <p><span className="text-gray-300">Location:</span> {item.location}</p>
                <p><span className="text-gray-300">Posted:</span> {new Date(item.postedDate).toLocaleDateString()}</p>
                {item.contactName && <p><span className="text-gray-300">Contact:</span> {item.contactName} ({item.contactPhone})</p>}
              </div>
              <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors w-full">Contact Owner</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Campus Events & RSVP</h1>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={24} /></button>
        </div>
        <div className="mb-6">
          <input type="text" placeholder="Search events..." value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(campusEvents.length > 0 ? campusEvents : generateMockEvents()).filter(event => event.name.toLowerCase().includes(eventFilter.toLowerCase()) || event.description.toLowerCase().includes(eventFilter.toLowerCase())).map(event => (
            <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mt-4">
                <p className="flex items-center gap-2"><Clock size={16} className="text-amber-400" /><span className="text-gray-400">{event.date} @ {event.time}</span></p>
                <p className="flex items-center gap-2"><MapPin size={16} className="text-amber-400" /><span className="text-gray-400">{event.location}</span></p>
                <p className="text-gray-400"><span className="text-amber-400 font-semibold">Attendees:</span> {event.attendees}/{event.capacity}</p>
              </div>
              <button onClick={() => {
                if (user && userRsvps.includes(event.id)) {
                  setUserRsvps(userRsvps.filter(id => id !== event.id));
                } else if (user) {
                  setUserRsvps([...userRsvps, event.id]);
                }
              }} className={`mt-4 w-full px-4 py-2 font-bold rounded-lg transition-colors ${user && userRsvps.includes(event.id) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>{user && userRsvps.includes(event.id) ? '✓ Attending' : 'RSVP Now'}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full selection:bg-amber-500/30 selection:text-amber-200 overflow-auto scrollbar-hide fixed inset-0">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
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
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
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
            transition={{ duration: 0.5 }}
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
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
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
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {renderProfile()}
          </motion.div>
        )}
        {view === 'confession' && (
          <motion.div
            key="confession"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {renderConfession()}
          </motion.div>
        )}
        {view === 'feedbacks' && (
          <motion.div
            key="feedbacks"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
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
            transition={{ duration: 0.4 }}
          >
            {renderMessenger()}
          </motion.div>
        )}
        {view === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderSchedule()}
          </motion.div>
        )}
        {view === 'roomfinder' && (
          <motion.div
            key="roomfinder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderRoomFinder()}
          </motion.div>
        )}
        {view === 'scholarships' && (
          <motion.div
            key="scholarships"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderScholarships()}
          </motion.div>
        )}
        {view === 'internships' && (
          <motion.div
            key="internships"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderInternships()}
          </motion.div>
        )}
        {view === 'campusmap' && (
          <motion.div
            key="campusmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderCampusMap()}
          </motion.div>
        )}
        {view === 'lostandfound' && (
          <motion.div
            key="lostandfound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderLostAndFound()}
          </motion.div>
        )}
        {view === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderEvents()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl bg-amber-500 text-black font-bold shadow-2xl shadow-amber-900/40 flex items-center gap-3 cursor-pointer hover:bg-amber-400 transition-colors"
            onClick={() => {
              setActiveRoom(toast.roomId);
              setView('messenger');
              setToast(null);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
              <MessageCircle size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-70 uppercase tracking-wider">New Notification</span>
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setToast(null); }}
              className="ml-2 p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation Overlay (Mobile) */}
      {!isLoggedIn && (
        <div className="fixed top-6 right-6 z-50 md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-full bg-amber-500 text-black shadow-lg"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-8 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Home</button>
              <button onClick={() => { setView('explorer'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Campuses</button>
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
