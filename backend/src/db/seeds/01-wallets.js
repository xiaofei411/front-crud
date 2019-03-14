exports.seed = knex =>
  knex('wallets')
    .del()
    .then(() =>
      knex('wallets').insert({
        id: 'f43bbe17-1a8d-4e25-88cd-43bcf50ca5cf',
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        type: 'credit',
        amount: 3.5,
      })
    )
    .then(() =>
      knex('wallets').insert({
        id: 'a3af7f34-63e5-4704-a9d4-b408955e2fe1',
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        type: 'credit',
        amount: 1200,
      })
    )
    .then(() =>
      knex('wallets').insert({
        id: 'e7c73af9-f433-4b84-80c8-5e31139870e5',
        user_id: 'f3d402b1-6109-4ae5-9fc8-40c7459bb84d',
        type: 'credit',
        amount: 3.5,
      })
    )
    .then(() =>
      knex('wallets').insert({
        id: '00c219ec-11fd-4d1a-b740-369493cbf6d2',
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        type: 'debit',
        amount: 15,
      })
    )
    .then(() =>
      knex('wallets').insert({
        id: '00c219ec-11fd-4d1a-b740-369493cbf677',
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d59878',
        type: 'credit',
        amount: 100,
      })
    );
