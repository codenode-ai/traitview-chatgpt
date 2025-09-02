// Função para obter o IP local da máquina
export function getLocalIP(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Tentativa 1: Usar WebRTC para descobrir o IP local
    const pc = new RTCPeerConnection({
      iceServers: []
    });
    
    pc.createDataChannel('');
    
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      
      const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)?.[1];
      
      if (myIP) {
        pc.onicecandidate = () => {};
        resolve(myIP);
      }
    };
    
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(reject);
      
    // Timeout para fallback
    setTimeout(() => {
      reject(new Error('Não foi possível obter o IP local'));
    }, 5000);
  });
}

// Função para obter o IP local com fallback
export async function getLocalOrigin(): Promise<string> {
  // Se estiver em produção (deploy), usar a URL atual da página
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Se estiver em desenvolvimento local, tentar obter o IP local
  try {
    const ip = await getLocalIP();
    return `http://${ip}:3001`;
  } catch (error) {
    console.warn('Não foi possível obter o IP local, usando localhost como fallback:', error);
    return 'http://localhost:3001';
  }
}