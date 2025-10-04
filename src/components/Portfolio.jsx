import React, { useEffect, useRef, useState } from 'react';
// FIX 2: Cleaned up unused Lucide imports
import { Linkedin, Mail, ChevronUp, Download } from 'lucide-react';

/* -------------------------
    Simple useInView hook
    ------------------------- */
function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* -------------------------
    CONSTANTS
    ------------------------- */
// FIX 1: Defined roles array OUTSIDE the component to prevent re-creation on every render
const TYPING_ROLES = ['CA Finalist', 'Auditor', 'Tax Expert', 'Finance Enthusiast'];

const PROFILE_IMAGE_PATH = '/assets/anjali.jpg'; // <-- YOUR IMAGE PATH
const RESUME_DOWNLOAD_PATH = '/assets/anjali_shukla_resume.pdf'; // <-- YOUR RESUME PATH

/* -------------------------
    Cyberpunk single-page
    ------------------------- */
const Portfolio = () => {
  const [showScroll, setShowScroll] = useState(false);

  // Scroll logic for Back to Top button
  useEffect(() => {
    const checkScrollTop = () => {
      // Show button after 300px scroll
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen antialiased text-gray-100 bg-[#06060a] relative overflow-x-hidden">
      <BackgroundVisuals />
      <Header />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-28 space-y-24">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </main>
      
      {/* Back to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#06b6d4]/80 text-black shadow-xl border border-[#9be7ff] hover:bg-[#06b6d4] transition transform hover:scale-110 z-50 back-to-top-glow"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <style>{css}</style>
    </div>
  );
};

/* -------------------------
    Background visuals
    ------------------------- */
const BackgroundVisuals = () => (
  <>
    {/* animated gradient blobs */}
    <div className="fixed -left-64 -top-40 w-[700px] h-[700px] rounded-full opacity-30 blur-[80px] bg-gradient-to-tr from-[#7c3aed] via-[#06b6d4] to-[#fb7185] animate-blob -z-10"></div>
    <div className="fixed right-[-200px] bottom-[-120px] w-[560px] h-[560px] rounded-full opacity-20 blur-[70px] bg-gradient-to-br from-[#f472b6] via-[#7c3aed] to-[#06b6d4] animate-blob animation-delay-3000 -z-10"></div>

    {/* thin scanlines */}
    <div className="pointer-events-none fixed inset-0 -z-5 opacity-5 bg-[repeating-linear-gradient(180deg,#ffffff05,#ffffff05_1px,#00000000_1px,#00000000_3px)]"></div>

    {/* subtle grid overlay */}
    <div className="pointer-events-none fixed inset-0 -z-20">
      <svg className="w-full h-full opacity-6" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff08" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </>
);

/* -------------------------
    Header (centered compact)
    ------------------------- */
const Header = () => {
  const [active, setActive] = useState('home');
  useEffect(() => {
    // Scroll listener logic could go here to update active state based on section in view
  }, []);
  const nav = ['home', 'about', 'education', 'skills', 'experience', 'contact'];
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-4 bg-[#0b0b10]/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#ffffff12] shadow-lg">
        <nav className="hidden md:flex items-center gap-2">
          {nav.map((n) => (
            <a
              key={n}
              href={`#${n}`}
              onClick={() => setActive(n)}
              className={`text-xs px-3 py-2 rounded-md transition ${
                active === n ? 'bg-[#0f1724] text-[#9be7ff] shadow-[0_6px_20px_-8px_rgba(99,102,241,0.45)]' : 'text-[#bfc9d6aa] hover:text-white'
              }`}
            >
              {n.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

/* -------------------------
    Hero Section with Typing Effect
    ------------------------- */
const Hero = () => {
  // Uses the static TYPING_ROLES constant

  // Typing state
  const [roleIndex, setRoleIndex] = useState(0); // Index of the current role string
  const [charIndex, setCharIndex] = useState(0); // Index of the current character
  const [display, setDisplay] = useState(''); // The string currently being displayed
  const [isDeleting, setIsDeleting] = useState(false); // Whether the text is currently being deleted

  useEffect(() => {
    const currentRole = TYPING_ROLES[roleIndex];
    let speed = isDeleting ? 40 : 90; // Deletion is faster than typing

    if (!isDeleting && charIndex <= currentRole.length) {
      // Typing phase
      const t = setTimeout(() => {
        setDisplay(currentRole.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, speed);
      return () => clearTimeout(t);
      
    } else if (!isDeleting && charIndex > currentRole.length) {
      // Hold phase after typing is complete
      const hold = setTimeout(() => {
        setIsDeleting(true);
      }, 1000); // Wait 1 second before deleting
      return () => clearTimeout(hold);
      
    } else if (isDeleting && charIndex >= 0) {
      // Deleting phase
      const t = setTimeout(() => {
        setDisplay(currentRole.slice(0, charIndex));
        setCharIndex(charIndex - 1);
      }, speed);
      return () => clearTimeout(t);
      
    } else if (isDeleting && charIndex < 0) {
      // Deleting complete, switch to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % TYPING_ROLES.length);
      setCharIndex(0);
    }
    // Dependency array is clean because TYPING_ROLES is defined outside the component
  }, [charIndex, isDeleting, roleIndex]);


  return (
    <section id="home" className="grid lg:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 bg-[#07070a]/50 px-3 py-1 rounded-full text-sm font-medium text-[#9be7ff] border border-[#9be7ff22]">
          <span className="px-2 py-0.5 rounded bg-[#9be7ff]/20">CA Candidate</span>
          <span className="text-xs text-[#a0f0ff99]">Articleship</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight" style={{ textShadow: '0 6px 30px rgba(124,58,237,0.18)' }}>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-[#7c3aed] to-[#fb7185]">Anjali Shukla</span>
          <span className="block text-lg mt-3 text-[#9beaff]">Numbers that speak. Taxes that comply.</span>
        </h1>

        <p className="max-w-xl text-[#bcdff6aa]">
          I solve complex tax problems, perform detailed audits, and produce accurate financial statements. I combine technical CA training with practical Articleship experience.
        </p>

        <div className="flex gap-4 items-center">
          <a href="#contact" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] text-black font-semibold shadow-lg hover:scale-[1.03] transition transform">Contact</a>
          <a 
            href={RESUME_DOWNLOAD_PATH} 
            download 
            className="px-4 py-3 border rounded-full border-[#ffffff14] text-sm text-[#a8eaff] hover:bg-[#ffffff0f] transition flex items-center gap-2"
          >
            <Download size={16} /> Resume
          </a>
        </div>

        <div className="mt-6 text-[#8feaff] text-lg">
          <span className="font-medium">{display}</span>
          <span className="inline-block w-2 h-6 align-middle border-r-2 border-[#9be7ff] ml-2 animate-pulse"></span>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0b0c10]/60 to-[#050507]/50 border border-[#ffffff0f] shadow-lg">
          <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-[#7c3aed] shadow-[0_10px_40px_rgba(124,58,237,0.14)]">
            {/* Profile Image usage */}
            <img src={PROFILE_IMAGE_PATH} alt="Anjali Shukla Profile" className="w-full h-full object-cover" />
          </div>

          <div className="mt-6 text-center">
            <div className="text-xl font-semibold text-white">Anjali Shukla</div>
            <div className="text-sm text-[#8feaff]">CA Finalist • Audit & Tax</div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="mailto:shuklaanjali536@gmail.com" className="p-3 rounded-full bg-[#06b6d4] hover:scale-105 transition">
                <Mail size={16} />
              </a>
              <a href="https://www.linkedin.com/in/anjali-shukla-040140276" className="p-3 rounded-full bg-[#7c3aed] hover:scale-105 transition">
                <Linkedin size={16} />
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-[#bcdff6]">
              <div className="p-3 bg-[#08080b]/50 rounded-lg">Articleship <div className="text-[11px] text-[#9be7ff]">Ongoing</div></div>
              <div className="p-3 bg-[#08080b]/50 rounded-lg">OC & IT <div className="text-[11px] text-[#9be7ff]">Completed</div></div>
            </div>
          </div>
        </div>

        {/* small holographic badge */}
        <div className="absolute -right-6 -top-6 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] text-black font-semibold shadow">CA Finalist</div>
      </div>
    </section>
  );
};

/* -------------------------
    About
    ------------------------- */
const About = () => {
  const [ref, inView] = useInView(0.2);
  return (
    <section id="about" ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="bg-[#07070b]/60 border border-[#ffffff10] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-[#e6f7ff] mb-3">About</h2>
        <p className="text-[#bfeaff] leading-relaxed">
          I am <span className="text-[#9be7ff] font-semibold">Anjali Shukla</span>, focused on auditing, taxation and financial accounting.
          I work with teams to deliver accurate reports, support compliance, and improve financial processes.
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#0b0b10]/60 border border-[#ffffff06] hover:scale-[1.02] transition">
            <div className="text-sm text-[#9be7ff] font-semibold">Location</div>
            <div className="text-xs text-[#cfefff] mt-1">New Delhi, India</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0b0b10]/60 border border-[#ffffff06] hover:scale-[1.02] transition">
            <div className="text-sm text-[#9be7ff] font-semibold">Availability</div>
            <div className="text-xs text-[#cfefff] mt-1">Open to opportunities</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0b0b10]/60 border border-[#ffffff06] hover:scale-[1.02] transition">
            <div className="text-sm text-[#9be7ff] font-semibold">Focus</div>
            <div className="text-xs text-[#cfefff] mt-1">Taxation · Audit · Finance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------
    Education
    ------------------------- */
const Education = () => {
  const [ref, inView] = useInView(0.2);
  const items = [
    { degree: 'CA Finalist', inst: 'Institute of Chartered Accountants of India', note: 'OC & IT training completed', status: 'Pursuing' },
    { degree: 'B.Com', inst: 'Patliputra University', note: 'Major in Accounting', status: '2023' }
  ];
  return (
    <section id="education" ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-2xl font-bold text-[#e6f7ff] mb-6">Education</h2>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="p-6 bg-[#08080b]/60 border border-[#ffffff08] rounded-xl hover:translate-x-1 transition transform">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] text-black font-semibold">{it.degree.split(' ')[0]}</div>
              <div>
                <div className="text-white font-semibold">{it.degree}</div>
                <div className="text-sm text-[#9be7ff]">{it.inst}</div>
                <div className="text-xs text-[#cfefff] mt-2">{it.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-lg text-[#e6f7ff] mb-3">Certifications</h3>
      <div className="flex gap-4 flex-wrap">
        <div className="px-4 py-2 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded-full text-black font-semibold">PwC Certification</div>
        <div className="px-4 py-2 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded-full text-black font-semibold">EY Certification</div>
      </div>
    </section>
  );
};

/* -------------------------
    Skills
    ------------------------- */
const Skills = () => {
  const [ref, inView] = useInView(0.18);
  const skills = [
    { name: 'Taxation', pct: 90 },
    { name: 'Auditing', pct: 85 },
    { name: 'Financial Accounting', pct: 88 },
    { name: 'Communication', pct: 82 },
    { name: 'MS Excel', pct: 80 },
    { name: 'Tally', pct: 75 }
  ];
  return (
    <section id="skills" ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-2xl font-bold text-[#e6f7ff] mb-6">Skills</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((s, idx) => (
          <div key={idx} className="p-4 bg-[#08080b]/60 rounded-lg border border-[#ffffff06]">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-[#cfefff] font-medium">{s.name}</div>
              <div className="text-sm text-[#9be7ff]">{s.pct}%</div>
            </div>
            <div className="w-full bg-[#0b0b10]/80 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] transition-all duration-[1200ms]" style={{ width: inView ? `${s.pct}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* -------------------------
    Experience
    ------------------------- */
const Experience = () => {
  const [ref, inView] = useInView(0.18);
  const experiences = [
    { role: 'Articleship Trainee', company: 'Your Firm', duration: '2024 - Present', desc: 'Assisting audits & tax compliance for clients.' },
    { role: 'Tax Intern', company: 'ABC Tax Advisors', duration: '2023 - 2024', desc: 'Worked on GST & Income Tax filings.' }
  ];
  return (
    <section id="experience" ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-2xl font-bold text-[#e6f7ff] mb-6">Experience</h2>
      <div className="relative border-l border-[#ffffff08] pl-6 space-y-8">
        {experiences.map((ex, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-4 top-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] shadow-lg" />
            <div className="p-4 bg-[#08080b]/60 rounded-lg border border-[#ffffff06] hover:scale-[1.02] transition transform">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{ex.role}</div>
                  <div className="text-sm text-[#9be7ff]">{ex.company}</div>
                </div>
                <div className="text-sm text-[#cfefff]">{ex.duration}</div>
              </div>
              <p className="mt-2 text-[#bfeaff] text-sm">{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* -------------------------
    Contact
    ------------------------- */
const Contact = () => {
  const [ref, inView] = useInView(0.18);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Please fill all fields.');
      return;
    }
    alert('Message saved locally (demo). Thank you — I will respond soon.');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <section id="contact" ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-2xl font-bold text-[#e6f7ff] mb-6">Contact</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#07070b]/60 rounded-2xl border border-[#ffffff08]">
          <h3 className="text-lg text-[#9be7ff] font-semibold mb-2">Get in touch</h3>
          <p className="text-[#bfeaff] text-sm">Email: <a href="mailto:shuklaanjali536@gmail.com" className="text-[#9be7ff]">shuklaanjali536@gmail.com</a></p>

          <div className="mt-6 grid gap-3">
            <div className="p-3 rounded-lg bg-[#08080b]/50 border border-[#ffffff06]">Open to opportunities</div>
            <div className="p-3 rounded-lg bg-[#08080b]/50 border border-[#ffffff06]">Articleship: ongoing</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 bg-[#07070b]/60 rounded-2xl border border-[#ffffff08]">
          <input className="w-full p-3 rounded-md bg-transparent border border-[#ffffff06] mb-3 text-[#cfefff]" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full p-3 rounded-md bg-transparent border border-[#ffffff06] mb-3 text-[#cfefff]" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea className="w-full p-3 rounded-md bg-transparent border border-[#ffffff06] mb-3 text-[#cfefff]" rows={6} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-3 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] text-black font-semibold shadow-lg">Send</button>
            <button type="button" onClick={() => setForm({ name: '', email: '', message: '' })} className="px-5 py-3 rounded-full border border-[#ffffff06] text-[#cfefff]">Reset</button>
          </div>
        </form>
      </div>
    </section>
  );
};

/* -------------------------
    Footer
    ------------------------- */
const Footer = () => (
  <footer className="py-8 text-center text-sm text-[#9be7ff] opacity-80">
    <div className="mb-3">© {new Date().getFullYear()} Anjali Shukla — CA Finalist</div>
    <div className="flex items-center justify-center gap-4">
      <a href="mailto:shuklaanjali536@gmail.com" className="text-[#a8eaff]">Email</a>
      <a href="https://www.linkedin.com/in/anjali-shukla-040140276" target="_blank" rel="noreferrer" className="text-[#a8eaff]">LinkedIn</a>
    </div>
  </footer>
);

/* -------------------------
    CSS (scoped, included in file)
    ------------------------- */
const css = `
/* neon & cyber styles added inline */
@keyframes blob {
  0% { transform: translate(0px,0px) scale(1); }
  33% { transform: translate(30px,-20px) scale(1.05); }
  66% { transform: translate(-20px,30px) scale(0.95); }
  100% { transform: translate(0px,0px) scale(1); }
}
.animate-blob { 
  animation: blob 10s ease-in-out infinite; 
} /* <--- Added closing brace here */

.animation-delay-3000 { 
  animation-delay: 3s; 
} /* <--- Added semicolon and closing brace here */

/* FIX: Add padding above anchored sections to clear the fixed navbar */
section[id] {
  scroll-padding-top: 100px; /* Adjust this value (100px) based on your navbar height + desired spacing */
  scroll-margin-top: 100px;  /* Older property for better compatibility */
} /* <--- Added closing brace here */

/* Back to Top Neon Glow */
.back-to-top-glow {
  box-shadow: 0 0 10px #06b6d4, 0 0 20px #7c3aed;
}

/* tiny hover scales */
.hover\\:scale-102:hover { transform: scale(1.02); }
.hover\\:scale-105:hover { transform: scale(1.05); }
`;

/* -------------------------
    Export
    ------------------------- */
export default Portfolio;