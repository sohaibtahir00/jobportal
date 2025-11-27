// Sample questions and prep data for skills assessment

export type NicheCategory = "AI/ML" | "Healthcare IT" | "Fintech" | "Cybersecurity";
export type QuestionSection = "technical" | "coding" | "system-design";
export type Difficulty = "easy" | "medium" | "hard";

export interface SampleQuestion {
  id: string;
  category: NicheCategory;
  section: QuestionSection;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  codeSnippet?: string;
}

export interface StudyTopic {
  title: string;
  description: string;
  resources: { title: string; url: string; type: "article" | "video" | "docs" }[];
}

export interface PrepTip {
  title: string;
  description: string;
  icon: string;
}

// Sample Questions Data
export const sampleQuestions: SampleQuestion[] = [
  // AI/ML Questions
  {
    id: "aiml-1",
    category: "AI/ML",
    section: "technical",
    difficulty: "medium",
    question: "What is the primary purpose of regularization in machine learning?",
    options: [
      "To speed up training",
      "To prevent overfitting",
      "To increase model complexity",
      "To reduce training data requirements",
    ],
    answer: "To prevent overfitting",
    explanation:
      "Regularization adds a penalty term to the loss function to discourage overly complex models, helping prevent overfitting to training data. Common techniques include L1 (Lasso) and L2 (Ridge) regularization.",
  },
  {
    id: "aiml-2",
    category: "AI/ML",
    section: "technical",
    difficulty: "easy",
    question: "Which activation function is commonly used in the output layer for binary classification?",
    options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
    answer: "Sigmoid",
    explanation:
      "Sigmoid squashes values between 0 and 1, making it ideal for binary classification where we need a probability output. Softmax is used for multi-class classification.",
  },
  {
    id: "aiml-3",
    category: "AI/ML",
    section: "coding",
    difficulty: "medium",
    question: "Write a function to implement gradient descent for linear regression.",
    codeSnippet: `def gradient_descent(X, y, learning_rate=0.01, iterations=1000):
    # Your implementation here
    pass`,
    answer: `def gradient_descent(X, y, learning_rate=0.01, iterations=1000):
    m = len(y)
    theta = np.zeros(X.shape[1])

    for _ in range(iterations):
        predictions = X.dot(theta)
        errors = predictions - y
        gradient = (1/m) * X.T.dot(errors)
        theta -= learning_rate * gradient

    return theta`,
    explanation:
      "Gradient descent iteratively updates parameters by moving in the direction of steepest descent. The gradient is computed as the derivative of the cost function with respect to each parameter.",
  },
  {
    id: "aiml-4",
    category: "AI/ML",
    section: "system-design",
    difficulty: "hard",
    question:
      "Design a real-time recommendation system for an e-commerce platform that handles 10 million daily active users.",
    answer:
      "Key components: 1) Feature store for user/item embeddings, 2) Two-stage retrieval (candidate generation + ranking), 3) Redis for real-time feature serving, 4) Kafka for event streaming, 5) A/B testing framework, 6) Model serving with low latency (TensorFlow Serving/TorchServe), 7) Fallback strategies for cold start users.",
    explanation:
      "Real-time recommendation systems require balancing accuracy with latency. The two-stage approach allows filtering millions of items down to a manageable candidate set before applying expensive ranking models.",
  },
  {
    id: "aiml-5",
    category: "AI/ML",
    section: "technical",
    difficulty: "hard",
    question: "Explain the difference between batch normalization and layer normalization. When would you use each?",
    answer:
      "Batch normalization normalizes across the batch dimension, while layer normalization normalizes across the feature dimension. Use batch norm for CNNs with large batch sizes; use layer norm for RNNs/Transformers or when batch sizes are small or variable.",
    explanation:
      "Batch norm depends on batch statistics, making it problematic for small batches or sequence models. Layer norm is independent of batch size, making it more suitable for NLP tasks and situations with variable sequence lengths.",
  },

  // Healthcare IT Questions
  {
    id: "health-1",
    category: "Healthcare IT",
    section: "technical",
    difficulty: "easy",
    question: "What does HIPAA stand for and what is its primary purpose?",
    options: [
      "Health Insurance Portability and Accountability Act - Protects patient health information",
      "Healthcare Information Privacy and Access Act - Regulates medical billing",
      "Health Integration Protocol and Authentication Act - Standardizes medical records",
      "Hospital Information Processing and Administration Act - Manages healthcare facilities",
    ],
    answer: "Health Insurance Portability and Accountability Act - Protects patient health information",
    explanation:
      "HIPAA establishes national standards for protecting sensitive patient health information (PHI). It requires appropriate safeguards to protect privacy and sets limits on the use and disclosure of health information.",
  },
  {
    id: "health-2",
    category: "Healthcare IT",
    section: "technical",
    difficulty: "medium",
    question: "What is HL7 FHIR and why is it important in healthcare interoperability?",
    answer:
      "FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare information electronically. It uses modern web technologies (REST APIs, JSON/XML) making it easier to implement than previous HL7 versions.",
    explanation:
      "FHIR addresses the complexity of healthcare data exchange by providing a modular approach with resources (Patient, Observation, Medication, etc.) that can be combined as needed. Its REST-based approach makes integration with modern applications much simpler.",
  },
  {
    id: "health-3",
    category: "Healthcare IT",
    section: "coding",
    difficulty: "medium",
    question: "Write a function to validate a patient identifier format (MRN) following the pattern: 3 letters followed by 6 digits.",
    codeSnippet: `function validateMRN(mrn: string): boolean {
  // Your implementation here
}`,
    answer: `function validateMRN(mrn: string): boolean {
  const pattern = /^[A-Z]{3}\\d{6}$/;
  return pattern.test(mrn.toUpperCase());
}`,
    explanation:
      "Medical Record Numbers (MRNs) often follow specific formats for validation. Regular expressions provide an efficient way to validate these patterns. The pattern ensures exactly 3 uppercase letters followed by exactly 6 digits.",
  },
  {
    id: "health-4",
    category: "Healthcare IT",
    section: "system-design",
    difficulty: "hard",
    question:
      "Design a telemedicine platform that supports video consultations, maintains HIPAA compliance, and integrates with existing EHR systems.",
    answer:
      "Key components: 1) End-to-end encrypted video (WebRTC with SRTP), 2) HIPAA-compliant cloud infrastructure (AWS GovCloud/Azure Healthcare), 3) FHIR API for EHR integration, 4) Audit logging for all PHI access, 5) Role-based access control, 6) Secure messaging with encryption at rest, 7) BAA agreements with all vendors.",
    explanation:
      "Telemedicine platforms must balance user experience with strict compliance requirements. HIPAA requires technical safeguards (encryption), administrative safeguards (policies), and physical safeguards (access controls).",
  },
  {
    id: "health-5",
    category: "Healthcare IT",
    section: "technical",
    difficulty: "medium",
    question: "What are the key differences between ICD-10 and CPT coding systems?",
    answer:
      "ICD-10 codes describe diagnoses and conditions (what's wrong with the patient), while CPT codes describe medical procedures and services performed (what was done). ICD-10 is maintained by WHO, CPT by the AMA.",
    explanation:
      "Both coding systems are essential for healthcare billing and documentation. ICD-10 has over 70,000 diagnosis codes providing detailed clinical information, while CPT codes are used for billing and reimbursement of medical services.",
  },

  // Fintech Questions
  {
    id: "fin-1",
    category: "Fintech",
    section: "technical",
    difficulty: "easy",
    question: "What is PCI DSS and why is it important for payment processing?",
    options: [
      "Payment Card Industry Data Security Standard - Protects cardholder data",
      "Personal Credit Information Data Storage System - Manages credit scores",
      "Processing Card Interface Digital Security Service - Encrypts transactions",
      "Payment Compliance Industry Data Safety Standard - Audits financial systems",
    ],
    answer: "Payment Card Industry Data Security Standard - Protects cardholder data",
    explanation:
      "PCI DSS is a set of security standards designed to ensure all companies that process, store, or transmit credit card information maintain a secure environment. Non-compliance can result in fines and loss of ability to process card payments.",
  },
  {
    id: "fin-2",
    category: "Fintech",
    section: "technical",
    difficulty: "medium",
    question: "Explain the concept of eventual consistency in distributed financial systems and its implications.",
    answer:
      "Eventual consistency means all replicas will eventually return the same value, but there may be temporary inconsistencies. In financial systems, this requires careful handling through techniques like idempotency keys, saga patterns, and compensating transactions.",
    explanation:
      "While strong consistency seems ideal for financial systems, the CAP theorem shows it's impossible to have both availability and partition tolerance with strong consistency. Eventual consistency with proper safeguards provides a practical solution for scalable systems.",
  },
  {
    id: "fin-3",
    category: "Fintech",
    section: "coding",
    difficulty: "hard",
    question: "Implement a function to detect potential fraudulent transactions using velocity checking (more than 3 transactions from same card in 5 minutes).",
    codeSnippet: `interface Transaction {
  cardId: string;
  timestamp: Date;
  amount: number;
}

function detectVelocityFraud(transactions: Transaction[], newTransaction: Transaction): boolean {
  // Your implementation here
}`,
    answer: `function detectVelocityFraud(transactions: Transaction[], newTransaction: Transaction): boolean {
  const fiveMinutesAgo = new Date(newTransaction.timestamp.getTime() - 5 * 60 * 1000);

  const recentTransactions = transactions.filter(
    tx => tx.cardId === newTransaction.cardId &&
    tx.timestamp >= fiveMinutesAgo &&
    tx.timestamp <= newTransaction.timestamp
  );

  return recentTransactions.length >= 3;
}`,
    explanation:
      "Velocity checking is a fundamental fraud detection technique. It identifies suspicious patterns like rapid successive transactions that might indicate a stolen card. Production systems would use more sophisticated ML-based approaches alongside rule-based checks.",
  },
  {
    id: "fin-4",
    category: "Fintech",
    section: "system-design",
    difficulty: "hard",
    question:
      "Design a real-time payment processing system that handles 100,000 transactions per second with 99.99% availability.",
    answer:
      "Key components: 1) Load balancer with health checks, 2) Stateless API servers with horizontal scaling, 3) Message queue (Kafka) for async processing, 4) Distributed database with sharding (CockroachDB/Spanner), 5) Multi-region deployment, 6) Circuit breakers and rate limiting, 7) Idempotency keys for retry safety, 8) Hot-warm-cold data tiering.",
    explanation:
      "High-throughput payment systems require careful attention to consistency, idempotency, and fault tolerance. The combination of synchronous validation with asynchronous settlement provides the best balance of user experience and system reliability.",
  },
  {
    id: "fin-5",
    category: "Fintech",
    section: "technical",
    difficulty: "medium",
    question: "What is the difference between symmetric and asymmetric encryption? Give examples of each used in financial systems.",
    answer:
      "Symmetric uses same key for encryption/decryption (AES for data at rest), while asymmetric uses public/private key pairs (RSA/ECDSA for digital signatures, TLS handshakes). Financial systems use both: symmetric for bulk data, asymmetric for key exchange and authentication.",
    explanation:
      "Understanding encryption is critical for fintech security. Symmetric is faster but requires secure key distribution. Asymmetric solves the key distribution problem but is computationally expensive, hence the hybrid approach used in TLS.",
  },

  // Cybersecurity Questions
  {
    id: "cyber-1",
    category: "Cybersecurity",
    section: "technical",
    difficulty: "easy",
    question: "What is the principle of least privilege and why is it important?",
    options: [
      "Users should have minimum access needed for their job - Reduces attack surface",
      "Systems should use minimum computing resources - Improves performance",
      "Code should have minimum dependencies - Reduces vulnerabilities",
      "Networks should have minimum connections - Simplifies topology",
    ],
    answer: "Users should have minimum access needed for their job - Reduces attack surface",
    explanation:
      "The principle of least privilege limits potential damage from compromised accounts or insider threats. If a user only has access to what they need, an attacker who compromises that account is similarly limited.",
  },
  {
    id: "cyber-2",
    category: "Cybersecurity",
    section: "technical",
    difficulty: "medium",
    question: "Explain the difference between authentication and authorization. Provide examples of vulnerabilities in each.",
    answer:
      "Authentication verifies identity (who you are), authorization determines access rights (what you can do). Auth vulnerabilities: weak passwords, credential stuffing. Authz vulnerabilities: IDOR, privilege escalation, broken access control.",
    explanation:
      "These concepts are often confused but serve different purposes. A user might authenticate successfully but still be denied access to resources they're not authorized for. Both must be implemented correctly for secure systems.",
  },
  {
    id: "cyber-3",
    category: "Cybersecurity",
    section: "coding",
    difficulty: "medium",
    question: "Identify the security vulnerability in this code and write a secure version.",
    codeSnippet: `app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, result) => {
    res.json(result);
  });
});`,
    answer: `app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});`,
    explanation:
      "The original code is vulnerable to SQL injection. User input is concatenated directly into the query, allowing attackers to manipulate the SQL. Parameterized queries (prepared statements) prevent this by treating user input as data, not code.",
  },
  {
    id: "cyber-4",
    category: "Cybersecurity",
    section: "system-design",
    difficulty: "hard",
    question:
      "Design a security architecture for a zero-trust enterprise network supporting remote workers.",
    answer:
      "Key components: 1) Identity provider with MFA (Okta/Azure AD), 2) Device trust verification (MDM, health checks), 3) Micro-segmentation with software-defined perimeter, 4) Continuous authentication and authorization, 5) Encrypted tunnels (WireGuard/ZTNA), 6) SIEM for logging/monitoring, 7) DLP for data protection, 8) CASB for SaaS security.",
    explanation:
      "Zero trust assumes no implicit trust based on network location. Every access request must be verified regardless of origin. This is especially important with remote work where traditional perimeter security is ineffective.",
  },
  {
    id: "cyber-5",
    category: "Cybersecurity",
    section: "technical",
    difficulty: "hard",
    question: "Explain the OWASP Top 10 vulnerability 'Broken Access Control' and describe three different attack scenarios.",
    answer:
      "Broken Access Control occurs when restrictions on authenticated users aren't properly enforced. Scenarios: 1) IDOR - accessing other users' data by changing IDs, 2) Privilege escalation - regular user accessing admin functions, 3) Metadata manipulation - modifying JWT claims or hidden form fields to elevate privileges.",
    explanation:
      "Broken Access Control has been the #1 vulnerability in OWASP Top 10 since 2021. It encompasses many attack types where users can act outside their intended permissions. Defense requires implementing access controls on the server side, denying by default.",
  },
];

