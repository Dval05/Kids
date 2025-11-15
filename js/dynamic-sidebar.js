import supabase from 'supabaseClient';

async function getRoleForCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('user_role')
        .select('RoleID')
        .eq('UserID', user.id)
        .single();
    
    if (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
    return data ? data.RoleID : null;
}

async function getPermissionsForRole(roleId) {
    if (!roleId) return [];

    const { data, error } = await supabase
        .from('role_permission')
        .select('permission(Module, Action, Link, Icon, PermissionName:Description)') // Renombramos Description a PermissionName para coincidir
        .eq('RoleID', roleId);

    if (error) {
        console.error("Error fetching permissions for role:", error);
        return [];
    }
    
    // Aplanar la estructura
    return data.map(item => ({
        module: item.permission.Module,
        action: item.permission.Action,
        link: item.permission.Link,
        icon: item.permission.Icon,
        name: item.permission.PermissionName
    }));
}


document.addEventListener('DOMContentLoaded', async () => {
    const sidebarNav = document.getElementById('sidebar-nav');
    if (!sidebarNav) return;

    const roleId = await getRoleForCurrentUser();
    const userPermissions = await getPermissionsForRole(roleId);
    
    // Añadir el Dashboard como opción por defecto si no está
    const hasDashboard = userPermissions.some(p => p.module === 'Dashboard');
    if (!hasDashboard) {
        userPermissions.unshift({
             module: 'Dashboard', action: 'view', link: '/html/welcome.html', icon: 'fa-tachometer-alt', name: 'Panel de Control'
        });
    }
    
    let navHTML = '';
    userPermissions.forEach(permission => {
        // Solo mostrar enlaces que sean para 'ver' vistas principales
        if (permission.action === 'view') {
             navHTML += `
                <a href="#" onclick="loadContent('${permission.link}', '${permission.name}')" 
                   class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200">
                    <i class="fas ${permission.icon} w-6"></i>
                    <span class="ml-3">${permission.name}</span>
                </a>
            `;
        }
    });
    sidebarNav.innerHTML = navHTML;
});