import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for high-res images
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('只允许上传图片文件'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Initialize default user if not exists
async function initUser() {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('Default admin user created: admin / admin123');
  }
}
initUser();

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(400).json({ error: 'User not found' });
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
  
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, username: user.username });
});

// Image upload route
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Category Routes =====
// Get all categories with sorting
app.get('/api/category', async (req, res) => {
  try {
    const data = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/category', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.category.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/category/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/category/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Brand Routes =====
// Get all brands with sorting
app.get('/api/brand', async (req, res) => {
  try {
    const data = await prisma.brand.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/brand', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.brand.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/brand/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brand/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.brand.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Product Routes =====
// Get all products with category and brand info
app.get('/api/product', async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      include: {
        category: true,
        brand: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get products by category
app.get('/api/product/category/:categoryId', async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      where: { categoryId: Number(req.params.categoryId) },
      include: {
        category: true,
        brand: true
      }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/product', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.product.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/product/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/product/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== News Routes =====
app.get('/api/news', async (req, res) => {
  try {
    const data = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.news.findUnique({ where: { id } });
    if (!data) {
      const bySlug = await prisma.news.findFirst({ where: { slug: req.params.id } });
      if (!bySlug) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(bySlug);
      return;
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.news.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.news.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== HomeConfig Routes =====
app.get('/api/homeConfig', async (req, res) => {
  try {
    const data = await prisma.homeConfig.findMany();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homeConfig', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.homeConfig.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/homeConfig/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.homeConfig.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/homeConfig/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.homeConfig.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ContactConfig Routes =====
app.get('/api/contactConfig', async (req, res) => {
  try {
    const data = await prisma.contactConfig.findMany();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contactConfig', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.contactConfig.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contactConfig/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.contactConfig.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contactConfig/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contactConfig.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SiteConfig Routes =====
app.get('/api/siteConfig', async (req, res) => {
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: {} });
    }
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/siteConfig/:id', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.siteConfig.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
