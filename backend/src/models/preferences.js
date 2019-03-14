const knex = require('../db/connection');

const updatePreferences = req =>
  knex('preferences')
    .where({ user_id: req.id })
    .update({
      allow_communication: req.allow_communication,
      allow_analysis: req.allow_analysis,
    })
    .returning('*');

module.exports = { updatePreferences };