// Study Topics by Niche
export const studyTopicsByNiche: Record<NicheCategory, StudyTopic[]> = {
  "AI/ML": [
    {
      title: "Machine Learning Fundamentals",
      description: "Supervised, unsupervised, and reinforcement learning basics",
      resources: [
        { title: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", type: "article" },
        { title: "Andrew Ng's ML Course", url: "https://www.coursera.org/learn/machine-learning", type: "video" },
      ],
    },
    {
      title: "Deep Learning",
      description: "Neural networks, CNNs, RNNs, Transformers",
      resources: [
        { title: "Deep Learning Book", url: "https://www.deeplearningbook.org/", type: "article" },
        { title: "Fast.ai Practical Deep Learning", url: "https://www.fast.ai/", type: "video" },
      ],
    },
    {
      title: "MLOps & Deployment",
      description: "Model serving, monitoring, and pipeline orchestration",
      resources: [
        { title: "MLOps Guide", url: "https://ml-ops.org/", type: "docs" },
        { title: "TensorFlow Serving Docs", url: "https://www.tensorflow.org/tfx/serving/", type: "docs" },
      ],
    },
  ],
  "Healthcare IT": [
    {
      title: "HIPAA Compliance",
      description: "Privacy rule, security rule, and breach notification",
      resources: [
        { title: "HHS HIPAA Guide", url: "https://www.hhs.gov/hipaa/", type: "docs" },
        { title: "HIPAA Training Resources", url: "https://www.hhs.gov/hipaa/for-professionals/training/", type: "article" },
      ],
    },
    {
      title: "Healthcare Interoperability",
      description: "HL7 FHIR, CDA, and healthcare data standards",
      resources: [
        { title: "HL7 FHIR Documentation", url: "https://www.hl7.org/fhir/", type: "docs" },
        { title: "SMART on FHIR", url: "https://docs.smarthealthit.org/", type: "docs" },
      ],
    },
    {
      title: "Clinical Terminology",
      description: "ICD-10, CPT, SNOMED CT, and LOINC",
      resources: [
        { title: "ICD-10 Browser", url: "https://icd.who.int/browse10/", type: "docs" },
        { title: "SNOMED CT Browser", url: "https://browser.ihtsdotools.org/", type: "docs" },
      ],
    },
  ],
  Fintech: [
    {
      title: "Payment Systems",
      description: "Card networks, ACH, wire transfers, and real-time payments",
      resources: [
        { title: "Stripe Payment Guides", url: "https://stripe.com/guides", type: "article" },
        { title: "Federal Reserve Payment Systems", url: "https://www.federalreserve.gov/paymentsystems.htm", type: "docs" },
      ],
    },
    {
      title: "Financial Regulations",
      description: "PCI DSS, PSD2, KYC/AML requirements",
      resources: [
        { title: "PCI DSS Requirements", url: "https://www.pcisecuritystandards.org/", type: "docs" },
        { title: "KYC/AML Overview", url: "https://www.fincen.gov/", type: "docs" },
      ],
    },
    {
      title: "Distributed Systems for Finance",
      description: "Consistency, idempotency, and transaction processing",
      resources: [
        { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "article" },
        { title: "Martin Kleppmann's Blog", url: "https://martin.kleppmann.com/", type: "article" },
      ],
    },
  ],
  Cybersecurity: [
    {
      title: "Application Security",
      description: "OWASP Top 10, secure coding, and vulnerability assessment",
      resources: [
        { title: "OWASP Top 10", url: "https://owasp.org/Top10/", type: "docs" },
        { title: "OWASP Cheat Sheets", url: "https://cheatsheetseries.owasp.org/", type: "docs" },
      ],
    },
    {
      title: "Network Security",
      description: "Firewalls, VPNs, IDS/IPS, and network monitoring",
      resources: [
        { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", type: "docs" },
        { title: "SANS Reading Room", url: "https://www.sans.org/reading-room/", type: "article" },
      ],
    },
    {
      title: "Identity & Access Management",
      description: "Authentication, authorization, OAuth, and SSO",
      resources: [
        { title: "OAuth 2.0 Simplified", url: "https://oauth.net/2/", type: "docs" },
        { title: "Auth0 Documentation", url: "https://auth0.com/docs/", type: "docs" },
      ],
    },
  ],
};

// Assessment section details
export const assessmentSections = [
  {
    name: "Technical Skills",
    duration: 20,
    questions: 15,
    description: "Multiple choice and short answer questions testing core knowledge",
    topics: [
      "Domain-specific terminology and concepts",
      "Best practices and industry standards",
      "Architecture patterns and design principles",
      "Tools and technologies",
    ],
  },
  {
    name: "Practical Coding",
    duration: 25,
    questions: 5,
    description: "Hands-on coding challenges in your preferred language",
    topics: [
      "Algorithm implementation",
      "Data structure manipulation",
      "API design and implementation",
      "Code debugging and optimization",
    ],
  },
  {
    name: "System Design",
    duration: 15,
    questions: 3,
    description: "Scenario-based questions on system architecture",
    topics: [
      "Scalability and performance",
      "Security and compliance",
      "Integration patterns",
      "Trade-off analysis",
    ],
  },
];

// Prep tips
export const prepTips: PrepTip[] = [
  {
    title: "Test Your Environment",
    description: "Ensure stable internet, working camera/mic, and a quiet space before starting.",
    icon: "Monitor",
  },
  {
    title: "Read Questions Carefully",
    description: "Take time to understand what's being asked before answering. Look for keywords.",
    icon: "BookOpen",
  },
  {
    title: "Manage Your Time",
    description: "Don't spend too long on any single question. Mark difficult ones and return later.",
    icon: "Clock",
  },
  {
    title: "Show Your Work",
    description: "For coding and design questions, explain your thought process even if incomplete.",
    icon: "FileText",
  },
  {
    title: "Stay Calm",
    description: "It's normal to not know everything. Focus on demonstrating your problem-solving approach.",
    icon: "Heart",
  },
  {
    title: "Use Available Resources",
    description: "Documentation lookups are allowed. Know where to find information quickly.",
    icon: "Search",
  },
];

// Practice test questions (subset for mini assessment)
export const practiceTestQuestions: SampleQuestion[] = [
  sampleQuestions[0], // AI/ML technical
  sampleQuestions[5], // Healthcare technical
  sampleQuestions[10], // Fintech technical
  sampleQuestions[15], // Cybersecurity technical
  sampleQuestions[1], // AI/ML easy
  sampleQuestions[6], // Healthcare medium
  sampleQuestions[11], // Fintech medium
  sampleQuestions[16], // Cybersecurity medium
  sampleQuestions[4], // AI/ML hard
  sampleQuestions[14], // Fintech hard
];

// FAQ data
export const prepFAQs = [
  {
    question: "How long is the skills assessment?",
    answer: "The full assessment takes approximately 60 minutes, divided into three sections: Technical Skills (20 min), Practical Coding (25 min), and System Design (15 min).",
  },
  {
    question: "Can I use external resources during the test?",
    answer: "Yes, you may reference documentation and online resources. However, the test is proctored, so activities like copying code from external sources or communicating with others will be flagged.",
  },
  {
    question: "What happens if I lose internet connection?",
    answer: "Your progress is auto-saved every 30 seconds. If you disconnect, you can resume from where you left off within a 5-minute window. Longer disconnections may require restarting the current section.",
  },
  {
    question: "How is the assessment scored?",
    answer: "Each section contributes to your overall score. Technical Skills (40%), Practical Coding (35%), System Design (25%). You'll receive a tier rating (Elite, Advanced, Proficient, or Developing) based on your performance.",
  },
  {
    question: "Can I retake the assessment?",
    answer: "Yes, you can retake the assessment after a 30-day cooldown period. This ensures candidates have time to improve their skills between attempts.",
  },
  {
    question: "What equipment do I need?",
    answer: "You'll need a computer with a webcam and microphone, stable internet connection (minimum 5 Mbps), and a modern web browser (Chrome, Firefox, or Edge recommended).",
  },
  {
    question: "Is the assessment proctored?",
    answer: "Yes, the assessment uses AI-powered proctoring that monitors for suspicious activity. Your webcam and screen will be recorded. Multiple faces, tab switches, or unusual behavior may be flagged for review.",
  },
  {
    question: "How do I prepare for my specific niche?",
    answer: "Use our niche-specific study guides and sample questions. Focus on the core concepts for your field: AI/ML candidates should review ML fundamentals, Healthcare IT should study HIPAA/FHIR, Fintech should know PCI DSS, and Cybersecurity should master OWASP Top 10.",
  },
];
