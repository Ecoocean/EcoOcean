create function signin_admin(user_id text) returns jwt_token
    strict
    security definer
    language plpgsql
as
$$
DECLARE
        token_information jwt_token;
BEGIN
        SELECT 'admin', uid, "displayName"
               INTO token_information
               FROM users
               WHERE users.uid = $1 AND users."isAdmin";
       RETURN token_information::jwt_token;
end;
$$;

alter function signin_admin(text) owner to postgres;