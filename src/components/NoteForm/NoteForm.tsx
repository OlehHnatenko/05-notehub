import css from './NoteForm.module.css';
import type { NewNote } from '../../types/note';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from '../../services/noteService';

interface NoteFormProps {

    onCloseModal: () => void;
}
const formNewNote: NewNote = {
    title: "",
    content: "",
    tag: "Todo"
};
const NoteSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Too Short!")
        .max(50, "Too Long!")
        .required("Required field"),
    content: Yup.string().max(500, "Too Long!"),
    tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required(),
});
 



export default function NoteForm({ onCloseModal }: NoteFormProps) {
    const queryClient = useQueryClient();
    const formId = useId();

    const { mutate, isPending } = useMutation({
        mutationFn: (noteData: NewNote) => addNote(noteData),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onCloseModal();
        },
    });

    const handleSubmit = (values: NewNote,
        formikHelpers: FormikHelpers<NewNote>
    ) => {
        formikHelpers.resetForm(); 
        mutate(values);
    }
    

    return (
        <Formik
            initialValues={formNewNote}
            onSubmit={handleSubmit}
            validationSchema={NoteSchema}
        >
            
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-title`}>Title</label>
                    <Field id={`${formId}-title`} type="text" name="title" className={css.input} />
                    {<ErrorMessage component="span" name="title" className={css.error} />}
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-content`}>Content</label>
                    <Field
                        as="textarea"
                        id={`${formId}content`}
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    {<ErrorMessage component="span" name="content" className={css.error} />}
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-tag`}>Tag</label>
                    <Field as="select" id={`${formId}-tag`} name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    {<ErrorMessage component="span" name="tag" className={css.error} />}
                </div>

                <div className={css.actions}>
                    <button type="button" onClick={onCloseModal} className={css.cancelButton}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={isPending}
                    >
                        {isPending ? "Well done" : "Create note"}
                    </button>
                </div>
            </Form>
            
        </Formik>
    );
}