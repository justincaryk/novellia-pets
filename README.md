## Node + Postgres + Nextjs Starter

### Requirements

- [Install Docker](https://docs.docker.com/engine/install/)
- [Install node](https://nodejs.org/en/download/prebuilt-installer/current)
- [Install node version manager (nvm)](https://github.com/nvm-sh/nvm) \*Optional

### About this repository

This repo will spin up the following services:

- Node server that includes
  - TypeScript
  - GraphQL via postgraphile

- NextJS service that includes
  - Typescript
  - Tailwindcss
  - Codegen generated GraphQL schema types
  - Cypress + Jest + Testing-Library for testing

- PostgreSQL service

- Docker containerization with profiles to allow for targeted development

### Getting started

1. Copy `.env.exmaple` into `.env` and update any missing values
2. Install frontend dependencies - Follow instructions in `/frontend/README.md`
3. Install backend packages - Follow instructions in `/backend/README.md`
4. Confirm `docker-compose.yml` works:

```bash
docker build
```

5. Docker Profiles have been set up for the frontend and backend directories. The db is always configured to run. Choose which best suits your development requirements:

- To spin up nextapp and db only: `docker compose --profile frontend up`
- To spin up backend and db only: `docker compose --profile backend up`
- To spin up the whole app: `docker compose --profile backend --profile frontend up`

If you want to run these in a detached state, you can append the `-d` flag to the end of the commands above, which will free up the terminal window.

**Note: You can also skip Docker and spin each directory in a separate terminal, if desired.**

- For frontend dev: `cd frontend && yarn dev`
- For backend dev: `cd backend && yarn dev`
- Ensure you have postgres instance setup!

### TODO

**Backend**
- [x] write sql for schema init
- [x] write row level security 
- [x] write sql for seeding db
- [] revise schema if needed

**Frontend**
- [] update signup & signin api calls on front end
- [] admin dashboard view
   - [] view pets
   - [] view 
- [] user dashboard view
- [] add a pet view
- [] new record forms

**Dealer's Choice**
- [] one more feature that is cool
- [] search feature ?

**Build**
- [] Spin up with 2 commands at most

**Cleanup**

- [] update ERD with final values
- [] update schema with final values

**Extras**
- [] dog logo ?
- [] malware scanner
  `clamav.js` or `malware-scanner`
- [] add notes on extending enum (severity: mild/severe - possibly add moderate)


### Thoughts / Considerations

- How and why you modeled the data structure(s) the way you did
- How and why you structured your API(s)
 
- How and why you decided on the page(s) you built
- What improvements you’d make if you want to build this for real


DB:
- pretty easily extend new record types by creating a basic many to many lookup table.
- to extend just add private.record_type + add a new table



- security
  - admin has read only for all but pets.
  - private.pet.owner_name 
    - added so admins dont need access to user records
    - drawback is keeping those in sync -> used a function to do this
    - note: there aren't actually db guards to prevent a user from updating directly, rather than using the provided provide. - considering a TODO 

  - admin has write for themselves only 
  - row level security with policies that do check on jwt 
  - adds an insert trigger to ensure users only insert pets/records which they own