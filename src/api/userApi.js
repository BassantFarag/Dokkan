import api from './axios'

export const updateUserProfile =(payload ,id)=>api.patch(`/users/${id}`,payload);