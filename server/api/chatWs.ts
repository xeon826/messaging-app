import { defineWebSocketHandler } from '#imports'
import type { Peer } from "crossws";
import { getQuery } from "ufo";
import { createOrFindChat } from '#imports';

// Keep track of all connected peers
const connectedPeers = new Set<Peer>();
const users = new Map<string, { online: boolean }>();

export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] open ${peer}`);
    
    const userId = getUserId(peer);
    if (!userId) {
      console.warn('User attempted to connect without userId');
      peer.send({
        user: "server",
        message: "Error: No user ID provided",
      });
      peer.close();
      return;
    }

    // Add peer to connected peers set
    connectedPeers.add(peer);
    users.set(userId, { online: true });

    const stats = getStats();
    peer.send({
      user: "server",
      message: `Welcome to the server ${userId}! (Online users: ${stats.online}/${stats.total})`,
    });

    // Subscribe to the chat channel
    peer.subscribe("chat");
    peer.publish("chat", { user: "server", message: `${peer} joined!` });
    
  },

  async message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`);

    const userId = getUserId(peer);
    const messageObj = {
      user: userId,
      message: message.text(),
    };

    // Store message in database
    // await addMessage(userId, '1', message.text());

    
    // Publish to all other subscribers
    broadcastMessage(messageObj)

  },

  close(peer, details) {
    console.log(`[ws] close ${peer}`);

    const userId = getUserId(peer);
    users.set(userId, { online: false });
    
    // Remove peer from connected peers set
    connectedPeers.delete(peer);

    // Broadcast leave message
    broadcastMessage({
      user: "server",
      message: `${userId} left!`
    });
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
    connectedPeers.delete(peer);
  },

  upgrade(req) {
    return {
      headers: {
        "x-powered-by": "cross-ws",
      },
    };
  },
});

// Helper function to broadcast message to all connected peers
function broadcastMessage(message: any) {
  for (const peer of connectedPeers) {
    peer.send(message);
  }
}

function getUserId(peer: Peer) {
  console.log('Peer URL:', peer.url); // Debug log
  // The URL in the peer object might be just the path part
  // We need to get the raw URL from the request
  const url = peer.url || peer.request?.url || '';
  console.log('URL being parsed:', url);
  const query = getQuery(url);
  console.log('Query params:', query); // Debug log
  const userId = query.userId;
  if (!userId) {
    console.warn('No userId found in query parameters');
  }
  return userId as string;
}

function getStats() {
  const online = Array.from(users.values()).filter((u) => u.online).length;
  return { online, total: users.size };
}

// async function addMessage(userId: string, message: string) {
// }
