CREATE FUNCTION set_last_updated_stamp()
  RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated_stamp := now();
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;


create OR REPLACE function generate_product_code()
RETURNS trigger AS $generate_product_code$
begin
  if NEW.code is null or NEW.code = '' then
    NEW.code := cast(nextval('product_code_generator') as varchar);
   NEW.code := lpad(NEW.code, 5, '0');
   NEW.code := concat('SKU', NEW.code);
  end if;
  return NEW;
end ; $generate_product_code$
LANGUAGE plpgsql;


create OR REPLACE function generate_supplier_code()
RETURNS trigger AS $generate_supplier_code$
begin
  if NEW.code is null or NEW.code = '' then
  NEW.code := cast(nextval('supplier_code_generator') as varchar);
   NEW.code := lpad(NEW.code, 5, '0');
   NEW.code := concat('NCC', NEW.code);
  end if;
  return NEW;
end ; $generate_supplier_code$
LANGUAGE plpgsql;


create OR REPLACE function generate_order_code()
RETURNS trigger AS $generate_order_code$
begin
  if NEW.code is null or NEW.code = '' then
  NEW.code := cast(nextval('order_code_generator') as varchar);
   NEW.code := lpad(NEW.code, 5, '0');
   NEW.code := concat('DH', NEW.code);
  end if;
  return NEW;
end ; $generate_order_code$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.find_in_set(id uuid, s text)
 RETURNS bigint
 LANGUAGE sql
AS $function$
select z.row_number
from
(
    select row_number() over(), y.x
    from (select unnest(('{' || $2 || '}')::uuid[]) as x) as y
) as z
where z.x = $1
$function$
;
