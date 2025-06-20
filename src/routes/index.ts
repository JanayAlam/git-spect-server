import express, { Router } from "express";
import healthRouter from "../api/v1/health";

interface IRoute {
  baseUrl: string;
  router: Router;
}

const configureRoutes = (app: express.Express) => {
  const routes: IRoute[] = [
    {
      baseUrl: "/health",
      router: healthRouter,
    },
  ];

  for (const route of routes) {
    app.use(`/api/v1${route.baseUrl}`, route.router);
  }
};

export default configureRoutes;
