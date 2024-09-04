import fp from 'fastify-plugin';
import cron from 'node-cron';

async function cronPlugin(fastify, options) {
  // Schedule a job to run every hour to close expired jobs
  cron.schedule('0 * * * *', async () => {
    try {
      const { data: expiredJobs, error } = await fastify.supabase
        .from('jobs')
        .select('id')
        .lte('expiration_date', new Date().toISOString())
        .eq('status', 'open');

      if (error) {
        fastify.log.error('Error fetching expired jobs:', error.message);
        return;
      }

      if (expiredJobs.length > 0) {
        const jobIds = expiredJobs.map(job => job.id);

        const { error: updateError } = await fastify.supabase
          .from('jobs')
          .update({ status: 'closed' })
          .in('id', jobIds);

        if (updateError) {
          fastify.log.error('Error updating job status:', updateError.message);
        } else {
          fastify.log.info(`Closed ${expiredJobs.length} expired jobs.`);
        }
      }
    } catch (err) {
      fastify.log.error('Error in scheduled job:', err.message);
    }
  });

  fastify.addHook('onClose', async (instance, done) => {
    // Perform any necessary cleanup here
    done();
  });
}

export default fp(cronPlugin);