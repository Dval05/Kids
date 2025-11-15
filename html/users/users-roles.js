// RECOMENDACIÓN: Renombrar este archivo a /js/users/users-roles.js

import supabase from 'supabaseClient';

// --- LÓGICA DE LA PÁGINA ---

const userModal = document.getElementById('userModal');
const roleModal = document.getElementById('roleModal');
const permissionsModal = document.getElementById('permissionsModal');
const userForm = document.getElementById('userForm');
const roleForm = document.getElementById('roleForm');
const permissionsForm = document.getElementById('permissionsForm');

// --- Toast Notification ---
let toastTimer;
const showToast = (message, isError = false) => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    clearTimeout(toastTimer);

    const icon = isError 
        ? `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg"><i class="fas fa-exclamation-triangle"></i></div>`
        : `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg"><i class="fas fa-check"></i></div>`;

    toast.innerHTML = `
        <div class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
            ${icon}
            <div class="ms-3 text-sm font-normal">${message}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
                <span class="sr-only">Close</span>
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toast.querySelector('button').addEventListener('click', () => {
        toast.classList.remove('show');
    });

    toast.classList.add('show');

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// --- Funciones para Modales ---
const openModal = (modal) => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

const closeModal = (modal) => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// --- Fetching de Datos desde Supabase ---
async function fetchUsers() {
    const { data, error } = await supabase
        .from('user')
        .select(`
            UserID,
            FirstName,
            LastName,
            Email,
            IsActive,
            AuthUserID,
            user_role(
                role(RoleID, RoleName)
            )
        `);
    if (error) {
        console.error('Error fetching users:', error);
        showToast('Error al cargar usuarios.', true);
        return [];
    }
    // Aplanar la estructura de datos
    return data.map(u => ({
        id: u.UserID,
        authId: u.AuthUserID,
        firstName: u.FirstName,
        lastName: u.LastName,
        email: u.Email,
        isActive: u.IsActive,
        role: u.user_role[0]?.role || { RoleID: null, RoleName: 'Sin Asignar' },
    }));
}

async function fetchRoles() {
    const { data, error } = await supabase.from('role').select('*');
    if (error) {
        console.error('Error fetching roles:', error);
        showToast('Error al cargar roles.', true);
        return [];
    }
    return data;
}

async function fetchPermissions() {
    const { data, error } = await supabase.from('permission').select('*');
    if (error) {
        console.error('Error fetching permissions:', error);
        showToast('Error al cargar permisos.', true);
        return [];
    }
    return data;
}


// --- Renderizado de Tablas ---
async function renderUsers() {
    const users = await fetchUsers();
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = users.map(user => {
        const statusClass = user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return `
            <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium text-gray-900">${user.firstName} ${user.lastName}</td>
                <td class="px-6 py-4">${user.email}</td>
                <td class="px-6 py-4">${user.role.RoleName}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">${user.isActive ? 'Activo' : 'Inactivo'}</span></td>
                <td class="px-6 py-4 space-x-2">
                    <button class="text-blue-600 hover:text-blue-900" onclick='editUser(${JSON.stringify(user)})'><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

