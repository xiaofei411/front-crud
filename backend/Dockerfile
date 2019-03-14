FROM node:10.15.0

RUN apt-get update -y

COPY . ./

RUN yarn --frozen-lockfile

ENV PORT 80
EXPOSE 80

CMD ["yarn", "start"]
