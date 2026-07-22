UPDATE "InsuranceCategory"
SET "image" = "icon"
WHERE "image" = ''
  AND "icon" LIKE '/%';

UPDATE "FooterSettings"
SET "copyrightText" = replace("copyrightText", 'Â©', 'Copyright')
WHERE "copyrightText" LIKE '%Â©%';
