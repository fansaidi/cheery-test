let clients = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    // Broadcast to all connected SSE clients
    clients.forEach((client) => {
      try {
        console.debug(`Broadcasted to client(${client.id}):`, data);
        client.res.write(`event: updated\ndata: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error("Error sending data to client:", error);
      }
    });

    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.flushHeaders(); // flush the headers to establish SSE

    const clientId = req.query.clientId || Date.now(); // optional tracking
    console.log("New client connected:", clientId);

    const client = { id: clientId, res };
    clients.push(client);

    // Keep connection alive with pings
    const intervalId = setInterval(() => {
      res.write(`event: ping\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
    }, 5000); // 10s interval

    // Clean up when client disconnects
    req.on("close", () => {
      console.log("Client disconnected:", clientId);
      clearInterval(intervalId);
      clients = clients.filter((c) => c.id !== clientId);
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
