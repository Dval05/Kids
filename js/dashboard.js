import supabase from 'supabaseClient';

document.addEventListener('DOMContentLoaded', async () => {
    // Protección de ruta
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // No hay sesión, redirigir al login
        window.location.href = '/';
        return; // Detener la ejecución del resto del script
    }

    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const logoutButton = document.getElementById('logoutButton');
    const welcomeMessage = document.querySelector('header span');

    if (welcomeMessage && session.user.email) {
        welcomeMessage.textContent = `Bienvenido, ${session.user.email}`;
    }

    // Cargar contenido dinámicamente
    window.loadContent = async (url, title) => {
        try {
            if (url === '#' || !url) return;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('No se pudo cargar la página.');
            }
            const content = await response.text();
            mainContent.innerHTML = content;
            pageTitle.textContent = title;

            // Si hay un script asociado, cargarlo
            const scriptUrl = url.replace('.html', '.js');
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) {
                existingScript.remove();
            }
            
            const scriptExists = await fetch(scriptUrl, { method: 'HEAD' });
            if(scriptExists.ok) {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.type = 'module';
                document.body.appendChild(script);
            }

        } catch (error) {
            mainContent.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Error:</strong>
                <span class="block sm:inline">${error.message}</span>
            </div>`;
        }
    };
    
    // Manejar cierre de sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error al cerrar sesión:', error);
                alert('No se pudo cerrar la sesión.');
            } else {
                window.location.href = '/';
            }
        });
    }
});