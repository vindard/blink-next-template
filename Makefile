bump-blink-schema:
	mkdir -p services/common/blink/
	curl -s https://raw.githubusercontent.com/GaloyMoney/blink/main/dev/config/apollo-federation/supergraph.graphql \
		| tee services/common/blink/supergraph.graphql \
		> /dev/null
