// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

// 导入组件
import AuthModal from './components/AuthModal'; 
import ProfileModal from './components/ProfileModal'; 
import AdminGallery from './components/AdminGallery';
import CompetitorTable from './components/CompetitorTable';
import ScheduleDetailModal from './components/ScheduleDetailModal';

import { 
  LogOut, ShieldCheck, Trophy, Calendar, ClipboardList, 
  Award, ChevronRight, LayoutGrid, Zap, Target, Search,
  Mail, Phone, MapPin, Instagram, Facebook, Globe, MessageCircle, ArrowUpRight
} from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('gallery'); // 管理员子面板状态
  const [publicImages, setPublicImages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 管理员权限核对
        const userDoc = await getDoc(doc(db, "users", currentUser.uid)); 
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
        }
      } else { setIsAdmin(false); }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setPublicImages(querySnapshot.docs.map(doc => doc.data().url));
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans scroll-smooth flex flex-col text-left">
      {/* 顶部导航 */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/50">
        <div className="flex items-center gap-3 text-cyan-400 font-black text-2xl tracking-tighter">
          <Trophy className="w-8 h-8 shadow-[0_0_15px_rgba(34,211,238,0.3)]" /> BIS 2026
        </div>
        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 font-mono">
          <button type="button" onClick={() => document.getElementById('rules-section').scrollIntoView()}>参赛须知</button>
          <button type="button" onClick={() => document.getElementById('gallery-section').scrollIntoView()}>精彩瞬间</button>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-cyan-500 font-mono font-bold uppercase">{user.email.split('@')[0]}</span>
              <button onClick={() => signOut(auth)} className="text-slate-500 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsAuthOpen(true)} className="bg-cyan-500 text-black px-6 py-2 font-black text-xs hover:bg-cyan-400 transition-all skew-x-[-15deg]">
              <div className="skew-x-[15deg]">选手登录 / 注册</div>
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 flex-grow">
        <section className="text-center mb-32 relative py-20">
          <div className="inline-block px-4 py-1 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 mb-8 tracking-[.5em] uppercase font-bold bg-cyan-950/20">
            ● 創智機械人學會 (香港) 主办
          </div>
          <h1 className="text-7xl lg:text-9xl font-black mb-10 tracking-tighter leading-none uppercase">智创无限 · <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-italic italic">巅峰竞技</span></h1>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button type="button" onClick={() => { if(!user) setIsAuthOpen(true); else setIsProfileOpen(true); }} className="px-12 py-6 bg-cyan-500 text-black font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              立即报名参赛 <ArrowUpRight className="w-6 h-6" />
            </button>
            <button type="button" onClick={() => setIsScheduleOpen(true)} className="px-12 py-6 border border-slate-800 font-bold text-xl hover:bg-white/5 transition-colors">探索详细赛程</button>
          </div>
        </section>

        {/* 🎯 管理员控制台：优化子面板切换，零跳转体验 */}
        {isAdmin && (
          <section className="mb-32 border border-cyan-500/20 rounded-3xl p-10 bg-slate-900/20 backdrop-blur-md relative overflow-hidden min-h-[500px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
              <h2 className="text-xl font-bold text-cyan-400 uppercase italic tracking-widest flex items-center gap-2 font-mono underline underline-offset-8 decoration-cyan-500/30">
                <ShieldCheck className="w-5 h-5" /> BIS_ADMIN_DASHBOARD
              </h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-slate-800">
                <button type="button" onClick={() => setActiveAdminTab('gallery')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeAdminTab === 'gallery' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}>
                  现场照片管理
                </button>
                <button type="button" onClick={() => setActiveAdminTab('users')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeAdminTab === 'users' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}>
                  选手报名名单
                </button>
              </div>
            </div>
            {/* 内容区域无刷新切换 */}
            <div className="transition-all duration-300">
              {activeAdminTab === 'gallery' ? <AdminGallery /> : <CompetitorTable />}
            </div>
          </section>
        )}

        {/* 找回：参赛须知 & 注意事项 */}
        <section id="rules-section" className="mb-32 scroll-mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          <div className="p-12 bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ClipboardList className="w-32 h-32" /></div>
            <div className="flex items-center gap-3 mb-10 text-cyan-400">
              <ClipboardList className="w-8 h-8" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">参赛须知 / RULES</h3>
            </div>
            <ul className="space-y-8 relative z-10">
              <li className="flex gap-5 items-start"><Target className="text-cyan-500 w-6 h-6 mt-1 shrink-0" /><p className="text-slate-400 text-lg font-light leading-relaxed">机器人必须基于自主研发，严禁使用商用成品参赛。</p></li>
              <li className="flex gap-5 items-start"><Zap className="text-cyan-500 w-6 h-6 mt-1 shrink-0" /><p className="text-slate-400 text-lg font-light leading-relaxed">电池电压不得超过 48V，严禁使用任何内燃动力系统。</p></li>
              <li className="flex gap-5 items-start"><LayoutGrid className="text-cyan-500 w-6 h-6 mt-1 shrink-0" /><p className="text-slate-400 text-lg font-light leading-relaxed">机器人最大展开尺寸不得超过 1000mm x 1000mm。</p></li>
            </ul>
          </div>
          <div className="p-12 bg-cyan-500/5 border border-cyan-400/20 rounded-[2rem] flex flex-col justify-center text-center">
            <Award className="w-20 h-20 text-cyan-400 mx-auto mb-8 animate-pulse" />
            <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white font-italic italic">总奖金池 <br /> <span className="text-cyan-400 font-mono">$250,000</span></h3>
            <p className="text-slate-400 text-lg font-light">冠军将获得 $100,000 奖励及全方位的技术支持。</p>
          </div>
        </section>

        {/* 精彩瞬间展示 */}
        <section id="gallery-section" className="pt-24 border-t border-slate-900 text-left">
          <div className="flex items-center gap-4 mb-16"><LayoutGrid className="w-10 h-10 text-cyan-500" /><h2 className="text-5xl font-black uppercase tracking-tighter">精彩瞬间 SHOWCASE</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {publicImages.map((url, index) => (
              <div key={index} className="aspect-[3/4] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-2xl hover:border-cyan-500/50 transition-all"><img src={url} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" /></div>
            ))}
          </div>
        </section>
      </main>

      {/* 🚀 最终版专业注脚：創智機械人學會 (香港) */}
      <footer className="bg-black border-t border-white/10 pt-24 pb-12 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            {/* 学会介绍 */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex flex-col gap-2 text-cyan-400 font-black text-3xl tracking-tighter uppercase italic">
                <span>創智機械人學會 (香港)</span>
                <span className="text-[10px] text-slate-500 not-italic uppercase tracking-[0.3em] font-bold">Botificial Intelligence Society (Hong Kong)</span>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed max-w-sm">
                由创智人发起，致力于在全港及全球范围推广前沿机器人教育，激发青少年的机械创造潜能与逻辑思维能力。
              </p>
              <div className="flex gap-4"><a href="https://wa.me/85262190414" target="_blank" rel="noreferrer" className="p-3 bg-slate-900 rounded-xl hover:text-green-400 border border-white/5 transition-all shadow-xl"><MessageCircle className="w-6 h-6" /></a></div>
            </div>

            {/* 官方联络 */}
            <div className="md:col-span-5 md:col-start-8 space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-4 italic underline underline-offset-4 decoration-cyan-500/50">联络我们 / CONTACT</h4>
              <div className="space-y-8 font-mono text-xs text-slate-400">
                <div className="flex items-start gap-4 group cursor-pointer hover:text-white transition-colors"><Mail className="text-cyan-500 w-5 h-5 shrink-0" /> <div><p className="text-[8px] text-slate-600 mb-1 uppercase font-bold">电子邮箱 / Email</p> 2024bishk@gmail.com</div></div>
                <div className="flex items-start gap-4 group cursor-pointer hover:text-white transition-colors"><Phone className="text-cyan-500 w-5 h-5 shrink-0" /> <div><p className="text-[8px] text-slate-600 mb-1 uppercase font-bold">WhatsApp</p> +852 6219 0414</div></div>
                <div className="flex items-start gap-4 group cursor-pointer hover:text-white transition-colors"><MapPin className="text-cyan-500 w-5 h-5 shrink-0" /> <div><p className="text-[8px] text-slate-600 mb-1 uppercase font-bold">学会地址 / Address</p> Rm 1511, 15/F, Blk B, Galaxy Factory Building, <br /> 25-27 Lup Hop Street, KLN, Hong Kong</div></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-700 font-bold uppercase pt-10 border-t border-white/5 font-mono tracking-widest flex justify-between items-center">
            <span>© 2026 創智機械人學會 (香港)</span>
            <span className="text-slate-800 opacity-50 select-none">BIS_ROBOT_CORE_SYSTEM_v4.0</span>
          </p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ScheduleDetailModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
}

export default App;