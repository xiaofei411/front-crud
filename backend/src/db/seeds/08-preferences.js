exports.seed = knex =>
  knex('preferences')
    .del()
    .then(() =>
      knex('preferences').insert({
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        allow_analysis: true,
        allow_communication: true,
      })
    )
    .then(() =>
      knex('preferences').insert({
        user_id: 'f3d402b1-6109-4ae5-9fc8-40c7459bb84d',
        allow_analysis: true,
        allow_communication: true,
      })
    )
    .then(() =>
      knex('preferences').insert({
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d59878',
        allow_analysis: false,
        allow_communication: false,
      })
    );
