const moment = require('moment');

exports.seed = knex =>
  knex('classes')
    .del()
    .then(() =>
      knex('classes').insert({
        id: '908d2487-25df-49e8-82a9-c9759cfe0f5f',
        vendor_id: '5be32eed-06fa-481e-bccb-250956a92b1b',
        name: 'Learn how to taste cheese',
        description:
          'Follow a fancy guy with a cheese knife and learn why cheddar is the best cheese in the world.',
        price: 15.0,
        location: 'Sal 1',
        seats: 60,
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
    )
    .then(() =>
      knex('classes').insert({
        id: '54266d87-51e6-4533-969b-803f22e65912',
        vendor_id: 'd15cc98d-1ad4-4436-ab7b-b711ab797cde',
        name: 'Experience the beer rodeo',
        description: 'Taste great texas beer while riding a bull',
        price: 60.0,
        location: 'Sal 2',
        seats: 6,
        image_url:
          'https://uploads-ssl.webflow.com/5bebfd31fb29cc51aeb8688a/5bebfd31fb29cc4e27b86895_transparent_16_9-p-1080.png',
        start_timestamp: moment(
          '​​​​​2019-03-08T13:00:00.000Z',
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
