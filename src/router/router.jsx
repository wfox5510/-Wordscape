import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import BlogHome from "../page/BlogPage/BlogHome";
import AdminBackground from "../page/AdminPage/AdminBackground";
import AdminInfo from "../page/AdminPage/AdminInfo";
import AdminCollection from "../page/AdminPage/AdminCollection";
import AdminSubscription from "../page/AdminPage/AdminSubscription";
import BlogPage from "../page/BlogPage/BlogPage";
import TestLoginPage from "../page/BlogPage/TestLoginPage";
import TestArticlePage from "../page/BlogPage/TestArticlePage";
import { element } from "prop-types";
import AdminLayout from "../page/AdminPage/AdminLayout";


const router = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/article",
    element: <ArticlePage />
  },
  {
    path: "/blog",
    element: <BlogHome />
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "info",
        element: <AdminInfo />
      },
      {
        path: "collection",
        element: <AdminCollection />
      },
      {
        path: "subscription",
        element: <AdminSubscription />
      },
      {
        path: "background",
        element: <AdminBackground />
      }
    ]
  },
  {
    path: "/blogpage",
    element: <BlogPage />
  }, {
    path: "/testlogin",
    element: <TestLoginPage />
  }, {
    path: "/testArticle/:id",
    element: <TestArticlePage />
  }


];

export default router;