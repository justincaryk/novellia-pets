-- Ensure roles exist or create them if they don't
DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_roles
        WHERE rolname = 'role_user'
    ) THEN
        CREATE ROLE role_user;
        RAISE NOTICE 'Role "role_user" created.';
    ELSE
        RAISE NOTICE 'Role "role_user" already exists. Skipping creation.';
    END IF;
END $do$;

DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_roles
        WHERE rolname = 'role_admin'
    ) THEN
        CREATE ROLE role_admin;
        RAISE NOTICE 'Role "role_admin" created.';
    ELSE
        RAISE NOTICE 'Role "role_admin" already exists. Skipping creation.';
    END IF;
END $do$;

DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_roles
        WHERE rolname = 'anonymous_user'
    ) THEN
        CREATE ROLE anonymous_user;
        RAISE NOTICE 'Role "anonymous_user" created.';
    ELSE
        RAISE NOTICE 'Role "anonymous_user" already exists. Skipping creation.';
    END IF;
END $do$;

-- Ensure extensions exist or create them if they don't
DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'uuid-ossp'
    ) THEN
        CREATE EXTENSION "uuid-ossp";
        RAISE NOTICE 'Extension "uuid-ossp" created.';
    ELSE
        RAISE NOTICE 'Extension "uuid-ossp" already exists. Skipping creation.';
    END IF;
END $do$;

DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'pgcrypto'
    ) THEN
        CREATE EXTENSION pgcrypto;
        RAISE NOTICE 'Extension "pgcrypto" created.';
    ELSE
        RAISE NOTICE 'Extension "pgcrypto" already exists. Skipping creation.';
    END IF;
END $do$;

-- Define types
DO $do$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
        RAISE NOTICE 'Type "user_role" created.';
    ELSE
        RAISE NOTICE 'Type "user_role" already exists. Skipping creation.';
    END IF;
END $do$;

-- Create tables
CREATE TABLE IF NOT EXISTS public.user (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    password text,
    email varchar(150) NOT NULL,
    first_name varchar(75),
    last_name varchar(75),
    role user_role DEFAULT 'user',
    CONSTRAINT core_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.admin (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.user (id),
    CONSTRAINT core_employee_user_id_key UNIQUE (user_id)
);

-- Set row-level security
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DO $do$
BEGIN
    -- Drop policy if it exists
    IF EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'policy_users'
    ) THEN
        EXECUTE 'DROP POLICY policy_users ON public.admin;';
        RAISE NOTICE 'Policy "policy_users" dropped.';
    END IF;

    -- Create the policy
    EXECUTE 'CREATE POLICY policy_users ON public.admin
        FOR SELECT TO role_user
        USING (EXISTS (
            SELECT 1
            FROM public.user
            WHERE id = user_id AND email = CURRENT_USER
        ));';
    RAISE NOTICE 'Policy "policy_users" created.';
END $do$;

CREATE TYPE public.jwt_token AS (
    ROLE text, -- db role of the user
    exp integer, -- expiry date as the unix epoch
    user_id uuid, -- db identifier of the user
    email varchar(150), -- username for sign in, email ideally
    first_name varchar(75), -- display name first
    last_name varchar(75), -- display name last
    user_role user_role -- user role as referenceable enum
);

-- Define functions
CREATE OR REPLACE FUNCTION public.signup (input_email varchar(50), input_password varchar(50))
RETURNS boolean AS $$
DECLARE
    result varchar DEFAULT NULL;
BEGIN
    SELECT email
    FROM public.user
    WHERE email = input_email INTO result;
    IF NOT found THEN
        INSERT INTO public.user (email, password)
        VALUES (input_email, crypt(input_password, gen_salt('bf')));
    END IF;
    RETURN TRUE;
END
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.signup (input_email varchar(50), input_password varchar(50))
TO anonymous_user;

CREATE OR REPLACE FUNCTION public.signin (input_email text, input_password text)
RETURNS public.jwt_token AS $$
DECLARE
    account public.user;
    admin_acc public.admin;
    role text;
BEGIN
    -- Retrieve user account
    SELECT *
    FROM public.user
    WHERE email = input_email INTO account;

    -- Retrieve admin account if it exists
    SELECT *
    FROM public.admin
    WHERE user_id = account.id INTO admin_acc;

    -- Determine the role based on the existence of admin account
    IF admin_acc.user_id IS NOT NULL THEN
        role = 'admin';
    ELSE
        role = 'user';
    END IF;

    -- Validate password and return JWT token if valid
    IF account.password = crypt(input_password, account.password) THEN
        RETURN ROW(
            role, -- text
            extract(epoch FROM now() + interval '365 days')::integer, -- expiry as integer
            account.id, -- uuid
            account.email, -- varchar(150)
            account.first_name, -- varchar(75)
            account.last_name, -- varchar(75)
            account.role -- user_role
        )::public.jwt_token;
    ELSE
        RETURN NULL;
    END IF;
END
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.signin (input_email text, input_password text)
TO anonymous_user;
