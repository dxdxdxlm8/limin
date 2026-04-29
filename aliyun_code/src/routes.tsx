import { RouteObject } from "react-router-dom";
import { Layout } from "./layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import BrandDetail from "./pages/BrandDetail";
import NewsDetail from "./pages/NewsDetail";
import AdminBrandIds from "./pages/AdminBrandIds";
import Admin from "./pages/Admin";

export const routes: RouteObject[] = [
  {
    path: "/manage",
    element: <Admin />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/brands",
        element: <Brands />,
      },
      {
        path: "/brand/:id",
        element: <BrandDetail />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/news/:id",
        element: <NewsDetail />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin/brand-ids",
        element: <AdminBrandIds />,
      },
    ],
  },
];
