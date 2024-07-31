
-- user
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_policy ON public.user 
    TO role_user, role_admin
    USING (current_setting('jwt.claims.user_id')::uuid = id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user TO role_user, role_admin;

-- pet
ALTER TABLE private.pet ENABLE ROW LEVEL SECURITY;

CREATE POLICY pet_user_policy ON private.pet 
    TO role_user, role_admin
    USING (current_setting('jwt.claims.user_id')::uuid = owner_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON private.pet TO role_user, role_admin;

-- record
ALTER TABLE private.record ENABLE ROW LEVEL SECURITY;

CREATE POLICY record_user_policy ON private.record 
    TO role_user, role_admin
    USING (current_setting('jwt.claims.user_id')::uuid = owner_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON private.record TO role_user, role_admin;

-- vaccine
ALTER TABLE private.vaccine_record ENABLE ROW LEVEL SECURITY;

CREATE POLICY vaccine_user_policy ON private.vaccine_record 
    TO role_user, role_admin
    USING (
        EXISTS (
            SELECT 1
            FROM private.record r
            WHERE r.id = private.vaccine_record.record_id
              AND r.owner_id = current_setting('jwt.claims.user_id')::uuid
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON private.vaccine_record TO role_user, role_admin;

-- allergy
ALTER TABLE private.allergy_record ENABLE ROW LEVEL SECURITY;

CREATE POLICY vaccine_user_policy ON private.allergy_record 
    TO role_user, role_admin
    USING (
        EXISTS (
            SELECT 1
            FROM private.record r
            WHERE r.id = private.allergy_record.record_id
              AND r.owner_id = current_setting('jwt.claims.user_id')::uuid
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON private.allergy_record TO role_user, role_admin;


-- assign this trigger for any inserts that are related to a specific user
-- the point is to ensure the jwt matches the user of the payload
CREATE OR REPLACE FUNCTION private.check_is_this_user () RETURNS trigger AS $$ 
DECLARE
jwt_user_id uuid; 

BEGIN 
SELECT current_setting('jwt.claims.user_id') INTO jwt_user_id;
if (new.user_id = jwt_user_id) THEN
    RETURN NEW;

ELSE
    RAISE EXCEPTION 'invalid user id';

END IF;
END 
$$ 
LANGUAGE plpgsql;

-- pet creation
CREATE TRIGGER pet_create_trigger
BEFORE INSERT
ON private.pet
FOR EACH ROW
EXECUTE FUNCTION private.check_is_this_user();

-- record creation
CREATE TRIGGER record_create_trigger
BEFORE INSERT
ON private.record
FOR EACH ROW
EXECUTE FUNCTION private.check_is_this_user();

-- vaccine creation
CREATE TRIGGER vaccine_create_trigger
BEFORE INSERT
ON private.vaccine_record
FOR EACH ROW
EXECUTE FUNCTION private.check_is_this_user();

-- allergy creation
CREATE TRIGGER allergy_create_trigger
BEFORE INSERT
ON private.allergy_record
FOR EACH ROW
EXECUTE FUNCTION private.check_is_this_user();

