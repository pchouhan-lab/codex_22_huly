ALTER TABLE "InsuranceCategory" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
ALTER TABLE "InsuranceCategory" ADD COLUMN "image" TEXT NOT NULL DEFAULT '';
ALTER TABLE "InsuranceCategory" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "InsuranceCategory" ADD COLUMN "detailContent" TEXT NOT NULL DEFAULT '';

UPDATE "InsuranceCategory"
SET
  "slug" = CASE "id"
    WHEN 'category-auto' THEN 'auto-insurance'
    WHEN 'category-home' THEN 'home-insurance'
    WHEN 'category-recreational' THEN 'recreational-vehicles'
    WHEN 'category-pet' THEN 'pet-insurance'
    WHEN 'category-dental' THEN 'dental-service'
    WHEN 'category-disability' THEN 'disability-insurance'
    WHEN 'category-health' THEN 'health-insurance'
    WHEN 'category-workers' THEN 'workers-compensation'
    WHEN 'category-crop' THEN 'crop-insurance'
    ELSE lower(replace("label", ' ', '-'))
  END,
  "description" = CASE "id"
    WHEN 'category-auto' THEN 'Reliable protection for the road ahead.'
    WHEN 'category-home' THEN 'Confidence for the place you call home.'
    WHEN 'category-recreational' THEN 'Coverage for the vehicles that make weekends better.'
    WHEN 'category-pet' THEN 'Help prepare for your pet''s unexpected care.'
    WHEN 'category-dental' THEN 'Everyday support for a healthier smile.'
    WHEN 'category-disability' THEN 'Income protection when work is interrupted.'
    WHEN 'category-health' THEN 'Health coverage built around your needs.'
    WHEN 'category-workers' THEN 'Support for your team and your business.'
    WHEN 'category-crop' THEN 'Protection for the risks facing your operation.'
    ELSE 'Personalized coverage for your needs.'
  END,
  "detailContent" = CASE "id"
    WHEN 'category-auto' THEN 'Whether you commute, travel, or simply run errands around town, the right auto policy helps protect you, your passengers, and your vehicle. We compare coverage options to help you find a policy that fits the way you drive.'
    WHEN 'category-home' THEN 'Your home is one of your most important investments. We help you review the protection for your home, belongings, and personal liability, then find coverage that suits your property and budget.'
    WHEN 'category-recreational' THEN 'From boats and campers to ATVs and other recreational vehicles, we can help you understand the available coverage and choose a policy for the adventures you enjoy.'
    WHEN 'category-pet' THEN 'Pet insurance can help you plan for eligible veterinary costs when an accident or illness happens. We can discuss the available options and help you choose coverage for your companion.'
    WHEN 'category-dental' THEN 'Dental plans can help make preventive care and other eligible dental services more manageable. We will help you evaluate the choices available for you and your family.'
    WHEN 'category-disability' THEN 'Disability insurance can provide important income protection if an illness or injury keeps you from working. We can help you understand the options and select a plan that supports your household.'
    WHEN 'category-health' THEN 'Choosing health coverage involves balancing your care needs, providers, prescription costs, and budget. Our team can walk through the available plans and help you make an informed choice.'
    WHEN 'category-workers' THEN 'Workers compensation coverage helps protect employees and employers after eligible work-related injuries. We can help businesses review their needs and find appropriate protection.'
    WHEN 'category-crop' THEN 'Crop insurance can help protect against the financial effects of eligible yield and revenue losses. We work with local producers to review coverage options for their operation.'
    ELSE 'We can help you review your options and choose coverage that fits your needs.'
  END
WHERE "slug" = '';

CREATE UNIQUE INDEX "InsuranceCategory_slug_key" ON "InsuranceCategory"("slug");
