FROM node:20-alpine

LABEL Maintainer="Ankit Agrawal (agrawal.ank83@gmail.com)"

EXPOSE 3000

# Prerequisite: take latest code from git repo and add required dependencies using npm -i
WORKDIR /hosp-mgmt-app-ui/
COPY public/ /hosp-mgmt-app-ui/public
COPY src/ /hosp-mgmt-app-ui/src
COPY package.json /hosp-mgmt-app-ui/

RUN npm install

CMD ["npm", "start"]