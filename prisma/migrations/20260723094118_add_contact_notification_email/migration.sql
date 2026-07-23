-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InsuranceCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "detailContent" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_InsuranceCategory" ("createdAt", "description", "detailContent", "icon", "id", "image", "label", "order", "published", "slug", "updatedAt") SELECT "createdAt", "description", "detailContent", "icon", "id", "image", "label", "order", "published", "slug", "updatedAt" FROM "InsuranceCategory";
DROP TABLE "InsuranceCategory";
ALTER TABLE "new_InsuranceCategory" RENAME TO "InsuranceCategory";
CREATE UNIQUE INDEX "InsuranceCategory_slug_key" ON "InsuranceCategory"("slug");
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoImage" TEXT NOT NULL,
    "logoText" TEXT NOT NULL,
    "logoSubtext" TEXT NOT NULL,
    "navLinks" TEXT NOT NULL DEFAULT '[]',
    "headerPhone" TEXT NOT NULL,
    "contactNotificationEmail" TEXT NOT NULL DEFAULT 'pchouhan@starlab.co.in',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("createdAt", "headerPhone", "id", "logoImage", "logoSubtext", "logoText", "navLinks", "updatedAt") SELECT "createdAt", "headerPhone", "id", "logoImage", "logoSubtext", "logoText", "navLinks", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
