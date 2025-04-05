import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-your-api-key"
});

interface EmailAnalysisResult {
  isScam: boolean;
  scamProbability: number;
  reasons: string[];
  summary: string;
  category: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  sensitiveContent: boolean;
  unsubscribeRecommended: boolean;
  unsubscribeReason?: string;
}

export async function analyzeEmail(
  from: string,
  subject: string,
  body: string
): Promise<EmailAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an email security expert specializing in detecting phishing, scams, and analyzing email content. 
          Analyze the provided email and return a detailed assessment in JSON format.`
        },
        {
          role: "user",
          content: `Analyze this email for security threats, content type, and provide recommendations:
          
          From: ${from}
          Subject: ${subject}
          Body: ${body}
          
          Provide a detailed analysis including:
          - Is this likely a scam or phishing attempt?
          - What's the probability it's malicious (0-1 scale)?
          - Specific reasons for your determination
          - Brief summary of the email content
          - Email category (e.g., promotional, newsletter, personal, business, etc.)
          - Urgency level (low, medium, high)
          - Does it contain sensitive content requests?
          - Should the user unsubscribe from this sender? If yes, provide a reason.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(response.choices[0].message.content) as EmailAnalysisResult;
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing email with OpenAI:", error);
    // Return a default analysis in case of error
    return {
      isScam: false,
      scamProbability: 0,
      reasons: ["Analysis failed due to API error"],
      summary: "Email analysis failed",
      category: "unknown",
      urgencyLevel: "low",
      sensitiveContent: false,
      unsubscribeRecommended: false
    };
  }
}

export async function generateUnsubscribeEmail(
  to: string,
  fromName: string,
  serviceDescription: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an assistant that helps users unsubscribe from email lists. Create formal, concise unsubscribe request emails."
        },
        {
          role: "user",
          content: `Generate a polite, brief email requesting to unsubscribe from a mailing list.
          
          To: ${to}
          My name: ${fromName}
          Service description: ${serviceDescription}`
        }
      ]
    });

    return response.choices[0].message.content || "Failed to generate unsubscribe email";
  } catch (error) {
    console.error("Error generating unsubscribe email:", error);
    return "Failed to generate unsubscribe email due to an error.";
  }
}
