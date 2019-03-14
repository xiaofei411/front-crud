exports.seed = knex =>
  knex('users_vendors')
    .del()
    .then(() =>
      knex('users_vendors').insert({
        id: '847fd916-eaff-41b6-a9b2-68534ecc904d',
        user_id: 'f3d402b1-6109-4ae5-9fc8-40c7459bb84d',
        vendor_id: 'd15cc98d-1ad4-4436-ab7b-b711ab797cde',
        permission_type: 'owner',
      })
    );
