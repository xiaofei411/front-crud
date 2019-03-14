exports.seed = knex =>
  knex('invoices')
    .del()
    .then(() =>
      knex('invoices').insert({
        id: 'be0b37b0-eeed-49b7-8a76-bd5ce01bd301',
        user_id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        class_id: '908d2487-25df-49e8-82a9-c9759cfe0f5f',
        wallet_id: '00c219ec-11fd-4d1a-b740-369493cbf6d2',
        amount: 15,
      })
    );
