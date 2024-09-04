export default async function (fastify, opts) {
  // Fetch the 10 most recently published job postings
  fastify.get('/recent', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              description: { type: 'string' },
              requirements: { type: 'string' },
              poster_id: { type: 'integer' },
              lowest_bid_amount: { type: 'number' },
              number_of_bids: { type: 'integer' },
              expiration_date: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { data, error } = await fastify.supabase
        .from('jobs')
        .select('*')
        .order('id', { ascending: false })
        .limit(10)

      if (error) {
        reply.internalServerError(error.message)
      } else {
        reply.send(data)
      }
    },
  })

  // Fetch the top 10 most active and open jobs
  fastify.get('/active', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              description: { type: 'string' },
              requirements: { type: 'string' },
              poster_id: { type: 'integer' },
              lowest_bid_amount: { type: 'number' },
              number_of_bids: { type: 'integer' },
              expiration_date: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { data, error } = await fastify.supabase
        .from('jobs')
        .select('*')
        .order('number_of_bids', { ascending: false })
        .limit(10)

      if (error) {
        reply.internalServerError(error.message)
      } else {
        reply.send(data)
      }
    },
  })

  // Post a new job
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: [
          'description',
          'requirements',
          'poster_id',
          'expiration_date',
        ],
        properties: {
          description: { type: 'string' },
          requirements: { type: 'string' },
          poster_id: { type: 'integer' },
          expiration_date: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            description: { type: 'string' },
            requirements: { type: 'string' },
            poster_id: { type: 'integer' },
            lowest_bid_amount: { type: 'number' },
            number_of_bids: { type: 'integer' },
            expiration_date: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { description, requirements, poster_id, expiration_date } =
        request.body
      const { data, error } = await fastify.supabase
        .from('jobs')
        .insert([{ description, requirements, poster_id, expiration_date }])
        .single()

      if (error) {
        reply.internalServerError(error.message)
      } else {
        reply.code(201).send(data)
      }
    },
  })

  // Place a bid on a job
  fastify.post('/:id/bids', {
    schema: {
      body: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'number' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { id } = request.params
      const { amount } = request.body

      try {
        // Insert the bid
        const { data: bidData, error: bidError } = await fastify.supabase
          .from('bids')
          .insert([{ job_id: id, amount, bid_time: new Date().toISOString() }])

        if (bidError) {
          throw bidError
        }

        // Fetch the current job details
        const { data: jobData, error: jobFetchError } = await fastify.supabase
          .from('jobs')
          .select('lowest_bid_amount, number_of_bids')
          .eq('id', id)
          .single()

        if (jobFetchError) {
          throw jobFetchError
        }

        // Calculate the new lowest bid amount and increment the number of bids
        if(!jobData.lowest_bid_amount) {
          jobData.lowest_bid_amount = Infinity
        }
        const newLowestBidAmount = Math.min(jobData.lowest_bid_amount, amount)
        const newNumberOfBids = jobData.number_of_bids + 1
        
        // Update the job
        const { data: updatedJobData, error: jobUpdateError } =
          await fastify.supabase
            .from('jobs')
            .update({
              lowest_bid_amount: newLowestBidAmount,
              number_of_bids: newNumberOfBids,
            })
            .eq('id', id)

        if (jobUpdateError) {
          throw jobUpdateError
        }

        reply.code(201).send({ status: 'Bid placed successfully' })
      } catch (error) {
        reply.internalServerError(error.message)
      }
    },
  })
}
