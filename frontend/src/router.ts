import { createBrowserRouter } from 'react-router';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import BookInfoPage from './pages/BookInfoPage';
import ListsPage from './pages/ListsPage';
import SearchPage from './pages/SearchPage';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PublicLayout from './layouts/PublicLayout';

export const router = createBrowserRouter([
    {
        Component: PublicLayout,
        children: [
            {
                index: true,
                Component: LandingPage
            },
            {
                path: '/login',
                Component: SignInPage
            },
            {
                path: '/signup',
                Component: SignUpPage
            }]
    },
    {
        Component: ProtectedLayout,
        children: [
            {
                path: "home",
                Component: HomePage,
            },
            {
                path: "lists",
                Component: ListsPage
            },
            {
                path: "book/:id",
                Component: BookInfoPage
                // A page to view information about a specific book
            },
            {
                path: "search",
                Component: SearchPage
                // search page to look up books using OpenLibrary api
            }
        ],
    },
]);