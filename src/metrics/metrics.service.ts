import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';


//tentar implementar métricas personalizadas relacionadas aos decks depois
@Injectable()
export class MetricsService {
    private readonly register: client.Registry;

    constructor() {
        this.register = new client.Registry();

        const httpRequestCounter = new client.Counter({
            name: 'http_requests_total',
            help: 'Contador de requisicoes HTTP recebidas',
        });

        this.register.registerMetric(httpRequestCounter);

        client.collectDefaultMetrics({ register: this.register });
    }

    async getMetrics(): Promise<string> {
        return this.register.metrics();
    }
}
