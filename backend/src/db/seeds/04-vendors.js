exports.seed = knex =>
  knex('vendors')
    .del()
    .then(() =>
      knex('vendors').insert({
        id: '5be32eed-06fa-481e-bccb-250956a92b1b',
        name: 'Tasty Wines',
        website_url: 'https://www.example.com/',
      })
    )
    .then(() =>
      knex('vendors').insert({
        id: 'd15cc98d-1ad4-4436-ab7b-b711ab797cde',
        name: 'Texas Beers',
        website_url: 'https://www.example.com/',
      })
    );
