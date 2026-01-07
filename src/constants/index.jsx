import { 
  BotMessageSquare, 
  BatteryCharging, 
  Fingerprint, 
  ShieldHalf, 
  PlugZap, 

  Code2, 
  Palette, 
  Smartphone, 
  Database, 
  Cloud, 
  Shield,
  Lightbulb, Users, BarChart, DollarSign, Kanban, Rocket,
  Map, ClipboardList, TrendingUp, FileText, GitBranch, Video, Wallet, Target, Award
} from "lucide-react";

// إضافة استيراد الصورة هنا
import successImg from "../assets/code.jpg";
export const navItems = [
  { label: "Features", path: "/#features", scrollId: "features" },
  { label: "Workflow", path: "/#workflow", scrollId: "workflow" },
  { label: "Success Stories", path: "/#success-stories", scrollId: "success-stories" },
  { label: "Expert Committee", path: "/#expert-committee", scrollId: "expert-committee" },// رابط لصفحة مستقلة
];


export const workflowSteps = [
  {
    title: "Idea Submission & Initial Evaluation",
    description: "Submit your idea through a comprehensive form and get evaluated by an expert committee based on feasibility, innovation, and implementability."
  },
  {
    title: "Strategic Business Planning",
    description: "Use tools like Business Model Canvas to develop a comprehensive business plan and identify resources, risks, and solutions."
  },
  {
    title: "Funding & Advanced Evaluation",
    description: "Receive funding recommendations after a thorough study of your business model and project plan by investors and the committee."
  },
  {
    title: "Execution & Monitoring",
    description: "Implement your project using Gantt charts with task tracking and regular meetings with the expert committee."
  },
  {
    title: "Launch & Continuous Monitoring",
    description: "Launch your project with full support and monitor its performance through monthly reports and continuous improvement recommendations."
  },
  {
    title: "Independence & Stabilization",
    description: "Receive project independence certification after achieving financial stability and the ability to continue without direct support."
  }
];

export const testimonials = [
  {
    user: "Robert Chen",
    company: "Global Economic Institute",
    role: "economist",
    text: "The platform's economic model demonstrates sustainable growth potential with impressive ROI metrics. The market positioning strategy shows deep understanding of macroeconomic trends.",
image: "/src/assets/profile-pictures/user2.jpg"
  },
  {
    user: "Sarah Martinez",
    company: "Market Dynamics Inc.",
    role: "market",
    text: "Outstanding market penetration strategy! The platform addresses a clear gap in the VR development market with compelling competitive advantages and scalable business model.",
image: "/src/assets/profile-pictures/user1.jpg"
  },
  {
    user: "James Patterson",
    company: "Legal Shield Partners",
    role: "legal",
    text: "Comprehensive compliance framework and robust intellectual property protection. The platform's legal structure ensures long-term sustainability and risk mitigation.",
image: "/src/assets/profile-pictures/user3.jpg"
  },
  {
    user: "Dr. Amanda Zhang",
    company: "Tech Innovation Labs",
    role: "technical",
    text: "The technical architecture is remarkably scalable and innovative. The real-time collaboration features and multi-platform support demonstrate cutting-edge engineering excellence.",
image: "/src/assets/profile-pictures/user4.jpg"
  },
  {
    user: "Michael Thompson",
    company: "Venture Growth Capital",
    role: "investor",
    text: "Exceptional investment opportunity with clear monetization strategy and strong traction. The platform shows potential for significant market disruption and returns.",
image: "/src/assets/profile-pictures/user5.jpg"
  },
  {
    user: "Elena Rodriguez",
    company: "Strategic Investments Group",
    role: "investor",
    text: "The financial projections are realistic and the growth strategy is well-structured. This platform represents a solid investment with multiple revenue streams.",
image: "/src/assets/profile-pictures/user6.jpg"
  }
];
export const features = [
  {
    icon: <Map />,
    text: "Smart Roadmap",
    description: "Get a customized roadmap that guides you step by step from idea to success, with precise task and deadline identification"
  },
  {
    icon: <Users />,
    text: "Specialized Expert Committee",
    description: "Connect with a neutral committee of investors, market experts, and economists to evaluate your idea and provide appropriate guidance"
  },
  {
    icon: <ClipboardList />,
    text: "Multi-stage Objective Evaluation",
    description: "Get comprehensive evaluation of your idea through multiple stages ensuring neutrality and objectivity in decisions"
  },
  {
    icon: <TrendingUp />,
    text: "Continuous Post-Funding Monitoring",
    description: "We don't leave you alone after funding - we monitor your project step by step with performance reports and course correction"
  },
  {
    icon: <BarChart />,
    text: "Measurable Performance Indicators",
    description: "Track your project progress through clear key performance indicators (KPIs) that help you make right decisions"
  },
  {
    icon: <FileText />,
    text: "Ready Business Templates",
    description: "Use pre-prepared Business Model Canvas templates and business plans to accelerate the planning process"
  },
  {
    icon: <GitBranch />,
    text: "Integrated Task Management",
    description: "Organize your project using Gantt charts and task tracking with clear responsibilities and deadlines"
  },
  {
    icon: <Video />,
    text: "Organized Virtual Meetings",
    description: "Conduct effective meetings with experts through the platform with complete documentation of decisions and recommendations"
  },
  {
    icon: <Wallet />,
    text: "Transparent Funding System",
    description: "Manage funding requests and money transfers securely and transparently with expenditure and budget tracking"
  },
];

