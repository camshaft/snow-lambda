deploy:
	@MAXMIND_DB_DIR=lib/enrichers/ip-address/ ./node_modules/.bin/maxmind-geolite-mirror
	@./node_modules/.bin/node-lambda deploy
