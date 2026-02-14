# ng-crud

Simple CRUD app: **ASP.NET Core Web API (.NET 10)** backend + **Angular 21** frontend.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (LTS)
- Angular CLI 21: `npm install -g @angular/cli@21`

## Run the app

### 1. Backend (API)

**Note:** If the backend is already running, stop it (Ctrl+C in its terminal) before running `dotnet build` again, or the build will fail with "file is being used by another process".

```bash
cd backend
dotnet restore
dotnet run
```

API runs at **http://localhost:5019** (and https://localhost:7057).  
CRUD: `GET/POST/PUT/DELETE` on **http://localhost:5019/api/items**.

### 2. Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

App runs at **http://localhost:4200**. The dev server proxies `/api` to the backend.

### 3. Use the app

Open http://localhost:4200. Add, edit, and delete items. Data is stored in memory (resets when the API restarts).

## Project layout

- **backend/** – ASP.NET Core Web API (.NET 10), `ItemService` with in-memory dummy data, `ItemsController` CRUD.
- **frontend/** – Angular 21 app, `ItemsComponent` with list + form, `ItemService` calling `/api/items`.
