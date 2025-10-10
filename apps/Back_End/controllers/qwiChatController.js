import { getSmartRecommendationsForMessage, appendToSession } from "../services/qwiChatService.js";

export const handleQwiChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ message: "Missing 'message' in request" });

    const user = req.user || null;

    // store user message in session (optional)
    const session = await appendToSession(sessionId, "user", message, { userId: user?._id });

    const rec = await getSmartRecommendationsForMessage(message, { user });

    // attach session id if created
    const response = {
      sessionId: session?.sessionId || sessionId || null,
      type: rec.type,
      products: rec.products || [],
      message: rec.products && rec.products.length ? undefined : (rec.message || "Sorry, I couldn't find anything."),
    };

    return res.json(response);
  } catch (err) {
    console.error("QwiChat error:", err);
    return res.status(500).json({ message: "Server error in QwiChat" });
  }
};
