import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from "use-debounce";
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');


  const closeModal = () => setModalIsOpen(false);
  const openModal = () => setModalIsOpen(true);

  const updateSearchQuery = useDebouncedCallback((searchText: string) => {
    setDebouncedSearch(searchText)
  }, 400);

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setPage(1);
    updateSearchQuery(search);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({
      page,
      perPage: 12,
      search: debouncedSearch,
    }),
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.totalPages ?? 0;


  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              total={totalPages}
              onChange={setPage}
            />
          )}
          <button onClick={openModal} className={css.button}>Create note +</button>

        </header>
        {data && !isLoading && <NoteList notes={data.notes} />}
        {modalIsOpen && (
          <Modal onClose={() => closeModal()}>
            <NoteForm onCloseModal={closeModal} />
          </Modal>
        )}

      </div>
      
    </>
  );
}

