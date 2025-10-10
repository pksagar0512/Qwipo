import { getSmartRecommendationsForMessage, appendToSession } from "../services/qwiChatService.js";

export const handleQwiChat = async (req, res) => {
  try {
    const body = req.body || {};
    const message = body.message || body.query || "";
    const sessionId = body.sessionId || null;
    const user = req.user || null;

    console.log("⚙️ Reached qwiChat route - body:", Object.keys(body));

    await appendToSession(sessionId, "user", message, { userId: user?._id });

    const recs = await getSmartRecommendationsForMessage(message, { user });

    const reply = (recs && recs.products && recs.products.length)
      ? { sessionId: sessionId || (recs.sessionId || null), type: recs.type, products: recs.products }
      : { sessionId: sessionId || null, type: recs.type || "none", products: [] , message: "Sorry, I couldn't find anything for that." };

    await appendToSession(reply.sessionId, "assistant", reply.message || `returned ${reply.products.length} products`, { meta: { type: reply.type } });

    return res.json(reply);
  } catch (err) {
    console.error("QwiChat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
