import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
interface Props { title: string; description: string; links: Array<{label:string;href:string}>; }
export default function AppPreview({ title, description, links }: Props) {
  return <div className="min-h-screen bg-[#FFFDF8] p-6 sm:p-10"><div className="mx-auto max-w-6xl space-y-8"><div className="rounded-3xl bg-[#111827] p-8 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">UI Preview • No API access</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{links.map((item)=><Link key={item.href} to={item.href} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"><CheckCircle2 className="h-5 w-5 text-[#06D6A0]"/><p className="mt-4 font-semibold text-slate-900">{item.label}</p><p className="mt-1 text-xs text-slate-500">Open page</p></Link>)}</div></div></div>;
}
