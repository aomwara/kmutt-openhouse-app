run-docker:
	docker run -d -p 80:3000 \
		-e "PORT=3000" \
		-e "DATABASE_URL=mysql://root:kmuttopenhouse2025@localhost:3306/kmuttopenhouse" \
		-e "NEXTAUTH_SECRET=fmdkljlt$#%rfe32e" \
		-e "NEXTAUTH_URL=http://localhost:3000" \
		-e "EXTERNAL_JWT_SECRET=supersecrettest" \
		kmutt-oph

build:
	docker build -t kmutt_oph .