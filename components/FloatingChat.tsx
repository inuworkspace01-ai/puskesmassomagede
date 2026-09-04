import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
export default function FloatingChat(){return <Link className="floatingChat" href="/chatbot" aria-label="Buka asisten virtual"><MessageCircle size={21}/><span>Asisten</span></Link>}
