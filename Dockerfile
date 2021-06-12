FROM faddat/archlinux

COPY . .

RUN pacman --noconfirm -Syyu yarn nodejs-lts-erbium git base-devel&& \
	yarn install && \
	yarn run build


CMD [ "yarn", "run", "production" ]
