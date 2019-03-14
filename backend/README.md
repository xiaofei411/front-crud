## LOCAL SETUP

1.  Install project dependacies `$ yarn`
1.  Add a `.env` file
1.  Look at `.env-example` for what variables are needed in the `.env` file
1.  Create two local Postgres databases - `spisogdrikk_db_dev` and `spisogdrikk_db_test`
1.  Run knex database migration - `$ knex migrate:latest --env development`
1.  Run knex seeding of database - `$ knex seed:run --env development`

## DEVELOPMENT

1.  To start developing: `$ yarn dev`
1.  Create new file for new route group in `./src/server/routes/`
1.  Create new file for new models and database access for the route group in `./src/server/models/`
1.  Update `./src/server/config/route-config.js` to include the new route group

## TESTING

1.  To run all Jest tests: `$ yarn test`
1.  Create new files for migration tables
1.  Create new files for seed content
1.  Create new file for tests next to the tested file. Add `test` to the file name ie `user.js` will have `user.test.js` file.
1.  Write tests for every endpoint case. Success, failure, unauthorized, unauthenticated, bad request
1.  Ensure correct HTTP status codes are being returned
1.  If endpoint uses 3rd party endpoint, mock the endpoint in order to allow testing when offline

## DEPLOYMENT

1.  commit to master branch and gitlab will run all tests and then deploy to the cloud

## MERGE REQUESTS

1. We use the Angular standard for merge request title. https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits
1. example merge request title: `feat(auth): require email confirmation before login is allowed`
1. when merge request is accepted, we use "squash commits" to combine all commits into a single commit named after the merge request title

## NOTES

1.  generating uuid for seeds: `$ uuidgen | tr "[:upper:]" "[:lower:]"`
1.  DEBUG=express:\*
