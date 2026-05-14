import { useState, useEffect, useRef, useCallback } from "react";

const ROLES = [
  { id: "frontend", label: "Frontend Engineer", icon: "⚡", color: "#6366f1" },
  { id: "backend", label: "Backend Engineer", icon: "🔧", color: "#8b5cf6" },
  { id: "fullstack", label: "Full-Stack Engineer", icon: "🚀", color: "#3b82f6" },
  { id: "devops", label: "DevOps / SRE", icon: "⚙️", color: "#06b6d4" },
  { id: "ml", label: "ML / AI Engineer", icon: "🧠", color: "#10b981" },
  { id: "pm", label: "Product Manager", icon: "📊", color: "#f59e0b" },
];

const DIFFICULTIES = [
  { id: "junior", label: "Junior", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  { id: "mid", label: "Mid-level", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { id: "senior", label: "Senior", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const LANGUAGES = ["English", "Polish", "German", "French", "Spanish", "Portuguese"];

type QuestionType = "open" | "mcq";
type Phase = "setup" | "session" | "complete";
type SessionStep = "question" | "answering" | "feedback";

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  category: string;
  hint: string;
  options?: string[];
  correctOption?: number;
  explanation?: string;
  sampleAnswer?: string;
}

const QUESTIONS: Record<string, Question[]> = {
  frontend: [
    {
      id: 1, type: "open", category: "Core Concepts",
      text: "Explain the concept of the Virtual DOM in React and how it improves performance compared to direct DOM manipulation.",
      hint: "Think about diffing algorithms and batched updates",
      sampleAnswer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React keeps a copy of it in memory and uses a diffing algorithm to find the minimal set of changes needed, then batches those updates into the real DOM in one efficient pass — reducing expensive reflows and repaints.",
    },
    {
      id: 2, type: "mcq", category: "JavaScript",
      text: "Which of the following best describes the difference between `let` and `var` in JavaScript?",
      options: [
        "`var` is block-scoped, `let` is function-scoped",
        "`let` is block-scoped, `var` is function-scoped",
        "Both are block-scoped but `var` is hoisted",
        "There is no difference in modern JavaScript",
      ],
      correctOption: 1,
      explanation: "`let` is block-scoped — it only exists within the `{}` block it was declared in. `var` is function-scoped and gets hoisted to the top of its function (or global scope), which can cause subtle bugs in loops and conditionals.",
      hint: "Consider how each behaves inside an if-block or for-loop",
    },
    {
      id: 3, type: "open", category: "Performance",
      text: "How would you optimize a React application that re-renders too frequently and causes noticeable jank?",
      hint: "Consider memoization, code splitting, and profiling tools",
      sampleAnswer: "Start by profiling with React DevTools to identify which components re-render unnecessarily. Apply React.memo for pure components, useMemo/useCallback to stabilize references, and consider moving state closer to where it's consumed. Lazy-load heavy components with React.lazy and Suspense, and batch state updates where possible.",
    },
    {
      id: 4, type: "mcq", category: "CSS",
      text: "What is the output of `display: flex` on a container's direct children by default?",
      options: [
        "Children stack vertically in a column",
        "Children wrap to the next line automatically",
        "Children are laid out in a horizontal row",
        "Children take full width of the container",
      ],
      correctOption: 2,
      explanation: "By default, `flex-direction` is `row`, which arranges direct children horizontally in a single line. You need to explicitly set `flex-direction: column` or `flex-wrap: wrap` to change this behavior.",
      hint: "Think about the default value of flex-direction",
    },
    {
      id: 5, type: "open", category: "Architecture",
      text: "Describe a scalable state management approach for a large-scale React application with complex cross-component data sharing.",
      hint: "Consider Context, Zustand, Redux, and when each is appropriate",
      sampleAnswer: "For large applications I prefer a layered approach: use React Query or SWR for server state (caching, invalidation), local React state for UI state, and a lightweight store like Zustand for shared client state. Avoid putting everything in one global store — co-locate state with the components that own it, and only lift it when multiple distant consumers need it.",
    },
  ],
  backend: [
    {
      id: 1, type: "open", category: "APIs",
      text: "Explain the key differences between REST and GraphQL APIs, and describe when you would choose one over the other.",
      hint: "Consider over-fetching, under-fetching, and team structure",
      sampleAnswer: "REST uses fixed endpoints with predetermined response shapes, which is simple to cache and easy to understand but leads to over-fetching or under-fetching. GraphQL lets clients request exactly the data they need in a single query, reducing round-trips — ideal for complex UIs with varied data needs. I'd pick REST for simple CRUD services and GraphQL for data-heavy frontends with many entity relationships.",
    },
    {
      id: 2, type: "mcq", category: "Databases",
      text: "Which isolation level prevents dirty reads but still allows non-repeatable reads?",
      options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
      correctOption: 1,
      explanation: "Read Committed prevents dirty reads (you only see committed data) but doesn't lock rows between reads, so another transaction can modify a row you've already read — causing non-repeatable reads. This is the default in PostgreSQL and SQL Server.",
      hint: "Think about the transaction isolation spectrum from weakest to strongest",
    },
    {
      id: 3, type: "open", category: "Scalability",
      text: "How would you design a system to handle 10,000 concurrent WebSocket connections efficiently?",
      hint: "Consider event loops, horizontal scaling, and pub/sub patterns",
      sampleAnswer: "Use a non-blocking event-loop server (Node.js, Go, or async Python) to handle connections without a thread per socket. Horizontally scale across multiple nodes with a shared pub/sub layer (Redis Pub/Sub or Kafka) so messages can fan out across servers. Use a load balancer with sticky sessions or route by connection ID, and implement health checks and graceful reconnect logic on the client.",
    },
    {
      id: 4, type: "mcq", category: "Security",
      text: "What is the primary defense against SQL injection attacks?",
      options: [
        "Encrypting the database connection",
        "Using ORM frameworks exclusively",
        "Parameterized queries / prepared statements",
        "Input length validation",
      ],
      correctOption: 2,
      explanation: "Parameterized queries (prepared statements) separate SQL code from user data, so the database treats input as data — never as executable SQL. ORMs typically use them internally, but the protection comes from parameterization, not the ORM itself.",
      hint: "Think about where malicious SQL gets interpreted",
    },
    {
      id: 5, type: "open", category: "Distributed Systems",
      text: "Explain the CAP theorem and describe a real-world trade-off you would make when designing a distributed database.",
      hint: "Consider availability vs. consistency during network partitions",
      sampleAnswer: "CAP states that a distributed system can only guarantee two of three: Consistency, Availability, and Partition Tolerance. Since partitions are inevitable in distributed networks, you're really choosing between CP (consistent but may refuse requests during partitions) and AP (always available but may return stale data). For a payment system I'd choose CP — stale balances are dangerous. For a social feed I'd choose AP — eventual consistency is acceptable.",
    },
  ],
  fullstack: [
    {
      id: 1, type: "open", category: "Architecture",
      text: "Describe how you would architect a full-stack application that needs to handle real-time collaboration features like Google Docs.",
      hint: "Think about OT, CRDTs, WebSockets, and conflict resolution",
      sampleAnswer: "I'd use operational transformation (OT) or CRDTs for conflict-free merging of concurrent edits. Each client sends operations (not full document state) via WebSocket to the server, which applies OT to sequence and broadcast them. Persist a log of operations in a database for offline replay. Use a pub/sub layer for multi-server deployments and periodic snapshots to avoid replaying the full log on reconnect.",
    },
    {
      id: 2, type: "mcq", category: "Performance",
      text: "Which rendering strategy delivers the best Time-to-First-Byte (TTFB) while also supporting dynamic personalized content?",
      options: [
        "Client-Side Rendering (CSR)",
        "Static Site Generation (SSG)",
        "Server-Side Rendering (SSR) with Edge caching",
        "Incremental Static Regeneration (ISR)",
      ],
      correctOption: 2,
      explanation: "SSR at the edge generates HTML close to the user with low latency TTFB, and because it runs on each request it can include personalized data. Edge caching of public content further reduces origin load. SSG is fastest for fully static content but can't personalize per-request.",
      hint: "Consider where the HTML is generated and how close to the user it runs",
    },
    {
      id: 3, type: "open", category: "Security",
      text: "Walk me through how you would implement secure user authentication in a full-stack app — from signup to protected API calls.",
      hint: "Cover hashing, token strategy, refresh tokens, and HTTPS",
      sampleAnswer: "Hash passwords with bcrypt (cost factor 12+) before storage. On login, issue a short-lived JWT access token (15 min) and a long-lived refresh token stored as an HttpOnly cookie. The frontend uses the access token in the Authorization header; when it expires, a silent refresh endpoint exchanges the cookie for a new access token. Protect all API routes with middleware that validates the JWT signature. Use HTTPS everywhere and set Secure, SameSite=Strict on cookies.",
    },
  ],
  devops: [
    {
      id: 1, type: "open", category: "CI/CD",
      text: "Describe a CI/CD pipeline you would design for a microservices application with 15 services that need independent deployments.",
      hint: "Consider pipeline-per-service, affected-only builds, and deployment strategies",
      sampleAnswer: "Use a monorepo with change-detection: only rebuild and redeploy services affected by a commit. Each service has its own pipeline — lint, test, build Docker image, push to registry, then deploy via rolling update or canary. Use feature flags for risky changes, blue-green deployments for zero-downtime, and automatic rollback triggered by error-rate SLOs. Coordinate with a service mesh for traffic splitting during canary releases.",
    },
    {
      id: 2, type: "mcq", category: "Kubernetes",
      text: "What is the role of a Kubernetes Liveness Probe?",
      options: [
        "Checks if a pod is ready to receive traffic",
        "Restarts a container when it becomes unresponsive or deadlocked",
        "Monitors resource usage and triggers autoscaling",
        "Validates the pod's network connectivity to the cluster",
      ],
      correctOption: 1,
      explanation: "A Liveness Probe tells Kubernetes whether a container is still running correctly. If it fails repeatedly, Kubernetes restarts the container — useful for recovering from deadlocks or corrupted states that didn't crash the process. A Readiness Probe (different) controls whether traffic is routed to the pod.",
      hint: "Distinguish between 'is alive' and 'is ready for traffic'",
    },
  ],
  ml: [
    {
      id: 1, type: "open", category: "Model Design",
      text: "Explain the bias-variance trade-off and how you would diagnose and address each problem in a production ML model.",
      hint: "Think about training vs. validation error patterns and regularization",
      sampleAnswer: "High bias (underfitting) shows as high training and validation error — the model is too simple. Fix it with a more complex model, more features, or less regularization. High variance (overfitting) shows as low training error but high validation error — the model memorizes noise. Fix with regularization (L1/L2, dropout), more training data, or a simpler model. In production I monitor both errors continuously with A/B held-out sets and use learning curves to diagnose which regime I'm in.",
    },
    {
      id: 2, type: "mcq", category: "Deep Learning",
      text: "Why is the ReLU activation function preferred over sigmoid in deep neural networks?",
      options: [
        "ReLU outputs probabilities, making it easier to interpret",
        "ReLU avoids the vanishing gradient problem for positive inputs",
        "ReLU is differentiable everywhere, unlike sigmoid",
        "ReLU is slower but more accurate for classification tasks",
      ],
      correctOption: 1,
      explanation: "Sigmoid squashes values to (0, 1), and its gradient approaches zero for large positive or negative inputs — causing vanishing gradients in deep networks where gradients are multiplied across many layers. ReLU outputs the input directly for positive values (gradient = 1), avoiding this problem. The dead ReLU issue (negative inputs always output 0) is addressed by variants like Leaky ReLU.",
      hint: "Think about what happens to gradients when they're multiplied across many layers",
    },
  ],
  pm: [
    {
      id: 1, type: "open", category: "Strategy",
      text: "You're a PM at a B2B SaaS company. Your top metric — monthly active users — has dropped 15% in the last 4 weeks. Walk me through how you would diagnose and respond to this.",
      hint: "Structure your answer: data → hypothesis → experiment → action",
      sampleAnswer: "First, segment the drop: which cohorts (plan tier, industry, geography, acquisition channel) drove it? Is it acquisition, activation, or retention? Check if the drop correlates with a product change, external event, or seasonal pattern. Then form hypotheses in priority order and validate the top one with data before acting. If it's retention, run NPS surveys and churn interviews. If acquisition, check funnel conversion rates. Build a recovery plan with clear metrics and a timeline, communicate it to stakeholders, and define a leading indicator to track progress weekly.",
    },
    {
      id: 2, type: "mcq", category: "Prioritization",
      text: "Which prioritization framework is best suited for evaluating features when engineering effort is highly variable across items?",
      options: [
        "MoSCoW (Must/Should/Could/Won't)",
        "RICE scoring (Reach × Impact × Confidence / Effort)",
        "Kano Model (Basic, Performance, Excitement)",
        "Story Mapping",
      ],
      correctOption: 1,
      explanation: "RICE explicitly divides by Effort, making it the strongest framework when effort varies significantly between items. A high-impact feature requiring 1 sprint will score far higher than a similar-impact feature requiring 6 sprints, which directly surfaces the ROI trade-off. MoSCoW ignores effort entirely, and Kano focuses on customer satisfaction categories rather than prioritization math.",
      hint: "Which framework explicitly accounts for return on engineering investment?",
    },
  ],
};

function getQuestionsForRole(role: string): Question[] {
  return QUESTIONS[role] ?? QUESTIONS["frontend"];
}

function NotesPanel({
  sessionKey,
  isOpen,
  onToggle,
}: {
  sessionKey: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(`interview_notes_${sessionKey}`) ?? "";
    } catch {
      return "";
    }
  });

  const save = useCallback(
    (val: string) => {
      setNotes(val);
      try {
        localStorage.setItem(`interview_notes_${sessionKey}`, val);
      } catch {}
    },
    [sessionKey]
  );

  return (
    <div
      style={{
        position: "fixed",
        right: isOpen ? 0 : -340,
        top: 0,
        bottom: 0,
        width: 340,
        background: "#13141a",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "right 0.3s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📝</span>
          <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>Session Notes</span>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 6,
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px 8px",
            fontSize: 12,
          }}
        >
          ✕
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => save(e.target.value)}
        placeholder="Jot down key insights, terms to review, or areas to improve…"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          color: "#cbd5e1",
          fontSize: 13,
          lineHeight: "1.7",
          padding: "16px 20px",
          resize: "none",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11,
          color: "#475569",
        }}
      >
        Auto-saved to this browser
      </div>
    </div>
  );
}

