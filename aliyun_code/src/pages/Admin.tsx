import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ===== Types =====
interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface HomeConfig {
  id: number;
  heroSlides: string;
  philosophyTitle: string;
  yearsExperience: number;
  globalBrands: number;
  servedCustomers: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
}

interface Brand {
  id: number;
  name: string;
  nameEn: string | null;
  country: string | null;
  description: string | null;
  longDescription: string | null;
  brandImage: string | null;
  logo: string | null;
  displayOrder: number;
}

interface Product {
  id: number;
  name: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  images: string | null; // JSON数组
  categoryId: number | null;
  brandId: number | null;
  category?: Category;
  brand?: Brand;
}

interface News {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  imageUrl: string | null;
  slug: string | null;
  publishedAt: string | null;
}

interface ContactConfig {
  id: number;
  companyName: string | null;
  companyNameEn: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  addressEn: string | null;
  mapUrl: string | null;
  workingHours: string | null;
  wechat: string | null;
  weibo: string | null;
  introText: string | null;
}

interface SiteConfig {
  id: number;
  logoUrl: string | null;
  accentColor: string | null;
  theme: string | null;
}

type SidebarType = 'create' | 'edit' | null;

// ===== Sidebar Component =====
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

function Sidebar({ isOpen, onClose, title, children, width = '480px' }: SidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full max-w-full bg-zinc-900 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/50">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

// ===== Form Components =====
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
    />
  );
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-sm transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-zinc-600 mx-1" />;

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
      {/* Toolbar */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-3 py-2 flex flex-wrap gap-1 items-center">
        {/* Heading */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="标题1">H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="标题2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="标题3">H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="正文">P</ToolbarButton>
        <Divider />

        {/* Text Style */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="粗体"><strong>B</strong></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="斜体"><em>I</em></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="删除线"><s>S</s></ToolbarButton>
        <Divider />



        {/* Color */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
            title="文字颜色"
          />
          <span className="text-zinc-400 text-xs">颜色</span>
        </div>
        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="左对齐">⬅️</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="居中">⬆️</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="右对齐">➡️</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="两端对齐">↔️</ToolbarButton>
        <Divider />

        {/* List */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="无序列表">• 列表</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="有序列表">1. 列表</ToolbarButton>
        <Divider />

        {/* Link & Image */}
        <ToolbarButton onClick={() => {
          const url = window.prompt('输入链接地址:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} active={editor.isActive('link')} title="插入链接">🔗</ToolbarButton>
        <ToolbarButton onClick={() => {
          const url = window.prompt('输入图片地址:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} title="插入图片">🖼️</ToolbarButton>
        <Divider />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="撤销">↩️</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="重做">↪️</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="清除格式">🧹</ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 text-white prose prose-invert prose-zinc max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-[350px] [&_p]:my-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_img]:max-w-full [&_img]:rounded [&_a]:text-blue-400 [&_a]:underline"
      />
    </div>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
    />
  );
}

function ImageUpload({
  imageUrl,
  onUpload,
  onRemove,
  uploading,
  hint
}: {
  imageUrl: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (imageUrl) {
    return (
      <div className="relative group">
        <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-zinc-700" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            更换
          </button>
          <button
            onClick={onRemove}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            删除
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-zinc-800/50 transition-all group"
      >
        {uploading ? (
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-10 h-10 text-zinc-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-zinc-400 group-hover:text-zinc-300">点击上传图片</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="hidden"
        />
      </button>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('product');
  
  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  
  // Sidebar states
  const [sidebarType, setSidebarType] = useState<SidebarType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Home config states
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([{ image: '', title: '', subtitle: '' }]);
  const [philosophyTitle, setPhilosophyTitle] = useState('对音质追求的执着');
  const [yearsExperience, setYearsExperience] = useState(25);
  const [globalBrands, setGlobalBrands] = useState(50);
  const [servedCustomers, setServedCustomers] = useState(10000);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', displayOrder: 0 });
  const [brandForm, setBrandForm] = useState({ 
    name: '', nameEn: '', country: '', description: '', 
    longDescription: '', brandImage: '', logo: '', displayOrder: 0 
  });
  const [productForm, setProductForm] = useState({ 
    name: '', summary: '', description: '', imageUrl: '', 
    images: [] as string[], categoryId: '', brandId: '' 
  });
  const [newsForm, setNewsForm] = useState({ title: '', summary: '', content: '', imageUrl: '', slug: '', publishedAt: '' });
  const [contactForm, setContactForm] = useState<ContactConfig | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const tabs = [
    { id: 'product', label: '产品管理' },
    { id: 'category', label: '分类管理' },
    { id: 'brand', label: '品牌管理' },
    { id: 'news', label: '新闻管理' },
    { id: 'contact', label: '联系我们' },
    { id: 'homeConfig', label: '首页配置' },
    { id: 'siteConfig', label: '站点配置' },
    { id: 'security', label: '安全设置' },
  ];

  // ===== Auth =====
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call backend login API
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await res.json();

      if (result.token) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_username', username);
        setToken(result.token);
      } else {
        alert('登录失败: ' + (result.error || '账号或密码错误'));
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('登录失败: 网络错误');
    }
  };

  // ===== Password Change =====
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('请填写所有字段');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新密码长度至少6位');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('两次输入的新密码不一致');
      return;
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError('新密码不能与当前密码相同');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Get current admin username from localStorage
      const adminUsername = localStorage.getItem('admin_username');

      if (!adminUsername) {
        setPasswordError('会话已过期，请重新登录');
        setIsChangingPassword(false);
        return;
      }

      // Call backend API to change password
      const res = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          username: adminUsername,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const result = await res.json();

      if (!res.ok) {
        setPasswordError(result.error || '密码修改失败');
        setIsChangingPassword(false);
        return;
      }

      setPasswordSuccess('密码修改成功！请使用新密码重新登录');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Sign out and redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setToken(null);
        setPasswordSuccess('');
      }, 2000);

    } catch (err) {
      console.error('Password change error:', err);
      setPasswordError('网络错误，请稍后重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ===== Data Fetching =====
  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/api/category`);
    if (res.ok) setCategories(await res.json());
  };

  const fetchBrands = async () => {
    const res = await fetch(`${API_BASE_URL}/api/brand`);
    if (res.ok) setBrands(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/api/product`);
    if (res.ok) setProducts(await res.json());
  };

  const fetchNews = async () => {
    const res = await fetch(`${API_BASE_URL}/api/news`);
    if (res.ok) setNews(await res.json());
  };

  const fetchContactConfig = async () => {
    const res = await fetch(`${API_BASE_URL}/api/contactConfig`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        setContactForm(data[0]);
      }
    }
  };

  const fetchSiteConfig = async () => {
    const res = await fetch(`${API_BASE_URL}/api/siteConfig`);
    if (res.ok) {
      const data = await res.json();
      setSiteConfig(data);
    }
  };

  const fetchHomeConfig = async () => {
    const res = await fetch(`${API_BASE_URL}/api/homeConfig`);
    if (res.ok) {
      const result = await res.json();
      if (result && result.length > 0) {
        const config = result[0];
        setHomeConfig(config);
        if (config.heroSlides) {
          try { setHeroSlides(JSON.parse(config.heroSlides)); } catch {}
        }
        setPhilosophyTitle(config.philosophyTitle || '对音质追求的执着');
        setYearsExperience(config.yearsExperience || 25);
        setGlobalBrands(config.globalBrands || 50);
        setServedCustomers(config.servedCustomers || 10000);
      }
    }
  };

  useEffect(() => {
    if (!token) return;
    switch (activeTab) {
      case 'category': fetchCategories(); break;
      case 'brand': fetchBrands(); break;
      case 'product': fetchProducts(); fetchCategories(); fetchBrands(); break;
      case 'news': fetchNews(); break;
      case 'contact': fetchContactConfig(); break;
      case 'homeConfig': fetchHomeConfig(); break;
      case 'siteConfig': fetchSiteConfig(); break;
    }
  }, [activeTab, token]);

  // ===== CRUD Operations =====
  const handleSave = async (endpoint: string, data: any, isEdit: boolean) => {
    const url = isEdit ? `${API_BASE_URL}/api/${endpoint}/${editingItem.id}` : `${API_BASE_URL}/api/${endpoint}`;
    const method = isEdit ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      setSidebarType(null);
      setEditingItem(null);
      switch (activeTab) {
        case 'category': fetchCategories(); break;
        case 'brand': fetchBrands(); break;
        case 'product': fetchProducts(); break;
        case 'news': fetchNews(); break;
      }
    } else {
      alert('操作失败');
    }
  };

  const handleDelete = async (endpoint: string, id: number) => {
    if (!confirm('确定要删除吗？')) return;
    const res = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      switch (activeTab) {
        case 'category': fetchCategories(); break;
        case 'brand': fetchBrands(); break;
        case 'product': fetchProducts(); break;
        case 'news': fetchNews(); break;
      }
    }
  };

  // ===== Image Upload =====
  const handleImageUpload = async (file: File, field: string, callback: (url: string) => void) => {
    setUploadingField(field);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        callback(`${API_BASE_URL}${result.url}`);
      }
    } finally {
      setUploadingField(null);
    }
  };

  // ===== Home Config =====
  const handleSaveHomeConfig = async () => {
    const configData = {
      heroSlides: JSON.stringify(heroSlides),
      philosophyTitle,
      yearsExperience: Number(yearsExperience),
      globalBrands: Number(globalBrands),
      servedCustomers: Number(servedCustomers)
    };

    const url = homeConfig ? `${API_BASE_URL}/api/homeConfig/${homeConfig.id}` : `${API_BASE_URL}/api/homeConfig`;
    const method = homeConfig ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    });

    if (res.ok) {
      fetchHomeConfig();
    }
  };

  // ===== Open Sidebar Helpers =====
  const openCreateSidebar = () => {
    setEditingItem(null);
    switch (activeTab) {
      case 'category':
        setCategoryForm({ name: '', description: '', displayOrder: 0 });
        break;
      case 'brand':
        setBrandForm({ name: '', nameEn: '', country: '', description: '', longDescription: '', brandImage: '', logo: '', displayOrder: 0 });
        break;
      case 'product':
        setProductForm({ name: '', summary: '', description: '', imageUrl: '', images: [], categoryId: '', brandId: '' });
        break;
      case 'news':
        setNewsForm({ title: '', summary: '', content: '', imageUrl: '', slug: '', publishedAt: new Date().toISOString().slice(0, 16) });
        break;
      case 'contact':
        break;
    }
    setSidebarType('create');
  };

  const openEditSidebar = (item: any) => {
    setEditingItem(item);
    switch (activeTab) {
      case 'category':
        setCategoryForm({ name: item.name, description: item.description || '', displayOrder: item.displayOrder });
        break;
      case 'brand':
        setBrandForm({ 
          name: item.name, nameEn: item.nameEn || '', country: item.country || '', 
          description: item.description || '', longDescription: item.longDescription || '', 
          brandImage: item.brandImage || '', logo: item.logo || '', displayOrder: item.displayOrder 
        });
        break;
      case 'product':
        setProductForm({ 
          name: item.name, summary: item.summary || '', description: item.description || '', 
          imageUrl: item.imageUrl || '', 
          images: item.images ? JSON.parse(item.images) : [],
          categoryId: item.categoryId?.toString() || '', 
          brandId: item.brandId?.toString() || '' 
        });
        break;
      case 'news':
        setNewsForm({ 
          title: item.title, 
          summary: item.summary || '', 
          content: item.content, 
          imageUrl: item.imageUrl || '', 
          slug: item.slug || '', 
          publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16) 
        });
        break;
    }
    setSidebarType('edit');
  };

  // ===== Render Functions =====
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <form onSubmit={handleLogin} className="p-8 bg-zinc-900 rounded-lg w-96 flex flex-col gap-4 shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">后台管理登录</h1>
          <input className="bg-zinc-800 p-3 rounded border border-zinc-700" placeholder="请输入账号" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="bg-zinc-800 p-3 rounded border border-zinc-700" type="password" placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-blue-600 p-3 rounded mt-4 hover:bg-blue-500 font-medium" type="submit">登录</button>
        </form>
      </div>
    );
  }

  // ===== Category Management =====
  const renderCategoryManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">分类管理</h2>
          <p className="text-zinc-400 text-sm mt-1">管理产品分类，用于导航栏产品下拉菜单</p>
        </div>
        <button onClick={openCreateSidebar} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加分类
        </button>
      </div>
      
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">ID</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">分类名称</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">描述</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">排序</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-500 text-sm">{cat.id}</td>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-zinc-400 text-sm">{cat.description || '-'}</td>
                <td className="p-4 text-zinc-400 text-sm">{cat.displayOrder}</td>
                <td className="p-4">
                  <button onClick={() => openEditSidebar(cat)} className="text-blue-400 hover:text-blue-300 mr-4 text-sm font-medium">编辑</button>
                  <button onClick={() => handleDelete('category', cat.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={sidebarType !== null && activeTab === 'category'}
        onClose={() => setSidebarType(null)}
        title={sidebarType === 'create' ? '添加分类' : '编辑分类'}
      >
        <div className="p-6 space-y-6">
          <FormField label="分类名称" required>
            <TextInput value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="请输入分类名称" />
          </FormField>
          <FormField label="描述">
            <TextInput value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} placeholder="请输入分类描述（可选）" />
          </FormField>
          <FormField label="显示顺序">
            <TextInput type="number" value={categoryForm.displayOrder} onChange={e => setCategoryForm({...categoryForm, displayOrder: Number(e.target.value)})} placeholder="数字越小越靠前" />
          </FormField>
          
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => handleSave('category', categoryForm, !!editingItem)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors">保存</button>
            <button onClick={() => setSidebarType(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-colors">取消</button>
          </div>
        </div>
      </Sidebar>
    </div>
  );

  // ===== Brand Management =====
  const renderBrandManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">品牌管理</h2>
          <p className="text-zinc-400 text-sm mt-1">管理品牌信息，用于导航栏品牌下拉菜单</p>
        </div>
        <button onClick={openCreateSidebar} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加品牌
        </button>
      </div>
      
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">ID</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">品牌名称</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">英文名</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">国家</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">排序</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-500 text-sm">{brand.id}</td>
                <td className="p-4 font-medium">{brand.name}</td>
                <td className="p-4 text-zinc-400 text-sm">{brand.nameEn || '-'}</td>
                <td className="p-4 text-zinc-400 text-sm">{brand.country || '-'}</td>
                <td className="p-4 text-zinc-400 text-sm">{brand.displayOrder}</td>
                <td className="p-4">
                  <button onClick={() => openEditSidebar(brand)} className="text-blue-400 hover:text-blue-300 mr-4 text-sm font-medium">编辑</button>
                  <button onClick={() => handleDelete('brand', brand.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={sidebarType !== null && activeTab === 'brand'}
        onClose={() => setSidebarType(null)}
        title={sidebarType === 'create' ? '添加品牌' : '编辑品牌'}
      >
        <div className="p-6 space-y-6">
          <FormField label="品牌名称" required>
            <TextInput value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} placeholder="请输入品牌名称" />
          </FormField>
          <FormField label="英语名称">
            <TextInput value={brandForm.nameEn} onChange={e => setBrandForm({...brandForm, nameEn: e.target.value})} placeholder="请输入英语名称（可选）" />
          </FormField>
          <FormField label="国家">
            <TextInput value={brandForm.country} onChange={e => setBrandForm({...brandForm, country: e.target.value})} placeholder="请输入国家（可选）" />
          </FormField>
          <FormField label="品牌简介">
            <TextArea value={brandForm.description} onChange={e => setBrandForm({...brandForm, description: e.target.value})} placeholder="请输入品牌简介（可选）" rows={3} />
          </FormField>
          <FormField label="详细介绍">
            <RichTextEditor value={brandForm.longDescription} onChange={(value) => setBrandForm({...brandForm, longDescription: value})} />
          </FormField>
          <FormField label="品牌大图">
            <ImageUpload
              imageUrl={brandForm.brandImage}
              onUpload={(file) => handleImageUpload(file, 'brandImage', url => setBrandForm({...brandForm, brandImage: url}))}
              onRemove={() => setBrandForm({...brandForm, brandImage: ''})}
              uploading={uploadingField === 'brandImage'}
              hint="推荐尺寸: 1200x500px 或 21:9 比例，用于品牌详情页顶部大图和品牌列表展示"
            />
          </FormField>
          <FormField label="品牌 Logo">
            <ImageUpload
              imageUrl={brandForm.logo}
              onUpload={(file) => handleImageUpload(file, 'brandLogo', url => setBrandForm({...brandForm, logo: url}))}
              onRemove={() => setBrandForm({...brandForm, logo: ''})}
              uploading={uploadingField === 'brandLogo'}
              hint="推荐尺寸: 200x60px，透明背景 PNG 最佳，用于首页精选品牌展示"
            />
          </FormField>
          <FormField label="显示顺序">
            <TextInput type="number" value={brandForm.displayOrder} onChange={e => setBrandForm({...brandForm, displayOrder: Number(e.target.value)})} placeholder="数字越小越靠前" />
          </FormField>
          
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => handleSave('brand', brandForm, !!editingItem)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors">保存</button>
            <button onClick={() => setSidebarType(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-colors">取消</button>
          </div>
        </div>
      </Sidebar>
    </div>
  );

  // ===== Product Management =====
  const renderProductManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">产品管理</h2>
          <p className="text-zinc-400 text-sm mt-1">管理产品信息，关联分类和品牌</p>
        </div>
        <button onClick={openCreateSidebar} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加产品
        </button>
      </div>
      
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">ID</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">产品名称</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">分类</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">品牌</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-500 text-sm">{product.id}</td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-zinc-400 text-sm">{product.category?.name || '-'}</td>
                <td className="p-4 text-zinc-400 text-sm">{product.brand?.name || '-'}</td>
                <td className="p-4">
                  <button onClick={() => openEditSidebar(product)} className="text-blue-400 hover:text-blue-300 mr-4 text-sm font-medium">编辑</button>
                  <button onClick={() => handleDelete('product', product.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={sidebarType !== null && activeTab === 'product'}
        onClose={() => setSidebarType(null)}
        title={sidebarType === 'create' ? '添加产品' : '编辑产品'}
        width="900px"
      >
        <div className="p-6 space-y-6">
          <FormField label="产品名称" required>
            <TextInput value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="请输入产品名称" />
          </FormField>
          <FormField label="产品简介">
            <TextInput value={productForm.summary} onChange={e => setProductForm({...productForm, summary: e.target.value})} placeholder="请输入产品简介（可选）" />
          </FormField>
          <FormField label="产品详情（富文本）">
            <RichTextEditor
              value={productForm.description}
              onChange={(value) => setProductForm({...productForm, description: value})}
            />
          </FormField>
          <FormField label="分类">
            <Select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})}>
              <option value="">请选择分类</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
          </FormField>
          <FormField label="所属品牌">
            <Select value={productForm.brandId} onChange={e => setProductForm({...productForm, brandId: e.target.value})}>
              <option value="">请选择品牌</option>
              {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </Select>
          </FormField>
          <FormField label="封面图">
            <ImageUpload
              imageUrl={productForm.imageUrl}
              onUpload={(file) => handleImageUpload(file, 'productImage', url => setProductForm({...productForm, imageUrl: url}))}
              onRemove={() => setProductForm({...productForm, imageUrl: ''})}
              uploading={uploadingField === 'productImage'}
              hint="推荐尺寸: 800x600px 或 4:3 比例，用于产品列表和详情页主图"
            />
          </FormField>
          <FormField label="其他产品图片">
            <div className="space-y-3">
              {productForm.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`产品图${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => setProductForm({...productForm, images: productForm.images.filter((_, i) => i !== index)})}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <ImageUpload
                imageUrl=""
                onUpload={(file) => handleImageUpload(file, `productImage${productForm.images.length}`, (url) => {
                  setProductForm({...productForm, images: [...productForm.images, url]});
                })}
                onRemove={() => {}}
                uploading={uploadingField?.startsWith('productImage') && uploadingField !== 'productImage'}
                hint="推荐尺寸: 800x600px 或 4:3 比例，用于产品详情页展示"
              />
            </div>
          </FormField>
          
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => handleSave('product', {
              ...productForm, 
              categoryId: productForm.categoryId ? Number(productForm.categoryId) : null, 
              brandId: productForm.brandId ? Number(productForm.brandId) : null,
              images: productForm.images.length > 0 ? JSON.stringify(productForm.images) : null
            }, !!editingItem)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors">保存</button>
            <button onClick={() => setSidebarType(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-colors">取消</button>
          </div>
        </div>
      </Sidebar>
    </div>
  );

  // ===== News Management =====
  const renderNewsManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">新闻管理</h2>
          <p className="text-zinc-400 text-sm mt-1">管理新闻资讯，支持富文本编辑</p>
        </div>
        <button onClick={openCreateSidebar} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加新闻
        </button>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">ID</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">封面</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">标题</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">发布时间</th>
              <th className="p-4 text-left text-zinc-400 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-500 text-sm">{item.id}</td>
                <td className="p-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-10 object-cover rounded border border-zinc-700" />
                  ) : (
                    <span className="text-zinc-600 text-sm">无封面</span>
                  )}
                </td>
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-zinc-400 text-sm">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('zh-CN') : '-'}</td>
                <td className="p-4">
                  <button onClick={() => openEditSidebar(item)} className="text-blue-400 hover:text-blue-300 mr-4 text-sm font-medium">编辑</button>
                  <button onClick={() => handleDelete('news', item.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={sidebarType !== null && activeTab === 'news'}
        onClose={() => setSidebarType(null)}
        title={sidebarType === 'create' ? '添加新闻' : '编辑新闻'}
        width="900px"
      >
        <div className="p-6 space-y-6">
          <FormField label="标题" required>
            <TextInput value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="请输入新闻标题" />
          </FormField>
          <FormField label="URL别名 (slug)">
            <TextInput value={newsForm.slug} onChange={e => setNewsForm({...newsForm, slug: e.target.value})} placeholder="如: company-news-2024，用于URL展示（可选）" />
          </FormField>
          <FormField label="摘要">
            <TextArea value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} placeholder="请输入新闻摘要，用于列表页展示（可选）" rows={3} />
          </FormField>
          <FormField label="封面图">
            <ImageUpload
              imageUrl={newsForm.imageUrl}
              onUpload={(file) => handleImageUpload(file, 'newsImage', url => setNewsForm({...newsForm, imageUrl: url}))}
              onRemove={() => setNewsForm({...newsForm, imageUrl: ''})}
              uploading={uploadingField === 'newsImage'}
              hint="推荐尺寸: 1200x630px 或 16:9 比例，用于新闻列表和详情页展示"
            />
          </FormField>
          <FormField label="发布时间">
            <TextInput
              type="datetime-local"
              value={newsForm.publishedAt}
              onChange={e => setNewsForm({...newsForm, publishedAt: e.target.value})}
            />
          </FormField>
          <FormField label="内容（富文本）">
            <RichTextEditor
              value={newsForm.content}
              onChange={(value) => setNewsForm({...newsForm, content: value})}
            />
          </FormField>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => handleSave('news', {
              ...newsForm,
              publishedAt: newsForm.publishedAt ? new Date(newsForm.publishedAt).toISOString() : new Date().toISOString()
            }, !!editingItem)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors">保存</button>
            <button onClick={() => setSidebarType(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-colors">取消</button>
          </div>
        </div>
      </Sidebar>
    </div>
  );

  // ===== Contact Management =====
  const renderContactManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">联系我们配置</h2>
          <p className="text-zinc-400 text-sm mt-1">管理联系我们页面的公司信息</p>
        </div>
      </div>

      {contactForm ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField label="公司名称">
              <TextInput value={contactForm.companyName || ''} onChange={e => setContactForm({...contactForm, companyName: e.target.value})} placeholder="请输入公司名称" />
            </FormField>
            <FormField label="公司英文名">
              <TextInput value={contactForm.companyNameEn || ''} onChange={e => setContactForm({...contactForm, companyNameEn: e.target.value})} placeholder="请输入公司英文名" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="电话">
              <TextInput value={contactForm.phone || ''} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="请输入联系电话" />
            </FormField>
            <FormField label="邮箱">
              <TextInput value={contactForm.email || ''} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="请输入联系邮箱" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="地址">
              <TextInput value={contactForm.address || ''} onChange={e => setContactForm({...contactForm, address: e.target.value})} placeholder="请输入公司地址" />
            </FormField>
            <FormField label="英文地址">
              <TextInput value={contactForm.addressEn || ''} onChange={e => setContactForm({...contactForm, addressEn: e.target.value})} placeholder="请输入英文地址" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="工作时间">
              <TextInput value={contactForm.workingHours || ''} onChange={e => setContactForm({...contactForm, workingHours: e.target.value})} placeholder="如: 周一至周五 9:00-18:00" />
            </FormField>
            <FormField label="微信公众号">
              <TextInput value={contactForm.wechat || ''} onChange={e => setContactForm({...contactForm, wechat: e.target.value})} placeholder="请输入微信公众号" />
            </FormField>
          </div>

          <FormField label="微博">
            <TextInput value={contactForm.weibo || ''} onChange={e => setContactForm({...contactForm, weibo: e.target.value})} placeholder="请输入微博账号" />
          </FormField>

          <FormField label="地图图片">
            <ImageUpload
              imageUrl={contactForm.mapUrl || ''}
              onUpload={(file) => handleImageUpload(file, 'contactMap', url => setContactForm({...contactForm, mapUrl: url}))}
              onRemove={() => setContactForm({...contactForm, mapUrl: ''})}
              uploading={uploadingField === 'contactMap'}
              hint="推荐尺寸: 1200x600px 或 2:1 比例，用于联系我们页面地图展示"
            />
          </FormField>

          <FormField label="介绍文本（富文本）">
            <RichTextEditor
              value={contactForm.introText || ''}
              onChange={(value) => setContactForm({...contactForm, introText: value})}
            />
          </FormField>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button onClick={async () => {
              const url = `${API_BASE_URL}/api/contactConfig/${contactForm.id}`;
              const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm)
              });
              if (res.ok) {
                fetchContactConfig();
                alert('保存成功');
              } else {
                alert('保存失败');
              }
            }} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors">保存配置</button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
          <p className="text-zinc-500 mb-4">暂无联系我们配置</p>
          <button
            onClick={async () => {
              const defaultConfig = {
                companyName: '立敏音响',
                companyNameEn: 'LIMIN AUDIO',
                phone: '0086-21-56317880',
                email: 'info@liminaudio.com',
                address: '上海市黄浦区南苏州路 933 号 103 室',
                addressEn: 'Room 103, No. 933 South Suzhou Road, Huangpu District, Shanghai',
                workingHours: '周一至周五 9:00-18:00',
                wechat: '',
                weibo: '',
                introText: '<p>我们在中国领导高端音频业务超过 25 年，提供来自各大洲的最佳设备，提供最先进的 Hi-End 音频体验，与客户分享对音乐艺术的热情。</p><p>我们追求最好的音频性能。我们选择和分销世界级品牌和组件，采用新技术和制作定制服务，以确保我们的客户能够在他们的聆听环境中体验高保真音乐再现。</p><p>我们在上海设有工作室和展示厅，在中国各地设有经销商。</p><p>我们所有的产品都经过精心挑选，代表了我们制造商的性能和支持的巅峰。</p><p>无论您是在寻找音响系统还是家庭影院，一体化系统或模拟转盘，我们随时为您提供帮助。我们的目标是引导您，让您轻松选择音乐系统，无论您的预算如何。</p><p>如果您有任何疑问，请联系我们。</p>'
              };
              const res = await fetch(`${API_BASE_URL}/api/contactConfig`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(defaultConfig)
              });
              if (res.ok) {
                fetchContactConfig();
              } else {
                const errorData = await res.json().catch(() => ({ error: '未知错误' }));
                alert('创建失败: ' + (errorData.error || `HTTP ${res.status}`));
              }
            }}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            创建默认配置
          </button>
        </div>
      )}
    </div>
  );

  // ===== Site Config =====
  const renderSiteConfig = () => (
    <div className="space-y-8">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-6">站点配置</h2>

        <div className="space-y-6 max-w-xl">
          <FormField label="Logo 图片">
            <div className="space-y-3">
              {siteConfig?.logoUrl && (
                <div className="w-48 h-16 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={siteConfig.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={siteConfig?.logoUrl || ''}
                  onChange={e => setSiteConfig(prev => prev ? { ...prev, logoUrl: e.target.value } : null)}
                  placeholder="Logo 图片 URL"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'siteLogo', url => setSiteConfig(prev => prev ? { ...prev, logoUrl: url } : null))}
                  className="hidden"
                  id="site-logo-upload"
                />
                <label
                  htmlFor="site-logo-upload"
                  className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors whitespace-nowrap"
                >
                  {uploadingField === 'siteLogo' ? '上传中...' : '上传图片'}
                </label>
              </div>
              <p className="text-xs text-zinc-500">推荐尺寸：200 × 60 像素，透明背景 PNG 最佳</p>
            </div>
          </FormField>

          <FormField label="主题强调色">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={siteConfig?.accentColor || '#C9A96E'}
                onChange={e => setSiteConfig(prev => prev ? { ...prev, accentColor: e.target.value } : null)}
                className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={siteConfig?.accentColor || '#C9A96E'}
                onChange={e => setSiteConfig(prev => prev ? { ...prev, accentColor: e.target.value } : null)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-32"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">用于导航栏激活状态、分割线、hover 效果等</p>
          </FormField>

          <FormField label="站点风格">
            <div className="flex gap-4">
              <div className="flex-1 p-4 rounded-lg border-2 border-blue-500 bg-blue-500/10">
                <div className="w-full h-20 rounded-md bg-[#050505] border border-white/10 mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-1 bg-[#C9A96E]/60 rounded mb-1.5 mx-auto" />
                    <div className="w-12 h-1 bg-white/20 rounded mb-1.5 mx-auto" />
                    <div className="w-6 h-1 bg-white/10 rounded mx-auto" />
                  </div>
                </div>
                <p className="text-sm font-medium text-white">暗色系</p>
                <p className="text-xs text-zinc-500 mt-1">深色背景，沉浸感强</p>
              </div>
            </div>
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={async () => {
            if (!siteConfig) return;
            const res = await fetch(`${API_BASE_URL}/api/siteConfig/${siteConfig.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ logoUrl: siteConfig.logoUrl, accentColor: siteConfig.accentColor, theme: 'dark' }),
            });
            if (res.ok) alert('站点配置保存成功');
            else alert('保存失败');
          }}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
        >
          保存站点配置
        </button>
      </div>
    </div>
  );

  // ===== Security Settings =====
  const renderSecuritySettings = () => (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">安全设置</h2>
          <p className="text-zinc-400 text-sm mt-1">修改管理员登录密码，提高账户安全性</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">修改密码</h3>
            <p className="text-zinc-500 text-sm">建议定期更换密码，使用包含字母、数字的复杂密码</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {passwordError && (
            <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-4 bg-green-950/50 border border-green-800/50 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-300 text-sm">{passwordSuccess}</p>
            </div>
          )}

          <FormField label="当前密码" required>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="请输入当前密码"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </FormField>

          <FormField label="新密码" required>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="请输入新密码（至少6位）"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </FormField>

          <FormField label="确认新密码" required>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="请再次输入新密码"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </FormField>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  修改中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  确认修改密码
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-8 bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          安全建议
        </h3>
        <ul className="space-y-2 text-sm text-zinc-500">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            密码长度至少 8 位，建议包含大小写字母、数字和特殊字符
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            避免使用生日、手机号等容易被猜到的信息作为密码
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            建议每 3 个月更换一次密码
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            修改密码后，系统会自动退出登录，请使用新密码重新登录
          </li>
        </ul>
      </div>
    </div>
  );

  // ===== Home Config =====
  const renderHomeConfig = () => (
    <div className="space-y-8">
      {/* Hero Slides */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Banner 轮播图配置</h2>
            <p className="text-zinc-400 text-sm mt-1">设置首页轮播图内容</p>
          </div>
          <button onClick={() => setHeroSlides([...heroSlides, { image: '', title: '', subtitle: '' }])} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加轮播图
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg text-sm">
          <p className="font-medium text-blue-200 mb-1">图片尺寸要求：</p>
          <ul className="space-y-1 text-blue-300/80">
            <li>• 推荐尺寸：<span className="text-white">1920 × 1080 像素</span>（16:9 宽屏比例）</li>
            <li>• 文件格式：JPG、PNG、GIF、WebP</li>
            <li>• 建议控制在 5MB 以内以获得最佳加载速度</li>
          </ul>
        </div>
        
        <div className="space-y-6">
          {heroSlides.map((slide, index) => (
            <div key={index} className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-400 font-medium text-sm">轮播图 #{index + 1}</span>
                <button onClick={() => heroSlides.length > 1 && setHeroSlides(heroSlides.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 text-sm font-medium">删除</button>
              </div>
              
              <div className="mb-4">
                <input type="file" ref={el => fileInputRefs.current[index] = el} onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], `slide-${index}`, url => { const newSlides = [...heroSlides]; newSlides[index].image = url; setHeroSlides(newSlides); })} accept="image/*" className="hidden" />
                
                {slide.image ? (
                  <div className="relative group">
                    <img src={slide.image} alt={`轮播图 ${index + 1}`} className="w-full h-48 object-cover rounded-lg border border-zinc-700" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                      <button onClick={() => fileInputRefs.current[index]?.click()} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">更换图片</button>
                      <button onClick={() => { const newSlides = [...heroSlides]; newSlides[index].image = ''; setHeroSlides(newSlides); }} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">删除图片</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => fileInputRefs.current[index]?.click()} className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-zinc-800/50 transition-all group">
                    <svg className="w-10 h-10 text-zinc-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-zinc-400 group-hover:text-zinc-300">点击上传图片</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <TextInput placeholder="大标题" value={slide.title} onChange={e => { const newSlides = [...heroSlides]; newSlides[index].title = e.target.value; setHeroSlides(newSlides); }} />
                <TextInput placeholder="副标题" value={slide.subtitle} onChange={e => { const newSlides = [...heroSlides]; newSlides[index].subtitle = e.target.value; setHeroSlides(newSlides); }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">中间理念标题配置</h2>
          <p className="text-zinc-400 text-sm mt-1">设置首页中间展示的理念文字</p>
        </div>
        <TextInput value={philosophyTitle} onChange={e => setPhilosophyTitle(e.target.value)} placeholder="请输入理念标题" />
      </div>

      {/* Stats */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">数值配置</h2>
          <p className="text-zinc-400 text-sm mt-1">设置首页展示的统计数据</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="年行业经验">
            <TextInput type="number" value={yearsExperience} onChange={e => setYearsExperience(Number(e.target.value))} />
          </FormField>
          <FormField label="全球合作品牌">
            <TextInput type="number" value={globalBrands} onChange={e => setGlobalBrands(Number(e.target.value))} />
          </FormField>
          <FormField label="服务客户">
            <TextInput type="number" value={servedCustomers} onChange={e => setServedCustomers(Number(e.target.value))} />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveHomeConfig} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium text-lg transition-colors">保存首页配置</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-zinc-900 p-4 flex flex-col gap-1 border-r border-zinc-800">
        <h2 className="text-xl font-bold mb-6 mt-4 px-2">管理后台</h2>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
        <div className="mt-auto">
          <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_username'); setToken(null); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950 rounded-lg transition-colors">退出登录</button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'category' && renderCategoryManagement()}
        {activeTab === 'brand' && renderBrandManagement()}
        {activeTab === 'product' && renderProductManagement()}
        {activeTab === 'news' && renderNewsManagement()}
        {activeTab === 'contact' && renderContactManagement()}
        {activeTab === 'homeConfig' && renderHomeConfig()}
        {activeTab === 'siteConfig' && renderSiteConfig()}
        {activeTab === 'security' && renderSecuritySettings()}
      </div>
    </div>
  );
}
