FROM mhart/alpine-node:7
RUN apk update

RUN apk add git
RUN npm install --loglevel verbose -g bower polymer-cli gulp-cli


WORKDIR /tmp
ADD bower.json /tmp/
ADD package.json /tmp/

RUN npm install --loglevel verbose 
RUN bower --allow-root install

RUN mkdir /code/
ADD . /code/

# remove installed modules for clean setup
RUN rm -rf /code/build/
RUN rm -rf /code/node_modules/
RUN rm -rf /code/bower_modules/

WORKDIR /code
RUN cp -a /tmp/node_modules /code/node_modules
RUN cp -a /tmp/bower_components /code/bower_components
RUN gulp
EXPOSE 8080
CMD ["node", "express.js"]
