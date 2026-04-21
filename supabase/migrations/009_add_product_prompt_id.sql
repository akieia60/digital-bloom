-- Add a stable prompt identifier to products so prompt-engine sync does not
-- depend on storefront slugs or legacy naming conventions.

alter table products
add column if not exists prompt_id text;

create index if not exists idx_products_prompt_id on products(prompt_id);

create index if not exists idx_products_active_prompt_id
on products(prompt_id)
where is_active = true and prompt_id is not null;
