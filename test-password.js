const bcrypt = require('bcryptjs');

const passwordFromDB = "$2b$10$Hs4rom4pJB0xLQPauXREUOYHGgIg.hKGhwDqbj1tVrYntdunK3Rya";
const passwordToTest = "Admin123";

bcrypt.compare(passwordToTest, passwordFromDB).then(result => {
  console.log("Le mot de passe 'Admin123' correspond:", result);
  
  if (!result) {
    // Génère un nouveau hash correct
    bcrypt.hash("Admin123", 10).then(newHash => {
      console.log("\nNouveau hash à mettre dans Supabase:");
      console.log(newHash);
    });
  }
}).catch(err => console.error("Erreur:", err));
