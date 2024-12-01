import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('deck.notifications')
  handleDeckNotifications(@Payload() notification: any): void {
    console.log('Notification received from RabbitMQ:', notification);
    this.notificationsService.handleNotification(notification);
  }
}
