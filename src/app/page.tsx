import Link from 'next/link'
import { PenTool, Target, Database, Heart, Map, FileText, ArrowRight, UserPlus, Settings2, Sparkles, Play } from 'lucide-react'

const tools = [
  { icon: PenTool, name: 'Fundraising Tekstforfatter', description: 'Skriv appeller, e-mails og breve der virker' },
  { icon: Target, name: 'Strategi Arkitekt', description: 'Byg en evidensbaseret fundraising-strategi' },
  { icon: Database, name: 'Datarensning & Formatering', description: 'Rens og formater donor- og medlemsdata' },
  { icon: Heart, name: 'Stewardship Planner', description: 'Design en plan for donorpleje og tak' },
  { icon: Map, name: 'Støtterejse Designer', description: 'Kortlæg rejsen fra første gave til loyal ambassadør' },
  { icon: FileText, name: 'Case for Support Builder', description: 'Skab en overbevisende sag for støtte' },
]

const steps = [
  { icon: UserPlus, title: 'Opret din profil', description: 'Fortæl os om jeres organisation, mission og kommunikationsstil.' },
  { icon: Settings2, title: 'Vælg et værktøj', description: 'Vælg det AI-værktøj der passer til din aktuelle opgave.' },
  { icon: Sparkles, title: 'Generér og forfin', description: 'Få professionelt output tilpasset jeres organisation på sekunder.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/magnetic-logo.svg" alt="Magnetic" width={120} height={32} />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">Log ind</Link>
            <Link href="/signup" className="text-sm text-white font-medium px-5 py-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: '#D946A8' }}>Kom i gang gratis</Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-16 overflow-hidden">
        <img src="/hero-bg.png" alt="" aria-hidden="true" className="absolute top-0 right-0 w-[400px] h-[400px] object-contain pointer-events-none select-none opacity-80" style={{ zIndex: 0 }} />
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-24 text-center" style={{ zIndex: 1 }}>
          <h1 className="text-4xl md:text-[56px] font-bold text-[#1a1a1a] leading-[1.1] mb-6">Din AI-drevet fundraising værktøjskasse</h1>
          <p className="text-[#666] text-lg mb-10 max-w-xl mx-auto leading-relaxed">Få adgang til den samme kvalitet af strategisk tænkning og kreativt output, som større velgørenhedsorganisationer får fra bureauer og konsulenter.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white font-medium px-7 py-3 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: '#D946A8' }}>Kom i gang gratis<ArrowRight className="w-4 h-4" /></Link>
            <Link href="/login" className="inline-flex items-center px-7 py-3 rounded-full border border-[#ddd] text-[#333] font-medium text-sm hover:bg-gray-50 transition-colors">Log ind</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">Dine værktøjer</h2>
            <p className="text-[#666] text-base">Seks specialiserede AI-værktøjer der dækker hele din fundraising-rejse.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <div key={index} className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl p-6 hover:shadow-md transition-all duration-200 hover:border-[#e0e0e0]">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#FDE8F4' }}>
                    <Icon className="w-5 h-5" style={{ color: '#D946A8' }} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-1.5">{tool.name}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{tool.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F7F7F5]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1a1a1a] text-center mb-14">Sådan virker det</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#FDE8F4' }}>
                    <Icon className="w-6 h-6" style={{ color: '#D946A8' }} />
                  </div>
                  <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">Se hvordan det virker</h2>
            <p className="text-[#666] text-base max-w-lg mx-auto">Se en kort video om hvordan Magnetic Fundraising Toolkit kan hjælpe jeres organisation.</p>
          </div>
          <div className="aspect-video rounded-3xl flex flex-col items-center justify-center gap-3 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5E6F0, #EDE4F0, #E8E0F0)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#D946A8' }}>
              <Play className="w-7 h-7 text-white fill-white ml-0.5" />
            </div>
            <p className="text-[#888] text-sm">Klik for at afspille</p>
          </div>
        </div>
      </section>
      <footer className="bg-[#F7F7F5] border-t border-[#EBEBEB] pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm mb-3">Magnetic Toolkit</h4>
              <p className="text-sm text-[#888] leading-relaxed">AI-drevet fundraising værktøjer til danske velgørenhedsorganisationer.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm mb-3">Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Forside</Link></li>
                <li><Link href="/login" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Log ind</Link></li>
                <li><Link href="/signup" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Opret konto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm mb-3">Juridisk</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Privatlivspolitik</a></li>
                <li><a href="#" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Vilkår og betingelser</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] pt-6 text-center">
            <p className="text-xs text-[#aaa]">© 2026 Magnetic Fundraising Toolkit. Drevet af AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}