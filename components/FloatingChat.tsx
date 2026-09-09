import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';
export default function FloatingChat(){return <Link className="floatingChat" href="/chatbot" aria-label="Buka Asisten Puskesmas"><span className="floatingChatPulse"/><span className="floatingChatIcon"><MessageCircle size={21}/></span><span className="floatingChatLabel"><Sparkles size={13}/> Asisten</span></Link>}
