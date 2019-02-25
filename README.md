# function-dashboard

List out the current functions and their deployment status and related repos.

Set environment variable 'OPENFAAS_BASIC_AUTH_HASH' for both dev and prod. Needs to be a base64-encoded `username:password` pair.

For Netlify, need to manually interpolate environment variable e.g.: `sed -i s/API_KEY_PLACEHOLDER/$API_KEY/g netlify.toml && npm run build`


