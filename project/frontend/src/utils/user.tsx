import { User } from '@/types/global.types';

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || '{}');
}

export function setCurrentUser(user: User) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}
