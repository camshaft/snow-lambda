deploy:
	@MAXMIND_DB_DIR=lib/enrichers/ip-address/ maxmind-geolite-mirror
	@node-lambda deploy