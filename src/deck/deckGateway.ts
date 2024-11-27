import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class DeckGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Usuário conectado:', client.id);
  }

  notifyImportStatus(clientId: string, message: string) {
    this.server.to(clientId).emit('importStatus', { message });
  }
}