async function renderRoles() {
    const roles = await fetchRoles();
    const tableBody = document.getElementById('rolesTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = roles.map(role => `
        <tr class="bg-white border-b">
            <td class="px-6 py-4 font-medium text-gray-900">${role.RoleName}</td>
            <td class="px-6 py-4">${role.Description}</td>
            <td class="px-6 py-4 space-x-2">
                <button class="text-blue-600 hover:text-blue-900" onclick='editRole(${JSON.stringify(role)})'><i class="fas fa-edit"></i></button>
                <button onclick="openPermissionsManager(${role.RoleID})" class="text-purple-600 hover:text-purple-900"><i class="fas fa-shield-alt"></i></button>
            </td>
        </tr>
    `).join('');
}


// --- Gestión de Formularios (CRUD) ---

window.editUser = (user) => {
    userForm.reset();
    document.getElementById('userModalTitle').textContent = 'Editar Usuario';
    document.getElementById('password-fields').classList.add('hidden');
    document.getElementById('userId').value = user.id;
    document.getElementById('userFirstName').value = user.firstName;
    document.getElementById('userLastName').value = user.lastName;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userEmail').disabled = true;
    document.getElementById('userRole').value = user.role.RoleID;
    document.getElementById('userIsActive').checked = user.isActive;
    openModal(userModal);
};

window.deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este usuario?')) return;
    // Borrado Lógico
    const { error } = await supabase.from('user').update({ IsActive: 0 }).eq('UserID', userId);
    if (error) {
        showToast('Error al desactivar usuario: ' + error.message, true);
    } else {
        showToast('Usuario desactivado correctamente.');
        renderUsers();
    }
};

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('userId');
    const roleId = formData.get('roleId');

    const userDataForTable = {
        FirstName: formData.get('firstName'),
        LastName: formData.get('lastName'),
        IsActive: formData.get('isActive') === 'on' ? 1 : 0,
    };
    
    if (userId) { // MODO EDICIÓN
        const { data, error } = await supabase.from('user').update(userDataForTable).eq('UserID', userId).select().single();
        if (error) return showToast('Error al actualizar: ' + error.message, true);
        
        const { error: roleError } = await supabase.from('user_role').upsert({ UserID: data.UserID, RoleID: roleId }, { onConflict: 'UserID' });
        if (roleError) return showToast('Usuario guardado, pero error al asignar rol: ' + roleError.message, true);

    } else { // MODO CREACIÓN
        const email = formData.get('email');
        const password = formData.get('password');
        if (password !== formData.get('confirmPassword')) return showToast('Las contraseñas no coinciden.', true);
        
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) return showToast('Error creando usuario: ' + authError.message, true);
        if (!authData.user) return showToast('No se pudo crear el usuario.', true);

        // 2. Actualizar la fila en la tabla 'user' que el trigger de Supabase ya debió crear
        const { data: profileData, error: profileError } = await supabase
            .from('user')
            .update({ ...userDataForTable, Email: email })
            .eq('AuthUserID', authData.user.id)
            .select()
            .single();
        
        if (profileError) return showToast('Error guardando perfil: ' + profileError.message, true);

        // 3. Asignar rol
        const { error: roleError } = await supabase.from('user_role').insert({ UserID: profileData.UserID, RoleID: roleId });
        if (roleError) return showToast('Usuario creado, pero error al asignar rol: ' + roleError.message, true);
    }

    showToast(`Usuario ${userId ? 'actualizado' : 'creado'} correctamente.`);
    closeModal(userModal);
    renderUsers();
    renderRoles();
});


window.editRole = (role) => {
    roleForm.reset();
    document.getElementById('roleModalTitle').textContent = 'Editar Rol';
    document.getElementById('roleId').value = role.RoleID;
    document.getElementById('roleName').value = role.RoleName;
    document.getElementById('roleDescription').value = role.Description;
    openModal(roleModal);
};

roleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roleId = formData.get('roleId');

    const roleData = {
        RoleName: formData.get('roleName'),
        Description: formData.get('description'),
    };

    let error;

    if (roleId) { // MODO EDICIÓN
        const { error: updateError } = await supabase.from('role').update(roleData).eq('RoleID', roleId);
        error = updateError;
    } else { // MODO CREACIÓN
        const { data: newRole, error: insertError } = await supabase.from('role').insert(roleData).select().single();
        if (insertError) {
            error = insertError;
        } else if (newRole) {
            // Asignar permiso por defecto (ver dashboard)
            // 1. Buscar el ID del permiso
            const { data: perm, error: permError } = await supabase
                .from('permission')
                .select('PermissionID')
                .eq('Module', 'Dashboard')
                .eq('Action', 'view')
                .single();

            if (perm && !permError) {
                // 2. Asignar el permiso al nuevo rol
                const { error: assignError } = await supabase
                    .from('role_permission')
                    .insert({ RoleID: newRole.RoleID, PermissionID: perm.PermissionID });
                
                if (assignError) {
                    console.warn(`Rol creado, pero no se pudo asignar el permiso por defecto: ${assignError.message}`);
                }
            } else {
                 console.warn('No se encontró el permiso por defecto "Ver Dashboard" para asignarlo al nuevo rol.');
            }
        }
    }

    if (error) {
        showToast('Error al guardar rol: ' + error.message, true);
    } else {
        showToast(`Rol ${roleId ? 'actualizado' : 'creado'} correctamente.`);
        closeModal(roleModal);
        renderRoles();
        loadRolesIntoSelect();
    }
});


window.openPermissionsManager = async (roleId) => {
    const role = (await fetchRoles()).find(r => r.RoleID === roleId);
    if (!role) return;

    document.getElementById('permissionsRoleName').textContent = role.RoleName;
    document.getElementById('permissionsRoleId').value = role.RoleID;

    const allPermissions = await fetchPermissions();
    const { data: assigned } = await supabase.from('role_permission').select('PermissionID').eq('RoleID', roleId);
    const assignedIds = assigned.map(p => p.PermissionID);
    
    const grouped = allPermissions.reduce((acc, p) => {
        (acc[p.Module] = acc[p.Module] || []).push(p);
        return acc;
    }, {});

    document.getElementById('permissionsList').innerHTML = Object.keys(grouped).map(module => `
        <div>
            <h4 class="font-semibold text-gray-800 border-b pb-1 mb-2">${module}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${grouped[module].map(p => `
                <label class="flex items-center space-x-3">
                    <input type="checkbox" name="permission" value="${p.PermissionID}" ${assignedIds.includes(p.PermissionID) ? 'checked' : ''} class="form-checkbox h-5 w-5 text-purple-600 rounded">
                    <span class="text-gray-700">${p.Description}</span>
                </label>
            `).join('')}
            </div>
        </div>
    `).join('');
    openModal(permissionsModal);
};

permissionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roleId = formData.get('roleId');
    const selectedPermissions = Array.from(formData.getAll('permission')).map(id => parseInt(id));

    await supabase.from('role_permission').delete().eq('RoleID', roleId);
    if (selectedPermissions.length > 0) {
        const newPermissions = selectedPermissions.map(pId => ({ RoleID: roleId, PermissionID: pId }));
        const { error } = await supabase.from('role_permission').insert(newPermissions);
        if (error) return showToast('Error al guardar permisos: ' + error.message, true);
    }
    showToast('Permisos guardados correctamente.');
    closeModal(permissionsModal);
});

async function loadRolesIntoSelect() {
    const roles = await fetchRoles();
    const userRoleSelect = document.getElementById('userRole');
    if (userRoleSelect) {
        userRoleSelect.innerHTML = roles.map(r => `<option value="${r.RoleID}">${r.RoleName}</option>`).join('');
    }
}

// --- Inicialización y Event Listeners ---
// This script is loaded dynamically, so DOMContentLoaded might have already fired.
// We'll run the setup code directly.
function initializePage() {
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        userForm.reset();
        document.getElementById('userModalTitle').textContent = 'Añadir Nuevo Usuario';
        document.getElementById('userId').value = '';
        document.getElementById('password-fields').classList.remove('hidden');
        document.getElementById('userEmail').disabled = false;
        openModal(userModal);
    });
    document.getElementById('cancelUserBtn')?.addEventListener('click', () => closeModal(userModal));

    document.getElementById('addRoleBtn')?.addEventListener('click', () => {
        roleForm.reset();
        document.getElementById('roleModalTitle').textContent = 'Añadir Nuevo Rol';
        document.getElementById('roleId').value = '';
        openModal(roleModal);
    });
    document.getElementById('cancelRoleBtn')?.addEventListener('click', () => closeModal(roleModal));

    document.getElementById('cancelPermissionsBtn')?.addEventListener('click', () => closeModal(permissionsModal));

    loadRolesIntoSelect();
    renderUsers();
    renderRoles();
}

initializePage();