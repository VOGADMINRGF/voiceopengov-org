import { membersCol } from "../src/lib/vogMongo";

async function main() {
  const col = await membersCol();

  const seed = [
    {
      type: "person",
      email: "seed-berlin@voiceopengov.local",
      firstName: "Seed",
      lastName: "Berlin",
      city: "Berlin",
      country: "Germany",
      lat: 52.52,
      lng: 13.405,
      isPublic: true,
      wantsNewsletterEdDebatte: false,
      status: "active",
      createdAt: new Date(),
      confirmedAt: new Date(),
    },
    {
      type: "person",
      email: "seed-weimar@voiceopengov.local",
      firstName: "Seed",
      lastName: "Weimar",
      city: "Weimar",
      country: "Germany",
      lat: 50.9795,
      lng: 11.3290,
      isPublic: true,
      wantsNewsletterEdDebatte: false,
      status: "active",
      createdAt: new Date(),
      confirmedAt: new Date(),
    },
  ] as const;

  for (const m of seed) {
    await col.updateOne({ email: m.email }, { $set: m }, { upsert: true });
  }

  console.log("Seeded:", seed.map(s => s.email).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
