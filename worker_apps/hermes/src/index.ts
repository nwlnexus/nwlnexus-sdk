import type { MessageBatch } from '@cloudflare/workers-types';

export default {
  async queue(_batch: MessageBatch<unknown>, _env: unknown): Promise<void> {},

  async scheduled(event: ScheduledEvent, env: unknown, _ctx: ExecutionContext) {
    console.log('Event scheduled time:', event.scheduledTime);
    console.log('Event cron', event.cron);
    console.log(env);
  }
};
