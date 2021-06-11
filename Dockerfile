### BUILD MINIFIED PRODUCTION ##
FROM faddart/anarchylinux

RUN pacman --noconfirm -Syyu yarn && \
	yarn install && \
	yarn run build

CMD [ "yarn", "run", "production" ]
