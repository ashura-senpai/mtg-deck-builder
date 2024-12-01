import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Registry, Gauge, Counter } from 'prom-client';

@Injectable()
export class PrometheusService {
    private readonly registry: Registry;
    public readonly requestCounter: Counter;
    public readonly latencyGauge: Gauge;

    constructor() {
        this.registry = new Registry();

        collectDefaultMetrics({ register: this.registry });

        this.requestCounter = new Counter({
            name: 'http_requests_total',
            help: 'Total de requisições http recebidas',
            labelNames: ['method', 'route', 'status_code'],
        });

        this.latencyGauge = new Gauge({
            name: 'http_request_duration_seconds',
            help: 'duraco das requisicoes HTTP',
            labelNames: ['method', 'route'],
        });

        this.registry.registerMetric(this.requestCounter);
        this.registry.registerMetric(this.latencyGauge);
    }

    async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }
}
