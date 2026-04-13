import Link from 'next/link'
import {
  PenTool,
  Target,
  Database,
  Heart,
  Map,
  FileText,
  Sparkles,
  Shield,
  Globe2,
  Lock,
  ArrowRight,
} from 'lucide-react'

const tools = [
  {
    icon: PenTool,
    name: 'Fundraising Tekstforfatter',
    description: 'Skriv appeller, e-mails og breve der virker',
  },
  {
    icon: Target,
    name: 'Strategi Arkitekt',
    description: 'Byg en evidensbaseret fundraising-strategi',
  },
  {
    icon: Database,
    name: 'Datarensning & Formatering',
    description: 'Rens og formater donor- og medlemsdata',
  },
  {
    icon: Heart,
    name: 'Arv og Testamente',
    description: 'Start og udvikle et arvsprogram',
  },
  {
    icon: Map,
    name: 'Støtterrejse Designer',
    description: 'Kortlæg og forbedr støtteres rejser',
  },
  {
    icon: FileText,
    name: 'Søg fonde eller partnerskabe',
    description: 'Skab overbevisende cases for støtte',
  },
]

const steps = [
  {
    number: '1',
    title: 'Opret din profil',
    description: 'Fortæl os om din organisation, og vores AI lærer jeres stemme og kontekst',
  },
  {
    number: '2',
    title: 'Vælg et værktøj',
    description: 'Seks specialiserede AI-værktøjer til fundraising, strategi og data',
  },
  {
    number: '3',
    title: 'Generér og forfin',
    description: 'Få professionelt output på sekunder, tilpas det, og gem det i dit bibliotek',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E8E8E4]">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <img src="/magnetic-logo.svg" alt="Magnetic" width={140} height={36} />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors font-medium text-sm">
              Log ind
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-white text-sm font-medium rounded-full transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #E87EAC, #6B7FD4)' }}
            >
              Kom i gang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden" style={{ minHeight: '580px' }}>
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute top-0 right-0 h-full pointer-events-none select-none"
          style={{ width: '50%', objectFit: 'cover', objectPosition: 'left center', zIndex: 0 }}
        />
        <div className="relative w-full max-w-[1200px] mx-auto px-6 py-28" style={{ zIndex: 1 }}>
          <div className="max-w-[560px]">
            <span className="inline-block border border-[#E8E8E4] text-[#6b6b6b] text-xs font-medium px-4 py-1.5 rounded-full mb-6">
              AI-drevet fundraising
            </span>
            <h1 className="text-[34px] md:text-[52px] leading-[1.1] font-semibold text-[#1a1a1a] mb-6">
              AI-drevet værktøjskasse for danske fundraisere
            </h1>
            <p className="text-[18px] text-[#6b6b6b] leading-relaxed mb-8 max-w-[460px]">
              Skriv bedre appeller, byg stærkere strategier og forstå dine støtter — med AI der kender din organisation
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #E87EAC, #6B7FD4)' }}
              >
                Kom i gang gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors hover:underline underline-offset-2">
                Log ind →
              </Link>
            </div>
            <p className="text-xs text-[#6b6b6b] mt-4">Ingen kreditkort påkrævet</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#F7F7F5]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-semibold text-[#1a1a1a] mb-4">
              Seks værktøjer til hele fundraising-rejsen
            </h2>
            <p className="text-[18px] text-[#6b6b6b]">
              Fra strategi til tekst, fra data til donorpleje
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-[#E8E8E4] rounded-2xl p-7 transition-shadow duration-200 hover:shadow-lg cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-5"
                    style={{ background: 'linear-gradient(135deg, #E87EAC, #6B7FD4)' }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-[14px] text-[#6b6b6b] leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-semibold text-[#1a1a1a] mb-4">
              Sådan virker det
            </h2>
            <p className="text-[18px] text-[#6b6b6b]">
              Tre enkle trin til bedre fundraising
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                <span
                  className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4"
                  style={{ background: 'linear-gradient(135deg, #E87EAC, #6B7FD4)' }}
                >
                  Trin {step.number}
                </span>
                <h3 className="text-[20px] font-semibold text-[#1a1a1a] mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] text-[#6b6b6b] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[36px] font-semibold text-[#1a1a1a] mb-4">
              Se hvordan det virker
            </h2>
            <p className="text-[18px] text-[#6b6b6b]">
              En hurtig introduktion til Magnetic Fundraising Toolkit
            </p>
          </div>
          <div className="aspect-video bg-[#F7F7F5] border-2 border-dashed border-[#E8E8E4] rounded-2xl flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E87EAC, #6B7FD4)' }}
            >
              <svg className="w-7 h-7 fill-white ml-1" viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <p className="text-[#6b6b6b] text-sm">Video kommer snart</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-[#F7F7F5]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-semibold text-[#1a1a1a] mb-4">
              Bygget til danske velgørende organisationer
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-[#6B7FD4]" />
              </div>
              <h3 className="font-semibold text-[15px] text-[#1a1a1a] mb-2">GDPR-venlig</h3>
              <p className="text-[14px] text-[#6b6b6b]">Fuld overholdelse af danske databeskyttelsesregler</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5 text-[#6B7FD4]" />
              </div>
              <h3 className="font-semibold text-[15px] text-[#1a1a1a] mb-2">Dansk sprog og kontekst</h3>
              <p className="text-[14px] text-[#6b6b6b]">AI der forstår dansk fundraising-kultur og terminologi</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-[#6B7FD4]" />
              </div>
              <h3 className="font-semibold text-[15px] text-[#1a1a1a] mb-2">Anthropic Claude AI</h3>
              <p className="text-[14px] text-[#6b6b6b]">Drevet af verdens mest avancerede AI-teknologi</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#6B7FD4]" />
              </div>
              <h3 className="font-semibold text-[15px] text-[#1a1a1a] mb-2">Dine data er dine egne</h3>
              <p className="text-[14px] text-[#6b6b6b]">Vi deler aldrig dine data med tredjeparter</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 text-white"
        style={{ background: 'linear-gradient(135deg, #E87EAC, #4FC9A4, #6B7FD4)' }}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2 className="text-[40px] font-semibold leading-tight mb-6">
            Klar til at skrive bedre fundraising?
          </h2>
          <p className="text-[18px] mb-10 opacity-90">
            Kom i gang gratis i dag — ingen kreditkort påkrævet
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#1a1a1a] font-semibold rounded-full transition-opacity hover:opacity-90"
          >
            Kom i gang gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ backgroundColor: '#F1FAEE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              Magnetic Fundraising Toolkit © 2026 · 
              <a href="#" className="hover:text-[#E63946] mx-1 transition-colors">Privatlivspolitik</a> · 
              <a href="#" className="hover:text-[#E63946] mx-1 transition-colors">Vilkår</a> · 
              <a href="#" className="hover:text-[#E63946] mx-1 transition-colors">Kontakt</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
