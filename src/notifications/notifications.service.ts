import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  handleNotification(notification: any): void {
    console.log('Notification received:', notification);

  }
}
