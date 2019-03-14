exports.seed = knex =>
  knex('vendors_events')
    .del()
    .then(() =>
      knex('vendors_events').insert({
        id: '8041eeb8-cb26-494e-91f1-af94d09c9ef4',
        vendor_id: '5be32eed-06fa-481e-bccb-250956a92b1b',
        event_id: '216294c1-c3a8-42a4-83f1-3ad90cd3c23e',
      })
    );