// تصدير الصورة هنا لتستخدم في Workflow component
export { successImg };

export const checklistItems = [
  {
    title: "Code Merge Made Easy",
    description: "Seamlessly integrate and manage code changes with our intelligent version control system.",
  },
  {
    title: "Real-Time Code Review",
    description: "Collaborate with your team through live code reviews and instant feedback mechanisms.",
  },
  {
    title: "AI-Powered Assistance",
    description: "Reduce development time with AI-driven code suggestions and automated optimization.",
  },
  {
    title: "Instant Deployment",
    description: "Share your work with stakeholders in minutes using our one-click deployment system.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Basic VR Templates",
      "5 GB Storage",
      "Single User",
      "Community Support",
      "Basic Analytics",
    ],
  },
  {
    title: "Pro",
    price: "$29",
    features: [
      "All Free Features",
      "50 GB Storage",
      "Up to 5 Users",
      "Priority Support",
      "Advanced Analytics",
      "Custom Templates",
    ],
  },
  {
    title: "Enterprise",
    price: "$99",
    features: [
      "All Pro Features",
      "Unlimited Storage",
      "Unlimited Users",
      "24/7 Dedicated Support",
      "Custom Integrations",
      "White-label Solutions",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];

export const ServiceData = [
  {
    backgroundImage: "/images/submmite.jpg"
  },
  {
    backgroundImage: "/images/evaluate.jpg"
  },
  {
    backgroundImage: "/images/meeting.jpg"
  },
  {
    backgroundImage: "/images/plan2.jpg"
  },
  {
    backgroundImage: "/images/funding2.jpg"
  },
  {
    backgroundImage: "/images/planning.jpg"
  },
];
// بدلاً من ذلك يمكنك استخدام:


export const successStories = [
  {
    initials: "M.A",
    name: "Rama alajlany",
    project: "Medicine Delivery App",
    story: "Started with a simple idea to deliver medicines to patients and elderly people. Through our platform, I received funding and guidance to develop an app that now serves thousands of users.",
    funding: "$50,000",
    duration: "6 months",
    rating: 5,
 image: "/src/assets/medecin.jpg"
  },
  {
    initials: "S.K",
    name: "Sedra Eid", 
    project: "Educational Platform for Children",
    story: "Transformed my passion for education into an interactive platform that helps children learn in a fun way. The platform provided me with technical and marketing support to reach a wider audience.",
    funding: "$30,000",
    duration: "8 months",
    rating: 5,
  image: "/src/assets/LearningCenter.jpg" 
  },
  {
    initials: "Y.M",
    name: "Sedra Alkhateb",
    project: "Renewable Energy Solutions",
    story: "My idea for providing renewable energy solutions for homes turned into a successful project thanks to continuous support from the expert committee and strategic guidance we received.",
    funding: "$100,000",
    duration: "12 months",
    rating: 4,

image: "/src/assets/sedrakh.jpg"
  }
];