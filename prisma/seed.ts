import { PrismaClient } from "@prisma/client";
import {
  aboutSectionDefault,
  categoryDefaults,
  contactInfoDefault,
  featureCardDefaults,
  footerSettingsDefault,
  heroDefault,
  siteSettingsDefault
} from "../src/lib/defaults";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: siteSettingsDefault.id },
    update: {},
    create: siteSettingsDefault
  });

  await prisma.hero.upsert({
    where: { id: heroDefault.id },
    update: {},
    create: heroDefault
  });

  for (const feature of featureCardDefaults) {
    await prisma.featureCard.upsert({
      where: { id: feature.id },
      update: {},
      create: feature
    });
  }

  for (const category of categoryDefaults) {
    await prisma.insuranceCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category
    });
  }

  await prisma.aboutSection.upsert({
    where: { id: aboutSectionDefault.id },
    update: {},
    create: aboutSectionDefault
  });

  await prisma.contactInfo.upsert({
    where: { id: contactInfoDefault.id },
    update: {},
    create: contactInfoDefault
  });

  await prisma.footerSettings.upsert({
    where: { id: footerSettingsDefault.id },
    update: {},
    create: footerSettingsDefault
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
