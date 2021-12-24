create function signin_client(user_id text) returns jwt_token
    strict
    security definer
    language plpgsql
as
$$
DECLARE
        token_information jwt_token;
BEGIN
        SELECT 'ecoocean_user', uid, "displayName"
               INTO token_information
               FROM users
               WHERE users.uid = $1;
       RETURN token_information::jwt_token;
end;
$$;

alter function signin_client(text) owner to postgres;