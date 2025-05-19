# Installation

1. Run `docker compose up --build` in the project root. This will start all 3 containers:

- RavenDB
- Node.js + Express
- React

This will also create the `ravendb/data` folder, which is used to store the RavenDB database volume.

```
	Labs/
	project/
	  	├─ ravendb/
	  		├─ data/
			...
		├─ INSTALL.md
		└─ README.md
	...
	README.md
```

2. Create the database and populate it with data after the containers are up **and the services are running**.
```bash
cd Data
bash upload.sh
```

3. You can now access the application by navigating to `http://localhost:8000` in your browser. To access RavenDB Studio, navigate to `http://localhost:8080` in your browser.