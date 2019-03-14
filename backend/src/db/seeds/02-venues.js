exports.seed = knex =>
  knex('venues')
    .del()
    .then(() =>
      knex('venues').insert({
        id: '94ed70b2-cc22-48b9-93e5-e3650d17b616',
        name: 'Oslo Spektrum Arena',
        website_url: 'https://www.oslospektrum.no/',
        image_url:
          'https://img7.custompublish.com/getfile.php/927082.297.dbsbsrwfbf/482x0/SpektrumByNight.jpg',
        address: 'Sonja Henies Plass 2, 0185 Oslo',
        latitude: 59.9126,
        longitude: 10.7548,
      })
    );
