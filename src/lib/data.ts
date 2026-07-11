export const profile = {
  name: "Navashri",
  displayName: "Navashri",
  role: "Full Stack Developer",
  heroTagline: "Building digital experiences that blend logic with creativity.",
  personas: [
    { label: "Explorer at Heart" },
    { label: "Builder on the Web" },
    { label: "Creator in the Kitchen" },
  ],
  heroBadges: [
    { label: "Every Project is an Adventure" },
    { label: "Every Recipe is a Creation" },
  ],
  heroStack: ["React", "TypeScript", "Python", "FastAPI", "MongoDB"],
  subRole: "B.Tech CSE @ SRM IST · Class of 2028",
  location: "Chennai, India",
  email: "navashri1032@gmail.com",
  linkedin: "https://www.linkedin.com/in/navashri",
  github: "https://github.com/navashri103",
  tagline:
    "Building clean, real-world web products end to end — from interface to infrastructure.",
  bio: [
    "I'm a Full Stack Developer who enjoys turning ideas into scalable, user-friendly web applications. I work across the entire development stack, from designing responsive frontends to building secure backend systems and databases. My focus is on creating clean, efficient, and impactful solutions that solve real-world problems.",
    "I continuously explore modern technologies, AI-powered applications, and software engineering practices to improve my skills and build meaningful products. Whether it's developing a collaborative platform, an intelligent application, or a productivity tool, I enjoy transforming complex challenges into intuitive digital experiences.",
  ],
  quickFacts: [
    { label: "Based in", value: "Chennai, India" },
    { label: "Education", value: "B.Tech CSE, SRM IST (9.60 CGPA)" },
    { label: "Focus", value: "Full Stack · Python · FastAPI" },
    { label: "Languages", value: "English, Tamil, Telugu, Hindi" },
  ],
};

export type JourneyItem = {
  period: string;
  title: string;
  org: string;
  description: string;
  tags?: string[];
  kind: "education" | "experience" | "milestone";
};

export const journey: JourneyItem[] = [
  {
    period: "Jun 2026 — Present",
    title: "Full Stack Developer & Software Development Intern (AI/ML)",
    org: "Coptercode",
    description:
      "Working across the stack on production features, applying AI/ML concepts alongside core full-stack engineering.",
    tags: ["Full Stack", "AI/ML", "Internship"],
    kind: "experience",
  },
  {
    period: "Jun 2024 — Jun 2028",
    title: "B.Tech, Computer Science & Engineering",
    org: "SRM Institute of Science and Technology",
    description:
      "CGPA: 9.60. Coursework spanning SQL, IoT, AI, Data Structures & Algorithms, and Design & Analysis of Algorithms — with consistent academic excellence across three semesters.",
    tags: ["DSA", "AI", "SQL", "IoT"],
    kind: "education",
  },
  {
    period: "Ongoing",
    title: "Hackathons & Technical Workshops",
    org: "Academic Excellence",
    description:
      "Built and pitched ideas under time pressure across hackathons, and attended hands-on workshops to stay current with industry practice.",
    tags: ["Hackathons", "Workshops"],
    kind: "milestone",
  },
  {
    period: "Self-paced",
    title: "Web Development Courses",
    org: "Udemy",
    description:
      "Completed self-paced Udemy courses covering modern web development — building on classroom fundamentals with hands-on, project-based learning.",
    tags: ["Web Development", "Self-Learning"],
    kind: "milestone",
  },
  {
    period: "Self-paced",
    title: "Python Courses",
    org: "Udemy",
    description:
      "Strengthened Python fundamentals and applied scripting skills through self-paced Udemy courses, feeding directly into backend and AI/ML work.",
    tags: ["Python", "Self-Learning"],
    kind: "milestone",
  },
  {
    period: "Jun 2023 — May 2024",
    title: "Class 12, Science",
    org: "Senthil Public School, Dharmapuri",
    description:
      "Scored 85% in Class 12 and 90% in Class 10. Active member of the IT & Math Club.",
    tags: ["IT & Math Club"],
    kind: "education",
  },
];

export type Project = {
  name: string;
  description: string;
  stack: string[];
  status: "Live" | "In Progress" | "Coming Soon";
  link?: string;
  source?: string;
};

export const projects: Project[] = [
  {
    name: "AI Notes Platform",
    description:
      "A smart study companion with file uploads, JWT authentication, and cloud storage — built for students who need their notes organized and accessible anywhere.",
    stack: ["FastAPI", "MongoDB", "Supabase", "JWT"],
    status: "In Progress",
  },
  {
    name: "AI Room Decor Planner",
    description:
      "An AI-assisted tool to visualize and plan room makeovers — helping users experiment with layouts and decor ideas before committing to them.",
    stack: ["HTML", "CSS", "JavaScript", "Python", "FastAPI", "AI/ML", "MongoDB"],
    status: "In Progress",
  },
  {
    name: "Revive Earth",
    description:
      "A platform for an NGO connecting volunteers with places that need help — built to make it easier to find and commit to volunteering opportunities. Not launched yet, but on its way.",
    stack: ["HTML", "CSS", "JavaScript", "Python", "FastAPI", "MongoDB", "REST APIs", "JWT Auth"],
    status: "Coming Soon",
  },
  {
    name: "Travel Expense Tracker",
    description:
      "A web app for managing trip budgets — categorizing expenses, generating summaries, and keeping financial records organized while travelling.",
    stack: ["Full Stack", "Database"],
    status: "Coming Soon",
  },
  {
    name: "AI Summarization Tool",
    description:
      "An AI-powered tool that condenses long documents into clear, concise summaries using NLP techniques to cut down reading time.",
    stack: ["Python", "NLP", "AI/ML"],
    status: "Coming Soon",
  },
  {
    name: "Weather Application",
    description:
      "A responsive weather app with real-time data integration, built on core web fundamentals.",
    stack: ["HTML", "CSS", "JavaScript"],
    status: "Coming Soon",
  },
];

export type SkillGroup = {
  category: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Python", "FastAPI", "Node.js", "Express", "REST APIs", "JWT Auth"],
  },
  {
    category: "Database",
    skills: ["MongoDB", "SQL", "PostgreSQL", "Supabase"],
  },
  {
    category: "Tooling",
    skills: ["Git", "GitHub", "Docker", "Postman", "VS Code"],
  },
  { category: "Core CS", skills: ["DSA", "DAA", "OOP", "AI/ML", "IoT"] },
  { category: "Beyond Code", skills: ["Team Leadership", "Photography", "Game Dev"] },
];

export const languages = [
  { name: "English", level: "Full Professional" },
  { name: "Tamil", level: "Full Professional" },
  { name: "Telugu", level: "Native / Bilingual" },
  { name: "Hindi", level: "Limited Working" },
];