function ConfidenceMeter({ score }: { score: number }) {
  const segments = [
    { label: "Low", color: "#ef4444", range: [0, 33] },
    { label: "Mid", color: "#f59e0b", range: [34, 66] },
    { label: "High", color: "#22c55e", range: [67, 100] },
  ];
  const active = segments.find((s) => score >= s.range[0] && score <= s.range[1]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>CONFIDENCE</span>
      <div style={{ display: "flex", gap: 3 }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 14,
              borderRadius: 2,
              background: i < Math.round(score / 10) ? (active?.color ?? "#6366f1") : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: active?.color ?? "#6366f1", fontWeight: 600 }}>
        {active?.label}
      </span>
    </div>
  );
}

export function InterviewLab() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [sessionStep, setSessionStep] = useState<SessionStep>("question");

  const [selectedRole, setSelectedRole] = useState("frontend");
  const [selectedDifficulty, setSelectedDifficulty] = useState("mid");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [mcqMode, setMcqMode] = useState(false);
  const [packageCount, setPackageCount] = useState(5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(72);
  const [streak, setStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const questions = getQuestionsForRole(selectedRole).slice(0, packageCount);
  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex) / questions.length) * 100);
  const role = ROLES.find((r) => r.id === selectedRole)!;
  const difficulty = DIFFICULTIES.find((d) => d.id === selectedDifficulty)!;
  const sessionKey = `${selectedRole}_${selectedDifficulty}`;
  const answerRef = useRef<HTMLTextAreaElement>(null);

  const isMcq = mcqMode && currentQuestion?.type === "mcq";

  const handleStartSession = () => {
    setCurrentIndex(0);
    setAnswer("");
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
    setSessionStep("question");
    setAnsweredCount(0);
    setStreak(0);
    setPhase("session");
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
    setSessionStep("feedback");
    setAnsweredCount((c) => c + 1);
    if (isMcq) {
      const correct = selectedOption === currentQuestion.correctOption;
      setStreak((s) => (correct ? s + 1 : 0));
      setConfidenceScore((s) => Math.min(100, Math.max(0, s + (correct ? 8 : -5))));
    } else {
      setConfidenceScore((s) => Math.min(100, s + 5));
      setStreak((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswer("");
      setSelectedOption(null);
      setShowFeedback(false);
      setShowHint(false);
      setSessionStep("question");
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setCurrentIndex(0);
    setAnswer("");
    setSelectedOption(null);
    setShowFeedback(false);
    setAnsweredCount(0);
    setStreak(0);
    setConfidenceScore(72);
  };

  if (phase === "setup") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0b0f 0%, #0d1117 50%, #0a0e1a 100%)",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#e2e8f0",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "rgba(10,11,15,0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🧪
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>
              Interview Lab
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#6366f1",
                background: "rgba(99,102,241,0.12)",
                padding: "2px 8px",
                borderRadius: 20,
                fontWeight: 600,
                letterSpacing: 0.5,
                marginLeft: 4,
              }}
            >
              AI SIMULATOR
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#475569" }}>
            <span>🔥 {streak} streak</span>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                color: "#818cf8",
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#6366f1",
                  animation: "pulse 2s infinite",
                  display: "inline-block",
                }}
              />
              Ready to practice · 50+ questions loaded
            </div>

            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: -1,
                marginBottom: 16,
                background: "linear-gradient(135deg, #e2e8f0 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your personal AI<br />interview simulator
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#64748b",
                lineHeight: 1.6,
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Practice real interview questions, get instant feedback, and track your confidence — role by role, level by level.
            </p>
          </div>

          {/* Setup Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "32px",
              marginBottom: 20,
            }}
          >
            {/* Role selection */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                SELECT ROLE
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: selectedRole === r.id ? `1.5px solid ${r.color}` : "1.5px solid rgba(255,255,255,0.07)",
                      background: selectedRole === r.id ? `${r.color}15` : "rgba(255,255,255,0.02)",
                      color: selectedRole === r.id ? r.color : "#64748b",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 6,
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                DIFFICULTY
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDifficulty(d.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      border: selectedDifficulty === d.id ? `1.5px solid ${d.color}` : "1.5px solid rgba(255,255,255,0.07)",
                      background: selectedDifficulty === d.id ? d.bg : "rgba(255,255,255,0.02)",
                      color: selectedDifficulty === d.id ? d.color : "#64748b",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row: Language + Questions + MCQ */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 8 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  LANGUAGE
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l} style={{ background: "#13141a" }}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  QUESTIONS
                </label>
                <select
                  value={packageCount}
                  onChange={(e) => setPackageCount(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {[3, 5, 10].map((n) => (
                    <option key={n} value={n} style={{ background: "#13141a" }}>
                      {n} questions
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  MODE
                </label>
                <button
                  onClick={() => setMcqMode((v) => !v)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: mcqMode ? "1.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.07)",
                    background: mcqMode ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.02)",
                    color: mcqMode ? "#818cf8" : "#64748b",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {mcqMode ? "✓ " : ""}MCQ Mode
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              { label: "Questions ready", value: questions.length.toString(), icon: "📋" },
              { label: "Estimated time", value: `${questions.length * 3} min`, icon: "⏱" },
              { label: "Your level", value: difficulty.label, icon: "🎯" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStartSession}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: -0.3,
              boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            Start Interview Simulation
            <span style={{ fontSize: 18 }}>→</span>
          </button>
          <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 12 }}>
            {selectedLanguage} · {role.label} · {difficulty.label}
            {mcqMode ? " · MCQ Mode" : ""}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    const pct = Math.round((answeredCount / questions.length) * 100);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0b0f 0%, #0d1117 50%, #0a0e1a 100%)",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 24,
            boxShadow: "0 0 40px rgba(99,102,241,0.4)",
          }}
        >
          🏆
        </div>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: -1,
            marginBottom: 8,
            background: "linear-gradient(135deg, #e2e8f0 0%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Session Complete!
        </h2>
        <p style={{ color: "#64748b", marginBottom: 40, fontSize: 15 }}>
          You answered {answeredCount} of {questions.length} questions
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 40,
            width: "100%",
            maxWidth: 480,
          }}
        >
          {[
            { label: "Completion", value: `${pct}%`, color: "#22c55e" },
            { label: "Best Streak", value: `${streak}x`, color: "#f59e0b" },
            { label: "Confidence", value: `${confidenceScore}%`, color: "#6366f1" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleStartSession}
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Practice Again
          </button>
          <button
            onClick={handleRestart}
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Change Settings
          </button>
        </div>
      </div>
    );
  }

  // SESSION PHASE
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#090a0e",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Session Header */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "#0a0b0f",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleRestart}
          style={{
            background: "none",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          ←
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span
            style={{
              fontSize: 18,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: `${role.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {role.icon}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{role.label}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
              background: difficulty.bg,
              color: difficulty.color,
              letterSpacing: 0.5,
            }}
          >
            {difficulty.label.toUpperCase()}
          </span>
          {mcqMode && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                background: "rgba(99,102,241,0.1)",
                color: "#818cf8",
                letterSpacing: 0.5,
              }}
            >
              MCQ
            </span>
          )}
        </div>

        <ConfidenceMeter score={confidenceScore} />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {streak > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "#f59e0b",
                background: "rgba(245,158,11,0.1)",
                padding: "3px 8px",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              🔥 {streak}
            </span>
          )}
          <button
            onClick={() => setNotesOpen((v) => !v)}
            style={{
              background: notesOpen ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
              border: notesOpen ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8,
              color: notesOpen ? "#818cf8" : "#64748b",
              cursor: "pointer",
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            📝 Notes
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 24px 120px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Question counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: 1,
                }}
              >
                QUESTION {currentIndex + 1} / {questions.length}
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: "rgba(255,255,255,0.05)",
                  color: "#64748b",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                {currentQuestion?.category}
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentIndex ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i < currentIndex
                        ? "#6366f1"
                        : i === currentIndex
                        ? "#818cf8"
                        : "rgba(255,255,255,0.08)",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: 18,
              padding: "28px 32px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(99,102,241,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <span style={{ fontSize: 18 }}>🤖</span>
              </div>
              <div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#e2e8f0", margin: 0, fontWeight: 450 }}>
                  {currentQuestion?.text}
                </p>
                {showHint && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "10px 14px",
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.15)",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#fbbf24",
                    }}
                  >
                    💡 Hint: {currentQuestion?.hint}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MCQ Options */}
          {isMcq && !showFeedback && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {currentQuestion.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    border:
                      selectedOption === i
                        ? "1.5px solid #6366f1"
                        : "1.5px solid rgba(255,255,255,0.07)",
                    background:
                      selectedOption === i
                        ? "rgba(99,102,241,0.12)"
                        : "rgba(255,255,255,0.02)",
                    color: selectedOption === i ? "#e2e8f0" : "#94a3b8",
                    cursor: "pointer",
                    fontSize: 14,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border:
                        selectedOption === i
                          ? "none"
                          : "1.5px solid rgba(255,255,255,0.12)",
                      background: selectedOption === i ? "#6366f1" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {selectedOption === i ? "✓" : ["A", "B", "C", "D"][i]}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* MCQ Feedback */}
          {isMcq && showFeedback && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {currentQuestion.options?.map((opt, i) => {
                const isCorrect = i === currentQuestion.correctOption;
                const isSelected = i === selectedOption;
                const isWrong = isSelected && !isCorrect;

                return (
                  <div
                    key={i}
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      border: isCorrect
                        ? "1.5px solid rgba(34,197,94,0.4)"
                        : isWrong
                        ? "1.5px solid rgba(239,68,68,0.3)"
                        : "1.5px solid rgba(255,255,255,0.04)",
                      background: isCorrect
                        ? "rgba(34,197,94,0.08)"
                        : isWrong
                        ? "rgba(239,68,68,0.06)"
                        : "rgba(255,255,255,0.01)",
                      color: isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#475569",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: isCorrect
                          ? "#22c55e"
                          : isWrong
                          ? "#ef4444"
                          : "rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#fff",
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      {isCorrect ? "✓" : isWrong ? "✕" : ["A", "B", "C", "D"][i]}
                    </span>
                    {opt}
                  </div>
                );
              })}
              <div
                style={{
                  marginTop: 4,
                  padding: "16px 18px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 12,
                  fontSize: 13,
                  color: "#a5b4fc",
                  lineHeight: 1.65,
                }}
              >
                <span style={{ fontWeight: 700, color: "#818cf8" }}>Explanation: </span>
                {currentQuestion.explanation}
              </div>
            </div>
          )}

          {/* Open Answer Area */}
          {!isMcq && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: showFeedback
                    ? "1.5px solid rgba(255,255,255,0.05)"
                    : "1.5px solid rgba(99,102,241,0.15)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#6366f1",
                      animation: !showFeedback ? "pulse 2s infinite" : "none",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>
                    Your answer
                  </span>
                </div>
                <textarea
                  ref={answerRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here… be thorough, think out loud."
                  disabled={showFeedback}
                  style={{
                    width: "100%",
                    minHeight: 160,
                    padding: "16px",
                    background: "transparent",
                    border: "none",
                    color: "#e2e8f0",
                    fontSize: 14,
                    lineHeight: "1.7",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    opacity: showFeedback ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          )}

          {/* Sample answer feedback */}
          {showFeedback && !isMcq && currentQuestion?.sampleAnswer && (
            <div
              style={{
                padding: "20px",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 10, letterSpacing: 0.5 }}>
                SAMPLE STRONG ANSWER
              </div>
              <p style={{ fontSize: 14, color: "#86efac", lineHeight: 1.7, margin: 0 }}>
                {currentQuestion.sampleAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(9,10,14,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 40,
        }}
      >
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          {!showFeedback && (
            <button
              onClick={() => setShowHint((v) => !v)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(245,158,11,0.2)",
                background: showHint ? "rgba(245,158,11,0.08)" : "transparent",
                color: "#f59e0b",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              💡 Hint
            </button>
          )}
          <button
            onClick={handleRestart}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent",
              color: "#475569",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ↩ Restart
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#334155" }}>
            {currentIndex + 1}/{questions.length}
          </span>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${((currentIndex) / questions.length) * 100}%`,
                background: "#6366f1",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={isMcq ? selectedOption === null : answer.trim().length < 10}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "none",
              background:
                (isMcq ? selectedOption !== null : answer.trim().length >= 10)
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.06)",
              color:
                (isMcq ? selectedOption !== null : answer.trim().length >= 10)
                  ? "#fff"
                  : "#334155",
              cursor:
                (isMcq ? selectedOption !== null : answer.trim().length >= 10)
                  ? "pointer"
                  : "not-allowed",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              minWidth: 120,
            }}
          >
            Submit Answer →
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              minWidth: 120,
            }}
          >
            {currentIndex + 1 >= questions.length ? "Finish Session ✓" : "Next Question →"}
          </button>
        )}
      </div>

      <NotesPanel sessionKey={sessionKey} isOpen={notesOpen} onToggle={() => setNotesOpen(false)} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
