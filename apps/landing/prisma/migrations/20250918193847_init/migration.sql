-- CreateTable
CREATE TABLE "Supporter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supporterId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "confirmedAt" DATETIME,
    "unsubscribedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NewsletterSubscription_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Supporter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChapterLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "postal" TEXT,
    "city" TEXT,
    "locale" TEXT,
    "intent" TEXT NOT NULL DEFAULT 'FOUND',
    "message" TEXT,
    "processedAt" DATETIME,
    "supporterId" TEXT,
    CONSTRAINT "ChapterLead_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Supporter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "ip" TEXT,
    "userAgent" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_email_key" ON "Supporter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_supporterId_key" ON "NewsletterSubscription"("supporterId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_token_key" ON "NewsletterSubscription"("token");

-- CreateIndex
CREATE INDEX "ChapterLead_email_idx" ON "ChapterLead"("email");

-- CreateIndex
CREATE INDEX "ChapterLead_countryCode_city_idx" ON "ChapterLead"("countryCode", "city");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
