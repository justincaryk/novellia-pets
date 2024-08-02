## Node + Postgres + Nextjs Starter

### Requirements

- [Install Docker](https://docs.docker.com/engine/install/)
- [Install node](https://nodejs.org/en/download/prebuilt-installer/current)

### About this repository

This repo will spin up the following services:

- Node server that includes
  - Typescript
  - Postgraphile

- NextJS service that includes
  - Typescript
  - Tailwindcss
  - Codegen generated GraphQL schema types
  - Cypress + Jest + Testing-Library for testing

- PostgreSQL service

- Docker containerization with profiles to allow for targeted development

### Getting started

1. Copy `.env.exmaple` into `.env`

```bash
cp .env.example .env
```

2. To spin up the whole app: `docker compose --profile backend --profile frontend up -d`

The `-d` flag runs Docker in a detached state, which will free up the terminal window.

3. Admin

To update a user to an admin, run the following SQL statements in your postgres instance:

```sql
UPDATE public.user
SET role = 'ADMIN'
WHERE id = [USER.ID];

INSERT INTO public.admin (user_id)
VALUES (USER_ID);
```

To access the admin view, simply nagivate to `localhost:3000/admin` while signed in with an admin account.


### Thoughts / Considerations

- How and why you modeled the data structure(s) the way you did

There is schema documentation in the `docs/` directory of this codebase. This is a pretty schema. The main consideration was the record structure. It would have been much more convenient given the scope and context of this assignment to just dump all of the various fields into a single Record table and add new columns as needed, but I chose to model it in a way that would be closer to a proper real-world use case. To add a new record type, we'll need to:

1. Insert a row into the RecordType table.
2. Create the NewRecordTable.
3. Create policies for NewRecordTable.
4. Update the frontend queries to fetch those table results. 
5. Regenerate the schema types via codegen.
6. Update frontend read queries to handle those new fields. 

- How and why you structured your API(s)

I considered doing a simple express API setup in the backend and just use a basic fetch on the frontend, but I wanted to demonstrate that I'm capable of building in the team's stack. So I settled on a nextjs, typescript, tanstack query client, and graphql-request setup for the frontend. On the backend, I like using postgraphile for small projects, as it avoids the need for a ton of different endpoints. One downside to this approach is it puts a lot of the burden on the database. That said, it is nice to be able to just write some decent SQL and have that schema propagated to the frontend for easy consumption.

- How and why you decided on the page(s) you built

This is a pretty straight forward app directory architecture. Account registration is built with the primary objective of reducing friction. There's a 2-step signup with options to skip the second step. Then it's straight to the dashboard. 

One thing I'm not totally sure about is the form submit confirm messages during onboarding. I've been using my time off to really focus on improving my coding habits around accessibility. A very common theme in the reading I've been doing is that there needs to be very clear state indiciations. UX principles say fewer clicks is better, so the register states I built aren't optimal in that regard, but until I learn more, I chose to err on the side of doing right by those that rely on accessibility tools.

- What improvements you’d make if you want to build this for real

I included a "First Name, "Last Name" route with the intention of providing extra functionality within the dashboard, but time ran out. It is still included in the codebase, but I bypassed the step since it's too unfinished to be useful. 

I need to add a better Loading component. Right now, you will likely see a single little text of "Loading" at the top left. That's not acceptable UX, but I chose to prioritize elsewhere for this takehome.


The dashboard page is wildly bloated. Typically, I'll build something in one file to a basic functional complete state. At that point, I'll do a pass to start breaking the code into sensible components. I'll probably do that after submission because this file is really bugging me, and I actually enjoyed working with the specs here.  

A lot of the `useState` stuff in that page would benefit greatly from being moved into jotai atoms so refactoring doesn't lead to lifting and passing something like `activePet` to a dozen different smaller components.

I have testing suites configured and integrated to a point that I'm happy with. This includes above average (at least in my experience) Accessiblity tooling, but the actual test coverage for the new code is no where near acceptable. This would be the first thing I'd address given another working session.

The date input validation is extremely rudimentary. This was another item on the TODO list.

The admin page is basically just a printout at this point.

* Restyle at a minimum
* Add search feature
* Top level options that allow the admin to decide how to consume the data (eg. drill down by user, record, or pet)

DB:
- pretty easily extend new record types by creating a basic many to many lookup table.
- to extend just add private.record_type + add a new table

Security:
  - CORS is configured for all at the moment, but should be configured to specific known origins 
  - admin has read only for all but pets.
  - private.pet.owner_name 
    - added so admins dont need access to user records
    - drawback is keeping those in sync -> used a function to do this
    - note: there aren't actually db guards to prevent a user from updating directly, rather than using the provided provide. - considering a TODO 

  - admin has write for themselves only 
  - row level security with policies that do check on jwt 
  - adds an insert trigger to ensure users only insert pets/records which they own


## Extra features

**Backend**

* Implemented a basic but functional register/login credentials feature. Passwords are salted and hashed, and frontend access is controlled by a jwt.
* Implemented Row level security and reasonable policies so user data at least has some level of security

**Frontend**

Like I said, I've been hyperfocused on accessibility lately, so some of the extras below aren't glitzy, but I thought they were worth mentioning.

* Skip links were added for the registration process and dashboard.
* Color contrast for all the UX was tested and confirmed well. (I think the lowest might be 7, but most scores were rated 10-12)
* Integrated a little icon library to assign pets an avatar based on the pet type. 



## Local Development


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
