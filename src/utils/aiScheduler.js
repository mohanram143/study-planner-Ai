import { GoogleGenAI } from "@google/genai";

// Priority constants
export const PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

// Gemini Client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Generate AI Schedule
export async function generateAISchedule({
  subjects,
  availableHours,
  startDate,
  endDate,
}) {
  const prompt = `
You are an expert study planner AI.

Generate a detailed and optimized study schedule.

Subjects to study:
${subjects
  .map(
    (s) =>
      `- ${s.name}
Priority: ${s.priority || "medium"}
Hours needed: ${s.hoursNeeded || 5}
Deadline: ${s.deadline || "flexible"}`
  )
  .join("\n")}

Available study hours per day: ${availableHours} hours
Start date: ${startDate}
End date: ${endDate}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text

JSON Format:
{
  "sessions": [
    {
      "date": "YYYY-MM-DD",
      "subject": "Subject Name",
      "topic": "Specific topic to study",
      "startTime": "09:00",
      "endTime": "10:30",
      "duration": 90,
      "priority": "high",
      "type": "study"
    }
  ],
  "tips": [
    "tip1",
    "tip2",
    "tip3"
  ],
  "totalHours": 20,
  "summary": "Brief summary"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Gemini response text
    const text = response.text || "{}";

    // Remove accidental markdown
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(clean);
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError);

      parsed = {
        sessions: [],
        tips: [
          "AI returned invalid format",
          "Please try again",
        ],
        totalHours: 0,
        summary: "Could not parse AI response",
      };
    }

    return parsed;
  } catch (err) {
    console.error("AI schedule error:", err);

    return {
      sessions: [],
      tips: [
        "Check your internet connection",
        "Verify your Gemini API key",
        "Try again in a few seconds",
      ],
      totalHours: 0,
      summary: "Could not generate schedule. Please try again.",
    };
  }
}

// Subject colors
export const SUBJECT_COLORS = [
  {
    bg: "rgba(124,58,237,0.15)",
    border: "#7c3aed",
    text: "#a78bfa",
    dot: "#7c3aed",
  },
  {
    bg: "rgba(16,185,129,0.15)",
    border: "#10b981",
    text: "#34d399",
    dot: "#10b981",
  },
  {
    bg: "rgba(245,158,11,0.15)",
    border: "#f59e0b",
    text: "#fbbf24",
    dot: "#f59e0b",
  },
  {
    bg: "rgba(239,68,68,0.15)",
    border: "#ef4444",
    text: "#f87171",
    dot: "#ef4444",
  },
  {
    bg: "rgba(59,130,246,0.15)",
    border: "#3b82f6",
    text: "#60a5fa",
    dot: "#3b82f6",
  },
  {
    bg: "rgba(236,72,153,0.15)",
    border: "#ec4899",
    text: "#f472b6",
    dot: "#ec4899",
  },
  {
    bg: "rgba(20,184,166,0.15)",
    border: "#14b8a6",
    text: "#2dd4bf",
    dot: "#14b8a6",
  },
  {
    bg: "rgba(249,115,22,0.15)",
    border: "#f97316",
    text: "#fb923c",
    dot: "#f97316",
  },
];