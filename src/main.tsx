import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Home from './Home';
import JSM from './Pages/JSM'
import Surveillance from './Pages/Surveillance'

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            { index: true, element: <Home /> },
            { path: 'japanese_salaryman', element: <JSM />},
            { path: 'surveillance', element: <Surveillance/>}
        ],
    },
    // You can add a route for "no match" scenarios (404 page)
    // { path: "*", element: <NoMatch /> }
]);

createRoot(document.getElementById('root')!).render(

    <RouterProvider router={router}>
    </RouterProvider>
)
