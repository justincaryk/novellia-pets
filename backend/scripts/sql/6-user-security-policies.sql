

-- admin policies -- allow READ of all pets, owners, and records

-- revoke select so we can write a more permissive policy
REVOKE SELECT ON private.pet FROM role_admin;
REVOKE SELECT ON private.record FROM role_admin;
REVOKE SELECT ON private.vaccine_record FROM role_admin;
REVOKE SELECT ON private.allergy_record FROM role_admin;

CREATE POLICY admin_access_pet_policy on private.pet
    TO role_admin USING (true) WITH CHECK (true);
CREATE POLICY admin_access_record_policy on private.record
    TO role_admin USING (true) WITH CHECK (true);
CREATE POLICY admin_access_vaccine_policy on private.vaccine_record
    TO role_admin USING (true) WITH CHECK (true);
CREATE POLICY admin_access_allergy_policy on private.allergy_record
    TO role_admin USING (true) WITH CHECK (true);

GRANT SELECT ON ALL TABLES IN SCHEMA private TO role_admin;
