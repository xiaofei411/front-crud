const moment = require('moment');

exports.seed = knex =>
  knex('events')
    .del()
    .then(() =>
      knex('events').insert({
        id: '216294c1-c3a8-42a4-83f1-3ad90cd3c23e',
        venue_id: '94ed70b2-cc22-48b9-93e5-e3650d17b616',
        name: 'Spis Og Drikk',
        description: 'Vin Og MatFestival',
        website_url: 'https://www.spisogdrikk.no/',
        image_url:
          'https://uploads-ssl.webflow.com/5bebfd31fb29cc51aeb8688a/5bebfd31fb29cc4e27b86895_transparent_16_9-p-1080.png',
        start_timestamp: moment(
          '​​​​​2019-03-08T12:00:00.000Z',
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        )
          .utc()
          .toISOString(),
        end_timestamp: moment(
          '2019-03-09T12:00:00.000Z',
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        )
          .utc()
          .toISOString(),
      })
    );
