GIT_VERSION := $(shell git describe --abbrev=4 --dirty --always --tags)

build:
	@-rm -r webapp.build
	@sed s/{{VERSION}}/$(GIT_VERSION)/g dev/webapp.build.js.in > dev/webapp.build.js
	@docker run -v `pwd`:/dim \
		--workdir /dim/dev \
		node:0.10.32 \
		node r.js -o webapp.build.js
	@echo $(GIT_VERSION) > webapp.build/version

release:
	@git checkout gh-pages
	@rm -rf webapp
	@mv webapp.build webapp
	@git add webapp
	@git commit -m "Release $$(cat webapp/version)"
