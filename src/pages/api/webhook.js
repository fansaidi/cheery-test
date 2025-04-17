let clients = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    // Broadcast to all connected SSE clients
    clients.forEach((client) => {
      try {
        console.debug(`Broadcasted to client(${client.id}):`, data); // For debugging
        client.res.write(`event: updated\ndata: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error('Error sending data to client:', error);
      }
    });

    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.flushHeaders?.();

    res.write("event: connect\ndata: connected\n\n");

    const clientId = Date.now();
    const client = { id: clientId, res };

    console.log('New client connected:', clientId); // For debugging

    clients.push(client);

    // Keep connection alive
    const intervalId = setInterval(() => {
      const message = { time: new Date().toISOString() };
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, 5000);

    // Clean up on disconnect
    req.on("close", () => {
      clearInterval(intervalId);
      console.log('Client disconnected:', clientId); // For debugging
      clients = clients.filter((c) => c.id !== clientId);
      res.end();
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
