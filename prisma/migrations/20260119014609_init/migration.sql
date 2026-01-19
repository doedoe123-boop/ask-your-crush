-- CreateTable
CREATE TABLE "ValentineInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'romantic',
    "senderName" TEXT,
    "recipientName" TEXT,
    "response" TEXT,
    "respondedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ValentineInvite_slug_key" ON "ValentineInvite"("slug");
