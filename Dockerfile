FROM pudding/docker-app:ubuntu-20.04-nodejs-12.14.1-20230810-0130

RUN npm link exif-parser
# RUN npm install xlsx