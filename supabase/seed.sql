insert into public.government_schemes
(name,description,benefit,eligibility,documents,application_steps,last_updated)
values
('Demo Farmer Support Scheme',
 'Demo data for development. Replace with verified government source data before production.',
 'Support varies',
 'Verify current eligibility on the official government portal.',
 'Applicable ID; land documents; bank details',
 '["Check eligibility","Prepare documents","Open official portal","Submit application"]'::jsonb,
 current_date)
on conflict do nothing;
