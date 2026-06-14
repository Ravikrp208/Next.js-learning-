import mongoose from "mongoose";
import CatModel from "../models/cats.model.ts";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("mongodb connected");

    // Seed cats if none exist
    const count = await CatModel.countDocuments();
    if (count === 0) {
      console.log("Seeding initial cats data...");
      const seedCats = [
        {
          name: "Milo",
          breed: "Singapura",
          description: "Milo is a tiny, affectionate cat who loves sitting on shoulders and big warm laps. He is highly active and gets along great with children.",
          lifespan: 14,
          energyLevel: "High",
          kidsFriendly: true,
          apartmentFriendly: true,
          image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600",
          color: "Sepia Ticked"
        },
        {
          name: "Bella",
          breed: "Munchkin",
          description: "Bella is a sweet-natured Munchkin with short legs but a massive personality. She loves to run and slide across the floor chasing feathers.",
          lifespan: 13,
          energyLevel: "High",
          kidsFriendly: true,
          apartmentFriendly: true,
          image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600",
          color: "Orange Tabby"
        },
        {
          name: "Whiskers",
          breed: "Devon Rex",
          description: "With huge ears and a soft, wavy coat, Whiskers looks like a little pixie. He is incredibly smart, learns tricks easily, and loves cuddling.",
          lifespan: 12,
          energyLevel: "Very High",
          kidsFriendly: true,
          apartmentFriendly: true,
          image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600",
          color: "Cream"
        },
        {
          name: "Coco",
          breed: "Toybob",
          description: "Coco is a miniature cat with a cute naturally bobbed tail. She is very quiet, loving, and feels perfectly happy living in smaller spaces.",
          lifespan: 15,
          energyLevel: "Medium",
          kidsFriendly: true,
          apartmentFriendly: true,
          image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
          color: "Seal Point"
        },
        {
          name: "Shadow",
          breed: "Rusty-spotted Cat",
          description: "Shadow represents the wild, tiny hunter spirit. Not recommended for kids or small apartments as they need wild forest-like enclosures and high stimulation.",
          lifespan: 11,
          energyLevel: "Extreme",
          kidsFriendly: false,
          apartmentFriendly: false,
          image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600",
          color: "Rusty Spotted Grey"
        }
      ];
      await CatModel.insertMany(seedCats);
      console.log("Cats database seeded successfully!");
    }
  } catch (error) {
    console.log("error in mongodb ", error);
  }
};