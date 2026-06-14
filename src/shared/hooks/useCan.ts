import { useAuth } from '../providers/AuthProvider';

export const useCan = () => {
    const { user } = useAuth();

    const can = (permission: string): boolean => {
        if (!user || !user.permissions) return false;

        // Si es super_admin, tiene acceso a todo
        if (user.roles?.includes('super_admin')) return true;

        return user.permissions.includes(permission);
    };

    const canAny = (permissions: string[]): boolean => {
        return permissions.some(p => can(p));
    };

    return { can, canAny, user };
};
