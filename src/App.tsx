import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Menu, 
  X,
  ChevronRight,
  BarChart3,
  Mic2,
  FileText,
  Zap,
  Layout,
  TrendingUp,
  LogIn,
  LogOut,
  User as UserIcon,
  GraduationCap,
  Award,
  Clapperboard,
  Trophy,
  History,
  Eye,
  ChevronLeft,
  Cpu,
  Brain
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, setDoc, doc } from './lib/firebase';
import { cn } from './lib/utils';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  const reportImages = [
    '/report_sample.png',
    '/report_sample2.png',
    '/report_sample3.png',
    '/report_sample4.png',
    '/report_sample5.png',
  ];

  const CTA_LINK = "https://forms.gle/EbWmFZmAGkKqfiMC9";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReportIndex((prev) => (prev + 1) % reportImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reportImages.length]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      
      if (currentUser) {
        // Save user profile to Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn("User closed the login popup before completing the process.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const diagnosisMetrics = [
    { icon: Layout, title: "송폼 구조", desc: "송폼이 가장 중요합니다. 송폼만 바꿔도 곡의 완성도가 눈에 띄게 올라갑니다.", color: "text-violet-500 bg-violet-50" },
    { icon: Mic2, title: "멜로디 흐름", desc: "좋은 멜로디, 꽂히는 멜로디는 특징이 있습니다.", color: "text-rose-500 bg-rose-50" },
    { icon: FileText, title: "가사", desc: "곡의 무드와 멜로디에 가사가 적합한지 판단합니다.", color: "text-amber-500 bg-amber-50" },
    { icon: Music, title: "장르 적합성", desc: "해당 장르의 필수 리듬과 편곡 요소를 확인 후 진단합니다.", color: "text-indigo-500 bg-indigo-50" },
    { icon: BarChart3, title: "사운드 퀄리티", desc: "믹싱/마스터링 관점에서의 사운드 완성도를 체크합니다.", color: "text-emerald-500 bg-emerald-50" },
    { icon: TrendingUp, title: "상업성", desc: "해당 곡이 릴스, 플레이리스트 등 대중적으로 흥행 가능성이 있을지 진단합니다.", color: "text-cyan-500 bg-cyan-50" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Music className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MusiFit</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-sm font-medium text-slate-700">{user.displayName}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {isLoggingIn ? '로그인 중...' : '로그인'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-900">{user.displayName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-slate-600 font-medium"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5" />
                    )}
                    {isLoggingIn ? '로그인 중...' : '구글로 시작하기'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6 border border-blue-100">
              AI Music Professional Diagnosis
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.15] mb-8 tracking-tight">
              여러분의 AI 음악,<br />
              <span className="text-blue-600">여러분들에게만 좋게 들리는 건 아닐까요?</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              어딘가 2% 아쉬운데,<br />
              어디를 수정해야 할지 막막하셨나요?<br />
              <span className="font-bold underline decoration-blue-200 underline-offset-4 text-slate-900 bg-yellow-100/80 px-1 rounded-sm">JYP, KBS, 안테나</span> 등 대형기획사/방송사 협업 이력의 현업 작곡가가 도와드릴게요.<br /><br />
              음악업계에서 <span className="font-bold underline decoration-blue-200 underline-offset-4 text-slate-900">10년간 활동한 노하우</span>를 토대로,<br />
              여러분의 문제를 해결할 <span className="font-bold underline decoration-blue-200 underline-offset-4 text-slate-900 bg-yellow-100/80 px-1 rounded-sm">6가지 정밀 진단과 '마법의 수정 프롬프트'</span>를 제공합니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={CTA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                뮤지핏 AI음악 진단 신청하기
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Major History Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/history-bg.jpg" 
            alt="History Background" 
            className="w-full h-full object-cover object-center opacity-60"
            referrerPolicy="no-referrer"
          />
          {/* Dark Overlay for content separation */}
          <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px]" />
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl opacity-50" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              뮤지핏 주요이력
            </h2>
            <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Major Artist Works */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 hover:border-blue-400/30 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                <Music className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Major Works
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">Artist</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2"><span>•</span> <b>NIZIU</b> - rise up (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>미주</b> - movie star (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>김재중</b> - 묻고싶다 (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>김나영</b> - 우린 헤어지지 않았을까 (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>뱀뱀X마인드브릿지</b> - pick it (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>CSR</b> - blueway / 열아홉 (작/편곡)</li>
                <li className="flex gap-2"><span>•</span> <b>뱀뱀X마인드브릿지</b> - pick it (작/편곡)</li>
                <li className="flex gap-2 text-slate-500">...외 루네이트, 카야, YUL2, ERG, 엔카이브 등 다수</li>
              </ul>
            </motion.div>

            {/* OST Works */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 hover:border-rose-400/30 transition-all group"
            >
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all">
                <Clapperboard className="w-6 h-6 text-rose-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Official OST
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/20">Media</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2"><span>•</span> <b>KBS [은수 좋은 날]</b> - Dejavu</li>
                <li className="flex gap-2"><span>•</span> <b>KBS [불후의명곡]</b> - 바다에 누워</li>
                <li className="flex gap-2"><span>•</span> <b>디즈니+ [화인가스캔들]</b> - I don't know why</li>
                <li className="flex gap-2"><span>•</span> <b>JTBC [비밀은 없어]</b> - I know</li>
                <li className="flex gap-2"><span>•</span> <b>WAVE [진용진의 버튼게임]</b> - devil</li>
                <li className="flex gap-2"><span>•</span> <b>MBN [돌싱글즈7]</b> - Day's gone</li>
                <li className="flex gap-2"><span>•</span> <b>MBN [허식당]</b> - 같이 걸을까</li>
                <li className="flex gap-2"><span>•</span> <b>Project 7 (JTBC 아이돌 오디션)</b> - trigger</li>
              </ul>
            </motion.div>

            {/* Public & Brand */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 hover:border-amber-400/30 transition-all group"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:bg-amber-600 group-hover:border-amber-500 transition-all">
                <Trophy className="w-6 h-6 text-amber-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Brand & Special
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">Project</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2"><span>•</span> <b>2026 iM금융오픈</b> 테마송 제작</li>
                <li className="flex gap-2"><span>•</span> <b>수원시 공식 마스코트</b> 테마송 제작</li>
                <li className="flex gap-2"><span>•</span> <b>평택시 공식채널</b> 골목 소개 테마송 제작</li>
                <li className="flex gap-2"><span>•</span> <b>블레이드M</b> 메인 OST 프로듀싱</li>
                <li className="flex gap-2"><span>•</span> <b>달빛고민상담소</b> 메인 OST 프로듀싱</li>
                <li className="flex gap-2"><span>•</span> <b>성동문화회관</b> '테디의 비트' 음원총괄제작</li>
                <li className="flex gap-2"><span>•</span> <b>청년순대국</b> 브랜드 홍보음악 프로듀싱</li>
                <li className="flex gap-2"><span>•</span> <b>마루초등학교</b> 교가 제작</li>
              </ul>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-slate-400 text-sm"
          >
            외 30여 곡 이상의 정규 앨범 및 싱글 작/편곡 참여
          </motion.p>
        </div>
      </section>

      {/* Testimonial Marquee Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              이미 수많은 창작자가 <span className="font-bold underline decoration-blue-500 decoration-4 underline-offset-4 bg-yellow-100/80 px-1 rounded-sm">뮤지핏의 정밀 진단</span>을 경험했습니다
            </h2>
            <p className="text-slate-500 text-lg">실제 의뢰자들의 검증된 실제 후기를 확인해보세요.</p>
          </motion.div>
        </div>

        {/* Marquee Row */}
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1630] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, index) => (
              <div 
                key={index} 
                className="w-[300px] h-[400px] shrink-0 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
              >
                <img 
                  src={`/review${item}-1.png`} 
                  alt={`Review ${item}`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/chat${item}/300/600`;
                  }}
                />
              </div>
            ))}
          </motion.div>

          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                "내가 만든 AI 음악, <br />
                <span className="text-blue-600">몇 번이나 반복해서 들으셨나요?"</span>
              </h2>
              
              <div className="space-y-6 lg:mb-10">
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  들을수록 멜로디가 입에 붙고,<br />
                  이대로 발매해도 차트에 오를 것 같은 설렘.<br />
                  느껴보셨죠?
                </p>

                <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    하지만 우리는,<br />
                    음악에 반복 노출될수록 그 곡을 <span className="font-bold underline decoration-blue-200 underline-offset-4 text-slate-900">'좋은 곡'</span>으로 착각한다고 합니다.<br />
                    여러분 음악의 완성도를 위해 잠시 한 발짝 물러서서 바라보세요.<br />
                    뮤지핏의 <span className="font-bold underline decoration-blue-200 underline-offset-4 text-slate-900 bg-yellow-100/80 px-1 rounded-sm">'객관적인 귀'</span>로 여러분의 음악을 한층 업그레이드 시켜드릴게요.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden relative group">
                  <img 
                    src="/paper.png" 
                    alt="Scientific Evidence" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/research/800/600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-lg mb-2">Exposure effects on music preference and recognition(1998)</p>
                    <p className="text-white/80 text-sm">반복 노출이 음악적 선호도에 미치는 영향에 대한 연구 자료</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-blue-800 font-bold text-lg mb-1">
                    💡 반복 노출이 음악 선호도에 미치는 영향에 대한 논문<br />
                    (Exposure effects on music preference and recognition (Memory & Cognition, 1998))
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Methodology Section */}
      <section className="py-24 bg-slate-950 overflow-hidden relative border-y border-white/5">
        {/* 3D Dimensional Background Elements */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[160px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] -ml-64 -mb-64" />
        
        {/* Architectural Grid for Depth */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex shrink-0 items-center justify-center shadow-lg shadow-blue-600/20">
                      <GraduationCap className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">현직 K-POP 프로듀서의 직강</h3>
                      <p className="text-blue-100/70 leading-relaxed">
                        실제 상업 음반을 제작하는 대표 작곡가가 곡의 본질을 직접 진단하고, 
                        수년간 쌓아온 장르별 핵심 노하우를 피드백에 녹여냅니다.
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/10" />
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex shrink-0 items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Brain className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">1,000+ 곡의 피드백 학습 데이터</h3>
                      <p className="text-indigo-100/70 leading-relaxed">
                        대표자의 노하우를 바탕으로 1,000건 이상의 실제 피드백 사례를 학습한 
                        뮤지핏 AI가 당신의 음악을 가장 논리적이고 체계적으로 정리하여 리포트를 구성합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full font-bold text-sm mb-6 border border-blue-500/30">
                <Sparkles className="w-4 h-4" />
                The MusiFit Methodology
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-[1.2]">
                K-POP 프로듀서의 안목,<br />
                <span className="text-blue-400">데이터의 논리</span>로 완성되다
              </h2>
              <p className="text-blue-100/80 text-lg mb-8 leading-relaxed">
                단순한 감상평이 아닙니다. 현직 작곡가의 차가운 분석과 1,000건 이상의 방대한 데이터를 기반으로, 
                누구보다 객관적으로 당신의 음악을 한 단계 더 도약시킵니다.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="px-5 py-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-200 font-bold text-sm tracking-wide shadow-inner">
                  #현직작곡가진단
                </div>
                <div className="px-5 py-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-200 font-bold text-sm tracking-wide shadow-inner">
                  #1000건데이터학습
                </div>
                <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-slate-300 font-bold text-sm tracking-wide shadow-inner">
                  #객관적레포트
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              뮤지핏이 6가지 핵심 지표를 제시해드릴게요.
            </h2>
            <p className="text-slate-600 text-lg">곡의 장점은 극대화하고, 약점은 보완해드립니다.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosisMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
              >
                <div className={`w-12 h-12 ${metric.color.split(' ')[1]} rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-300`}>
                  <metric.icon className={`w-6 h-6 ${metric.color.split(' ')[0]} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{metric.title}</h3>
                <p className="text-slate-500 leading-relaxed">{metric.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Flow Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 underline decoration-blue-500/30 underline-offset-8">
              뮤지핏 리포트는 이렇게 완성됩니다
            </h2>
            <p className="text-slate-500 text-lg">단순한 감상이 아닌, 체계적인 시스템을 거쳐 탄생합니다.</p>
          </motion.div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-blue-100/50 rounded-[2rem] blur-2xl group-hover:bg-blue-200/50 transition-colors" />
                <img 
                  src="/step1.jpg" 
                  alt="Step 1" 
                  className="relative rounded-3xl shadow-2xl border border-slate-100 z-10 w-full object-cover aspect-video"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-blue-600 font-black text-6xl opacity-25 block mb-4 italic leading-none">STEP 01</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">신청 및 음원 제출/결제 진행</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  '진단 + 프롬프트 신청하기' 버튼을 클릭해 분석할 음원과 관련 자료를 작성해 주세요. 
                  설문 하단에 적힌 결제정보로 결제를 진행해주시면 바로 진단이 시작됩니다.
                </p>
                <a 
                  href={CTA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 group inline-flex"
                >
                  진단 + 프롬프트 신청하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:order-2 relative group"
              >
                <div className="absolute -inset-4 bg-indigo-100/50 rounded-[2rem] blur-2xl group-hover:bg-indigo-200/50 transition-colors" />
                <img 
                  src="/step2.png" 
                  alt="Step 2" 
                  className="relative rounded-3xl shadow-2xl border border-slate-100 z-10 w-full object-cover aspect-video"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:order-1"
              >
                <span className="text-indigo-600 font-black text-6xl opacity-25 block mb-4 italic leading-none">STEP 02</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">프로듀서의 정밀 수기 진단</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  뮤지핏 프로듀서가 음악을 직접 듣고 분석합니다. 
                  뮤지핏의 6가지 핵심 지표를 바탕으로 여러분 곡의 장점을 극대화하고 약점을 보완할 수기 피드백을 작성합니다.
                </p>
              </motion.div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-purple-100/50 rounded-[2rem] blur-2xl group-hover:bg-purple-200/50 transition-colors" />
                <img 
                  src="/step3.png" 
                  alt="Step 3" 
                  className="relative rounded-3xl shadow-2xl border border-slate-100 z-10 w-full object-cover aspect-video"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-purple-600 font-black text-6xl opacity-25 block mb-4 italic leading-none">STEP 03</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">데이터 기반 시스템 최종 리포트 발행</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  1,000건 이상의 프로듀서 작업 노하우+피드백 노하우가 집약된 뮤지핏 시스템을 다시 거친 뒤, 최종 리포트가 완성됩니다. 
                  피드백의 논리를 강화하고, 곡 수정을 위한 팁과 <b>즉시 적용 가능한 수정 프롬프트</b>를 포함해 리포트를 전송해 드립니다.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm mb-4">
              <Eye className="w-4 h-4" />
              미리보기
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              실제 피드백 리포트 예시
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              전문가 팀이 직접 분석하여 작성한 상세 리포트로 당신의 음악을 객관적으로 진단해 드립니다.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto relative group">
            {/* Slider Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReportIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-white p-2"
                >
                  <img 
                    src={reportImages[currentReportIndex]} 
                    alt={`Feedback Report Example ${currentReportIndex + 1}`} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/report/600/800';
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2 z-10">
                {reportImages.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentReportIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentReportIndex ? 'bg-blue-600 w-8' : 'bg-slate-300 w-3'
                    }`} 
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <button 
                onClick={() => setCurrentReportIndex((prev) => (prev - 1 + reportImages.length) % reportImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-slate-800 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentReportIndex((prev) => (prev + 1) % reportImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-slate-800 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Label Decorations */}
            <div className="absolute -top-6 -right-6 lg:-right-12 hidden md:block">
              <motion.div 
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-yellow-400 text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-lg border-2 border-slate-900"
              >
                100% 리얼 피드백!
              </motion.div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex shrink-0 items-center justify-center text-white font-bold">1</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">상세한 6지표 점수</h4>
                <p className="text-slate-500 text-sm">각 항목별 장단점을 점수로 한눈에 파악</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex shrink-0 items-center justify-center text-white font-bold">2</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">전문가 코멘트</h4>
                <p className="text-slate-500 text-sm">음악적 이론을 바탕으로 한 구체적인 피드백</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex shrink-0 items-center justify-center text-white font-bold">3</div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">프롬프트 가이드</h4>
                <p className="text-slate-500 text-sm">리포트 하단에 즉시 적용 가능한 수정안 포함</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/background.jpg" 
            alt="Music Studio Background" 
            className="w-full h-full object-cover object-center opacity-60"
            referrerPolicy="no-referrer"
          />
          {/* Color Overlay for consistency and legibility */}
          <div className="absolute inset-0 bg-blue-900/25 backdrop-blur-[0.5px]" />
          
          {/* Subtle Light Accents */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="text-white mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight">
              피드백에서 끝나지 않습니다.<br />
              실제 수정을 거칠 수 있는<br />
              <span className="font-bold underline decoration-yellow-600 underline-offset-8 bg-yellow-400 px-2 rounded-md text-slate-900">'프롬프트 솔루션'</span>도 제공됩니다.
            </h2>

            {/* Prompt Generator Mockup - Higher transparency and Layered effect */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 text-left max-w-2xl mx-auto mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-slate-500 text-xs font-mono">prompt_generator.js</span>
              </div>
              <div className="font-mono text-xs md:text-sm space-y-4">
                <p className="text-blue-400">{"// MusiFit Custom Prompt"}</p>
                <p className="text-slate-300">
                  <span className="text-purple-400">Style:</span> [K-Pop, Future Bass, High Energy]
                </p>
                <p className="text-slate-300">
                  <span className="text-purple-400">Structure:</span> [Intro - Verse - Pre-Chorus - Chorus(Explosive) - Bridge - Outro]
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <span className="text-purple-400">Instructions:</span> "Enhance the sub-bass presence, add syncopated synth stabs in the chorus, ensure the melody peaks at the 5th interval for maximum impact..."
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] md:text-xs">Prompt generated successfully.</span>
                  <button className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Copy Prompt
                  </button>
                </div>
              </div>
            </motion.div>

            <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              진단 리포트와 함께 제공되는 <span className="font-bold underline underline-offset-4">'맞춤형 수정 프롬프트'</span>를 여러분이 쓰시는 AI(Suno, Udio 등)에 그대로 복사+붙여넣기 하세요.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                'Suno Studio 내에서 사용 권장',
                '장르별 특화된 전문 음악 용어 적용',
                '즉각적인 퀄리티 향상'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  <span className="font-medium text-blue-100">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
            내 음악이 진짜 음원 차트에{"\n"}올라갈 수 있을지 궁금하다면?
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            수백만 원의 레슨비, 수십만 원의 편곡비를 아끼세요.{"\n"}
            뮤지핏의 단 한 번의 진단으로 여러분의 음악은 완전히 다른 레벨이 됩니다.
          </p>
          <a 
            href={CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-8 md:px-10 py-5 rounded-full text-lg md:text-xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto leading-tight w-fit"
          >
            <span className="md:hidden">지금 바로 진단 + 프롬프트<br />신청하기</span>
            <span className="hidden md:inline">지금 바로 진단 + 프롬프트 신청하기</span>
            <ChevronRight className="w-6 h-6 shrink-0" />
          </a>
          
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-slate-100 pt-16">
            <div>
              <p className="text-3xl font-black text-slate-900 mb-1">98%</p>
              <p className="text-sm text-slate-500 font-medium">진단 만족도</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 mb-1">1,200+</p>
              <p className="text-sm text-slate-500 font-medium">누적 진단 곡 수</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 mb-1">12h</p>
              <p className="text-sm text-slate-500 font-medium whitespace-pre-wrap">진단 소요시간</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Music className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900">MusiFit</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 MusiFit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
