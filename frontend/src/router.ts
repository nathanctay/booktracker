import { createBrowserRouter } from 'react-router';
import NavLayout from './layouts/NavLayout';
import HomePage from './pages/HomePage';
import BookInfoPage from './pages/BookInfoPage';
import ListsPage from './pages/ListsPage';
import SearchPage from './pages/SearchPage';

export const router = createBrowserRouter([
    {
        Component: NavLayout,
        children: [
            {
                index: true,
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