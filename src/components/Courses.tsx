"use client";

import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import { Clock, BarChart3, ArrowRight } from "lucide-react";
import { SectionTag } from "@/components/SectionTag";
import { CourseThumbnail } from "@/components/CourseThumbnail";

export function Courses() {
  return (
    <section id="courses" className="relative py-24 scroll-mt-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-electric-blue/10 blur-[130px]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex justify-center">
            <SectionTag number="02" label="Our Courses" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Learn <span className="font-accent text-signal">Future-Ready Skills</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass group flex flex-col overflow-hidden rounded-2xl cursor-pointer"
            >
              <div className="relative h-40 w-full overflow-hidden border-b-[1.5px] border-foreground">
                <CourseThumbnail type={course.thumbnail} />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <h3 className="font-display text-lg text-white drop-shadow-lg">
                    {course.title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <ul className="space-y-2">
                  {course.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-xs text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal/80" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={12} />
                    {course.level}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-display text-xl text-foreground">
                    {course.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/btn inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-xs font-semibold text-white shadow-[3px_3px_0_0_rgba(13,13,10,0.9)] transition-shadow hover:shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] cursor-pointer"
                  >
                    Buy Now
                    <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
