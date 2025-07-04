# Git Spect Server

Git Spect Server is a backend service designed to track, analyze, and manage git commit activity across multiple repositories and users. It provides RESTful APIs for authentication, user management, and commit data ingestion, enabling teams to gain insights into code contributions, and review activity. The server supports secure authentication, role-based access control, and integration with third-party services such as GitHub for oAuth login. It is built with scalability and extensibility in mind, making it suitable for both individual developers and enterprise teams.

## Run Development Version

```bash
docker compose up --build
```

While the previous command is running, attach to the container's terminal and run:

```bash
yarn migrate:reset
```
