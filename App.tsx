// FIX: The original file contained a full HTML document, which is invalid in a .tsx file. It has been converted to a React functional component. The <html>, <head>, <body>, and <script> tags are removed as they are typically handled in the main index.html file in a React project.
// FIX: The initial HTML comment `<!-- RECOMENDACIÓN... -->` and `<!DOCTYPE html>` were removed as they are not valid JSX.
import React from 'react';

function App() {
    return (
        // FIX: Replaced `class` with `className` throughout the component to comply with JSX syntax. The `font-poppins` class from the original `<body>` tag has been moved here to maintain styling.
        <div className="flex h-screen bg-gray-200 font-poppins">
            {/* Barra lateral */}
            <div id="sidebar" className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold"><i className="fas fa-child text-blue-400"></i> NiceKids</h2>
                </div>
                {/* FIX: HTML comment `<!-- ... -->` converted to JSX comment `{/* ... */}` */}
                <nav id="sidebar-nav" className="flex-1 px-4 py-4 space-y-2">
                    {/* Los enlaces de navegación se insertarán aquí dinámicamente */}
                </nav>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Barra superior */}
                <header className="flex justify-between items-center p-4 bg-white border-b">
                    <div>
                        <h1 id="page-title" className="text-2xl font-semibold text-gray-800">Panel de Control</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Bienvenido, Administrador</span>
                        <button id="logoutButton" title="Cerrar Sesión" className="text-gray-500 hover:text-red-600">
                            <i className="fas fa-sign-out-alt fa-lg"></i>
                        </button>
                    </div>
                </header>
                
                {/* Área de contenido */}
                <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                     <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Bienvenido a NiceKids!</h2>
                        <p className="text-gray-600">Usa el menú de la izquierda para navegar por las diferentes secciones del sistema.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
