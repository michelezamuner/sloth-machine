root=$(shell pwd)
tag=sloth-machine

clean:
	@docker image ls | grep $(tag) >/dev/null | && docker image rm $(tag)

build:
	@docker image ls | grep $(tag) >/dev/null || docker build -t $(tag) .

ssh: build
	@docker run -ti --rm -v $(root):/app:delegated $(tag) bash

run:
	@docker run --rm $(tag)

install:
	@yarn

ci:
	@yarn run ci