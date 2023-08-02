import { Role } from "@prisma/client";
import { db } from "../src/utils/db.server";

type Author = {
  name: string;
  email: string;
  password: string;
  role: Role | undefined
};

function getAuthors(): Author[] {
  return [
    {
      name: "John Doe",
      email: "JohnDoe@gmail.com",
      password: "password",
      role: "ADMIN",
    },
    {
      name: "Jane",
      email: "John@gmail.com",
      password: "password",
      role: "USER",
    },
    {
      name: "emon",
      email: "emon@gmail.com",
      password: "1234",
      role: "USER",
    },
  ];
}

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.user.create({
        data: {
          name: author.name,
          email: author.email,
          password: author.password,
          role: author.role,
        },
      });
    })
  );

  console.log("Seeding complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
