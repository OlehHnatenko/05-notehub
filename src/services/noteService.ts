import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface FetchParams {
    page?: number;
    perPage?: number;
    search?: string;
}
interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async ({ perPage = 12, page = 1, search }: FetchParams) => {
    const response = await axios.get<FetchNotesResponse>(
        '/notes', {
        params: {
            page,
            perPage,
            ...(search !== '' && { search: search })
            
        },
        headers: {
            Authorization: `Bearer ${myKey}`,
        }
    }
    );
    return response.data;
}



export const addNote = async (noteData: NewNote) => {
    const response = await axios.post('/notes', noteData, {
        headers: {
            Authorization: `Bearer ${myKey}`,
        },
    });
    return response.data;
};

export const deleteNote = async (noteId: number) => {
    const response = await axios.delete(`/notes/${noteId}`, {
        headers: {
            Authorization: `Bearer ${myKey}`,
        },
    });
    return response.data;
};
