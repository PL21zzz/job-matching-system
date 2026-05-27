-- CreateTable
CREATE TABLE "_DisabilityTypeToJob" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DisabilityTypeToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DisabilityTypeToJob_B_index" ON "_DisabilityTypeToJob"("B");

-- AddForeignKey
ALTER TABLE "_DisabilityTypeToJob" ADD CONSTRAINT "_DisabilityTypeToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "disability_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisabilityTypeToJob" ADD CONSTRAINT "_DisabilityTypeToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
