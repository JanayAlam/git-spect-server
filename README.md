# Git Spect Server

Git Spect Server is a backend service designed to track, analyze, and manage git commit activity across multiple repositories and users. It provides RESTful APIs for authentication, user management, and commit data ingestion, enabling teams to gain insights into code contributions, and review activity. The server supports secure authentication, role-based access control, and integration with third-party services such as GitHub for oAuth login. It is built with scalability and extensibility in mind, making it suitable for both individual developers and enterprise teams.

## Run Development Version

```bash
docker compose --build
```

While the previous command is running, open another terminal and run:

```bash
yarn migrate:reset
```

## Todos

### June 30, 2025

- [x] Remove secured request body data from logging (error)
- [x] Implement libs for password encryptions and jwt token
- [x] Implement login functionalities

### July 1, 2025

- [ ] Implement oAuth login with GitHub
