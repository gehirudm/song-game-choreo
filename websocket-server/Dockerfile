FROM ballerina/ballerina

ARG USER=appusr
ARG USER_ID=10014
ARG USER_GROUP=appusrgrp
ARG USER_GROUP_ID=10014
ARG USER_HOME=/home/app

ENV USER=${USER_ID}

USER root

RUN addgroup -S -g ${USER_GROUP_ID} ${USER_GROUP} \
    && adduser -S -D -h ${USER_HOME} -G ${USER_GROUP} -u ${USER_ID} ${USER}

WORKDIR ${USER_HOME}

USER 10014

COPY --chown=${USER}:${USER_GROUP} . .

RUN bal build

EXPOSE 9090

# USER ballerina

CMD bal run target/bin/websocket_server.jar