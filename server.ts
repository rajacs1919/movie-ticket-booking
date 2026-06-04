import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Mock Data (Beginner friendly)
  const movies = [
    {
      id: "1",
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to restore order to the universe.",
      poster: "https://picsum.photos/seed/avengers/400/600",
      showtimes: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"],
      genre: "Action/Sci-Fi",
      duration: "3h 2min"
    },
    {
      id: "2",
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster: "https://picsum.photos/seed/interstellar/400/600",
      showtimes: ["11:00 AM", "03:00 PM", "07:00 PM"],
      genre: "Adventure/Drama",
      duration: "2h 49min"
    },
    {
      id: "3",
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster: "https://picsum.photos/seed/inception/400/600",
      showtimes: ["09:00 AM", "12:00 PM", "04:00 PM", "09:00 PM"],
      genre: "Action/Sci-Fi",
      duration: "2h 28min"
    }
  ];

  // In-memory bookings (for demo)
  const bookings: any[] = [];
  const users: any[] = [];

  // API Routes
  app.get('/api/movies', (req, res) => {
    res.json(movies);
  });

  app.get('/api/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === req.params.id);
    if (movie) res.json(movie);
    else res.status(404).json({ message: "Movie not found" });
  });

  app.post('/api/register', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);
    res.json({ message: "Registration successful", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  });

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post('/api/bookings', (req, res) => {
    const booking = { ...req.body, id: Date.now().toString() };
    bookings.push(booking);
    res.json({ message: "Booking confirmed", booking });
  });

  app.get('/api/bookings/:movieId', (req, res) => {
    const movieBookings = bookings.filter(b => b.movieId === req.params.movieId);
    res.json(movieBookings);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
