"use client";

import { motion } from "framer-motion";

const stories = [
  {
    id: "kartik-garhwal",
    name: "Meet the Founder – Kartik Garhwal",
    initials: "KG",
    location: "Jaipur, Rajasthan",
    paragraphs: [
      "Every successful company begins with a vision. For FUTUREIX, that vision belongs to Kartik Garhwal, a passionate entrepreneur from Jaipur, Rajasthan, who believes that technology and digital skills should create real opportunities for everyone.",
      "Kartik's entrepreneurial journey started with curiosity rather than resources. While pursuing his engineering degree, he spent countless hours learning digital marketing, website development, AI tools, and business strategies. Instead of waiting for opportunities, he created them by working with businesses, understanding client requirements, solving marketing challenges, and continuously improving his skills through real-world projects.",
      "Over time, he realized that many startups and local businesses had excellent products but struggled to build a strong online presence. This inspired him to provide practical digital solutions that focused on measurable growth rather than just attractive designs. From creating high-converting websites and managing advertising campaigns to helping brands establish their digital identity, every project strengthened his belief that the right strategy can transform any business.",
      "Driven by this vision, Kartik founded FUTUREIX with a simple mission:",
    ],
    mission:
      "To empower businesses and individuals through innovation, technology, AI, and result-driven digital solutions.",
    closingParagraphs: [
      "Today, Kartik leads FUTUREIX with a growth mindset, constantly exploring emerging technologies, automation, artificial intelligence, and performance marketing. His leadership is built on hard work, continuous learning, transparency, and a commitment to delivering real value to clients.",
      "He believes that success is not achieved overnight—it is built through consistency, discipline, and the courage to keep moving forward even when the path is uncertain.",
    ],
    quote: "Dream Big. Build Smart. Grow Together.",
  },
  {
    id: "mritunjay-pratap-singh",
    name: "Meet the Co-Founder – Mritunjay Pratap Singh",
    initials: "MS",
    location: "Uttar Pradesh",
    paragraphs: [
      "Behind every great vision is a strong partner who shares the same passion for growth and innovation. Mritunjay Pratap Singh, the Co-Founder of FUTUREIX, comes from Uttar Pradesh and has always been driven by a desire to solve problems through technology and creativity.",
      "His journey began with a deep interest in digital platforms, branding, and online business. Rather than following conventional paths, he focused on learning modern digital skills, exploring new technologies, and understanding how businesses can grow in the rapidly evolving digital world.",
      "As he gained practical experience working on websites, marketing strategies, and business development, Mritunjay recognized that many entrepreneurs needed more than just technical services—they needed a reliable partner who understood their vision and could help turn ideas into successful brands.",
      "When he joined forces with Kartik Garhwal, they shared a common goal: to build a company that combines innovation, technology, creativity, and trust under one roof. Together, they laid the foundation of FUTUREIX, aiming to help startups, businesses, and aspiring professionals grow with confidence in the digital age.",
    ],
    mission:
      "At FUTUREIX, Mritunjay focuses on strategic planning, business growth, creative direction, and delivering impactful digital experiences. His approach is centered on collaboration, continuous learning, and building long-term relationships with clients.",
    closingParagraphs: ["He believes that true success comes from teamwork, adaptability, and the willingness to embrace change."],
    quote: "Innovation begins where passion meets purpose.",
  },
];

export function FounderStory() {
  return (
    <section id="founder-story" className="relative py-24 scroll-mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 h-[25rem] w-[35rem] rounded-full bg-electric-blue/8 blur-[140px]"
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-neon-cyan">
            Our Story
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            The People Behind <span className="text-gradient">FUTUREIX</span>
          </h2>
        </motion.div>

        <div className="mt-16 space-y-10">
          {stories.map((story, i) => (
            <motion.article
              key={story.id}
              id={story.id}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              className="glass scroll-mt-28 rounded-3xl p-6 sm:p-10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                  <span className="font-display text-lg font-bold text-white">
                    {story.initials}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                    {story.name}
                  </h3>
                  <p className="text-sm text-neon-cyan mt-0.5 font-medium">{story.location}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base text-muted leading-relaxed">
                {story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <blockquote className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm sm:text-base font-medium text-foreground">
                {story.mission}
              </blockquote>

              <div className="mt-4 space-y-4 text-sm sm:text-base text-muted leading-relaxed">
                {story.closingParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <p className="mt-6 font-display text-lg sm:text-xl font-semibold text-gradient">
                &ldquo;{story.quote}&rdquo;
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
