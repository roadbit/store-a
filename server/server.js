const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const multer = require('multer');
const connectDB = require('./config/db');
const setupSocket = require('./config/socket');

const catalogCardRoutes = require('./routes/catalogCardRoutes');
const categoryPageRoutes = require('./routes/categoryPageRoutes');
const podcategoryCardRouter = require('./routes/podcategoryCardRoutes');
const podcategoryPageRoutes = require('./routes/podcategoryPageRoutes');
const productCardRoutes = require('./routes/productCardRoutes');
const productPageRouter = require('./routes/productPageRoutes');
const reviewsRouter = require('./routes/reviews');
const visitRoutes = require('./routes/visits');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const heroSlideRoutes = require('./routes/heroSlideRoutes');
const cardlineProductRoutes = require('./routes/cardlineProductRoutes');

const sliderCardRoutesTop = require('./routes/sliderCardRoutesTop');
const sliderCardRoutesInt = require('./routes/sliderCardRoutesInt');
const sliderCardRoutesRec = require('./routes/sliderCardRoutesRec');

const blogPageRoutes = require('./routes/blogPageRoutes');
const blogCardRoutes = require('./routes/blogcardRoutes');

const phoneRoutes = require('./routes/phoneRoutes');
const footerLinksRoutes = require('./routes/footerLinksRoutes');

const filterRoutes = require('./routes/filterRoutes');

const loginPanelRoutes = require('./routes/loginPanelRoutes');


dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
setupSocket(server);

app.use(catalogCardRoutes);
app.use(categoryPageRoutes);
app.use(podcategoryCardRouter); 
app.use(podcategoryPageRoutes);
app.use('/api', productCardRoutes);
app.use('/api/productpages', productPageRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api', visitRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/cardlineproducts', cardlineProductRoutes);
app.use('/api/slider-cards', sliderCardRoutesTop);
app.use('/api/int-slider-cards', sliderCardRoutesInt);
app.use('/api/rec-slider-cards', sliderCardRoutesRec);

app.use('/api/phone', phoneRoutes);
app.use('/api/footerLinks', footerLinksRoutes);

app.use('/api', blogPageRoutes);
app.use('/api/blogcards', blogCardRoutes);

app.use('/api', filterRoutes);

app.use('/api', loginPanelRoutes);

app.use(userRoutes);

app.use('/api/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server and Socket.IO running on port ${PORT}`);
});